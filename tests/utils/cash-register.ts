import * as anchor from "@project-serum/anchor";
import {
  SystemProgram,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { KachingCashRegister } from "../../target/types/kaching_cash_register";
import { confirmTransaction, sendAndConfirmTx } from "./solana";

const program = anchor.workspace
  .KachingCashRegister as anchor.Program<KachingCashRegister>;

const randomLowerCaseCharCode = () =>
  [1, 2, 3]
    .map(() => String.fromCharCode(97 + Math.floor(Math.random() * 25)))
    .join("");

export const createConsumedOrdersAccount = async (
  from: Keypair,
  sizeInBytes: number
) => {
  const target = Keypair.generate();
  const sip_keys_size = 4 * 8; // [u64; 4]
  const bitmap_bits_num = 8; // u64
  const k_num = 4; // u32
  const borsh_bytes_array_length_mark = 4;
  const ix = SystemProgram.createAccount({
    fromPubkey: from.publicKey,
    newAccountPubkey: target.publicKey,
    lamports: LAMPORTS_PER_SOL * 10,
    space:
      8 +
      bitmap_bits_num +
      k_num +
      sip_keys_size +
      borsh_bytes_array_length_mark +
      sizeInBytes,
    programId: program.programId,
  });
  await sendAndConfirmTx(ix, [from, target]);
  return target.publicKey;
};

export const generateRandomCashRegisterId = (
  prefix: string = "my_cash_register_"
) => `${prefix}${randomLowerCaseCharCode()}`;

export const findCashRegisterPDA = async (cashRegistedId: string) =>
  PublicKey.findProgramAddress(
    [
      anchor.utils.bytes.utf8.encode("cashregister"),
      Buffer.from(cashRegistedId, "ascii"),
    ],
    program.programId
  );

export const createCashRegister = async (
  {
    cashRegisterId,
    orderSignersWhitelist = [],
  }: { cashRegisterId: string; orderSignersWhitelist?: Array<PublicKey> },
  cashierWallet: anchor.web3.Keypair,
  options: {
    waitForTx?: boolean;
    consumedOrders?: anchor.web3.PublicKey;
    consumedOrderSize?: number;
  } = {}
) => {
  // await fundWalletWithSOL(cashier.publicKey);
  // const cashRegisterId = generateRandomCashRegisterId();
  // const [[cashRegister, cashRegisterBump], consumedOrders] =
  //   await Promise.all([
  //     findCashRegisterPDA(cashRegisterId),
  //     createConsumedOrdersAccount(cashier, 898_600),
  //   ]);
  // await createCashRegister({ cashRegisterId }, cashier, { consumedOrders });
  const [[cashRegister], consumedOrders] = await Promise.all([
    findCashRegisterPDA(cashRegisterId),
    options.consumedOrders ||
      createConsumedOrdersAccount(
        cashierWallet,
        options.consumedOrderSize || 898_600
      ),
  ]);

  const tx = await program.methods
    .createCashRegister({
      cashRegisterId,
      orderSignersWhitelist,
      consumedOrdersInitKNum: 10,
      consumedOrdersInitBitmapBitsNum: new anchor.BN("7188800"),
      consumedOrdersInitSipKeys: [
        "578437695752307201",
        "1157159078456920585",
        "1735880461161533969",
        "2314601843866147353",
      ].map((str) => new anchor.BN(str)),
    })
    .accounts({
      cashier: cashierWallet.publicKey,
      cashRegister,
      consumedOrders,
    })
    .signers([cashierWallet])
    .rpc();

  if (options.waitForTx) {
    await confirmTransaction(tx);
  }
};
