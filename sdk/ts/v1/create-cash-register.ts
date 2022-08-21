import * as anchor from "@project-serum/anchor";
import { KachingCashRegister } from "../../../target/types/kaching_cash_register";
import { PublicKey } from "@solana/web3.js";
import { ConsumedOrdersParams } from "./create-consumed-orders-account";

const program = anchor.workspace
  .KachingCashRegister as anchor.Program<KachingCashRegister>;

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
    [
      anchor.utils.bytes.utf8.encode("cashregister"),
      Buffer.from(cashRegistedId, "ascii"),
    ],
    program.programId
  );

export const createTx = async ({
  cashier,
  cashRegisterId,
  orderSignersWhitelist,
  consumedOrders: { account, kNum, bitmapBitsNum, sipKeys },
}: CreateCashRegisterParams) => {
  const [cashRegister, _cashRegisterBump] = await findCashRegisterPDA(
    cashRegisterId
  );
  return program.methods
    .createCashRegister({
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
