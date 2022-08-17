import {
  mockCashierOrderService,
  anOrder,
  settleOrderPayment,
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
    cashRegisterBump,
    cashier,
  }) => {
    const { serializedOrder, signature } = mockCashierOrderService(
      cashier,
      anOrder({
        cashRegisterId,
        customer: customer.publicKey,
      })
    );
    await settleOrderPayment({
      cashRegister: cashRegister,
      cashRegisterId: cashRegisterId,
      cashRegisterBump: cashRegisterBump,
      serializedOrder,
      signature,
      signerPublicKey: cashier.publicKey,
      customer,
      orderItems: [],
      consumedOrders,
    });
    return shouldFail(
      () =>
        settleOrderPayment({
          cashRegister: cashRegister,
          cashRegisterId: cashRegisterId,
          cashRegisterBump: cashRegisterBump,
          serializedOrder,
          signature,
          signerPublicKey: cashier.publicKey,
          customer,
          orderItems: [],
          consumedOrders,
        }),
      { code: "OrderHasBeenConsumed", num: 6011 }
    );
  }
);
