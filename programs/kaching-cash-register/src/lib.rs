mod create_cashbox;
mod errors;
mod settle_order_payment;

use crate::create_cashbox::utils as create_cashbox_utils;
use crate::errors::ErrorCode;
use crate::settle_order_payment::utils as settle_order_payment_utils;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::sysvar::{
    clock::Clock, instructions as instructions_sysvar_module,
};
use anchor_spl::token::{self, Token};
use solana_program::account_info::AccountInfo;
use spl_associated_token_account::get_associated_token_address;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

const CASHBOX_PDA_SEED: &[u8] = b"cashbox";
const ORDER_SIGNERS_WHITELIST_LIMIT: usize = 5;

#[program]
pub mod kaching_cash_register {
    use super::*;

    pub fn create_cashbox(ctx: Context<CreateCashBox>, ix_args: CreateCashBoxArgs) -> Result<()> {
        if false == create_cashbox_utils::is_cashbox_id_valid(&ix_args.cashbox_id) {
            return err!(ErrorCode::CashboxIdInvalid);
        }

        ctx.accounts.cashbox.bump = *ctx.bumps.get("cashbox").unwrap();
        ctx.accounts.cashbox.cashier = *ctx.accounts.cashier.to_account_info().key;

        let mut all_order_signers = Vec::from(ix_args.order_signers_whitelist);
        all_order_signers.push(ctx.accounts.cashbox.cashier);
        if all_order_signers.len() > ORDER_SIGNERS_WHITELIST_LIMIT {
            return err!(ErrorCode::CashboxOrderSignersWhilelistOverflow);
        }
        ctx.accounts.cashbox.order_signers_whitelist = all_order_signers;

        Ok(())
    }

    pub fn settle_order_payment<'info>(
        ctx: Context<'_, '_, '_, 'info, SettleOrderPayment<'info>>,
        ix_args: SettleOrderPaymentArgs,
    ) -> Result<()> {
        let (order_signer_pubkey, order) =
            settle_order_payment_utils::resolve(&ctx.accounts.instructions_sysvar)?;

        if false
            == ctx
                .accounts
                .cashbox
                .order_signers_whitelist
                .contains(&order_signer_pubkey)
        {
            return err!(ErrorCode::UnknownOrderSigner);
        }

        let signed_order = settle_order_payment_utils::deserialize_order(&order)?;

        if signed_order.cashbox_id != ix_args.cashbox_id {
            return err!(ErrorCode::OrderCashboxIdMismatch);
        }
        if false == signed_order.customer.eq(ctx.accounts.customer.key) {
            return err!(ErrorCode::OrderCustomerMismatch);
        }

        let now = Clock::get()?.unix_timestamp;
        if i64::try_from(signed_order.expiry).unwrap() < now {
            return err!(ErrorCode::OrderExpired);
        }
        if i64::try_from(signed_order.not_before).unwrap() > now {
            return err!(ErrorCode::OrderNotValidYet);
        }

        let mut order_items_atas = ctx.remaining_accounts.iter();

        for item in signed_order.items.iter() {
            let mut find_ata = |pubkey: &Pubkey| {
                let ata_pubkey = get_associated_token_address(pubkey, &item.currency);
                order_items_atas.find(|ac| ac.key.eq(&ata_pubkey))
            };
            let (from, to) = {
                let customer_ata =
                    find_ata(ctx.accounts.customer.key).ok_or(ErrorCode::OrderItemAtaMissing)?;
                let cashier_ata = find_ata(&ctx.accounts.cashbox.cashier)
                    .ok_or(ErrorCode::OrderItemAtaMissing)?;
                match item.op {
                    0 => Ok((cashier_ata, customer_ata)), // CREDIT_CUSTOMER
                    1 => Ok((customer_ata, cashier_ata)), // DEBIT_CUSTOMER
                    _ => err!(ErrorCode::OrderItemUnknownOperation),
                }
            }?;
            let amount = u64::try_from(item.amount).unwrap();

            msg!(
                "transfer {} tokens {} from {:?} to {:?}",
                amount,
                item.currency,
                from.to_account_info(),
                to.to_account_info()
            );
            let cpi_ctx = CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: from.to_account_info(),
                    to: to.to_account_info(),
                    authority: ctx.accounts.customer.to_account_info(),
                },
            );
            token::transfer(cpi_ctx, amount)?;
            // (&mut ctx.accounts.token_vault).reload()?;
        }

        Ok(())
    }
}

// create cashbox with initial configuration. If cashbox already exists (per given cashbox_id) the instruction will fail.
#[account]
pub struct CashRegisterCashbox {
    bump: u8,
    cashier: Pubkey,
    order_signers_whitelist: Vec<Pubkey>,
}

impl CashRegisterCashbox {
    pub const LEN: usize =
        1 // cashbox_bump,
        + 32 // cashier public key
        + (32 * ORDER_SIGNERS_WHITELIST_LIMIT) // array of public keys
        ;
}

#[derive(AnchorSerialize, AnchorDeserialize, Eq, PartialEq, Clone, Debug)]
pub struct CreateCashBoxArgs {
    pub cashbox_id: String,
    pub order_signers_whitelist: Vec<Pubkey>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Eq, PartialEq, Clone, Debug)]
pub struct SettleOrderPaymentArgs {
    pub cashbox_id: String,
    pub cashbox_bump: u8,
}

#[derive(Accounts)]
#[instruction(ix_args: CreateCashBoxArgs)]
pub struct CreateCashBox<'info> {
    #[account(mut)]
    pub cashier: Signer<'info>,

    #[account(
        init,
        payer = cashier,
        space = 8 + CashRegisterCashbox::LEN,
        seeds = [CASHBOX_PDA_SEED.as_ref(), ix_args.cashbox_id.as_bytes().as_ref()],
        bump
    )]
    pub cashbox: Account<'info, CashRegisterCashbox>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(ix_args: SettleOrderPaymentArgs)]
pub struct SettleOrderPayment<'info> {
    #[account(mut)]
    pub customer: Signer<'info>,

    #[account(
        mut,
        seeds = [CASHBOX_PDA_SEED.as_ref(), ix_args.cashbox_id.as_bytes().as_ref()],
        bump = ix_args.cashbox_bump,
    )]
    pub cashbox: Account<'info, CashRegisterCashbox>,

    /// CHECK: This is not dangerous because we explicitly check the id
    #[account(address = instructions_sysvar_module::ID)]
    pub instructions_sysvar: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
}
