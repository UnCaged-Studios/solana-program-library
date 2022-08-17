import * as anchor from "@project-serum/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import {
  createCashRegister,
  createConsumedOrdersAccount,
  findCashRegisterPDA,
  generateRandomCashRegisterId,
} from "../../utils/cash-register";
import { fundWalletWithSOL } from "../../utils/solana";

export type SettlePaymentTestEnv = {
  cashier: anchor.web3.Keypair;
  knownOrderSigner: anchor.web3.Keypair;
  customer: Keypair;
  cashRegister: PublicKey;
  cashRegisterId: string;
  cashRegisterBump: number;
  consumedOrders: PublicKey;
};

export const registerSettleOrderPaymentTest = (
  testTitle: string,
  testFn: (env: SettlePaymentTestEnv) => Promise<any>
) => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

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
    await createCashRegister(
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

  it(testTitle, () =>
    testFn({
      cashier,
      knownOrderSigner,
      cashRegister,
      cashRegisterId,
      cashRegisterBump,
      customer,
      consumedOrders,
    })
  );
};
