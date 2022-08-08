import * as anchor from "@project-serum/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { expect, assert } from "chai";
import {
  createCashbox,
  findCashboxPDA,
  generateRandomCashboxId,
} from "../utils/cashbox";
import {
  anOrder,
  mockCashierOrderService,
  settleOrderPayment,
} from "../utils/settle-payment";
import { fundWalletWithSOL } from "../utils/solana";
import { shouldFail } from "../utils/testing";

describe("order validations", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const cashier = Keypair.generate();
  const knownOrderSigner = Keypair.generate();

  let cashbox: PublicKey;
  let cashboxId: string;
  let cashboxBump: number;

  before(async () => {
    await fundWalletWithSOL(cashier.publicKey);
    cashboxId = generateRandomCashboxId();
    const [_cashbox, _cashboxBump] = await findCashboxPDA(cashboxId);
    cashbox = _cashbox;
    cashboxBump = _cashboxBump;
    return createCashbox(
      { cashboxId, orderSignersWhitelist: [knownOrderSigner.publicKey] },
      cashier
    );
  });

  it("should fail a payment because of wrong cashboxId", async () => {
    const customer = Keypair.generate();
    const { serializedOrder, signature } = mockCashierOrderService(
      cashier,
      anOrder({
        cashboxId: "blah",
        customer: customer.publicKey,
      })
    );
    return shouldFail(
      () =>
        settleOrderPayment({
          cashbox,
          cashboxId,
          cashboxBump,
          serializedOrder,
          signature,
          signerPublicKey: cashier.publicKey,
          customer,
        }),
      { code: "OrderCashboxIdMismatch", num: 6003 }
    );
  });

  it("should fail a payment because customer of signed transaction is not the customer in order", async () => {
    const customer = Keypair.generate();
    const evilCustomer = Keypair.generate();
    const { serializedOrder, signature } = mockCashierOrderService(
      cashier,
      anOrder({
        cashboxId,
        customer: customer.publicKey,
      })
    );
    return shouldFail(
      () =>
        settleOrderPayment({
          cashbox,
          cashboxId,
          cashboxBump,
          serializedOrder,
          signature,
          signerPublicKey: cashier.publicKey,
          customer: evilCustomer,
        }),
      { code: "OrderCustomerMismatch", num: 6004 }
    );
  });

  it("should fail a payment because order is expired", async () => {
    const customer = Keypair.generate();
    const { serializedOrder, signature } = mockCashierOrderService(
      cashier,
      anOrder({
        cashboxId,
        expiry: Date.now() / 1000 - 30, // expired 10 seconds ago
        customer: customer.publicKey,
      })
    );
    return shouldFail(
      () =>
        settleOrderPayment({
          cashbox,
          cashboxId,
          cashboxBump,
          serializedOrder,
          signature,
          signerPublicKey: cashier.publicKey,
          customer,
        }),
      { code: "OrderExpired", num: 6005 }
    );
  });

  it("should fail a payment because order is not valid yet", async () => {
    const customer = Keypair.generate();
    const { serializedOrder, signature } = mockCashierOrderService(
      cashier,
      anOrder({
        cashboxId,
        notBefore: Date.now() / 1000 + 30, // order will be valid in 30 seconds
        customer: customer.publicKey,
      })
    );
    return shouldFail(
      () =>
        settleOrderPayment({
          cashbox,
          cashboxId,
          cashboxBump,
          serializedOrder,
          signature,
          signerPublicKey: cashier.publicKey,
          customer,
        }),
      { code: "OrderNotValidYet", num: 6006 }
    );
  });
});
