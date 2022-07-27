mod create_cashbox;

use anchor_lang::prelude::*;
use crate::create_cashbox::utils;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

const CASHBOX_PDA_SEED: &[u8] = b"cashbox";
const ORDER_SIGNERS_WHITELIST_LIMIT: usize = 5;

#[program]
pub mod kaching_cash_register {
    use super::*;

    pub fn create_cashbox(ctx: Context<CreateCashBox>, ix_args: CreateCashBoxArgs) -> Result<()> {
        ctx.accounts.cashbox.bump = *ctx.bumps.get("cashbox").unwrap();
        ctx.accounts.cashbox.cashier = *ctx.accounts.cashier.to_account_info().key;
        ctx.accounts.cashbox.order_signers_whitelist = ix_args.order_signers_whitelist;
        if !utils::is_cashbox_id_valid(&ix_args.cashbox_id) {
            return Err(ErrorCode::CashboxIdInvalid.into())
        }
        Ok(())
    }
}

// create cashbox with initial configuration. If cashbox already exists (per given cashbox_id) the instruction will fail.
#[account]
pub struct CashRegisterCashbox {
    bump: u8,
    cashier: Pubkey,
    order_signers_whitelist: Vec<Pubkey>
}

impl CashRegisterCashbox {
    pub const LEN: usize =
        1 // cashbox_bump,
        + 32 // cashier public key
        + (32 * ORDER_SIGNERS_WHITELIST_LIMIT) // array of public key
        ;
}

#[derive(AnchorSerialize, AnchorDeserialize, Eq, PartialEq, Clone, Debug)]
pub struct CreateCashBoxArgs {
    pub cashbox_id: String,
    pub order_signers_whitelist: Vec<Pubkey>,
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

#[error_code]
pub enum ErrorCode {
    #[msg("cashbox_id is invalid, should be only ascii characters, of length 3-50.")]
    CashboxIdInvalid,
}
