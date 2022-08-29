import { PublicKey } from "@solana/web3.js";
import { IProgramAPI, PROGRAM_ID } from "./program";
import { findCashRegisterPDA } from "./create-cash-register";

export type CreateTokenCashboxParams = {
  currency: PublicKey;
  cashier: PublicKey;
  cashRegisterId: string;
};

export const findTokenCashboxPDA = (
  cashRegistedId: string,
  tokenMint: PublicKey
) =>
  PublicKey.findProgramAddress(
    [Buffer.from(cashRegistedId, "ascii"), tokenMint.toBytes()],
    PROGRAM_ID
  );

export class CreateTokenCashbox {
  constructor(private readonly programAPI: IProgramAPI) {}

  async createTx({
    cashRegisterId,
    currency,
    cashier,
  }: CreateTokenCashboxParams) {
    const [[tokenCashbox], [cashRegister]] = await Promise.all([
      findTokenCashboxPDA(cashRegisterId, currency),
      findCashRegisterPDA(cashRegisterId),
    ]);

    return this.programAPI
      .createTokenCashbox({
        tokenMintKey: currency,
      })
      .accounts({
        cashier,
        cashRegister,
        tokenMint: currency,
        tokenCashbox,
      })
      .transaction();
  }
}
