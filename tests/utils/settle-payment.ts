import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import {
  OrderItemOperation,
  OrderModel,
  serializeOrder,
  createSettlePaymentTransaction,
  SettleOrderPaymentArgs,
} from "../../sdk/ts";
import { getConnection } from "./solana";

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
      op: OrderItemOperation.CREDIT_CUSTOMER,
      amount: 42,
      currency: Keypair.generate().publicKey,
    },
    {
      op: OrderItemOperation.DEBIT_CUSTOMER,
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

export const settleOrderPayment = async (args: SettleOrderPaymentArgs) => {
  const tx = await createSettlePaymentTransaction(args);
  tx.feePayer = args.customer.publicKey;
  return getConnection().sendTransaction(tx, [args.customer]);
};
