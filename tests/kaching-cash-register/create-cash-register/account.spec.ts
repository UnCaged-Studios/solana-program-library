import { Keypair } from "@solana/web3.js";
import { createTestCashRegister } from "../../utils/cash-register";
import { getAccountInfo } from "../../utils/solana";
import { shouldFail } from "../../utils/testing";

describe("cashRegister account data", () => {
  const deserialize = (data: Buffer) => {
    const raw = data.subarray(8); // remove 8 bytes descriminator
    const cashRegisterIdLength = raw[0];
    const buff_cashRegisterId = Buffer.alloc(cashRegisterIdLength);
    const bumpOffset = 4 + cashRegisterIdLength;
    raw.copy(buff_cashRegisterId, 0, 4, bumpOffset);
    const raw2 = raw.subarray(bumpOffset); // remove cash_resgister_id
    const bump = Number(raw2[0]);
    const cashierPublicKey = raw2.subarray(1, 33); // cashier (PublicKey)

    const orderSignersWhitelistBuffer = raw2.subarray(33, 33 + 160); // order_signers_whitelist: Vec<Pubkey>
    const keysOffset = 4;
    const remainsOffset = keysOffset + 32 * 2;
    const pubkeys = orderSignersWhitelistBuffer.subarray(
      keysOffset,
      remainsOffset
    );
    return {
      cashRegisterId: buff_cashRegisterId.toString("ascii"),
      bump,
      cashierPublicKey,
      pubkeys,
    };
  };

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
    const accountData = deserialize(data);

    expect(accountData.bump).toEqual(cashRegisterBump); // bump (u8)
    expect(accountData.cashierPublicKey).toEqual(cashier.publicKey.toBuffer());
  });

  it("should create a cashRegister with order_signers_whitelist in its data", async () => {
    const orderSigner1 = Keypair.generate().publicKey;
    const orderSigner2 = Keypair.generate().publicKey;
    const { cashRegister } = await createTestCashRegister(cashier, {
      orderSignersWhitelist: [orderSigner1, orderSigner2],
    });
    const { data } = await getAccountInfo(cashRegister);
    const accountData = deserialize(data);

    expect(accountData.pubkeys).toEqual(
      Buffer.concat([orderSigner1.toBytes(), orderSigner2.toBytes()])
    );
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
