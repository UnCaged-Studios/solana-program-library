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

const CURRENCY_DECIMALS = 6;

const payer = Keypair.generate();

const resolveAssociatedTokenAccount = async (
  destination: PublicKey,
  mint: PublicKey
) =>
  PublicKey.isOnCurve(destination)
    ? getOrCreateAssociatedTokenAccount(
        localnetConnection,
        payer,
        mint,
        destination
      ).then((ac) => ac.address)
    : destination;

export const setupCurrency = async () => {
  const mintAuthority = Keypair.generate();

  await fundWalletWithSOL(payer.publicKey);

  const mint = await createMint(
    localnetConnection,
    payer,
    mintAuthority.publicKey,
    null,
    CURRENCY_DECIMALS // We are using 9 to match the CLI decimal default exactly
  );

  return {
    currency: mint,
    fundWallet: async (destination: PublicKey, amount: number) => {
      const ata = await resolveAssociatedTokenAccount(destination, mint);
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
  };
};

export const calculateAmountInDecimals = (n: number) =>
  n * Math.pow(10, CURRENCY_DECIMALS);

export const getMintInfo = (mint: PublicKey) =>
  getMint(localnetConnection, mint);

export const getMintBalanceForWallet = async (
  wallet: PublicKey,
  mint: PublicKey
) => {
  const ata = await resolveAssociatedTokenAccount(wallet, mint);
  const tokenAccountInfo = await getAccount(localnetConnection, ata);
  return tokenAccountInfo.amount;
};

export const getConnection = () => localnetConnection;

export const confirmTransaction = (tx: string) =>
  localnetConnection.confirmTransaction(tx, "finalized");
