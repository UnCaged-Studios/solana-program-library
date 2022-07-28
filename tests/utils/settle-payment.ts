import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import {
  Ed25519Program,
  Keypair,
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
} from "@solana/web3.js";
import { OrderItemOperation, OrderModel, serializeOrder } from "../../sdk/ts";
import { KachingCashRegister } from "../../target/types/kaching_cash_register";
import nacl from "tweetnacl";

const program = anchor.workspace
  .KachingCashRegister as Program<KachingCashRegister>;

const signOrderPayload = (data: Uint8Array, signer: Keypair) =>
  nacl.sign.detached(data, signer.secretKey);

export const anOrder = (input: Partial<OrderModel>) => ({
  id: input.id || 100000,
  cashboxId: input.cashboxId || "abc",
  expiry: input.expiry || Date.now() / 1000 + 1000,
  customer: input.customer || Keypair.generate().publicKey,
  notBefore: input.notBefore || Date.now() / 1000,
  createdAt: input.createdAt || Date.now() / 1000,
  items: input.items || [
    {
      op: OrderItemOperation.CREDIT,
      amount: 42,
      currency: Keypair.generate().publicKey,
    },
    {
      op: OrderItemOperation.DEBIT,
      amount: 73,
      currency: Keypair.generate().publicKey,
    },
  ],
});

export const mockCashierOrderService = (
  cashier: Keypair,
  order: OrderModel = anOrder({})
) => {
  const serializedOrder = serializeOrder(order);
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
