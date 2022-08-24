import * as anchor from "@project-serum/anchor";
import { PublicKey, SystemProgram, CreateAccountParams } from "@solana/web3.js";
import { KachingCashRegister } from "../../../target/types/kaching_cash_register";

const program = anchor.workspace
  .KachingCashRegister as anchor.Program<KachingCashRegister>;

const sip_keys_size = 4 * 8; // [u64; 4]
const bitmap_bits_num = 8; // u64
const k_num = 4; // u32
const borsh_bytes_array_length_mark = 4; // u32
const sizeInBytes = 120; // number_of_bits: 7_188_800 (898_600 bytes) => 500_000 items with 0.001 false-positive rate

export type ConsumedOrdersParams = {
  createAccountParams: Pick<CreateAccountParams, "space" | "programId">;
  cashRegisterInitParams: {
    bitmapBitsNum: anchor.BN;
    kNum: number;
    sipKeys: Array<anchor.BN>;
  };
};

export const createParams = (): ConsumedOrdersParams => {
  // TODO - derive all values from num_items + false-positive rate
  const sipKeys = [
    "578437695752307201",
    "1157159078456920585",
    "1735880461161533969",
    "2314601843866147353",
  ].map((str) => new anchor.BN(str));
  return {
    cashRegisterInitParams: {
      bitmapBitsNum: new anchor.BN("960"),
      kNum: 7,
      sipKeys,
    },
    createAccountParams: {
      space:
        8 +
        bitmap_bits_num +
        k_num +
        sip_keys_size +
        borsh_bytes_array_length_mark +
        sizeInBytes,
      programId: program.programId,
    },
  };
};

export const createTx = (
  payer: PublicKey,
  newAccountPubkey: PublicKey,
  lamports: number,
  createAccountParams: ConsumedOrdersParams["createAccountParams"]
) =>
  SystemProgram.createAccount({
    fromPubkey: payer,
    newAccountPubkey,
    lamports,
    ...createAccountParams,
  });
