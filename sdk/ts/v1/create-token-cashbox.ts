import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { KachingCashRegister } from "../../../target/types/kaching_cash_register";
import { findCashRegisterPDA } from "./create-cash-register";

const program = anchor.workspace
  .KachingCashRegister as anchor.Program<KachingCashRegister>;

export const findTokenCashboxPDA = (
  cashRegistedId: string,
  tokenMint: PublicKey
) =>
  PublicKey.findProgramAddress(
    [Buffer.from(cashRegistedId, "ascii"), tokenMint.toBytes()],
    program.programId
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

  return program.methods
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
};
