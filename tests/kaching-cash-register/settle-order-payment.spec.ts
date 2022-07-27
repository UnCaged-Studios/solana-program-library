import * as anchor from "@project-serum/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { expect, assert } from "chai";
import {
  createCashbox,
  findCashboxPDA,
  generateRandomCashboxId,
} from "../utils/cashbox";
import {
  mockCashierOrderService,
  settleOrderPayment,
} from "../utils/settle-payment";
import { fundWallet } from "../utils/solana";

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

  it("should settle a payment", async () => {
    const { serializedOrder, signature } = mockCashierOrderService(
      [
        { op: "crd", amount: 42, currency: Keypair.generate().publicKey },
        { op: "dbt", amount: 73, currency: Keypair.generate().publicKey },
      ],
      cashier
    );
    await settleOrderPayment({
      cashbox,
      cashboxId,
      cashboxBump,
      serializedOrder,
      signature,
      signerPublicKey: cashier.publicKey,
    });
  });

  it("should settle a payment if order signer is not cashier, but in whitelist", async () => {
    const { serializedOrder, signature } = mockCashierOrderService(
      [{ op: "crd", amount: 42, currency: Keypair.generate().publicKey }],
      knownOrderSigner
    );
    await settleOrderPayment({
      cashbox,
      cashboxId,
      cashboxBump,
      serializedOrder,
      signature,
      signerPublicKey: knownOrderSigner.publicKey,
    });
  });

  it("should fail to settle a payment if order signer is unknown", async () => {
    const evilCashier = Keypair.generate();

    const { serializedOrder, signature } = mockCashierOrderService(
      [{ op: "crd", amount: 42, currency: Keypair.generate().publicKey }],
      evilCashier
    );
    try {
      await settleOrderPayment({
        cashbox,
        cashboxId,
        cashboxBump,
        serializedOrder,
        signature,
        signerPublicKey: evilCashier.publicKey,
      });
    } catch (error) {
      expect(error.logs).to.contain(
        "Program log: AnchorError occurred. Error Code: UnknownOrderSigner. Error Number: 6002. Error Message: order was not signed by a known order signers."
      );
      return;
    }
    assert.fail("expected tx to throw error, but it succeeded");
  });
});
