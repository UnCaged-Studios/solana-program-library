import {
  Keypair,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { adminSDK } from "../../../sdk/ts/v1/with-anchor";
import { createTestCashRegister } from "../../utils/cash-register";
import { fundWalletWithSOL, sendAndConfirmTx } from "../../utils/solana";
import { shouldFail } from "../../utils/testing";

const withDifferentOwner = (programId: PublicKey) =>
  shouldFail(
    async () => {
      const evilCashier = Keypair.generate();
      await fundWalletWithSOL(evilCashier.publicKey);
      const {
        createAccountParams: { space },
      } = adminSDK.CreateConsumedOrdersAccount.createParams();
      const consumedOrdersAccount = Keypair.generate();
      const createConsumedOrdersTx = SystemProgram.createAccount({
        fromPubkey: evilCashier.publicKey,
        newAccountPubkey: consumedOrdersAccount.publicKey,
        lamports: LAMPORTS_PER_SOL * 10,
        space,
        programId,
      });
      await sendAndConfirmTx(createConsumedOrdersTx, [
        evilCashier,
        consumedOrdersAccount,
      ]);
      return createTestCashRegister(evilCashier, {
        consumedOrders: consumedOrdersAccount.publicKey,
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
