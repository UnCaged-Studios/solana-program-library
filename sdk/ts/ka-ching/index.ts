import { CreateConsumedOrdersAccount } from "./v1/create-consumed-orders-account";
import { CreateCashRegister } from "./v1/create-cash-register";
import { CreateTokenCashbox } from "./v1/create-token-cashbox";
import { SettleOrderPayment } from "./v1/settle-order-payment";
import { UpdateOrderSignersWhitelist } from "./v1/update-order-signers-whitelist";
import { deserializeCashRegisterAccountData } from "./v1/utils";

import * as orderSignerSDK from "./v1/order-signer";
import * as IDL_V1 from "../../../target/idl/kaching_cash_register.json";

import type { IProgramAPI as IKachingProgramAPI } from "./v1/program";

export const createAdminSDKv1 = (programAPI: IKachingProgramAPI) => ({
  CreateConsumedOrdersAccount: new CreateConsumedOrdersAccount(),
  CreateCashRegister: new CreateCashRegister(programAPI),
  CreateTokenCashbox: new CreateTokenCashbox(programAPI),
  UpdateOrderSignersWhitelist: new UpdateOrderSignersWhitelist(programAPI),
});

export const createCustomerSDKv1 = (programAPI: IKachingProgramAPI) => ({
  SettleOrderPayment: new SettleOrderPayment(programAPI),
});

export const createOrderSignerSDKv1 = () => orderSignerSDK;

export const utils = {
  deserializeCashRegisterAccountData,
};

export const KachingProgramIDL = IDL_V1;
