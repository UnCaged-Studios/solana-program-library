import { Keypair } from "@solana/web3.js";
import {
  mockCashierOrderService,
  anOrder,
  settleOrderPaymentTest,
} from "../../utils/settle-payment";
import { shouldFail } from "../../utils/testing";
import { registerSettleOrderPaymentTest } from "./runner";

registerSettleOrderPaymentTest(
  "should fail to settle a payment if order signer is unknown",
  async ({ cashRegisterId, cashRegister, consumedOrders, customer }) => {
    const evilCashier = Keypair.generate();

    const { serializedOrder, signature } = mockCashierOrderService(
      evilCashier,
      anOrder({
        cashRegisterId,
        customer: customer.publicKey,
      })
    );
    return shouldFail(
      () =>
        settleOrderPaymentTest({
          cashRegister: cashRegister,
          cashRegisterId: cashRegisterId,

          serializedOrder,
          signature,
          signerPublicKey: evilCashier.publicKey,
          customer,
          orderItems: [],
          consumedOrders,
        }),
      { code: "UnknownOrderSigner", num: 6002 }
    );
  }
);
