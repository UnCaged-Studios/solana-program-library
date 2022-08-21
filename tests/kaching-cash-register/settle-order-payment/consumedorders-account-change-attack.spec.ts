import { Keypair } from "@solana/web3.js";
import { createConsumedOrdersTestAccount } from "../../utils/cash-register";
import {
  mockCashierOrderService,
  anOrder,
  settleOrderPayment,
} from "../../utils/settle-payment";
import { V1 } from "../../../sdk/ts/v1";
import { fundWalletWithSOL } from "../../utils/solana";
import { shouldFail } from "../../utils/testing";
import { registerSettleOrderPaymentTest } from "./runner";

registerSettleOrderPaymentTest(
  "should fail when different consumedOrders account is passed to settle-order-payment",
  async (env) => {
    const evilCashier = Keypair.generate();
    await fundWalletWithSOL(evilCashier.publicKey);
    const { createAccountParams } =
      V1.adminSDK.CreateConsumedOrdersAccount.createParams();
    const evilConsumedOrders = await createConsumedOrdersTestAccount(
      evilCashier,
      createAccountParams
    );
    const { serializedOrder, signature } = mockCashierOrderService(
      env.cashier,
      anOrder({
        cashRegisterId: env.cashRegisterId,
        customer: env.customer.publicKey,
      })
    );
    return shouldFail(
      () =>
        settleOrderPayment({
          ...env,
          serializedOrder,
          signature,
          signerPublicKey: env.cashier.publicKey,
          orderItems: [],
          consumedOrders: evilConsumedOrders,
        }),
      { code: "AccountDiscriminatorMismatch", num: 3002 }
    );
  }
);
