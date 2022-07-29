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

describe("order validations", () => {
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

  it("should fail a payment because of wrong cashboxId", async () => {
    const { serializedOrder, signature } = mockCashierOrderService(
      cashier,
      anOrder({
        cashboxId: "blah",
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
        }),
      { code: "OrderCashboxIdMismatch", num: 6003 }
    );
  });
});
