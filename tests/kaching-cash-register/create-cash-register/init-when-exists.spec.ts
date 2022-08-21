import { Keypair } from "@solana/web3.js";
import {
  generateRandomCashRegisterId,
  createTestCashRegister,
} from "../../utils/cash-register";
import { shouldFail } from "../../utils/testing";

test("should fail to create a cashRegister if already exists", async () => {
  const cashier = Keypair.generate();
  const cashRegisterId = generateRandomCashRegisterId();

  const { cashRegister } = await createTestCashRegister(cashier, {
    cashRegisterId,
  });

  return shouldFail(
    () => createTestCashRegister(cashier, { cashRegisterId }),
    `Allocate: account Address { address: ${cashRegister.toBase58()}, base: None } already in use`
  );
});
