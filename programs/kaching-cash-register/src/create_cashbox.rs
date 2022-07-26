pub mod utils {
  pub fn is_cashbox_id_valid(id: &String) -> bool {
    if !id.is_ascii() {
      return false
    }
    match id.len() {
      3..=50 => return true,
      _ => return false
  }
  }
}