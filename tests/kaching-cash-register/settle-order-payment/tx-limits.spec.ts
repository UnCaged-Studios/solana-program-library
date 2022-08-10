import { OrderItemOperation } from "../../../sdk/ts";
import {
  mockCashierOrderService,
  anOrder,
  settleOrderPayment,
} from "../../utils/settle-payment";
import { confirmTransaction, setupCurrency } from "../../utils/solana";
import { shouldSucceed } from "../../utils/testing";
import { createTokenCashbox } from "../../utils/token-cashbox";
import { registerSettleOrderPaymentTest, SettlePaymentTestEnv } from "./runner";

const MAXIMUM_ORDER_ITEMS_LENGTH = 13;

registerSettleOrderPaymentTest(
  "should settle a payment with maximum ix size",
  shouldSucceed(
    async ({
      cashRegisterId,
      cashRegister,
      cashier,
      customer,
      cashRegisterBump,
    }: SettlePaymentTestEnv) => {
      const { utils, currency, fundWallet } = await setupCurrency();

      const customerInitialBalance = 25;

      const tokenCashbox = await createTokenCashbox({
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
          op: OrderItemOperation.DEBIT_CUSTOMER,
          amount: utils.calculateAmountInDecimals(1),
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

      const tx = await settleOrderPayment({
        cashRegister: cashRegister,
        cashRegisterId: cashRegisterId,
        cashRegisterBump: cashRegisterBump,
        serializedOrder,
        signature,
        signerPublicKey: cashier.publicKey,
        customer,
        orderItems,
      });

      await confirmTransaction(tx);

      const customerBalance = await utils.getMintBalanceForWallet(
        customer.publicKey
      );
      const expectedBalance = utils.calculateAmountInDecimals(
        customerInitialBalance - MAXIMUM_ORDER_ITEMS_LENGTH
      );
      expect(customerBalance.toString()).toEqual(String(expectedBalance));
    }
  )
);
