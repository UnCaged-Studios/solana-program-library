import { Keypair, PublicKey } from "@solana/web3.js";
import { createTestCashRegister } from "../utils/cash-register";
import {
  anOrder,
  mockCashierOrderService,
  settleOrderPaymentTest,
} from "../utils/settle-payment";
import { fundWalletWithSOL } from "../utils/solana";
import { shouldFail } from "../utils/testing";

describe("order validations", () => {
  const cashier = Keypair.generate();
  const knownOrderSigner = Keypair.generate();

  let cashRegisterId: string;
  let cashRegister: PublicKey;
  let consumedOrders: PublicKey;
  let cashRegisterBump: number;

  let customer: Keypair;

  beforeAll(async () => {
    const res = await createTestCashRegister(cashier, {
      orderSignersWhitelist: [knownOrderSigner.publicKey],
    });
    cashRegister = res.cashRegister;
    cashRegisterId = res.cashRegisterId;
    consumedOrders = res.consumedOrders;
    cashRegisterBump = res.cashRegisterBump;
  });

  beforeEach(async () => {
    customer = Keypair.generate();
    await fundWalletWithSOL(customer.publicKey);
  });

  it("should fail a payment because of wrong cashRegister", async () => {
    const { serializedOrder, signature } = mockCashierOrderService(
      knownOrderSigner,
      anOrder({
        cashRegisterId: "blah",
        customer: customer.publicKey,
      })
    );
    return shouldFail(
      () =>
        settleOrderPaymentTest({
          cashRegister,
          cashRegisterId,
          cashRegisterBump,
          serializedOrder,
          signature,
          signerPublicKey: knownOrderSigner.publicKey,
          customer,
          orderItems: [],
          consumedOrders,
        }),
      { code: "OrderCashRegisterIdMismatch", num: 6003 }
    );
  });

  it("should fail a payment because customer of signed transaction is not the customer in order", async () => {
    const evilCustomer = Keypair.generate();
    await fundWalletWithSOL(evilCustomer.publicKey);

    const { serializedOrder, signature } = mockCashierOrderService(
      knownOrderSigner,
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
          cashRegisterBump: cashRegisterBump,
          serializedOrder,
          signature,
          signerPublicKey: knownOrderSigner.publicKey,
          customer: evilCustomer,
          orderItems: [],
          consumedOrders,
        }),
      { code: "OrderCustomerMismatch", num: 6004 }
    );
  });

  it("should fail a payment because order is expired", async () => {
    const { serializedOrder, signature } = mockCashierOrderService(
      knownOrderSigner,
      anOrder({
        cashRegisterId,
        expiry: Date.now() / 1000 - 30, // expired 10 seconds ago
        customer: customer.publicKey,
      })
    );
    return shouldFail(
      () =>
        settleOrderPaymentTest({
          cashRegister: cashRegister,
          cashRegisterId: cashRegisterId,
          cashRegisterBump: cashRegisterBump,
          serializedOrder,
          signature,
          signerPublicKey: knownOrderSigner.publicKey,
          customer,
          orderItems: [],
          consumedOrders,
        }),
      { code: "OrderExpired", num: 6005 }
    );
  });

  it("should fail a payment because order is not valid yet", async () => {
    const { serializedOrder, signature } = mockCashierOrderService(
      knownOrderSigner,
      anOrder({
        cashRegisterId,
        notBefore: Date.now() / 1000 + 30, // order will be valid in 30 seconds
        customer: customer.publicKey,
      })
    );
    return shouldFail(
      () =>
        settleOrderPaymentTest({
          cashRegister: cashRegister,
          cashRegisterId: cashRegisterId,
          cashRegisterBump: cashRegisterBump,
          serializedOrder,
          signature,
          signerPublicKey: knownOrderSigner.publicKey,
          customer,
          orderItems: [],
          consumedOrders,
        }),
      { code: "OrderNotValidYet", num: 6006 }
    );
  });
});
