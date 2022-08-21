import { Keypair } from "@solana/web3.js";
import {
  mockCashierOrderService,
  anOrder,
  settleOrderPaymentTest,
} from "../../utils/settle-payment";
import { calculateAmountInDecimals } from "../../utils/solana";
import { shouldFail } from "../../utils/testing";
import { registerSettleOrderPaymentTest } from "./runner";

registerSettleOrderPaymentTest(
  "should fail to settle a payment if order contains unknown op",
  async (env) => {
    const orderItems = [
      {
        amount: calculateAmountInDecimals(2),
        currency: Keypair.generate().publicKey,
        op: 3,
      },
    ];
    const { serializedOrder, signature } = mockCashierOrderService(
      env.knownOrderSigner,
      anOrder({
        cashRegisterId: env.cashRegisterId,
        customer: env.customer.publicKey,
        items: orderItems,
      })
    );

    return shouldFail(
      () =>
        settleOrderPaymentTest({
          ...env,
          serializedOrder,
          signature,
          signerPublicKey: env.knownOrderSigner.publicKey,
          orderItems,
        }),
      {
        code: "OrderItemUnknownOperation",
        num: 6008,
      }
    );
  }
);
