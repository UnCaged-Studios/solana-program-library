import { Keypair, PublicKey } from "@solana/web3.js";
import { sendAndConfirmTx } from "./solana";
import { adminSDK } from "../../sdk/ts/with-anchor";
import { findTokenCashboxPDA } from "../../sdk/ts/v1/create-token-cashbox";

export const createTokenCashbox = async ({
  currency,
  cashier,
  cashRegisterId,
}: {
  currency: PublicKey;
  cashier: Keypair;
  cashRegisterId: string;
}) => {
  const tx = await adminSDK.CreateTokenCashbox.createTx({
    cashier: cashier.publicKey,
    currency,
    cashRegisterId,
  });
  await sendAndConfirmTx(tx, [cashier]);

  return findTokenCashboxPDA(cashRegisterId, currency);
};
