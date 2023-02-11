import { PublicKey, ParsedTransactionWithMeta } from "@solana/web3.js";
import * as borsh from "borsh";
import base58 from "bs58";
import BN from "bn.js";
import { PROGRAM_ID } from "./program";

const getItemsBuffAllocation = (items: Array<unknown>) => 4 + items.length * 41;

class OrderItemEncoderContainer {
  amount!: number;
  currency!: Uint8Array;
  op!: number;

  constructor(args: OrderItemEncoderContainer) {
    Object.assign(this, args);
  }
}

class OrderEncoderContainer {
  id!: Uint8Array;
  expiry!: number;
  customer!: Uint8Array;
  not_before!: number;
  created_at!: number;
  cash_register_id!: string;
  items!: Uint8Array;

  constructor(args: OrderEncoderContainer) {
    Object.assign(this, args);
  }
}

const serializeOrderItem = (item: OrderItemModel) =>
  borsh.serialize(
    new Map([
      [
        OrderItemEncoderContainer,
        {
          kind: "struct",
          fields: [
            ["amount", "u64"],
            ["currency", [32]],
            ["op", "u8"],
          ],
        },
      ],
    ]),
    new OrderItemEncoderContainer({
      amount: item.amount,
      currency: item.currency.toBytes(),
      op: item.op,
    })
  );

const serializeOrderItems = (items: OrderModel["items"]) => {
  const bufferLayout = new Uint8Array(getItemsBuffAllocation(items));
  let offset = 0;
  return [Uint8Array.from([items.length, 0, 0, 0])]
    .concat(items.map(serializeOrderItem))
    .reduce((layout, item) => {
      layout.set(item, offset);
      offset += item.length;
      return layout;
    }, bufferLayout);
};

// debit customer with 𝑛1 amount of mint X.
type OrderItemModel = {
  amount: number;
  currency: PublicKey;
  op: OrderItemOperation;
  shouldCreateAta?: boolean;
};

export type OrderModel = {
  id: string;
  expiry: number;
  customer: PublicKey;
  notBefore: number;
  createdAt: number;
  cashRegisterId: string;
  items: Array<OrderItemModel>;
};

export const serializeOrder = (order: OrderModel) =>
  borsh.serialize(
    new Map([
      [
        OrderEncoderContainer,
        {
          kind: "struct",
          fields: [
            ["id", "u128"],
            ["expiry", "u32"],
            ["customer", [32]],
            ["not_before", "u32"],
            ["created_at", "u32"],
            ["cash_register_id", "string"],
            ["items", [getItemsBuffAllocation(order.items)]],
          ],
        },
      ],
    ]),
    new OrderEncoderContainer({
      id: Uint8Array.from(Buffer.from(order.id, "hex")),
      expiry: order.expiry,
      customer: order.customer.toBytes(),
      not_before: order.notBefore,
      created_at: order.createdAt,
      cash_register_id: order.cashRegisterId,
      items: serializeOrderItems(order.items),
    })
  );

type ParsedOrder = {
  id: string;
  expiry: number;
  customer: Uint8Array;
  notBefore: number;
  createdAt: number;
  cashRegisterId: string;
};

const getSigverifyIx = (tx: ParsedTransactionWithMeta) => {
  if (!tx.meta || tx.meta.err != null || tx.meta.err != undefined) {
    throw new Error(`transaction meta.err object is invalid: ${tx.meta?.err}`);
  }
  if (
    tx.transaction.message.instructions.at(0)?.programId.toBase58() !==
    "Ed25519SigVerify111111111111111111111111111"
  ) {
    throw new Error(
      `tx.transaction.message.instructions.at(0) is not Ed25519SigVerify111111111111111111111111111`
    );
  }
  const sigverify_ix = tx.transaction.message.instructions.at(0);
  if (sigverify_ix && "data" in sigverify_ix && sigverify_ix.data) {
    return sigverify_ix.data;
  }
  throw new Error(`sigverify_ix is undefined or has no data field`);
};

export const parseOrderFromSettlePaymentTx = (
  tx: ParsedTransactionWithMeta
): ParsedOrder => {
  const sigverify_ix_data = getSigverifyIx(tx);
  const data = Buffer.from(base58.decode(sigverify_ix_data)).subarray(112);
  const deserializedOrder = borsh.deserializeUnchecked(
    new Map([
      [
        OrderEncoderContainer,
        {
          kind: "struct",
          fields: [
            ["id", "u128"],
            ["expiry", "u32"],
            ["customer", [32]],
            ["not_before", "u32"],
            ["created_at", "u32"],
            ["cash_register_id", "string"],
          ],
        },
      ],
    ]),
    OrderEncoderContainer,
    data
  );
  const id = (deserializedOrder.id as unknown as BN)
    .toBuffer(undefined, 16)
    .toString("hex");
  return {
    id,
    cashRegisterId: deserializedOrder.cash_register_id,
    createdAt: deserializedOrder.created_at,
    notBefore: deserializedOrder.not_before,
    expiry: deserializedOrder.expiry,
    customer: deserializedOrder.customer,
  };
};

export const enum OrderItemOperation {
  CREDIT_CUSTOMER = 0,
  DEBIT_CUSTOMER = 1,
}
