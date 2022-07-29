pub mod utils {
    use anchor_lang::prelude::*;
    use anchor_lang::solana_program::ed25519_program::ID as ED25519_PROGRAM_ID;
    use anchor_lang::solana_program::sysvar::instructions as instructions_sysvar_module;

    const EXPECTED_PUBLIC_KEY_OFFSET: usize = 16;
    const EXPECTED_PUBLIC_KEY_RANGE: std::ops::Range<usize> =
        EXPECTED_PUBLIC_KEY_OFFSET..(EXPECTED_PUBLIC_KEY_OFFSET + 32);
    const EXPTECED_IX_SYSVAR_INDEX: usize = 0;

    // based on https://github.com/GuidoDipietro/solana-ed25519-secp256k1-sig-verification/blob/master/programs/solana-ed25519-sig-verification/src/lib.rs
    fn validate_ed25519_ix(ix: &anchor_lang::solana_program::instruction::Instruction) -> bool {
        if ix.program_id != ED25519_PROGRAM_ID || ix.accounts.len() != 0 {
            return false;
        }
        let ix_data = &ix.data;
        let public_key_offset = &ix_data[6..=7];
        let exp_public_key_offset = u16::try_from(EXPECTED_PUBLIC_KEY_OFFSET)
            .unwrap()
            .to_le_bytes();
        let expected_num_signatures: u8 = 1;
        return public_key_offset       == &exp_public_key_offset                        && // pulic_key in expected offset (16)
            &[ix_data[0]]           == &expected_num_signatures.to_le_bytes()        && // num_signatures is 1
            &[ix_data[1]]           == &[0]                                          && // padding is 0
            &ix_data[4..=5]         == &u16::MAX.to_le_bytes()                       && // signature_instruction_index is not defined by user (default value)
            &ix_data[8..=9]         == &u16::MAX.to_le_bytes()                       && // public_key_instruction_index is not defined by user (default value)
            &ix_data[14..=15]       == &u16::MAX.to_le_bytes(); // message_instruction_index is not defined by user (default value)
    }

    pub fn resolve<'a>(ix_account_info: &'a AccountInfo) -> Result<(Pubkey, Vec<u8>)> {
        let ix = instructions_sysvar_module::load_instruction_at_checked(
            EXPTECED_IX_SYSVAR_INDEX,
            ix_account_info,
        )?;
        if !validate_ed25519_ix(&ix) {
            return err!(ErrorCode::InstructionMissing);
        }
        let pub_key = Pubkey::new(&ix.data[EXPECTED_PUBLIC_KEY_RANGE]);
        let order = &ix.data[112..];
        return Ok((pub_key, order.to_vec()));
    }

    #[derive(AnchorSerialize, AnchorDeserialize, Eq, PartialEq, Debug)]
    pub struct OrderItem {
        amount: u16,
        currency: Pubkey,
        op: u8,
    }

    #[derive(AnchorSerialize, AnchorDeserialize, Eq, PartialEq, Debug)]
    pub struct FullOrder {
        pub id: u64,
        pub expiry: u32,
        pub customer: Pubkey,
        pub not_before: u32,
        pub created_at: u32,
        pub cashbox_id: String,
        pub items: Vec<OrderItem>,
    }

    pub fn deserialize_order(order_payload: &Vec<u8>) -> Result<FullOrder> {
        match FullOrder::try_from_slice(order_payload) {
            Ok(order) => Ok(order),
            Err(_) => err!(ErrorCode::InstructionMissing),
        }
    }
}
