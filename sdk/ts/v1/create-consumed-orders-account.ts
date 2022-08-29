import { PublicKey, SystemProgram, CreateAccountParams } from "@solana/web3.js";
import BN from "bn.js";
import { PROGRAM_ID } from "./program";

const sip_keys_size = 4 * 8; // [u64; 4]
const bitmap_bits_num = 8; // u64
const k_num = 4; // u32
const borsh_bytes_array_length_mark = 4; // u32
const sizeInBytes = 89_860; // number_of_bits: 718_880 (89_860 bytes) => 50_000 items with 0.001 false-positive rate

export type ConsumedOrdersParams = {
  createAccountParams: Pick<CreateAccountParams, "space" | "programId">;
  cashRegisterInitParams: {
    bitmapBitsNum: BN;
    kNum: number;
    sipKeys: Array<BN>;
  };
};

export class CreateConsumedOrdersAccount {
  constructor() {}

  createTx(
    payer: PublicKey,
    newAccountPubkey: PublicKey,
    lamports: number,
    createAccountParams: ConsumedOrdersParams["createAccountParams"]
  ) {
    return SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey,
      lamports,
      ...createAccountParams,
    });
  }

  createParams(): ConsumedOrdersParams {
    // TODO - derive all values from num_items + false-positive rate
    const sipKeys = [
      "578437695752307201",
      "1157159078456920585",
      "1735880461161533969",
      "2314601843866147353",
    ].map((str) => new BN(str));
    return {
      cashRegisterInitParams: {
        bitmapBitsNum: new BN("718880"),
        kNum: 10,
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
        programId: PROGRAM_ID,
      },
    };
  }
}
