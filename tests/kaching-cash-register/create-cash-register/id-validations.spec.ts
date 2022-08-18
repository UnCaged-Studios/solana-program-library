import { Keypair } from "@solana/web3.js";
import {
  generateRandomCashRegisterId,
  createCashRegister,
} from "../../utils/cash-register";
import { shouldFail } from "../../utils/testing";

describe("cashRegister id validations", () => {
  let cashier: Keypair;

  beforeEach(() => {
    cashier = Keypair.generate();
  });

  it("should fail with proper error message", async () => {
    const id = generateRandomCashRegisterId();
    return shouldFail(
      () => createCashRegister({ cashRegisterId: `#${id}` }, cashier),
      {
        code: "CashRegisterIdInvalid",
        num: 6000,
      }
    );
  });

  it("should fail to create a cashRegister if id is invalid", async () => {
    const random = generateRandomCashRegisterId("");
    const failures = (
      await Promise.all(
        [
          `CashRegister_${random}`, // no capital letters
          `cashregister-${random}`, // no dash
          `cas$register_${random}`, // no symbols ($)
          `cashregister.${random}`, // no dots
          `cashregister/${random}`, // no slashes
          `${random.substring(0, 2)}`, // no length < 3,
          `${new Array(Math.ceil(50 / random.length) + 1).join(random)}`, // no length > 50
        ].map(
          (id) =>
            createCashRegister({ cashRegisterId: id }, cashier)
              .then(() => id) // if no error was thrown, it's a failure, return id
              .catch(() => undefined) // if error was thrown, it's success, return undefined
        )
      )
    ).filter(Boolean);
    expect(failures).toEqual([]);
  });
});
