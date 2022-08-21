import { PublicKey, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { V1 } from "../../sdk/ts/v1";
import { ConsumedOrdersParams } from "../../sdk/ts/v1/create-consumed-orders-account";
import { fundWalletWithSOL, sendAndConfirmTx } from "./solana";

const randomLowerCaseCharCode = () =>
  [1, 2, 3]
    .map(() => String.fromCharCode(97 + Math.floor(Math.random() * 25)))
    .join("");

export const generateRandomCashRegisterId = (
  prefix: string = "my_cash_register_"
) => `${prefix}${randomLowerCaseCharCode()}`;

export const createConsumedOrdersTestAccount = async (
  payer: Keypair,
  createAccountParams: ConsumedOrdersParams["createAccountParams"]
) => {
  const targetAccount = Keypair.generate();
  await sendAndConfirmTx(
    V1.adminSDK.CreateConsumedOrdersAccount.createTx(
      payer.publicKey,
      targetAccount.publicKey,
      LAMPORTS_PER_SOL * 10,
      createAccountParams
    ),
    [payer, targetAccount]
  );
  return targetAccount.publicKey;
};

export const createTestCashRegister = async (
  cashierWallet: Keypair,
  {
    cashRegisterId = generateRandomCashRegisterId(),
    orderSignersWhitelist = [],
    consumedOrders,
  }: Partial<{
    cashRegisterId: string;
    orderSignersWhitelist: Array<PublicKey>;
    consumedOrders?: PublicKey;
  }>
) => {
  await fundWalletWithSOL(cashierWallet.publicKey);
  const { createAccountParams, cashRegisterInitParams } =
    V1.adminSDK.CreateConsumedOrdersAccount.createParams();

  const [[cashRegister, cashRegisterBump], consumedOrdersAccount] =
    await Promise.all([
      V1.adminSDK.CreateCashRegister.findCashRegisterPDA(cashRegisterId),
      consumedOrders ||
        createConsumedOrdersTestAccount(cashierWallet, createAccountParams),
    ]);

  const tx = await V1.adminSDK.CreateCashRegister.createTx({
    cashier: cashierWallet.publicKey,
    cashRegisterId,
    orderSignersWhitelist,
    consumedOrders: {
      account: consumedOrdersAccount,
      ...cashRegisterInitParams,
    },
  });
  await sendAndConfirmTx(tx, [cashierWallet]);
  return {
    cashRegisterId,
    cashRegister,
    cashRegisterBump,
    consumedOrders: consumedOrdersAccount,
  };
};
