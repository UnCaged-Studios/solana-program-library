import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import {
  Ed25519Program,
  Keypair,
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
} from "@solana/web3.js";
import nacl from "tweetnacl";
import { OrderItemOperation, OrderModel, serializeOrder } from "../../sdk/ts";
import { KachingCashRegister } from "../../target/types/kaching_cash_register";

const program = anchor.workspace
  .KachingCashRegister as Program<KachingCashRegister>;

const signOrderPayload = (data: Uint8Array, signer: Keypair) =>
  nacl.sign.detached(data, signer.secretKey);

export const anOrder = (
  input: Partial<OrderModel> & Pick<OrderModel, "cashboxId" | "customer">
) => ({
  id: input.id || 100000,
  customer: input.customer,
  cashboxId: input.cashboxId,
  expiry: input.expiry || Date.now() / 1000 + 1000, // 1000 seconds into the future
  notBefore: input.notBefore || Date.now() / 1000 - 1000, // 1000 seconds ago
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
  order: OrderModel
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
  customer: Keypair;
};

export const settleOrderPayment = async ({
  cashbox,
  cashboxId,
  cashboxBump,
  serializedOrder,
  signature,
  signerPublicKey,
  customer,
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
      customer: customer.publicKey,
    })
    .preInstructions([ixEd25519Program])
    .signers([customer])
    .rpc();
};
