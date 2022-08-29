import {
  Ed25519Program,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  SYSVAR_CLOCK_PUBKEY,
  Keypair,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js";
import { customerSDK } from "../../sdk/ts/with-anchor";
import { createTestCashRegister } from "../utils/cash-register";
import { anOrder, mockCashierOrderService } from "../utils/settle-payment";
import { fundWalletWithSOL, sendAndConfirmTx } from "../utils/solana";
import { shouldFail, shouldSucceed } from "../utils/testing";

describe("settle_order_payment instruction with Ed25519 SigVerify pre-instruction", () => {
  const cashier = Keypair.generate();
  const knownOrderSigner = Keypair.generate();

  let settlePayment: (
    testOverrides: Partial<{
      serializedOrder: Buffer;
      signature: Uint8Array;
      signerPublicKey: PublicKey;
      instructionsSysvar: PublicKey;
      disableEd25519Ix: boolean;
      mutateEd25519Ix: (ix: TransactionInstruction) => TransactionInstruction;
      instructionIndex: number;
    }>
  ) => Promise<void>;

  const settlePaymentTestFunctionFactory =
    (cashRegisterModel: {
      cashRegister: PublicKey;
      cashRegisterId: string;
      consumedOrders: PublicKey;
    }): typeof settlePayment =>
    async (overrides) => {
      const customer = Keypair.generate();
      await fundWalletWithSOL(customer.publicKey);
      const { serializedOrder, signature } = mockCashierOrderService(
        knownOrderSigner,
        anOrder({
          cashRegisterId: cashRegisterModel.cashRegisterId,
          customer: customer.publicKey,
        })
      );
      const mutateEd25519Ix =
        overrides.mutateEd25519Ix || ((i: TransactionInstruction) => i);
      const ixEd25519Program = mutateEd25519Ix(
        Ed25519Program.createInstructionWithPublicKey({
          publicKey:
            overrides.signerPublicKey?.toBytes() ||
            knownOrderSigner.publicKey.toBytes(),
          signature,
          message: serializedOrder,
          instructionIndex: overrides.instructionIndex,
        })
      );
      const tx = await customerSDK.SettleOrderPayment.createTx({
        cashRegister: cashRegisterModel.cashRegister,
        cashRegisterId: cashRegisterModel.cashRegisterId,
        serializedOrder,
        signature,
        signerPublicKey: knownOrderSigner.publicKey,
        customer: customer.publicKey,
        orderItems: [],
        consumedOrders: cashRegisterModel.consumedOrders,
      });
      tx.feePayer = customer.publicKey;
      // Ed25519Program test overrides
      if (overrides.instructionsSysvar) {
        tx.instructions[1].keys.forEach((k, idx) => {
          if (k.pubkey.equals(SYSVAR_INSTRUCTIONS_PUBKEY)) {
            tx.instructions[1].keys[idx].pubkey = overrides.instructionsSysvar;
          }
        });
      }
      if (overrides.disableEd25519Ix) {
        tx.instructions.shift();
      } else {
        tx.instructions[0] = ixEd25519Program;
      }
      await sendAndConfirmTx(tx, [customer]);
    };

  beforeAll(async () => {
    const { cashRegisterId, cashRegister, consumedOrders } =
      await createTestCashRegister(cashier, {
        orderSignersWhitelist: [knownOrderSigner.publicKey],
      });
    settlePayment = settlePaymentTestFunctionFactory({
      cashRegisterId,
      cashRegister: cashRegister,

      consumedOrders: consumedOrders,
    });
  });

  it("sanity (happy flow)", () => shouldSucceed(() => settlePayment({})));

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
});
