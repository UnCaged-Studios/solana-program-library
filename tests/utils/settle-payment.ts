import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { customerSDK, orderSignerSDK } from "../../sdk/ts/v1/with-anchor";
import { OrderModel } from "../../sdk/ts/v1/order-signer";
import { SettleOrderPaymentParams } from "../../sdk/ts/v1/settle-order-payment";
import { sendAndConfirmTx } from "./solana";

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
  orderSigner: Keypair,
  order: OrderModel
) => {
  const serializedOrder = orderSignerSDK.serializeOrder(order);
  const signature = signOrderPayload(serializedOrder, orderSigner);
  return { serializedOrder, signature };
};

type SettleTestOrderPaymentParams = Omit<
  SettleOrderPaymentParams,
  "customer"
> & { customer: Keypair };

export const settleOrderPaymentTest = async (
  params: SettleTestOrderPaymentParams
) => {
  const customer = params.customer;
  const tx = await customerSDK.SettleOrderPayment.createTx({
    ...params,
    customer: customer.publicKey,
  });
  tx.feePayer = customer.publicKey;
  return sendAndConfirmTx(tx, [customer]);
};
