import { PublicKey } from "@solana/web3.js";
import type { Program as IProgram } from "@project-serum/anchor";
import type { KachingCashRegister } from "../../../../target/types/kaching_cash_register";

export const PROGRAM_ID = new PublicKey(
  "9Pg1X5SXH4m2VXFLBd711GYc98aYAG5DVJW5ssFL28pF"
);

export type IProgramAPI = IProgram<KachingCashRegister>["methods"];
