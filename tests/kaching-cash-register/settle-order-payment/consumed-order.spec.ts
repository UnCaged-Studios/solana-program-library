import {
  mockCashierOrderService,
  anOrder,
  settleOrderPaymentTest,
} from "../../utils/settle-payment";
import { shouldFail } from "../../utils/testing";
import { registerSettleOrderPaymentTest } from "./runner";

registerSettleOrderPaymentTest(
  "should fail to settle two orders with the same id",
  async ({
    cashRegisterId,
    cashRegister,
    consumedOrders,
    customer,
    knownOrderSigner,
  }) => {
    const { serializedOrder, signature } = mockCashierOrderService(
      knownOrderSigner,
      anOrder({
        cashRegisterId,
        customer: customer.publicKey,
      })
    );
    await settleOrderPaymentTest({
      cashRegister: cashRegister,
      cashRegisterId: cashRegisterId,

      serializedOrder,
      signature,
      signerPublicKey: knownOrderSigner.publicKey,
      customer,
      orderItems: [],
      consumedOrders,
    });
    return shouldFail(
      () =>
        settleOrderPaymentTest({
          cashRegister: cashRegister,
          cashRegisterId: cashRegisterId,

          serializedOrder,
          signature,
          signerPublicKey: knownOrderSigner.publicKey,
          customer,
          orderItems: [],
          consumedOrders,
        }),
      { code: "OrderHasBeenConsumed", num: 6011 }
    );
  }
);
