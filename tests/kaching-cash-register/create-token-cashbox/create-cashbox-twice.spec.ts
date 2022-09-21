import { shouldFail } from "../../utils/testing";
import { createTokenCashbox } from "../../utils/token-cashbox";
import { registerCreateTokenCashboxTest } from "./runner";

registerCreateTokenCashboxTest(
  "should failed to create a token cashbox twice",
  async (env) => {
    const [cashBox1] = await createTokenCashbox(env);
    return shouldFail(async () => {
      await createTokenCashbox(env);
    }, `Allocate: account Address { address: ${cashBox1.toBase58()}, base: None } already in use`);
  }
);
