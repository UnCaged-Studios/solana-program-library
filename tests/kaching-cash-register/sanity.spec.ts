import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Keypair, PublicKey } from '@solana/web3.js';
import { KachingCashRegister } from '../../target/types/kaching_cash_register';
import { fundWallet } from './test-utils';

describe('kaching-cash-register: sanity', () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .KachingCashRegister as Program<KachingCashRegister>;

  const cashier = Keypair.generate();

  beforeEach(() => fundWallet(cashier.publicKey));

  it('Is initialized!', async () => {
    const cashboxId = 'my_test_cashbox';
    const [cashbox] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode('cashbox'),
        cashier.publicKey.toBytes(),
        // Buffer.from(cashboxId, 'ascii'),
      ],
      program.programId
    );
    const tx = await program.methods
      .createCashbox({
        cashboxId,
      })
      .accounts({
        cashier: cashier.publicKey,
        cashbox,
      })
      .signers([cashier])
      .rpc();

    console.log('Your transaction signature', tx);
  });
});
