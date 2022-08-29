import { Keypair } from "@solana/web3.js";
import { createConsumedOrdersTestAccount } from "../../utils/cash-register";
import {
  mockCashierOrderService,
  anOrder,
  settleOrderPaymentTest,
} from "../../utils/settle-payment";
import { adminSDK } from "../../../sdk/ts/ka-ching/with-anchor";
import { fundWalletWithSOL } from "../../utils/solana";
import { shouldFail } from "../../utils/testing";
import { registerSettleOrderPaymentTest } from "./runner";

registerSettleOrderPaymentTest(
  "should fail when different consumedOrders account is passed to settle-order-payment",
  async (env) => {
    const evilCashier = Keypair.generate();
    await fundWalletWithSOL(evilCashier.publicKey);
    const { createAccountParams } =
      adminSDK.CreateConsumedOrdersAccount.createParams();
    const evilConsumedOrders = await createConsumedOrdersTestAccount(
      evilCashier,
      createAccountParams
    );
    const { serializedOrder, signature } = mockCashierOrderService(
      env.knownOrderSigner,
      anOrder({
        cashRegisterId: env.cashRegisterId,
        customer: env.customer.publicKey,
      })
    );
    return shouldFail(
      () =>
        settleOrderPaymentTest({
          ...env,
          serializedOrder,
          signature,
          signerPublicKey: env.knownOrderSigner.publicKey,
          orderItems: [],
          consumedOrders: evilConsumedOrders,
        }),
      { code: "AccountDiscriminatorMismatch", num: 3002 }
    );
  }
);
