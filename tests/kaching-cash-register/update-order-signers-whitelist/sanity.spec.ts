import { Keypair, PublicKey } from "@solana/web3.js";
import { createTestCashRegister } from "../../utils/cash-register";
import { shouldSucceed } from "../../utils/testing";
import { adminSDK } from "../../../sdk/ts/ka-ching/with-anchor";
import { deserializeCashRegisterAccountData } from "../../../sdk/ts/ka-ching/v1/utils";
import { getAccountInfo, sendAndConfirmTx } from "../../utils/solana";
import { UpdateOrderSignersWhitelistParams } from "../../../sdk/ts/ka-ching/v1/update-order-signers-whitelist";

const innerTest = async (
  orderSignersWhitelist_1: Array<PublicKey>,
  orderSignersWhitelist_2: Array<PublicKey>,
  updateType: UpdateOrderSignersWhitelistParams["updateType"]
) => {
  const cashier = Keypair.generate();
  const { cashRegisterId, cashRegister } = await createTestCashRegister(
    cashier,
    {
      orderSignersWhitelist: orderSignersWhitelist_1,
    }
  );
  const tx = await adminSDK.UpdateOrderSignersWhitelist.createTx({
    cashRegisterId,
    cashier: cashier.publicKey,
    orderSignersWhitelist: orderSignersWhitelist_2,
    updateType,
  });
  await sendAndConfirmTx(tx, [cashier]);
  const { data } = await getAccountInfo(cashRegister);
  return deserializeCashRegisterAccountData(data).orderSignersWhitelist;
};

test("should update owner signers whitelist (override policy)", () =>
  shouldSucceed(async () => {
    const expectedSigner1 = Keypair.generate();
    const expectedSigner2 = Keypair.generate();
    const expectedSigner3 = Keypair.generate();
    const actualSigners = await innerTest(
      [expectedSigner1.publicKey, expectedSigner2.publicKey],
      [expectedSigner3.publicKey],
      "override"
    );
    expect(actualSigners).toEqual([expectedSigner3.publicKey]);
  }));

test("should update owner signers whitelist (merge policy)", () =>
  shouldSucceed(async () => {
    const expectedSigner1 = Keypair.generate();
    const expectedSigner2 = Keypair.generate();
    const expectedSigner3 = Keypair.generate();
    const actualSigners = await innerTest(
      [expectedSigner1.publicKey, expectedSigner2.publicKey],
      [expectedSigner3.publicKey],
      "merge"
    );
    expect(actualSigners).toEqual([
      expectedSigner1.publicKey,
      expectedSigner2.publicKey,
      expectedSigner3.publicKey,
    ]);
  }));
