import {
  mockCashierOrderService,
  anOrder,
  settleOrderPayment,
} from "../../utils/settle-payment";
import { shouldSucceed } from "../../utils/testing";
import { registerSettleOrderPaymentTest } from "./runner";

registerSettleOrderPaymentTest(
  "should settle a payment if order signer is not cashier, but in whitelist",
  ({
    cashRegisterId,
    cashRegister,
    knownOrderSigner,
    customer,
    cashRegisterBump,
    consumedOrders,
  }) =>
    shouldSucceed(() => {
      const { serializedOrder, signature } = mockCashierOrderService(
        knownOrderSigner,
        anOrder({
          cashRegisterId,
          customer: customer.publicKey,
        })
      );
      return settleOrderPayment({
        cashRegister: cashRegister,
        cashRegisterId: cashRegisterId,
        cashRegisterBump: cashRegisterBump,
        serializedOrder,
        signature,
        signerPublicKey: knownOrderSigner.publicKey,
        customer,
        orderItems: [],
        consumedOrders,
      });
    })
);
