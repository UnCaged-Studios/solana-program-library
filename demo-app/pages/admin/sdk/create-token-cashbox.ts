import { KachingProgram, KACHING_PROGRAM_ID } from "./anchor-client";
import { PublicKey } from "@solana/web3.js";
import { findCashRegisterPDA } from "./create-cash-register";

export const findTokenCashboxPDA = (
  cashRegistedId: string,
  tokenMint: PublicKey
) =>
  PublicKey.findProgramAddress(
    [Buffer.from(cashRegistedId, "ascii"), tokenMint.toBytes()],
    KACHING_PROGRAM_ID
  );

export type CreateTokenCashboxParams = {
  currency: PublicKey;
  cashier: PublicKey;
  cashRegisterId: string;
};

export const createTx = async ({
  cashRegisterId,
  currency,
  cashier,
}: CreateTokenCashboxParams) => {
  const [[tokenCashbox], [cashRegister]] = await Promise.all([
    findTokenCashboxPDA(cashRegisterId, currency),
    findCashRegisterPDA(cashRegisterId),
  ]);

  return KachingProgram.createTokenCashbox({
    tokenMintKey: currency,
  })
    .accounts({
      cashier,
      cashRegister,
      tokenMint: currency,
      tokenCashbox,
    })
    .transaction();
};
