import { PublicKey, LAMPORTS_PER_SOL, Connection } from '@solana/web3.js';

const localnetConnection = new Connection('http://127.0.0.1:8899');

export const fundWallet = async (wallet: PublicKey) => {
  let balance = await localnetConnection.getBalance(wallet);
  if (balance >= 0.1 * LAMPORTS_PER_SOL) {
    return;
  }
  const airdropSignature = await localnetConnection.requestAirdrop(
    wallet,
    LAMPORTS_PER_SOL
  );
  await localnetConnection.confirmTransaction(airdropSignature);
};

export const getConnection = () => localnetConnection;
