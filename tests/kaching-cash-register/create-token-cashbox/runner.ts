import { Keypair, PublicKey } from "@solana/web3.js";
import {
  createTestCashRegister,
  generateRandomCashRegisterId,
} from "../../utils/cash-register";
import { fundWalletWithSOL, setupCurrency } from "../../utils/solana";

export type CreateTokenCashboxEnv = {
  cashier: Keypair;
  currency: PublicKey;
  cashRegisterId: string;
};

export const registerCreateTokenCashboxTest = (
  testTitle: string,
  testFn: (env: CreateTokenCashboxEnv) => Promise<any>
) => {
  const cashier = Keypair.generate();
  const cashRegisterId = generateRandomCashRegisterId();

  let currency: PublicKey;

  beforeAll(() => fundWalletWithSOL(cashier.publicKey));

  beforeEach(async () => {
    await createTestCashRegister(cashier, { cashRegisterId });
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
