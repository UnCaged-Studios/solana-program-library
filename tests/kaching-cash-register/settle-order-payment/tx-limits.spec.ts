import { V1 } from "../../../sdk/ts/v1";
import {
  mockCashierOrderService,
  anOrder,
  settleOrderPayment,
} from "../../utils/settle-payment";
import {
  calculateAmountInDecimals,
  getMintBalanceForWallet,
  setupCurrency,
} from "../../utils/solana";
import { shouldSucceed } from "../../utils/testing";
import { createTokenCashbox } from "../../utils/token-cashbox";
import { registerSettleOrderPaymentTest } from "./runner";

const MAXIMUM_ORDER_ITEMS_LENGTH = 12;

registerSettleOrderPaymentTest(
  "should settle a payment with maximum ix size",
  async ({
    cashRegisterId,
    cashRegister,
    cashier,
    customer,
    cashRegisterBump,
    consumedOrders,
  }) =>
    shouldSucceed(async () => {
      const { currency, fundWallet } = await setupCurrency();

      const customerInitialBalance = 25;

      const [tokenCashbox] = await createTokenCashbox({
        currency,
        cashier,
        cashRegisterId,
      });

      await Promise.all([
        fundWallet(tokenCashbox, 1),
        fundWallet(customer.publicKey, customerInitialBalance),
      ]);

      const orderItems = new Array(MAXIMUM_ORDER_ITEMS_LENGTH)
        .fill(0)
        .map(() => ({
          op: V1.orderSignerSDK.OrderItemOperation.DEBIT_CUSTOMER,
          amount: calculateAmountInDecimals(1),
          currency,
        }));

      const { serializedOrder, signature } = mockCashierOrderService(
        cashier,
        anOrder({
          cashRegisterId,
          customer: customer.publicKey,
          items: orderItems,
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
        orderItems,
        consumedOrders,
      });

      const customerBalance = await getMintBalanceForWallet(
        customer.publicKey,
        currency
      );
      const expectedBalance = calculateAmountInDecimals(
        customerInitialBalance - MAXIMUM_ORDER_ITEMS_LENGTH
      );
      expect(customerBalance.toString()).toEqual(String(expectedBalance));
    })
);
