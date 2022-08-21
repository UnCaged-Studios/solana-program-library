mod bloomfilter;
mod create_cash_register;
mod errors;
mod settle_order_payment;

use crate::bloomfilter::set_if_available;
use crate::create_cash_register::utils as create_cash_register_utils;
use crate::errors::ErrorCode;
use crate::settle_order_payment::utils as settle_order_payment_utils;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::sysvar::{
    clock::Clock, instructions as instructions_sysvar_module,
};
use anchor_spl::token::{self, Mint, Token, TokenAccount};
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

        let all_order_signers = Vec::from(ix_args.order_signers_whitelist);
        if all_order_signers.len() > ORDER_SIGNERS_WHITELIST_LIMIT {
            return err!(ErrorCode::CashRegisterOrderSignersWhilelistOverflow);
        }
        ctx.accounts.cash_register.order_signers_whitelist = all_order_signers;

        ctx.accounts.cash_register.consumed_orders = ctx.accounts.consumed_orders.key();
        let orders = &mut ctx.accounts.consumed_orders.load_init()?;
        orders.k_num = ix_args.consumed_orders_init_k_num;
        orders.bitmap_bits_num = ix_args.consumed_orders_init_bitmap_bits_num;
        orders.sip_keys = ix_args.consumed_orders_init_sip_keys;

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
        let customer_account = ctx.accounts.customer.to_account_info();

        if false
            == ctx.accounts.consumed_orders.key().eq(&ctx
                .accounts
                .cash_register
                .consumed_orders
                .key())
        {
            return err!(ErrorCode::ConsumedOrderAccountMismatch);
        }

        let mut consumed_orders = ctx.accounts.consumed_orders.load_mut()?;

        if false
            == set_if_available(
                &signed_order.id,
                consumed_orders.k_num,
                consumed_orders.sip_keys,
                consumed_orders.bitmap_bits_num,
                &mut consumed_orders.bytes,
            )
        {
            return err!(ErrorCode::OrderHasBeenConsumed);
        }

        for item in signed_order.items.iter() {
            let mut find_ata_in_accounts =
                |ata_pubkey: &Pubkey| order_items_atas.find(|ac| ac.key.eq(&ata_pubkey));

            let find_cashbox_pda = || {
                Pubkey::find_program_address(
                    &[
                        &ix_args.cash_register_id.as_bytes(),
                        &item.currency.to_bytes(),
                    ],
                    ctx.program_id,
                )
            };
            let amount = u64::try_from(item.amount).unwrap();
            let customer_key = get_associated_token_address(customer_account.key, &item.currency);
            let customer_ata =
                find_ata_in_accounts(&customer_key).ok_or(ErrorCode::OrderItemAtaMissing)?;
            let (token_cashbox_key, token_cashbox_bump) = find_cashbox_pda();
            let cashbox_ata =
                find_ata_in_accounts(&token_cashbox_key).ok_or(ErrorCode::OrderItemAtaMissing)?;

            match item.op {
                0 => {
                    let seeds = &[
                        ix_args.cash_register_id.as_bytes().as_ref(),
                        item.currency.as_ref(),
                        &[token_cashbox_bump],
                    ];
                    let signer = &[&seeds[..]];
                    let cpi_ctx = CpiContext::new_with_signer(
                        ctx.accounts.token_program.to_account_info(),
                        token::Transfer {
                            from: cashbox_ata.to_account_info(),
                            to: customer_ata.to_account_info(),
                            authority: cashbox_ata.to_account_info(),
                        },
                        signer,
                    );
                    // FIXME - create associated token account for customer if doesnt exist
                    token::transfer(cpi_ctx, amount)?;
                    Ok(())
                    // TODO - should we reload?
                }
                1 => {
                    let cpi_ctx = CpiContext::new(
                        ctx.accounts.token_program.to_account_info(),
                        token::Transfer {
                            from: customer_ata.to_account_info(),
                            to: cashbox_ata.to_account_info(),
                            authority: customer_account.to_account_info(),
                        },
                    );
                    token::transfer(cpi_ctx, amount)?;
                    Ok(())
                    // TODO - should we reload?
                }
                _ => err!(ErrorCode::OrderItemUnknownOperation),
            }?;
        }

        Ok(())
    }

    pub fn create_token_cashbox(
        ctx: Context<CreateTokenCashbox>,
        _ix_args: CreateTokenCashboxArgs,
    ) -> Result<()> {
        if false
            == ctx
                .accounts
                .cashier
                .key()
                .eq(&ctx.accounts.cash_register.cashier.key())
        {
            return err!(ErrorCode::SignerIsNotCashRegisterAuthorized);
        }
        Ok(())
    }

    pub fn update_order_signers_whitelist(
        ctx: Context<UpdateOrderSignersWhitelist>,
        ix_args: UpdateOrderSignersWhitelistArgs,
    ) -> Result<()> {
        if false
            == ctx
                .accounts
                .cashier
                .key()
                .eq(&ctx.accounts.cash_register.cashier.key())
        {
            return err!(ErrorCode::SignerIsNotCashRegisterAuthorized);
        }
        if ix_args.mode == OrderSignersUpdateType::OVERRIDE {
            ctx.accounts.cash_register.order_signers_whitelist = ix_args.order_signers_whitelist;
            return Ok(());
        }
        for signer in ix_args.order_signers_whitelist {
            if false
                == ctx
                    .accounts
                    .cash_register
                    .order_signers_whitelist
                    .contains(&signer)
            {
                ctx.accounts
                    .cash_register
                    .order_signers_whitelist
                    .push(signer);
            }
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
    consumed_orders: Pubkey,
}

impl CashRegister {
    pub const LEN: usize =
        1 // cash_regiser bump,
        + 32 // cashier public key
        + (32 * ORDER_SIGNERS_WHITELIST_LIMIT) // array of public keys
        + 32 // consumed_orders account address
        ;
}

#[account(zero_copy)]
pub struct ConsumedOrders {
    pub bytes: [u8; 898_600], // number_of_bits: 7_188_800 (898_600 bytes) => 500_000 items with 0.001 false-positive rate
    pub k_num: u32,
    pub bitmap_bits_num: u64,
    pub sip_keys: [u64; 4],
}

#[derive(AnchorSerialize, AnchorDeserialize, Eq, PartialEq, Clone, Debug)]
pub struct CreateCashRegisterArgs {
    pub cash_register_id: String,
    pub order_signers_whitelist: Vec<Pubkey>,
    pub consumed_orders_init_k_num: u32,
    pub consumed_orders_init_bitmap_bits_num: u64,
    pub consumed_orders_init_sip_keys: [u64; 4],
}

#[derive(AnchorSerialize, AnchorDeserialize, Eq, PartialEq, Clone, Debug)]
pub struct SettleOrderPaymentArgs {
    pub cash_register_id: String,
    pub cash_register_bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Eq, PartialEq, Clone, Debug)]
pub struct CreateTokenCashboxArgs {
    pub token_mint_key: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize, Eq, PartialEq, Clone, Debug)]
pub enum OrderSignersUpdateType {
    MERGE,
    OVERRIDE,
}

#[derive(AnchorSerialize, AnchorDeserialize, Eq, PartialEq, Clone, Debug)]
pub struct UpdateOrderSignersWhitelistArgs {
    pub order_signers_whitelist: Vec<Pubkey>,
    pub mode: OrderSignersUpdateType,
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

    #[account(zero)]
    pub consumed_orders: AccountLoader<'info, ConsumedOrders>,

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

    #[account(mut)]
    pub consumed_orders: AccountLoader<'info, ConsumedOrders>,

    /// CHECK: This is not dangerous because we explicitly check the id
    #[account(address = instructions_sysvar_module::ID)]
    pub instructions_sysvar: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
#[instruction(ix: CreateTokenCashboxArgs)]
pub struct CreateTokenCashbox<'info> {
    #[account(mut)]
    pub cashier: Signer<'info>, // TODO: rename to 'manager'

    #[account(address = ix.token_mint_key)]
    pub token_mint: Box<Account<'info, Mint>>,

    #[account(mut)]
    pub cash_register: Account<'info, CashRegister>,

    #[account(
        init,
        payer = cashier,
        token::mint = token_mint,
        token::authority = token_cashbox,
        seeds = [ cash_register.cash_register_id.as_ref(), ix.token_mint_key.as_ref() ],
        bump,
    )]
    pub token_cashbox: Account<'info, TokenAccount>,

    // needed because of token_cashbox account
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(ix: UpdateOrderSignersWhitelistArgs)]
pub struct UpdateOrderSignersWhitelist<'info> {
    #[account(mut)]
    pub cashier: Signer<'info>,

    #[account(mut)]
    pub cash_register: Account<'info, CashRegister>,
}
