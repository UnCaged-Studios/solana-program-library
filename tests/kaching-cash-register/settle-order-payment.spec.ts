import * as anchor from "@project-serum/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
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

  let cashbox: PublicKey;
  let cashboxId: string;
  let cashboxBump: number;

  before(async () => {
    await fundWallet(cashier.publicKey);
    cashboxId = generateRandomCashboxId();
    const [_cashbox, _cashboxBump] = await findCashboxPDA(cashboxId);
    cashbox = _cashbox;
    cashboxBump = _cashboxBump;
    await createCashbox({ cashboxId }, cashier);
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
});
