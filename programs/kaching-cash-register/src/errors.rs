use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("cash_register_id is invalid, should be only ascii characters, of length 3-50")]
    CashRegisterIdInvalid,

    #[msg("cash register can only have up to 5 order signers in whitelist")]
    CashRegisterOrderSignersWhilelistOverflow,

    #[msg("order was not signed by a known order signers")]
    UnknownOrderSigner,

    #[msg("cash_register_id in order does not match the cash register provided in instruction")]
    OrderCashRegisterIdMismatch,

    #[msg("tx signer does not match customer registered in order")]
    OrderCustomerMismatch,

    #[msg("order is expired")]
    OrderExpired,

    #[msg("order is not valid yet")]
    OrderNotValidYet,

    #[msg("order item associated token account was not found in instruction accounts")]
    OrderItemAtaMissing,

    #[msg("order item operation is unknown (not 0 or 1)")]
    OrderItemUnknownOperation,

    #[msg("instruction signer does not match cash register owner")]
    SignerIsNotCashRegisterAuthorized,

    #[msg("consumed_orders account does not match consumed_orders listed in cash register")]
    ConsumedOrderAccountMismatch,

    #[msg("order has been consumed already")]
    OrderHasBeenConsumed,
}
