pub mod utils {
  use anchor_lang::prelude::*;
  use anchor_lang::solana_program::sysvar::instructions as instructions_sysvar_module;
  use anchor_lang::solana_program::instruction::Instruction;
  use bs58;

  static PUBLIC_KEY_SIZE: usize = 32;

  // based on https://docs.solana.com/developing/runtime-facilities/programs#ed25519-program
  fn add_u16_bytes(vec: &Vec<u8>, i: usize, j: usize) -> Option<usize> {
    // A BUG! 255 + 255 should return u16::MAX, not 510!
    usize::checked_add(vec[i].into(), vec[j].into())
  }

  fn is_sigverify_ix(ix: &Instruction) -> bool {
    let sigverify_program_id = "Ed25519SigVerify111111111111111111111111111".parse::<Pubkey>().unwrap();
    ix.program_id.eq(&sigverify_program_id)
  }

  fn extract_msg(sigverify_ix_data: &Vec<u8>) -> Result<&[u8]> {
    let message_data_offset = add_u16_bytes(sigverify_ix_data, 10, 11).ok_or(ErrorCode::InstructionMissing)?;
    let message_data_size = add_u16_bytes(sigverify_ix_data, 12, 13).ok_or(ErrorCode::InstructionMissing)?;
    let message = &sigverify_ix_data[message_data_offset..(message_data_offset + message_data_size)];
    Ok(message)
  }

  fn extract_pubkey(sigverify_ix_data: &Vec<u8>) -> Result<Pubkey> {
    let public_key_offset = add_u16_bytes(sigverify_ix_data, 6, 7).ok_or(ErrorCode::InstructionMissing)?;
    let ix_pub_key = &sigverify_ix_data[public_key_offset..(public_key_offset + PUBLIC_KEY_SIZE)];
    match bs58::encode(ix_pub_key).into_string().parse::<Pubkey>() {
      Ok(pk) => Ok(pk),
      Err(_) => err!(ErrorCode::InstructionMissing)
    }
  }

  pub fn resolve<'a>(ix_account_info: &'a UncheckedAccount) -> Result<(Pubkey, Vec<u8>)> {
    let ix = instructions_sysvar_module::load_instruction_at_checked(0, ix_account_info)?;
    if !is_sigverify_ix(&ix) {
      return err!(ErrorCode::InstructionMissing)
    }
    let msg = extract_msg(&ix.data)?;
    let pubkey = extract_pubkey(&ix.data)?;
    Ok((pubkey, msg.to_vec()))
  }

  impl OrderItem {
    pub const LEN: usize = 41;
  }

  #[derive(AnchorSerialize, AnchorDeserialize, Eq, PartialEq, Debug)]
  pub struct OrderItem {
      amount: u16,
      currency: Pubkey,
      op: String, // "dbt" | "crd" TODO: make enum
  }

  pub fn deserialize_order_items(order_payload: &Vec<u8>) -> Result<Vec<OrderItem>> {
      let num_of_items: usize = order_payload[0].into();
      let res = (0..num_of_items).map(|idx| {
        let from = (idx * OrderItem::LEN) + 1;
        let range = from..(from + OrderItem::LEN);
        OrderItem::try_from_slice(&order_payload[range]).unwrap()
      }).collect();
      Ok(res)
  }
}