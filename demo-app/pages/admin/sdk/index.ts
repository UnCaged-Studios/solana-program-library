import * as CreateConsumedOrdersAccount from "./create-consumed-orders-account";
import * as CreateCashRegister from "./create-cash-register";
import * as CreateTokenCashbox from "./create-token-cashbox";
import * as SettleOrderPayment from "./settle-order-payment";
import * as orderSignerSDK from "./order-signer";

const adminSDK = {
  CreateConsumedOrdersAccount,
  CreateCashRegister,
  CreateTokenCashbox,
};

const customerSDK = {
  SettleOrderPayment,
};

export const V1 = {
  adminSDK,
  customerSDK,
  orderSignerSDK,
};
