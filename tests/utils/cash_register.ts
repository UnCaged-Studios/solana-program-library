import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { KachingCashRegister } from "../../target/types/kaching_cash_register";
import { confirmTransaction } from "./solana";

const program = anchor.workspace
  .KachingCashRegister as Program<KachingCashRegister>;

const randomLowerCaseCharCode = () =>
  [1, 2, 3]
    .map(() => String.fromCharCode(97 + Math.floor(Math.random() * 25)))
    .join("");

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
  options: { waitForTx?: boolean } = {}
) => {
  const [cashRegister] = await findCashRegisterPDA(cashRegisterId);

  const tx = await program.methods
    .createCashRegister({
      cashRegisterId,
      orderSignersWhitelist,
    })
    .accounts({
      cashier: cashierWallet.publicKey,
      cashRegister,
    })
    .signers([cashierWallet])
    .rpc();

  if (options.waitForTx) {
    await confirmTransaction(tx);
  }
};
