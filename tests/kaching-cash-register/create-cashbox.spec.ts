import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Keypair, PublicKey } from '@solana/web3.js';
import { assert, expect } from 'chai';
import { KachingCashRegister } from '../../target/types/kaching_cash_register';
import { generateRandomCashboxId } from '../utils/general';
import { fundWallet, getConnection } from '../utils/solana';

describe('kaching-cash-register', () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .KachingCashRegister as Program<KachingCashRegister>;

  const cashier = Keypair.generate();

  beforeEach(() => fundWallet(cashier.publicKey));

  const findCashboxPDA = async (cashboxId: string) =>
    PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode('cashbox'),
        Buffer.from(cashboxId, 'ascii'),
      ],
      program.programId
    );

  const createCashbox = async (
    {
      cashboxId,
      orderSignersWhitelist = [],
    }: { cashboxId: string; orderSignersWhitelist?: Array<PublicKey> },
    cashierWallet: anchor.web3.Keypair = cashier
  ) => {
    const [cashbox] = await findCashboxPDA(cashboxId);

    return program.methods
      .createCashbox({
        cashboxId,
        orderSignersWhitelist,
      })
      .accounts({
        cashier: cashierWallet.publicKey,
        cashbox,
      })
      .signers([cashierWallet])
      .rpc();
  };

  it('should create a cashbox', async () => {
    const cashboxId = generateRandomCashboxId();
    const tx = await createCashbox({ cashboxId });
    expect(tx).to.be.a('string');
  });

  it('should fail to create a cashbox if already exists', async () => {
    const cashboxId = generateRandomCashboxId();
    await createCashbox({ cashboxId });
    try {
      await createCashbox({ cashboxId });
    } catch (error) {
      const [cashbox] = await findCashboxPDA(cashboxId);
      expect(error.logs).to.contain(
        `Allocate: account Address { address: ${cashbox.toBase58()}, base: None } already in use`
      );
      return;
    }
    assert.fail('expected tx to throw error, but it succeeded');
  });

  it('should create a cashbox with expected account data', async () => {
    const cashboxId = generateRandomCashboxId();
    const orderSigner1 = Keypair.generate().publicKey;
    const orderSigner2 = Keypair.generate().publicKey;
    const [tx, [cashbox, bump]] = await Promise.all([
      createCashbox({
        cashboxId,
        orderSignersWhitelist: [orderSigner1, orderSigner2],
      }),
      findCashboxPDA(cashboxId),
    ]);
    const connection = getConnection();
    await connection.confirmTransaction(tx, 'finalized');
    const { data } = await connection.getAccountInfo(cashbox);
    const rawAccount = data.subarray(8); // remove 8 bytes descriminator

    expect(rawAccount[0]).to.eq(bump); // bump (u8)

    const cashierPublicKey = rawAccount.subarray(1, 33); // cashier (PublicKey)
    expect(cashierPublicKey).to.deep.equal(cashier.publicKey.toBuffer());

    const orderSignersWhitelistBuffer = rawAccount.subarray(33, 33 + 160); // order_signers_whitelist: Vec<Pubkey>
    const keysOffset = 4;
    const remainsOffset = keysOffset + 32 * 2;
    const length = orderSignersWhitelistBuffer.subarray(0, keysOffset);
    expect(length).to.deep.equal(Buffer.from([2, 0, 0, 0])); // length of 2 keys
    const pubkeys = orderSignersWhitelistBuffer.subarray(
      keysOffset,
      remainsOffset
    );
    expect(pubkeys).to.deep.equal(
      Buffer.concat([orderSigner1.toBytes(), orderSigner2.toBytes()])
    );
    const emptySpace = orderSignersWhitelistBuffer.subarray(remainsOffset);
    expect(emptySpace).to.deep.equal(
      Buffer.from(
        new Array(160 - remainsOffset)
          .join(',')
          .split(',')
          .map(() => 0)
      )
    );
  });

  describe('cashbox id validations', () => {
    it('should fail to create a cashbox if id is invalid with proper error message', async () => {
      const id = generateRandomCashboxId();
      try {
        await createCashbox({ cashboxId: `#${id}` });
      } catch (error) {
        expect(error.logs).to.contain(
          'Program log: AnchorError occurred. Error Code: CashboxIdInvalid. Error Number: 6000. Error Message: cashbox_id is invalid, should be only ascii characters, of length 3-50..'
        );
        return;
      }
      assert.fail('expected tx to throw error, but it succeeded');
    });

    it('should fail to create a cashbox if id is invalid', async () => {
      const random = generateRandomCashboxId('');
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
              createCashbox({ cashboxId: id })
                .then(() => id) // if no error was thrown, it's a failure, return id
                .catch(() => undefined) // if error was thrown, it's success, return undefined
          )
        )
      ).filter(Boolean);
      expect(failures).to.deep.equal([]);
    });
  });
});
