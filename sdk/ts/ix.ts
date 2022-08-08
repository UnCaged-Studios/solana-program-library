import * as anchor from "@project-serum/anchor";
import {
  Ed25519Program,
  Keypair,
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { KachingCashRegister } from "../../target/types/kaching_cash_register";
import { OrderModel } from "./serializer";

const program = anchor.workspace
  .KachingCashRegister as anchor.Program<KachingCashRegister>;

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

async function findAssociatedTokenAddress(
  walletAddress: PublicKey,
  tokenMintAddress: PublicKey
): Promise<PublicKey> {
  return (
    await PublicKey.findProgramAddress(
      [
        walletAddress.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        tokenMintAddress.toBuffer(),
      ],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )
  )[0];
}

export type SettleOrderPaymentArgs = {
  cashbox: PublicKey;
  cashboxId: string;
  cashboxBump: number;
  serializedOrder: Uint8Array;
  signature: Uint8Array;
  signerPublicKey: PublicKey;
  customer: Keypair;
  orderItems: OrderModel["items"];
};

export const createSettlePaymentTransaction = async ({
  cashbox,
  cashboxId,
  cashboxBump,
  serializedOrder,
  signature,
  signerPublicKey,
  customer,
  orderItems,
}: SettleOrderPaymentArgs) => {
  const ixEd25519Program = Ed25519Program.createInstructionWithPublicKey({
    publicKey: signerPublicKey.toBytes(),
    signature,
    message: serializedOrder,
  });

  const orderItemsAccounts = (
    await Promise.all(
      orderItems.map(async (orderItem) => {
        const [customerAta, cashierAta] = await Promise.all([
          findAssociatedTokenAddress(customer.publicKey, orderItem.currency),
          findAssociatedTokenAddress(signerPublicKey, orderItem.currency),
        ]);
        return [
          {
            pubkey: customerAta,
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: cashierAta,
            isSigner: false,
            isWritable: true,
          },
        ];
      })
    )
  ).flatMap((i) => i);

  return program.methods
    .settleOrderPayment({
      cashboxId,
      cashboxBump,
    })
    .accounts({
      cashbox,
      instructionsSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
      customer: customer.publicKey,
    })
    .remainingAccounts(orderItemsAccounts)
    .preInstructions([ixEd25519Program])
    .transaction();
};
