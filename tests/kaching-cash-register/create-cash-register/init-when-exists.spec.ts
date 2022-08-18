import { Keypair } from "@solana/web3.js";
import {
  generateRandomCashRegisterId,
  createCashRegister,
} from "../../utils/cash-register";
import { shouldFail } from "../../utils/testing";

test("should fail to create a cashRegister if already exists", async () => {
  const cashier = Keypair.generate();
  const cashRegisterId = generateRandomCashRegisterId();

  const { cashRegister } = await createCashRegister(
    { cashRegisterId },
    cashier,
    {
      waitForTx: true,
    }
  );

  return shouldFail(
    () => createCashRegister({ cashRegisterId }, cashier, { waitForTx: true }),
    `Allocate: account Address { address: ${cashRegister.toBase58()}, base: None } already in use`
  );
});
