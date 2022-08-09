import { shouldSucceed } from "../../utils/testing";
import { createTokenCashbox } from "../../utils/token-cashbox";
import {
  CreateTokenCashboxEnv,
  registerCreateTokenCashboxTest,
} from "./runner";

registerCreateTokenCashboxTest(
  "should create a token cashbox",
  shouldSucceed((env: CreateTokenCashboxEnv) => {
    return createTokenCashbox(env);
  })
);
