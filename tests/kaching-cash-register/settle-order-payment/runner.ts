import { Keypair, PublicKey } from "@solana/web3.js";
import { createTestCashRegister } from "../../utils/cash-register";
import { fundWalletWithSOL } from "../../utils/solana";

export type SettlePaymentTestEnv = {
  cashier: Keypair;
  knownOrderSigner: Keypair;
  customer: Keypair;
  cashRegister: PublicKey;
  cashRegisterId: string;
  consumedOrders: PublicKey;
};

export const registerSettleOrderPaymentTest = (
  testTitle: string,
  testFn: (env: SettlePaymentTestEnv) => Promise<any>
) => {
  const cashier = Keypair.generate();
  const knownOrderSigner = Keypair.generate();
  const customer = Keypair.generate();

  it(testTitle, async () => {
    const [{ cashRegister, cashRegisterId, consumedOrders }] =
      await Promise.all([
        createTestCashRegister(cashier, {
          orderSignersWhitelist: [knownOrderSigner.publicKey],
        }),
        fundWalletWithSOL(customer.publicKey),
      ]);

    return testFn({
      cashier,
      knownOrderSigner,
      cashRegister,
      cashRegisterId,
      customer,
      consumedOrders,
    });
  });
};
