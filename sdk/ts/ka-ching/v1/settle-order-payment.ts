import {
  Ed25519Program,
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  ComputeBudgetProgram,
} from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { OrderModel } from "./order-signer";
import { IProgramAPI } from "./program";
import { findTokenCashboxPDA } from "./create-token-cashbox";

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

export const findAssociatedTokenAddress = (
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

export type SettleOrderPaymentParams = {
  cashRegister: PublicKey;
  cashRegisterId: string;
  serializedOrder: Uint8Array;
  signature: Uint8Array;
  signerPublicKey: PublicKey;
  consumedOrders: PublicKey;
  customer: PublicKey;
  orderItems: OrderModel["items"];
};

export class SettleOrderPayment {
  constructor(private readonly programAPI: IProgramAPI) {}

  async createTx({
    cashRegister,
    cashRegisterId,
    serializedOrder,
    signature,
    signerPublicKey,
    customer,
    orderItems,
    consumedOrders,
  }: SettleOrderPaymentParams) {
    const ixEd25519Program = Ed25519Program.createInstructionWithPublicKey({
      publicKey: signerPublicKey.toBytes(),
      signature,
      message: serializedOrder,
    });

    const orderItemsAccounts = (
      await Promise.all(
        orderItems.map(async (orderItem) => {
          const [[customerAta], [tokenCashbox]] = await Promise.all([
            findAssociatedTokenAddress(customer, orderItem.currency),
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

    const createTokenAccounts = await Promise.all(
      orderItems
        .filter((itm) => itm.shouldCreateAta)
        .map(async (itm) => {
          const [ata] = await findAssociatedTokenAddress(
            customer,
            itm.currency
          );
          return createAssociatedTokenAccountInstruction(
            customer,
            ata,
            customer,
            itm.currency
          );
        })
    );

    return this.programAPI
      .settleOrderPayment({
        cashRegisterId,
      })
      .accounts({
        cashRegister,
        instructionsSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
        customer,
        consumedOrders,
      })
      .remainingAccounts(orderItemsAccounts)
      .preInstructions(
        [ixEd25519Program, computeBudgetIx!, ...createTokenAccounts].filter(
          Boolean
        )
      )
      .transaction();
  }
}
