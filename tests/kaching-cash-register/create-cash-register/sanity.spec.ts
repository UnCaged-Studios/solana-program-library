import { Keypair } from "@solana/web3.js";
import { createTestCashRegister } from "../../utils/cash-register";
import { shouldSucceed } from "../../utils/testing";

test("should create a cash register", () =>
  shouldSucceed(() => createTestCashRegister({}, Keypair.generate())));
