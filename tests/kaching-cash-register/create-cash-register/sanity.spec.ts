import { Keypair } from "@solana/web3.js";
import { createCashRegister } from "../../utils/cash-register";
import { shouldSucceed } from "../../utils/testing";

test("should create a cash register", () =>
  shouldSucceed(() => createCashRegister({}, Keypair.generate())));
