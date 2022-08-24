import { Keypair } from "@solana/web3.js";
import { V1 } from "../../../sdk/ts/v1";
import {
  createConsumedOrdersTestAccount,
  createTestCashRegister,
} from "../../utils/cash-register";
import { fundWalletWithSOL } from "../../utils/solana";
import { shouldSucceed } from "../../utils/testing";

test("should create a cash register with smaller consumed orders account", () =>
  shouldSucceed(async () => {
    const cashier = Keypair.generate();
    await fundWalletWithSOL(cashier.publicKey);
    const { createAccountParams } =
      V1.adminSDK.CreateConsumedOrdersAccount.createParams();
    const consumedOrders = await createConsumedOrdersTestAccount(
      cashier,
      createAccountParams
    );
    return createTestCashRegister(Keypair.generate(), {
      consumedOrders,
    });
  }));
