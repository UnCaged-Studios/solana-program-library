use siphasher::sip::SipHasher13;
use std::hash::{Hash, Hasher};

fn bloom_hash(hashes: &mut [u64; 2], item: &u128, k_i: u32, sips: [SipHasher13; 2]) -> u64 {
    if k_i < 2 {
        let sip = &mut sips[k_i as usize].clone();
        item.hash(sip);
        let hash = sip.finish();
        hashes[k_i as usize] = hash;
        hash
    } else {
        (hashes[0] as u128).wrapping_add((k_i as u128).wrapping_mul(hashes[1] as u128)) as u64
            % 0xffffffffffffffc5
    }
}

fn set(item: &u128, k_num: u32, sips: [SipHasher13; 2], bitmap_bits: u64, bytes: &mut [u8]) {
    let mut hashes = [0u64, 0u64];
    for k_i in 0..k_num {
        let bit_offset = (bloom_hash(&mut hashes, item, k_i, sips) % bitmap_bits) as usize;
        let byte_idx = bit_offset / 8;
        let bit_idx = bit_offset % 8;
        let mask: u8 = 1 << (7 - bit_idx);
        bytes[byte_idx] = bytes[byte_idx] | mask;
    }
}

fn check(item: &u128, k_num: u32, sips: [SipHasher13; 2], bitmap_bits: u64, bytes: &[u8]) -> bool {
    let mut hashes = [0u64, 0u64];
    for k_i in 0..k_num {
        let bit_offset = (bloom_hash(&mut hashes, item, k_i, sips) % bitmap_bits) as usize;
        let byte_idx = bit_offset / 8;
        let bit_idx = bit_offset % 8;
        let bit_at_idx = (bytes[byte_idx] >> (7 - bit_idx)) & 1;
        if bit_at_idx == 0 {
            return false;
        }
    }
    true
}

pub fn set_if_available(
    item: &u128,
    k_num: u32,
    sip_keys: [u64; 4],
    bitmap_bits: u64,
    bytes: &mut [u8],
) -> bool {
    let sips = [
        SipHasher13::new_with_keys(sip_keys[0], sip_keys[1]),
        SipHasher13::new_with_keys(sip_keys[2], sip_keys[3]),
    ];
    if check(item, k_num, sips, bitmap_bits, bytes) {
        return false;
    }
    set(item, k_num, sips, bitmap_bits, bytes);
    true
}
