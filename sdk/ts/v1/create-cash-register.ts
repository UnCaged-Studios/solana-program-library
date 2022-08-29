import { PublicKey } from "@solana/web3.js";
import { PROGRAM_ID, IProgramAPI } from "./program";
import { ConsumedOrdersParams } from "./create-consumed-orders-account";

export type CreateCashRegisterParams = {
  cashier: PublicKey;
  cashRegisterId: string;
  orderSignersWhitelist: Array<PublicKey>;
  consumedOrders: {
    account: PublicKey;
  } & ConsumedOrdersParams["cashRegisterInitParams"];
};

export const findCashRegisterPDA = (cashRegistedId: string) =>
  PublicKey.findProgramAddress(
    [Buffer.from("cashregister", "utf8"), Buffer.from(cashRegistedId, "ascii")],
    PROGRAM_ID
  );

export class CreateCashRegister {
  constructor(private readonly programAPI: IProgramAPI) {}

  async createTx({
    cashier,
    cashRegisterId,
    orderSignersWhitelist,
    consumedOrders: { account, kNum, bitmapBitsNum, sipKeys },
  }: CreateCashRegisterParams) {
    const [cashRegister] = await findCashRegisterPDA(cashRegisterId);
    return this.programAPI
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
  }
}
