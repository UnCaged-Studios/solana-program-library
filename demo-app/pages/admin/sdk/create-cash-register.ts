import { PublicKey } from "@solana/web3.js";
import { KachingProgram, KACHING_PROGRAM_ID } from "./anchor-client";
import { ConsumedOrdersParams } from "./create-consumed-orders-account";

export type CreateCashRegisterParams = {
  cashier: PublicKey;
  cashRegisterId: string;
  orderSignersWhitelist: Array<PublicKey>;
  consumedOrders: {
    account: PublicKey;
  } & ConsumedOrdersParams["cashRegisterInitParams"];
};

export const findCashRegisterPDA = async (cashRegistedId: string) =>
  PublicKey.findProgramAddress(
    [Buffer.from("cashregister", "utf8"), Buffer.from(cashRegistedId, "ascii")],
    KACHING_PROGRAM_ID
  );

export const createTx = async ({
  cashier,
  cashRegisterId,
  orderSignersWhitelist,
  consumedOrders: { account, kNum, bitmapBitsNum, sipKeys },
}: CreateCashRegisterParams) => {
  const [cashRegister] = await findCashRegisterPDA(cashRegisterId);
  return KachingProgram.createCashRegister({
    cashRegisterId,
    orderSignersWhitelist,
    consumedOrdersInitKNum: kNum,
    consumedOrdersInitBitmapBitsNum: bitmapBitsNum,
    consumedOrdersInitSipKeys: sipKeys,
  })
    .accounts({
      cashier,
      cashRegister,
      consumedOrders: account,
    })
    .transaction();
};
