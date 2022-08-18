import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import {
  createConsumedOrdersAccount,
  createTestCashRegister,
} from "../../utils/cash-register";
import { fundWalletWithSOL } from "../../utils/solana";
import { shouldFail } from "../../utils/testing";

const withDifferentOwner = (programId: PublicKey) =>
  shouldFail(
    async () => {
      const evilCashier = Keypair.generate();
      await fundWalletWithSOL(evilCashier.publicKey);
      const consumedOrders = await createConsumedOrdersAccount(
        evilCashier,
        898_600,
        { programId }
      );
      return createTestCashRegister({}, evilCashier, {
        consumedOrders,
      });
    },
    {
      num: 3007,
      code: "AccountOwnedByWrongProgram",
    }
  );

test("should fail when consumedOrders account owner is program id", () =>
  withDifferentOwner(SystemProgram.programId));

test("should fail when consumedOrders account owner is some other account", () =>
  withDifferentOwner(Keypair.generate().publicKey));
