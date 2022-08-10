import { Keypair, PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { KachingCashRegister } from "../../target/types/kaching_cash_register";
import { confirmTransaction } from "./solana";
import { findCashRegisterPDA } from "./cash-register";
import { findTokenCashboxPDA } from "../../sdk/ts";

const program = anchor.workspace
  .KachingCashRegister as anchor.Program<KachingCashRegister>;

export const createTokenCashbox = async ({
  currency,
  cashier,
  cashRegisterId,
}: {
  currency: PublicKey;
  cashier: Keypair;
  cashRegisterId: string;
}) => {
  const [[tokenCashbox], [cashRegister]] = await Promise.all([
    findTokenCashboxPDA(cashRegisterId, currency),
    findCashRegisterPDA(cashRegisterId),
  ]);

  const tx = await program.methods
    .createTokenCashbox({
      tokenMintKey: currency,
    })
    .accounts({
      cashier: cashier.publicKey,
      cashRegister,
      tokenMint: currency,
      tokenCashbox,
    })
    .signers([cashier])
    .rpc();

  await confirmTransaction(tx);

  return tokenCashbox;
};
