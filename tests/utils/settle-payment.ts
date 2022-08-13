import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import {
  OrderModel,
  serializeOrder,
  createSettlePaymentTransaction,
  SettleOrderPaymentArgs,
} from "../../sdk/ts";
import { getConnection } from "./solana";

const signOrderPayload = (data: Uint8Array, signer: Keypair) =>
  nacl.sign.detached(data, signer.secretKey);

const aUUID = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    var t = (16 * Math.random()) | 0;
    return ("x" === e ? t : (3 & t) | 8).toString(16);
  });

export const anOrder = (
  input: Partial<OrderModel> & Pick<OrderModel, "cashRegisterId" | "customer">
) => ({
  id: input.id || aUUID(),
  customer: input.customer,
  cashRegisterId: input.cashRegisterId,
  expiry: input.expiry || Date.now() / 1000 + 1000, // 1000 seconds into the future
  notBefore: input.notBefore || Date.now() / 1000 - 1000, // 1000 seconds ago
  createdAt: input.createdAt || Date.now() / 1000,
  items: input.items || [],
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
