import {
  PublicKey,
  LAMPORTS_PER_SOL,
  Connection,
  Keypair,
  sendAndConfirmTransaction,
  Transaction,
  TransactionInstruction,
  Signer,
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
  const airdropSignature = await localnetConnection.requestAirdrop(
    wallet,
    LAMPORTS_PER_SOL * 12
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

export const confirmTransaction = (tx: string) =>
  localnetConnection.confirmTransaction(tx, "finalized");

export const getAccountInfo = (address: PublicKey) =>
  localnetConnection.getAccountInfo(address);

export const sendAndConfirmTx = (
  ix: Transaction | TransactionInstruction,
  signers: Array<Signer>
) =>
  sendAndConfirmTransaction(
    localnetConnection,
    new Transaction().add(ix),
    signers,
    { commitment: "finalized" }
  );
