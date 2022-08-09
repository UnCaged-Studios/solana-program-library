mod create_cash_register;
mod errors;
mod settle_order_payment;

use crate::create_cash_register::utils as create_cash_register_utils;
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

const CASH_REGISTER_PDA_SEED: &[u8] = b"cashregister";
const ORDER_SIGNERS_WHITELIST_LIMIT: usize = 5;

#[program]
pub mod kaching_cash_register {
    use super::*;

    pub fn create_cash_register(
        ctx: Context<CreateCashRegister>,
        ix_args: CreateCashRegisterArgs,
    ) -> Result<()> {
        if false == create_cash_register_utils::is_cash_register_id_valid(&ix_args.cash_register_id)
        {
            return err!(ErrorCode::CashRegisterIdInvalid);
        }

        ctx.accounts.cash_register.cash_register_id = ix_args.cash_register_id;
        ctx.accounts.cash_register.bump = *ctx.bumps.get("cash_register").unwrap();
        ctx.accounts.cash_register.cashier = *ctx.accounts.cashier.to_account_info().key;

        let mut all_order_signers = Vec::from(ix_args.order_signers_whitelist);
        all_order_signers.push(ctx.accounts.cash_register.cashier);
        if all_order_signers.len() > ORDER_SIGNERS_WHITELIST_LIMIT {
            return err!(ErrorCode::CashRegisterOrderSignersWhilelistOverflow);
        }
        ctx.accounts.cash_register.order_signers_whitelist = all_order_signers;

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
                .cash_register
                .order_signers_whitelist
                .contains(&order_signer_pubkey)
        {
            return err!(ErrorCode::UnknownOrderSigner);
        }

        let signed_order = settle_order_payment_utils::deserialize_order(&order)?;

        if signed_order.cash_register_id != ix_args.cash_register_id {
            return err!(ErrorCode::OrderCashRegisterIdMismatch);
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
            let mut find_ata = |wallet: &Pubkey| {
                let ata_pubkey = get_associated_token_address(wallet, &item.currency);
                order_items_atas.find(|ac| ac.key.eq(&ata_pubkey))
            };
            let (from, to, authority) = {
                let customer_ata =
                    find_ata(ctx.accounts.customer.key).ok_or(ErrorCode::OrderItemAtaMissing)?;
                // FIXME - use "token_cashbox": Account<'info, TokenAccount>
                let cashier_ata = find_ata(&ctx.accounts.cash_register.cashier)
                    .ok_or(ErrorCode::OrderItemAtaMissing)?;
                match item.op {
                    0 => Ok((cashier_ata, customer_ata, None)), // CREDIT_CUSTOMER
                    1 => Ok((
                        customer_ata,
                        cashier_ata,
                        Some(ctx.accounts.customer.to_account_info()),
                    )), // DEBIT_CUSTOMER
                    _ => err!(ErrorCode::OrderItemUnknownOperation),
                }
            }?;
            let amount = u64::try_from(item.amount).unwrap();
            let cpi_ctx = CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: from.to_account_info(),
                    to: to.to_account_info(),
                    authority: authority.unwrap().to_account_info(),
                },
            );
            token::transfer(cpi_ctx, amount)?;
            // (&mut ctx.accounts.token_vault).reload()?;
        }

        Ok(())
    }
}

// create cash-regiser with initial configuration. If cash-regiser already exists (per given cash-regiser_id) the instruction will fail.
#[account]
pub struct CashRegister {
    cash_register_id: String,
    bump: u8,
    cashier: Pubkey,
    order_signers_whitelist: Vec<Pubkey>,
}

impl CashRegister {
    pub const LEN: usize =
        1 // cash_regiser bump,
        + 32 // cashier public key
        + (32 * ORDER_SIGNERS_WHITELIST_LIMIT) // array of public keys
        ;
}

#[derive(AnchorSerialize, AnchorDeserialize, Eq, PartialEq, Clone, Debug)]
pub struct CreateCashRegisterArgs {
    pub cash_register_id: String,
    pub order_signers_whitelist: Vec<Pubkey>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Eq, PartialEq, Clone, Debug)]
pub struct SettleOrderPaymentArgs {
    pub cash_register_id: String,
    pub cash_register_bump: u8,
}

#[derive(Accounts)]
#[instruction(ix_args: CreateCashRegisterArgs)]
pub struct CreateCashRegister<'info> {
    #[account(mut)]
    pub cashier: Signer<'info>, // TODO: rename to 'manager'

    #[account(
        init,
        payer = cashier,
        space = 8 + CashRegister::LEN,
        seeds = [CASH_REGISTER_PDA_SEED.as_ref(), ix_args.cash_register_id.as_bytes().as_ref()],
        bump
    )]
    pub cash_register: Account<'info, CashRegister>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(ix_args: SettleOrderPaymentArgs)]
pub struct SettleOrderPayment<'info> {
    #[account(mut)]
    pub customer: Signer<'info>,

    #[account(
        mut,
        seeds = [CASH_REGISTER_PDA_SEED.as_ref(), ix_args.cash_register_id.as_bytes().as_ref()],
        bump = ix_args.cash_register_bump,
    )]
    pub cash_register: Account<'info, CashRegister>,

    /// CHECK: This is not dangerous because we explicitly check the id
    #[account(address = instructions_sysvar_module::ID)]
    pub instructions_sysvar: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
}
