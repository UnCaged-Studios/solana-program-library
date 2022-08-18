import { Keypair, PublicKey } from "@solana/web3.js";
import {
  createTestCashRegister,
  createConsumedOrdersAccount,
  findCashRegisterPDA,
  generateRandomCashRegisterId,
} from "../utils/cash-register";
import {
  anOrder,
  mockCashierOrderService,
  settleOrderPayment,
} from "../utils/settle-payment";
import { fundWalletWithSOL } from "../utils/solana";
import { shouldFail } from "../utils/testing";

describe("order validations", () => {
  const cashier = Keypair.generate();
  const knownOrderSigner = Keypair.generate();

  let cashRegister: PublicKey;
  let consumedOrders: PublicKey;
  let cashRegisterId: string;
  let cashRegisterBump: number;

  let customer: Keypair;

  beforeAll(async () => {
    await fundWalletWithSOL(cashier.publicKey);
    cashRegisterId = generateRandomCashRegisterId();
    const [_cashRegister, _cashRegisterBump] = await findCashRegisterPDA(
      cashRegisterId
    );
    cashRegister = _cashRegister;
    cashRegisterBump = _cashRegisterBump;
    consumedOrders = await createConsumedOrdersAccount(cashier, 898_600);

    return createTestCashRegister(
      {
        cashRegisterId,
        orderSignersWhitelist: [knownOrderSigner.publicKey],
      },
      cashier,
      { consumedOrders }
    );
  });

  beforeEach(async () => {
    customer = Keypair.generate();
    await fundWalletWithSOL(customer.publicKey);
  });

  it("should fail a payment because of wrong cashRegister", async () => {
    const { serializedOrder, signature } = mockCashierOrderService(
      cashier,
      anOrder({
        cashRegisterId: "blah",
        customer: customer.publicKey,
      })
    );
    return shouldFail(
      () =>
        settleOrderPayment({
          cashRegister,
          cashRegisterId,
          cashRegisterBump,
          serializedOrder,
          signature,
          signerPublicKey: cashier.publicKey,
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
      cashier,
      anOrder({
        cashRegisterId,
        customer: customer.publicKey,
      })
    );
    return shouldFail(
      () =>
        settleOrderPayment({
          cashRegister: cashRegister,
          cashRegisterId: cashRegisterId,
          cashRegisterBump: cashRegisterBump,
          serializedOrder,
          signature,
          signerPublicKey: cashier.publicKey,
          customer: evilCustomer,
          orderItems: [],
          consumedOrders,
        }),
      { code: "OrderCustomerMismatch", num: 6004 }
    );
  });

  it("should fail a payment because order is expired", async () => {
    const { serializedOrder, signature } = mockCashierOrderService(
      cashier,
      anOrder({
        cashRegisterId,
        expiry: Date.now() / 1000 - 30, // expired 10 seconds ago
        customer: customer.publicKey,
      })
    );
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
      { code: "OrderExpired", num: 6005 }
    );
  });

  it("should fail a payment because order is not valid yet", async () => {
    const { serializedOrder, signature } = mockCashierOrderService(
      cashier,
      anOrder({
        cashRegisterId,
        notBefore: Date.now() / 1000 + 30, // order will be valid in 30 seconds
        customer: customer.publicKey,
      })
    );
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
      { code: "OrderNotValidYet", num: 6006 }
    );
  });
});
