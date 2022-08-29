import * as anchor from "@project-serum/anchor";
import {
  createAdminSDKv1,
  createCustomerSDKv1,
  createOrderSignerSDKv1,
} from ".";

import type { KachingCashRegister } from "../../../target/types/kaching_cash_register";

const program = anchor.workspace
  .KachingCashRegister as anchor.Program<KachingCashRegister>;

export const adminSDK = createAdminSDKv1(program.methods);

export const customerSDK = createCustomerSDKv1(program.methods);

export const orderSignerSDK = createOrderSignerSDKv1();
