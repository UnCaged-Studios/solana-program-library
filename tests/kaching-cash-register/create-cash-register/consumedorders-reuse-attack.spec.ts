import { Keypair } from "@solana/web3.js";
import { createTestCashRegister } from "../../utils/cash-register";
import { shouldFail } from "../../utils/testing";

test("should fail when consumedOrders account has already been initialized", () =>
  shouldFail(
    async () => {
      const { consumedOrders } = await createTestCashRegister(
        Keypair.generate(),
        {}
      );
      return createTestCashRegister(Keypair.generate(), { consumedOrders });
    },
    {
      num: 2013,
      code: "ConstraintZero",
    }
  ));
