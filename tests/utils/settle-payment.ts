import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import {
  Ed25519Program,
  Keypair,
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
} from "@solana/web3.js";
import { OrderItem, serializeOrder } from "../../sdk/ts";
import { KachingCashRegister } from "../../target/types/kaching_cash_register";
import nacl from "tweetnacl";

const program = anchor.workspace
  .KachingCashRegister as Program<KachingCashRegister>;

const signOrderPayload = (data: Uint8Array, signer: Keypair) =>
  nacl.sign.detached(data, signer.secretKey);

export const mockCashierOrderService = (
  items: OrderItem[],
  cashier: Keypair
) => {
  const serializedOrder = serializeOrder({
    items,
  });
  const signature = signOrderPayload(serializedOrder, cashier);
  return { serializedOrder, signature };
};

type SettleOrderPaymentArgs = {
  cashbox: PublicKey;
  cashboxId: string;
  cashboxBump: number;
  serializedOrder: Uint8Array;
  signature: Uint8Array;
  signerPublicKey: PublicKey;
};

export const settleOrderPayment = async ({
  cashbox,
  cashboxId,
  cashboxBump,
  serializedOrder,
  signature,
  signerPublicKey,
}: SettleOrderPaymentArgs) => {
  const ixEd25519Program = Ed25519Program.createInstructionWithPublicKey({
    publicKey: signerPublicKey.toBytes(),
    signature,
    message: serializedOrder,
  });
  await program.methods
    .settleOrderPayment({
      cashboxId,
      cashboxBump,
    })
    .accounts({
      cashbox,
      instructionsSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
    })
    .preInstructions([ixEd25519Program])
    .rpc();
};
