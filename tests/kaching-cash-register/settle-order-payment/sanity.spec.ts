import { OrderItemOperation } from "../../../sdk/ts";
import {
  mockCashierOrderService,
  anOrder,
  settleOrderPayment,
} from "../../utils/settle-payment";
import {
  calculateAmountInDecimals,
  confirmTransaction,
  getMintBalanceForWallet,
  setupCurrency,
} from "../../utils/solana";
import { createTokenCashbox } from "../../utils/token-cashbox";
import { registerSettleOrderPaymentTest } from "./runner";

registerSettleOrderPaymentTest("should settle a payment", async (env) => {
  const [
    { fundWallet: fundWalletWithC1, currency: c1 },
    { fundWallet: fundWalletWithC2, currency: c2 },
  ] = await Promise.all([setupCurrency(), setupCurrency()]);

  const [_cashbox1, cashbox2] = await Promise.all(
    [c1, c2].map((c) =>
      createTokenCashbox({
        currency: c,
        cashier: env.cashier,
        cashRegisterId: env.cashRegisterId,
      })
    )
  );

  await Promise.all([
    fundWalletWithC1(env.customer.publicKey, 3),
    fundWalletWithC2(env.customer.publicKey, 0), // TODO - should be done on contrat side
    fundWalletWithC2(cashbox2, 1),
  ]);
  const orderItems = [
    {
      amount: calculateAmountInDecimals(2),
      currency: c1,
      op: OrderItemOperation.DEBIT_CUSTOMER,
    },
    {
      amount: calculateAmountInDecimals(1),
      currency: c2,
      op: OrderItemOperation.CREDIT_CUSTOMER,
    },
  ];
  const { serializedOrder, signature } = mockCashierOrderService(
    env.cashier,
    anOrder({
      cashRegisterId: env.cashRegisterId,
      customer: env.customer.publicKey,
      items: orderItems,
    })
  );

  try {
    const tx = await settleOrderPayment({
      cashRegister: env.cashRegister,
      cashRegisterId: env.cashRegisterId,
      cashRegisterBump: env.cashRegisterBump,
      serializedOrder,
      signature,
      signerPublicKey: env.cashier.publicKey,
      customer: env.customer,
      orderItems,
      consumedOrders: env.consumedOrders,
    });
    await confirmTransaction(tx);
  } catch (error) {
    if (error.logs) {
      console.info(error.logs);
    } else {
      console.info(error);
    }
    throw new Error(`expected tx to succeed, but error was thrown`);
  }
  const [c1_balance, c2_balance] = await Promise.all([
    getMintBalanceForWallet(env.customer.publicKey, c1),
    getMintBalanceForWallet(env.customer.publicKey, c2),
  ]);

  expect(c1_balance.toString()).toEqual(
    calculateAmountInDecimals(1).toString()
  );
  expect(c2_balance.toString()).toEqual(
    calculateAmountInDecimals(1).toString()
  );
});
