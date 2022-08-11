import { shouldSucceed } from "../../utils/testing";
import { createTokenCashbox } from "../../utils/token-cashbox";
import { registerCreateTokenCashboxTest } from "./runner";

registerCreateTokenCashboxTest("should create a token cashbox", (env) =>
  shouldSucceed(() => createTokenCashbox(env))
);
