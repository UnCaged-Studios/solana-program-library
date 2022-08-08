import * as anchor from "@project-serum/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { assert, expect } from "chai";
import { OrderItemOperation } from "../../sdk/ts";
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
import {
  fundWalletWithSOL,
  getConnection,
  setupCurrency,
} from "../utils/solana";
import { shouldFail } from "../utils/testing";

describe("settle_order_payment instruction", () => {
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
    await createCashbox(
      { cashboxId, orderSignersWhitelist: [knownOrderSigner.publicKey] },
      cashier
    );
  });

  it.only("should settle a payment", async () => {
    const customer = Keypair.generate();
    const { utils, createCurrency, fundWallet } = await setupCurrency();
    const currency = await createCurrency();
    await Promise.all([
      fundWallet(cashier.publicKey, 2),
      fundWallet(customer.publicKey, 2),
      fundWalletWithSOL(customer.publicKey),
    ]);
    const orderItems = [
      {
        amount: utils.calculateAmountInDecimals(1),
        currency,
        op: OrderItemOperation.DEBIT_CUSTOMER,
      },
    ];
    const { serializedOrder, signature } = mockCashierOrderService(
      cashier,
      anOrder({
        cashboxId,
        customer: customer.publicKey,
        items: orderItems,
      })
    );

    try {
      const tx = await settleOrderPayment({
        cashbox,
        cashboxId,
        cashboxBump,
        serializedOrder,
        signature,
        signerPublicKey: cashier.publicKey,
        customer,
        orderItems,
      });
      await getConnection().confirmTransaction(tx);
    } catch (error) {
      console.info(error.logs);
      assert.fail(`expected tx to succeed, but error was thrown`);
    }
    const [customerBalance, cashierBalance] = await Promise.all([
      utils.getMintBalanceForWallet(customer.publicKey),
      utils.getMintBalanceForWallet(cashier.publicKey),
    ]);
    expect(customerBalance.toString()).to.eq(
      String(utils.calculateAmountInDecimals(1))
    );
    expect(cashierBalance.toString()).to.eq(
      String(utils.calculateAmountInDecimals(3))
    );
  });

  it("should settle a payment with maximum ix size", async () => {
    const customer = Keypair.generate();
    const { serializedOrder, signature } = mockCashierOrderService(
      cashier,
      anOrder({
        cashboxId,
        customer: customer.publicKey,
        items: new Array(18).fill(0).map(() => ({
          op: 1,
          amount: 42,
          currency: Keypair.generate().publicKey,
        })),
      })
    );
    return settleOrderPayment({
      cashbox,
      cashboxId,
      cashboxBump,
      serializedOrder,
      signature,
      signerPublicKey: cashier.publicKey,
      customer,
    });
  });

  it("should settle a payment if order signer is not cashier, but in whitelist", async () => {
    const customer = Keypair.generate();
    const { serializedOrder, signature } = mockCashierOrderService(
      knownOrderSigner,
      anOrder({
        cashboxId,
        customer: customer.publicKey,
      })
    );
    return settleOrderPayment({
      cashbox,
      cashboxId,
      cashboxBump,
      serializedOrder,
      signature,
      signerPublicKey: knownOrderSigner.publicKey,
      customer,
    });
  });

  it("should fail to settle a payment if order signer is unknown", async () => {
    const customer = Keypair.generate();
    const evilCashier = Keypair.generate();

    const { serializedOrder, signature } = mockCashierOrderService(
      evilCashier,
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
          signerPublicKey: evilCashier.publicKey,
          customer,
        }),
      { code: "UnknownOrderSigner", num: 6002 }
    );
  });
});
