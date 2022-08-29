import { PublicKey, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { adminSDK } from "../../sdk/ts/ka-ching/with-anchor";
import { ConsumedOrdersParams } from "../../sdk/ts/ka-ching/v1/create-consumed-orders-account";
import { fundWalletWithSOL, sendAndConfirmTx } from "./solana";
import { findCashRegisterPDA } from "../../sdk/ts/ka-ching/v1/create-cash-register";

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
    adminSDK.CreateConsumedOrdersAccount.createTx(
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
    adminSDK.CreateConsumedOrdersAccount.createParams();

  const [[cashRegister, cashRegisterBump], consumedOrdersAccount] =
    await Promise.all([
      findCashRegisterPDA(cashRegisterId),
      consumedOrders ||
        createConsumedOrdersTestAccount(cashierWallet, createAccountParams),
    ]);

  const tx = await adminSDK.CreateCashRegister.createTx({
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
