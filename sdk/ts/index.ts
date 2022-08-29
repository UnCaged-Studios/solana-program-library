import { CreateConsumedOrdersAccount } from "./v1/create-consumed-orders-account";
import { CreateCashRegister } from "./v1/create-cash-register";
import { CreateTokenCashbox } from "./v1/create-token-cashbox";
import { SettleOrderPayment } from "./v1/settle-order-payment";
import * as orderSignerSDK from "./v1/order-signer";

import type { IProgramAPI } from "./v1/program";

export const createAdminSDKv1 = (programAPI: IProgramAPI) => ({
  CreateConsumedOrdersAccount: new CreateConsumedOrdersAccount(),
  CreateCashRegister: new CreateCashRegister(programAPI),
  CreateTokenCashbox: new CreateTokenCashbox(programAPI),
});

export const createCustomerSDKv1 = (programAPI: IProgramAPI) => ({
  SettleOrderPayment: new SettleOrderPayment(programAPI),
});

export const createOrderSignerSDKv1 = () => orderSignerSDK;
