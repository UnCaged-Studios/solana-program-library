import * as anchor from "@project-serum/anchor";
import { Keypair } from "@solana/web3.js";
import { assert, expect } from "chai";
import {
  createCashbox,
  findCashboxPDA,
  generateRandomCashboxId,
} from "../utils/cashbox";
import { fundWallet, getConnection } from "../utils/solana";

describe("create_cashbox instruction", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const cashier = Keypair.generate();

  beforeEach(() => fundWallet(cashier.publicKey));

  it("should create a cashbox", async () => {
    const cashboxId = generateRandomCashboxId();
    await createCashbox({ cashboxId }, cashier);
  });

  it("should fail to create a cashbox if already exists", async () => {
    const cashboxId = generateRandomCashboxId();
    await createCashbox({ cashboxId }, cashier);
    try {
      await createCashbox({ cashboxId }, cashier);
    } catch (error) {
      const [cashbox] = await findCashboxPDA(cashboxId);
      expect(error.logs).to.contain(
        `Allocate: account Address { address: ${cashbox.toBase58()}, base: None } already in use`
      );
      return;
    }
    assert.fail("expected tx to throw error, but it succeeded");
  });

  describe("cashbox account data", () => {
    it("should create a cashbox with bump and cashier PublicKey in its data", async () => {
      const cashboxId = generateRandomCashboxId();
      const [[cashbox, bump]] = await Promise.all([
        findCashboxPDA(cashboxId),
        createCashbox(
          {
            cashboxId,
          },
          cashier,
          { waitForTx: true }
        ),
      ]);
      const connection = getConnection();
      const { data } = await connection.getAccountInfo(cashbox);
      const rawAccount = data.subarray(8); // remove 8 bytes descriminator
      const cashierPublicKey = rawAccount.subarray(1, 33); // cashier (PublicKey)

      expect(rawAccount[0]).to.eq(bump); // bump (u8)
      expect(cashierPublicKey).to.deep.equal(cashier.publicKey.toBuffer());
    });

    it("should create a cashbox with order_signers_whitelist in its data", async () => {
      const cashboxId = generateRandomCashboxId();
      const orderSigner1 = Keypair.generate().publicKey;
      const orderSigner2 = Keypair.generate().publicKey;
      const [[cashbox]] = await Promise.all([
        findCashboxPDA(cashboxId),
        createCashbox(
          {
            cashboxId,
            orderSignersWhitelist: [orderSigner1, orderSigner2],
          },
          cashier,
          { waitForTx: true }
        ),
      ]);
      const connection = getConnection();
      const { data } = await connection.getAccountInfo(cashbox);
      const rawAccount = data.subarray(8); // remove 8 bytes descriminator
      const orderSignersWhitelistBuffer = rawAccount.subarray(33, 33 + 160); // order_signers_whitelist: Vec<Pubkey>
      const keysOffset = 4;
      const remainsOffset = keysOffset + 32 * 3;
      const length = orderSignersWhitelistBuffer.subarray(0, keysOffset);
      expect(length).to.deep.equal(Buffer.from([3, 0, 0, 0])); // length of 3 keys

      const pubkeys = orderSignersWhitelistBuffer.subarray(
        keysOffset,
        remainsOffset
      );
      expect(pubkeys).to.deep.equal(
        Buffer.concat([
          orderSigner1.toBytes(),
          orderSigner2.toBytes(),
          cashier.publicKey.toBytes(),
        ])
      );

      const emptySpace = orderSignersWhitelistBuffer.subarray(remainsOffset);
      expect(emptySpace).to.deep.equal(
        Buffer.from(new Array(160 - remainsOffset).fill(0))
      );
    });

    it("should dailt to create a cashbox if order_signers_whitelist is bigger than 5", async () => {
      const cashboxId = generateRandomCashboxId();
      const orderSignersWhitelist = new Array(5)
        .fill(0)
        .map(() => Keypair.generate().publicKey);
      try {
        await createCashbox(
          {
            cashboxId,
            orderSignersWhitelist,
          },
          cashier,
          { waitForTx: true }
        );
      } catch (error) {
        expect(error.logs).to.contain(
          "Program log: AnchorError occurred. Error Code: CashboxOrderSignersWhilelistOverflow. Error Number: 6001. Error Message: cashbox can only have up to 5 order signers in whitelist."
        );
        return;
      }
      assert.fail("expected tx to throw error, but it succeeded");
    });
  });

  describe("cashbox id validations", () => {
    it("should fail to create a cashbox if id is invalid with proper error message", async () => {
      const id = generateRandomCashboxId();
      try {
        await createCashbox({ cashboxId: `#${id}` }, cashier);
      } catch (error) {
        expect(error.logs).to.contain(
          "Program log: AnchorError occurred. Error Code: CashboxIdInvalid. Error Number: 6000. Error Message: cashbox_id is invalid, should be only ascii characters, of length 3-50."
        );
        return;
      }
      assert.fail("expected tx to throw error, but it succeeded");
    });

    it("should fail to create a cashbox if id is invalid", async () => {
      const random = generateRandomCashboxId("");
      const failures = (
        await Promise.all(
          [
            `Cashbox_${random}`, // no capital letters
            `cashbox-${random}`, // no dash
            `cas$hbox_${random}`, // no symbols ($)
            `cashbox.${random}`, // no dots
            `cashbox/${random}`, // no slashes
            `${random.substring(0, 2)}`, // no length < 3,
            `${new Array(Math.ceil(50 / random.length) + 1).join(random)}`, // no length > 50
          ].map(
            (id) =>
              createCashbox({ cashboxId: id }, cashier)
                .then(() => id) // if no error was thrown, it's a failure, return id
                .catch(() => undefined) // if error was thrown, it's success, return undefined
          )
        )
      ).filter(Boolean);
      expect(failures).to.deep.equal([]);
    });
  });
});
