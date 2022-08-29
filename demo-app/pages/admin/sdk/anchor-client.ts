import { Program } from "../anchorjs-esm";
import IDL from "./kaching_cash_register.json";
import { PublicKey, Keypair } from "@solana/web3.js";
import type { Program as IProgram } from "@project-serum/anchor";
import type { KachingCashRegister } from "./kaching_cash_register";

export const KACHING_PROGRAM_ID = new PublicKey(
  "9Pg1X5SXH4m2VXFLBd711GYc98aYAG5DVJW5ssFL28pF"
);

export const KachingProgram: IProgram<KachingCashRegister>["methods"] =
  new Program(IDL, KACHING_PROGRAM_ID, {
    publicKey: Keypair.generate(),
  }).methods;
