import { Keypair } from "@solana/web3.js";
import { fundWalletWithSOL } from "../../utils/solana";
import { shouldFail } from "../../utils/testing";
import { createTokenCashbox } from "../../utils/token-cashbox";
import { registerCreateTokenCashboxTest } from "./runner";

registerCreateTokenCashboxTest("should create a token cashbox", (env) =>
  shouldFail(
    async () => {
      const evilCashier = Keypair.generate();
      await fundWalletWithSOL(evilCashier.publicKey);

      await createTokenCashbox({
        ...env,
        cashier: evilCashier,
      });
    },
    {
      code: "SignerIsNotCashRegisterAuthorized",
      num: 6009,
    }
  )
);
