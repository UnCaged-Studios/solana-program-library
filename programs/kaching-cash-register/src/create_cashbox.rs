pub mod utils {
  
  fn is_valid_cashobox_id_length(size: usize) -> bool {
    match size {
      3..=50 => return true,
      _ => return false
    }
  }

  fn is_valid_char(c: &u8) -> bool {
    match c {
      // allowed ascii characters: 0-9 | _ | a-z
      48..=57 | 95 | 97..=122 => true,
      _ => false
    }
  }

  pub fn is_cashbox_id_valid(id: &String) -> bool {
    let val = id.as_bytes();
    return is_valid_cashobox_id_length(val.len()) && val.iter().all(|b| is_valid_char(b))
  }
}