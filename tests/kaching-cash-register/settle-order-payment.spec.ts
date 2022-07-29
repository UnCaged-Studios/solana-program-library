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
import { fundWallet } from "../utils/solana";
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
    await fundWallet(cashier.publicKey);
    cashboxId = generateRandomCashboxId();
    const [_cashbox, _cashboxBump] = await findCashboxPDA(cashboxId);
    cashbox = _cashbox;
    cashboxBump = _cashboxBump;
    await createCashbox(
      { cashboxId, orderSignersWhitelist: [knownOrderSigner.publicKey] },
      cashier
    );
  });

  it("should settle a payment", () => {
    const customer = Keypair.generate();
    const { serializedOrder, signature } = mockCashierOrderService(
      cashier,
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
      signerPublicKey: cashier.publicKey,
      customer,
    });
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
