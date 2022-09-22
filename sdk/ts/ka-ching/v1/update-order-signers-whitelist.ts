import { IProgramAPI } from "./program";
import { findCashRegisterPDA } from "./create-cash-register";

import type { PublicKey } from "@solana/web3.js";

export type UpdateOrderSignersWhitelistParams = {
  cashRegisterId: string;
  cashier: PublicKey;
  orderSignersWhitelist: Array<PublicKey>;
  updateType: "merge" | "override";
};

export class UpdateOrderSignersWhitelist {
  constructor(private readonly programAPI: IProgramAPI) {}

  async createTx({
    cashRegisterId,
    cashier,
    orderSignersWhitelist,
    updateType,
  }: UpdateOrderSignersWhitelistParams) {
    const [cashRegister] = await findCashRegisterPDA(cashRegisterId);
    const mode = {
      [updateType]: true,
    } as never; // could not understand the type for enums arguments, so reversed-enginneered the source code
    return this.programAPI
      .updateOrderSignersWhitelist({
        orderSignersWhitelist,
        mode,
      })
      .accounts({
        cashRegister,
        cashier,
      })
      .transaction();
  }
}
