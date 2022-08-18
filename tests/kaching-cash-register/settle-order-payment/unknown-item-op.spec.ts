import { Keypair } from "@solana/web3.js";
import {
  mockCashierOrderService,
  anOrder,
  settleOrderPayment,
} from "../../utils/settle-payment";
import { calculateAmountInDecimals } from "../../utils/solana";
import { shouldFail } from "../../utils/testing";
import { registerSettleOrderPaymentTest } from "./runner";

registerSettleOrderPaymentTest("should settle a payment", async (env) => {
  const orderItems = [
    {
      amount: calculateAmountInDecimals(2),
      currency: Keypair.generate().publicKey,
      op: 3,
    },
  ];
  const { serializedOrder, signature } = mockCashierOrderService(
    env.cashier,
    anOrder({
      cashRegisterId: env.cashRegisterId,
      customer: env.customer.publicKey,
      items: orderItems,
    })
  );

  return shouldFail(
    () =>
      settleOrderPayment({
        ...env,
        serializedOrder,
        signature,
        signerPublicKey: env.cashier.publicKey,
        orderItems,
      }),
    {
      code: "OrderItemUnknownOperation",
      num: 6008,
    }
  );
});
