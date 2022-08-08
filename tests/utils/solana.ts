import {
  PublicKey,
  LAMPORTS_PER_SOL,
  Connection,
  Keypair,
} from "@solana/web3.js";
import {
  createMint,
  getAccount,
  getMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";

const localnetConnection = new Connection("http://127.0.0.1:8899");

export const fundWalletWithSOL = async (wallet: PublicKey) => {
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

export const setupCurrency = async () => {
  const DECIMALS = 6;
  const calculateAmountInDecimals = (n: number) => n * Math.pow(10, DECIMALS);

  const payer = Keypair.generate();
  const mintAuthority = Keypair.generate();

  let mint: PublicKey;

  const getAta = (destination: PublicKey) =>
    getOrCreateAssociatedTokenAccount(
      localnetConnection,
      payer,
      mint,
      destination
    );

  return {
    createCurrency: async () => {
      await fundWalletWithSOL(payer.publicKey);
      mint = await createMint(
        localnetConnection,
        payer,
        mintAuthority.publicKey,
        null,
        DECIMALS // We are using 9 to match the CLI decimal default exactly
      );
      return mint;
    },
    fundWallet: async (destination: PublicKey, amount: number) => {
      const ata = await getAta(destination);
      await mintTo(
        localnetConnection,
        payer,
        mint,
        ata.address,
        mintAuthority,
        calculateAmountInDecimals(amount)
      );
    },
    utils: {
      calculateAmountInDecimals,
      getMintInfo: () => getMint(localnetConnection, mint),
      getMintBalanceForWallet: async (wallet: PublicKey) => {
        const ata = await getAta(wallet);
        const tokenAccountInfo = await getAccount(
          localnetConnection,
          ata.address
        );
        return tokenAccountInfo.amount;
      },
    },
  };
};

export const getConnection = () => localnetConnection;
