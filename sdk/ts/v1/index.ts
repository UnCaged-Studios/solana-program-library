import { CreateConsumedOrdersAccount } from "./create-consumed-orders-account";
import { CreateCashRegister } from "./create-cash-register";
import { CreateTokenCashbox } from "./create-token-cashbox";
import { SettleOrderPayment } from "./settle-order-payment";
import * as orderSignerSDK from "./order-signer";

import type { IProgramAPI } from "./program";

export const createAdminSDKv1 = (programAPI: IProgramAPI) => ({
  CreateConsumedOrdersAccount: new CreateConsumedOrdersAccount(),
  CreateCashRegister: new CreateCashRegister(programAPI),
  CreateTokenCashbox: new CreateTokenCashbox(programAPI),
});

export const createCustomerSDKv1 = (programAPI: IProgramAPI) => ({
  SettleOrderPayment: new SettleOrderPayment(programAPI),
});

export const createOrderSignerSDKv1 = () => orderSignerSDK;
