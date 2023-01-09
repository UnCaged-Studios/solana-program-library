import { orderSignerSDK } from "../../../sdk/ts/ka-ching/with-anchor";
import {
  mockCashierOrderService,
  anOrder,
  settleOrderPaymentTest,
} from "../../utils/settle-payment";
import {
  calculateAmountInDecimals,
  getMintBalanceForWallet,
  setupCurrency,
} from "../../utils/solana";
import { resolveTxError } from "../../utils/testing";
import { createTokenCashbox } from "../../utils/token-cashbox";
import { registerSettleOrderPaymentTest } from "./runner";

registerSettleOrderPaymentTest(
  "should settle a payment if user doesnt have token account prior to txn",
  async ({
    cashier,
    customer,
    cashRegisterId,
    knownOrderSigner,
    cashRegister,
    consumedOrders,
  }) => {
    const { fundWallet, currency } = await setupCurrency();
    const [cashbox] = await createTokenCashbox({
      currency,
      cashier,
      cashRegisterId,
    });
    await fundWallet(cashbox, 2);
    const orderItems = [
      {
        amount: calculateAmountInDecimals(1),
        currency,
        op: orderSignerSDK.OrderItemOperation.CREDIT_CUSTOMER,
        shouldCreateAta: true,
      },
    ];
    const { serializedOrder, signature } = mockCashierOrderService(
      knownOrderSigner,
      anOrder({
        cashRegisterId,
        customer: customer.publicKey,
        items: orderItems,
      })
    );

    try {
      await settleOrderPaymentTest({
        cashRegister,
        cashRegisterId,
        serializedOrder,
        signature,
        signerPublicKey: knownOrderSigner.publicKey,
        customer,
        orderItems,
        consumedOrders,
      });
    } catch (e) {
      const error = resolveTxError(e);
      if (error.logs) {
        console.info(error.logs);
      } else {
        console.info(error);
      }
      throw new Error(`expected tx to succeed, but error was thrown`);
    }
    const balance = await getMintBalanceForWallet(customer.publicKey, currency);
    expect(balance.toString()).toEqual(calculateAmountInDecimals(1).toString());
  }
);
