import * as anchor from "@project-serum/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import {
  createTestCashRegister,
  generateRandomCashRegisterId,
} from "../../utils/cash-register";
import { fundWalletWithSOL, setupCurrency } from "../../utils/solana";

export type CreateTokenCashboxEnv = {
  cashier: anchor.web3.Keypair;
  currency: PublicKey;
  cashRegisterId: string;
};

export const registerCreateTokenCashboxTest = (
  testTitle: string,
  testFn: (env: CreateTokenCashboxEnv) => Promise<any>
) => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const cashier = Keypair.generate();
  const cashRegisterId = generateRandomCashRegisterId();

  let currency: PublicKey;

  beforeAll(() => fundWalletWithSOL(cashier.publicKey));

  beforeEach(async () => {
    await createTestCashRegister({ cashRegisterId }, cashier, {
      waitForTx: true,
    });
    const modl = await setupCurrency();
    currency = modl.currency;
  });

  it(testTitle, () =>
    testFn({
      cashier,
      currency,
      cashRegisterId,
    })
  );
};
