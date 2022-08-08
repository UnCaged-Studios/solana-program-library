import { Keypair } from "@solana/web3.js";
import {
  mockCashierOrderService,
  anOrder,
  settleOrderPayment,
} from "../../utils/settle-payment";
import { shouldFail } from "../../utils/testing";
import { registerSettleOrderPaymentTest } from "./runner";

registerSettleOrderPaymentTest(
  "should fail to settle a payment if order item associated-token-account is not passed",
  async ({
    cashier,
    cashRegister,
    cashRegisterBump,
    cashRegisterId,
    customer,
  }) => {
    const items = new Array(2).fill(0).map(() => ({
      op: 1,
      amount: 2,
      currency: Keypair.generate().publicKey,
    }));
    const { serializedOrder, signature } = mockCashierOrderService(
      cashier,
      anOrder({
        cashRegisterId,
        customer: customer.publicKey,
        items,
      })
    );
    return shouldFail(
      () =>
        settleOrderPayment({
          cashRegister,
          cashRegisterId,
          cashRegisterBump,
          serializedOrder,
          signature,
          signerPublicKey: cashier.publicKey,
          customer,
          orderItems: items.slice(1),
        }),
      { code: "OrderItemAtaMissing", num: 6007 }
    );
  }
);
