import { Keypair } from "@solana/web3.js";
import { utils } from "../../../sdk/ts/ka-ching";
import { createTestCashRegister } from "../../utils/cash-register";
import { getAccountInfo } from "../../utils/solana";
import { shouldFail } from "../../utils/testing";

describe("cashRegister account data", () => {
  let cashier: Keypair;

  beforeEach(() => {
    cashier = Keypair.generate();
  });

  it("should create a cashRegister with bump and cashier PublicKey in its data", async () => {
    const { cashRegisterBump, cashRegister } = await createTestCashRegister(
      cashier,
      {}
    );
    const { data } = await getAccountInfo(cashRegister);
    const accountData = utils.deserializeCashRegisterAccountData(data);

    expect(accountData.bump).toEqual(cashRegisterBump); // bump (u8)
    expect(accountData.cashierPublicKey.toBase58()).toEqual(
      cashier.publicKey.toBase58()
    );
  });

  it("should create a cashRegister with order_signers_whitelist in its data", async () => {
    const orderSigner1 = Keypair.generate().publicKey;
    const orderSigner2 = Keypair.generate().publicKey;
    const { cashRegister } = await createTestCashRegister(cashier, {
      orderSignersWhitelist: [orderSigner1, orderSigner2],
    });
    const { data } = await getAccountInfo(cashRegister);
    const accountData = utils.deserializeCashRegisterAccountData(data);

    const [os1, os2] = accountData.orderSignersWhitelist;
    expect(os1).toEqual(orderSigner1);
    expect(os2).toEqual(orderSigner2);
  });

  it("should fail to create a cashRegister if order_signers_whitelist is bigger than 5", () =>
    shouldFail(
      () =>
        createTestCashRegister(cashier, {
          orderSignersWhitelist: new Array(6)
            .fill(0)
            .map(() => Keypair.generate().publicKey),
        }),
      { code: "CashRegisterOrderSignersWhilelistOverflow", num: 6001 }
    ));
});
