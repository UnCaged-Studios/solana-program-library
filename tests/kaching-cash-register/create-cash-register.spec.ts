import * as anchor from "@project-serum/anchor";
import { Keypair } from "@solana/web3.js";
import {
  createCashRegister,
  createConsumedOrdersAccount,
  findCashRegisterPDA,
  generateRandomCashRegisterId,
} from "../utils/cash-register";
import { fundWalletWithSOL, getConnection } from "../utils/solana";
import { shouldFail, shouldSucceed } from "../utils/testing";

describe("create_cash_register instruction", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const cashier = Keypair.generate();

  beforeEach(() => fundWalletWithSOL(cashier.publicKey));

  it("should create a cash register", () =>
    shouldSucceed(() => {
      const cashRegisterId = generateRandomCashRegisterId();
      return createCashRegister({ cashRegisterId }, cashier);
    }));

  it("should fail to create a cashRegister if already exists", async () => {
    const cashRegisterId = generateRandomCashRegisterId();
    const [[cashRegister], consumedOrders] = await Promise.all([
      findCashRegisterPDA(cashRegisterId),
      createConsumedOrdersAccount(cashier, 898_600),
    ]);
    const _create = () =>
      createCashRegister({ cashRegisterId }, cashier, { consumedOrders });

    await _create();

    return shouldFail(
      () => _create(),
      `Allocate: account Address { address: ${cashRegister.toBase58()}, base: None } already in use`
    );
  });

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
      const remainsOffset = keysOffset + 32 * 3;
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

    it("should create a cashRegister with bump and cashier PublicKey in its data", async () => {
      const cashRegisterId = generateRandomCashRegisterId();
      const [[cashRegister, bump]] = await Promise.all([
        findCashRegisterPDA(cashRegisterId),
        createCashRegister(
          {
            cashRegisterId,
          },
          cashier,
          { waitForTx: true }
        ),
      ]);
      const connection = getConnection();
      const { data } = await connection.getAccountInfo(cashRegister);
      const accountData = deserialize(data);

      expect(accountData.bump).toEqual(bump); // bump (u8)
      expect(accountData.cashierPublicKey).toEqual(
        cashier.publicKey.toBuffer()
      );
    });

    it("should create a cashRegister with order_signers_whitelist in its data", async () => {
      const cashRegisterId = generateRandomCashRegisterId();
      const orderSigner1 = Keypair.generate().publicKey;
      const orderSigner2 = Keypair.generate().publicKey;
      const [[cashRegister]] = await Promise.all([
        findCashRegisterPDA(cashRegisterId),
        createCashRegister(
          {
            cashRegisterId,
            orderSignersWhitelist: [orderSigner1, orderSigner2],
          },
          cashier,
          { waitForTx: true }
        ),
      ]);
      const connection = getConnection();
      const { data } = await connection.getAccountInfo(cashRegister);
      const accountData = deserialize(data);

      expect(accountData.pubkeys).toEqual(
        Buffer.concat([
          orderSigner1.toBytes(),
          orderSigner2.toBytes(),
          cashier.publicKey.toBytes(),
        ])
      );
    });

    it("should failt to create a cashRegister if order_signers_whitelist is bigger than 5", async () => {
      const cashRegisterId = generateRandomCashRegisterId();
      const orderSignersWhitelist = new Array(5)
        .fill(0)
        .map(() => Keypair.generate().publicKey);
      return shouldFail(
        () =>
          createCashRegister(
            {
              cashRegisterId,
              orderSignersWhitelist,
            },
            cashier,
            { waitForTx: true }
          ),
        { code: "CashRegisterOrderSignersWhilelistOverflow", num: 6001 }
      );
    });
  });

  describe("cashRegister id validations", () => {
    it("should fail to create a cashRegister if id is invalid with proper error message", async () => {
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
});
