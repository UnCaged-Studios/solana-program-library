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
  await confirmTransaction(airdropSignature);
};

export const setupCurrency = async () => {
  const DECIMALS = 6;
  const calculateAmountInDecimals = (n: number) => n * Math.pow(10, DECIMALS);

  const payer = Keypair.generate();
  const mintAuthority = Keypair.generate();

  await fundWalletWithSOL(payer.publicKey);

  const resolveAssociatedTokenAccount = async (destination: PublicKey) =>
    PublicKey.isOnCurve(destination)
      ? getOrCreateAssociatedTokenAccount(
          localnetConnection,
          payer,
          mint,
          destination
        ).then((ac) => ac.address)
      : destination;

  const mint = await createMint(
    localnetConnection,
    payer,
    mintAuthority.publicKey,
    null,
    DECIMALS // We are using 9 to match the CLI decimal default exactly
  );

  return {
    currency: mint,
    fundWallet: async (destination: PublicKey, amount: number) => {
      if (!mint) {
        throw new Error(`you must `);
      }
      const ata = await resolveAssociatedTokenAccount(destination);
      await mintTo(
        localnetConnection,
        payer,
        mint,
        ata,
        mintAuthority,
        calculateAmountInDecimals(amount),
        [],
        { commitment: "finalized" }
      );
    },
    utils: {
      calculateAmountInDecimals,
      getMintInfo: () => getMint(localnetConnection, mint),
      getMintBalanceForWallet: async (wallet: PublicKey) => {
        const ata = await resolveAssociatedTokenAccount(wallet);
        const tokenAccountInfo = await getAccount(localnetConnection, ata);
        return tokenAccountInfo.amount;
      },
    },
  };
};

export const getConnection = () => localnetConnection;

export const confirmTransaction = (tx: string) =>
  localnetConnection.confirmTransaction(tx, "finalized");
