import { Keypair } from "@solana/web3.js";
import {
  mockCashierOrderService,
  anOrder,
  settleOrderPaymentTest,
} from "../../utils/settle-payment";
import { shouldFail } from "../../utils/testing";
import { registerSettleOrderPaymentTest } from "./runner";

registerSettleOrderPaymentTest(
  "should fail to settle a payment if order item associated-token-account is not passed",
  async ({
    cashRegister,
    cashRegisterId,
    customer,
    consumedOrders,
    knownOrderSigner,
  }) => {
    const items = new Array(2).fill(0).map(() => ({
      op: 1,
      amount: 2,
      currency: Keypair.generate().publicKey,
    }));
    const { serializedOrder, signature } = mockCashierOrderService(
      knownOrderSigner,
      anOrder({
        cashRegisterId,
        customer: customer.publicKey,
        items,
      })
    );
    return shouldFail(
      () =>
        settleOrderPaymentTest({
          cashRegister,
          cashRegisterId,
          serializedOrder,
          signature,
          signerPublicKey: knownOrderSigner.publicKey,
          customer,
          orderItems: items.slice(1),
          consumedOrders,
        }),
      { code: "OrderItemAtaMissing", num: 6007 }
    );
  }
);
