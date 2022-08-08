use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("cashbox_id is invalid, should be only ascii characters, of length 3-50")]
    CashboxIdInvalid,

    #[msg("cashbox can only have up to 5 order signers in whitelist")]
    CashboxOrderSignersWhilelistOverflow,

    #[msg("order was not signed by a known order signers")]
    UnknownOrderSigner,

    #[msg("cashbox_id in order does not match the cashbox provided in instruction")]
    OrderCashboxIdMismatch,

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
}
