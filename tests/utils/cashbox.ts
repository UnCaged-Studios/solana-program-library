import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Keypair, PublicKey } from '@solana/web3.js';
import { KachingCashRegister } from '../../target/types/kaching_cash_register';
import { getConnection } from './solana';

const program = anchor.workspace
  .KachingCashRegister as Program<KachingCashRegister>;

const randomLowerCaseCharCode = () =>
  [1, 2, 3]
    .map(() => String.fromCharCode(97 + Math.floor(Math.random() * 25)))
    .join('');

export const generateRandomCashboxId = (prefix: string = 'my_test_cashbox_') =>
  `${prefix}${randomLowerCaseCharCode()}`;

export const findCashboxPDA = async (cashboxId: string) =>
  PublicKey.findProgramAddress(
    [
      anchor.utils.bytes.utf8.encode('cashbox'),
      Buffer.from(cashboxId, 'ascii'),
    ],
    program.programId
  );

export const createCashbox = async (
  {
    cashboxId,
    orderSignersWhitelist = [],
  }: { cashboxId: string; orderSignersWhitelist?: Array<PublicKey> },
  cashierWallet: anchor.web3.Keypair,
  options: { waitForTx?: boolean } = {}
) => {
  const [cashbox] = await findCashboxPDA(cashboxId);

  const tx = await program.methods
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

  if (options.waitForTx) {
    const connection = getConnection();
    await connection.confirmTransaction(tx, 'finalized');
  }
};
