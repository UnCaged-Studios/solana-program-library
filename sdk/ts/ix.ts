import * as anchor from "@project-serum/anchor";
import {
  Ed25519Program,
  Keypair,
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  ComputeBudgetProgram,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { KachingCashRegister } from "../../target/types/kaching_cash_register";
import { OrderModel } from "./serializer";

const program = anchor.workspace
  .KachingCashRegister as anchor.Program<KachingCashRegister>;

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

const findAssociatedTokenAddress = (
  walletAddress: PublicKey,
  tokenMintAddress: PublicKey
) =>
  PublicKey.findProgramAddress(
    [
      walletAddress.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      tokenMintAddress.toBuffer(),
    ],
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  );

export const findTokenCashboxPDA = (
  cashRegistedId: string,
  tokenMint: PublicKey
) =>
  PublicKey.findProgramAddress(
    [Buffer.from(cashRegistedId, "ascii"), tokenMint.toBytes()],
    program.programId
  );

export type SettleOrderPaymentArgs = {
  cashRegister: PublicKey;
  cashRegisterId: string;
  cashRegisterBump: number;
  serializedOrder: Uint8Array;
  signature: Uint8Array;
  signerPublicKey: PublicKey;
  consumedOrders: PublicKey;
  customer: Keypair;
  orderItems: OrderModel["items"];
};

export const createSettlePaymentTransaction = async ({
  cashRegister,
  cashRegisterId,
  cashRegisterBump,
  serializedOrder,
  signature,
  signerPublicKey,
  customer,
  orderItems,
  consumedOrders,
}: SettleOrderPaymentArgs) => {
  const ixEd25519Program = Ed25519Program.createInstructionWithPublicKey({
    publicKey: signerPublicKey.toBytes(),
    signature,
    message: serializedOrder,
  });

  const orderItemsAccounts = (
    await Promise.all(
      orderItems.map(async (orderItem) => {
        const [[customerAta], [tokenCashbox]] = await Promise.all([
          findAssociatedTokenAddress(customer.publicKey, orderItem.currency),
          findTokenCashboxPDA(cashRegisterId, orderItem.currency),
        ]);
        return [
          {
            pubkey: customerAta,
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: tokenCashbox,
            isSigner: false,
            isWritable: true,
          },
        ];
      })
    )
  ).flatMap((i) => i);

  const computeBudgetIx =
    orderItems.length > 5
      ? ComputeBudgetProgram.setComputeUnitLimit({
          units: 1_500_000,
        })
      : undefined;

  return program.methods
    .settleOrderPayment({
      cashRegisterId,
      cashRegisterBump,
    })
    .accounts({
      cashRegister,
      instructionsSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
      customer: customer.publicKey,
      consumedOrders,
    })
    .remainingAccounts(orderItemsAccounts)
    .preInstructions([ixEd25519Program, computeBudgetIx].filter(Boolean))
    .transaction();
};
