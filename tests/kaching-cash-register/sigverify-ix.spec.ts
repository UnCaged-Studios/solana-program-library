import * as anchor from "@project-serum/anchor";
import {
  Ed25519Program,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  SYSVAR_CLOCK_PUBKEY,
  Keypair,
  PublicKey,
} from "@solana/web3.js";
import { fundWalletWithSOL } from "../utils/solana";
import {
  generateRandomCashRegisterId,
  findCashRegisterPDA,
  createCashRegister,
} from "../utils/cash_register";
import { anOrder, mockCashierOrderService } from "../utils/settle-payment";
import { KachingCashRegister } from "../../target/types/kaching_cash_register";
import { shouldFail } from "../utils/testing";

describe("settle_order_payment instruction with Ed25519 SigVerify pre-instruction", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .KachingCashRegister as anchor.Program<KachingCashRegister>;

  const cashier = Keypair.generate();

  let settlePayment: (
    testOverrides: Partial<{
      serializedOrder: Buffer;
      signature: Uint8Array;
      signerPublicKey: PublicKey;
      instructionsSysvar: anchor.Address;
      disableEd25519Ix: boolean;
      mutateEd25519Ix: (
        ix: anchor.web3.TransactionInstruction
      ) => anchor.web3.TransactionInstruction;
      instructionIndex: number;
    }>
  ) => Promise<void>;

  const settlePaymentTestFunctionFactory =
    (cashRegisterModel: {
      cashRegister: PublicKey;
      cashRegisterId: string;
      cashRegisterBump: number;
    }): typeof settlePayment =>
    async (overrides) => {
      const customer = Keypair.generate();
      const { serializedOrder, signature } = mockCashierOrderService(
        cashier,
        anOrder({
          cashRegisterId: cashRegisterModel.cashRegisterId,
          customer: customer.publicKey,
        })
      );
      const mutateEd25519Ix = overrides.mutateEd25519Ix || ((i: any) => i);
      const ixEd25519Program = mutateEd25519Ix(
        Ed25519Program.createInstructionWithPublicKey({
          publicKey:
            overrides.signerPublicKey?.toBytes() || cashier.publicKey.toBytes(),
          signature,
          message: serializedOrder,
          instructionIndex: overrides.instructionIndex,
        })
      );
      await program.methods
        .settleOrderPayment({
          cashRegisterId: cashRegisterModel.cashRegisterId,
          cashRegisterBump: cashRegisterModel.cashRegisterBump,
        })
        .accounts({
          cashRegister: cashRegisterModel.cashRegister,
          customer: customer.publicKey,
          instructionsSysvar:
            overrides.instructionsSysvar || SYSVAR_INSTRUCTIONS_PUBKEY,
        })
        .preInstructions(overrides.disableEd25519Ix ? [] : [ixEd25519Program])
        .signers([customer])
        .rpc();
    };

  beforeEach(async () => {
    await fundWalletWithSOL(cashier.publicKey);
    const cashRegisterId = generateRandomCashRegisterId();
    const [cashRegister, cashRegisterBump] = await findCashRegisterPDA(
      cashRegisterId
    );
    await createCashRegister({ cashRegisterId }, cashier);
    settlePayment = settlePaymentTestFunctionFactory({
      cashRegisterId,
      cashRegister,
      cashRegisterBump,
    });
  });

  it("sanity (happy flow)", async () => {
    await settlePayment({});
  });

  it("should fail settle-order ix because number of signatures in ixEd25519Program is zero", async () => {
    return shouldFail(
      () =>
        settlePayment({
          mutateEd25519Ix: (ix) => {
            ix.data[0] = 0;
            return ix;
          },
        }),
      "Transaction precompile verification failure InvalidAccountIndex"
    );
  });

  it("should fail settle-order ix because number of signatures in ixEd25519Program is more then supplied", async () => {
    return shouldFail(
      () =>
        settlePayment({
          mutateEd25519Ix: (ix) => {
            ix.data[0] = 2;
            return ix;
          },
        }),
      "Transaction precompile verification failure InvalidAccountIndex"
    );
  });

  it("should fail settle-order ix because number of signatures in ixEd25519Program is maxium possible", async () => {
    return shouldFail(
      () =>
        settlePayment({
          mutateEd25519Ix: (ix) => {
            ix.data[0] = 255;
            ix.data[1] = 255;
            return ix;
          },
        }),
      "Transaction precompile verification failure InvalidAccountIndex"
    );
  });

  it("should fail settle-order ix because instructionIndex pass to ixEd25519Program is defined (null by default)", async () => {
    return shouldFail(
      () =>
        settlePayment({
          instructionIndex: 2,
        }),
      "Transaction precompile verification failure InvalidAccountIndex"
    );
  });

  it("should fail settle-order ix because public key did not sign the message", async () => {
    return shouldFail(
      () =>
        settlePayment({
          signerPublicKey: Keypair.generate().publicKey,
        }),
      "Transaction precompile verification failure InvalidAccountIndex"
    );
  });

  it("should fail settle-order ix because no prior Ed25519Program ix", async () => {
    return shouldFail(() => settlePayment({ disableEd25519Ix: true }), {
      code: "InstructionMissing",
      num: 100,
    });
  });

  it("should fail settle-order ix because ix account is not sysvar::instructions", async () => {
    return shouldFail(
      () => settlePayment({ instructionsSysvar: SYSVAR_CLOCK_PUBKEY }),
      { code: "ConstraintAddress", num: 2012 }
    );
  });

  it("TODO", () => {
    // https://github.com/solana-labs/solana/blob/9cf772092273c98fa35cd9a2f23d635f47eac6aa/web3.js/src/ed25519-program.ts#L57)
    // create an Ed25519Program instruction with multiple signatures and try to bypass verification
  });
});
