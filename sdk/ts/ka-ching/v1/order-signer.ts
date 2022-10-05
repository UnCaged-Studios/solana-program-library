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

const encodeUUID = (str: string) =>
  Uint8Array.from(Buffer.from(str.replace(/-/g, ""), "hex"));

// debit customer with 𝑛1 amount of mint X.
type OrderItemModel = {
  amount: number;
  currency: PublicKey;
  op: OrderItemOperation;
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
      id: encodeUUID(order.id),
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
  if (tx.transaction.message.instructions.length !== 2) {
    throw new Error(
      `transaction message.instructions length is invalid ${tx.transaction.message.instructions.length}`
    );
  }
  if (
    tx.transaction.message.instructions.at(0)?.programId.toBase58() !==
    "Ed25519SigVerify111111111111111111111111111"
  ) {
    throw new Error(
      `tx.transaction.message.instructions.at(0) is not Ed25519SigVerify111111111111111111111111111`
    );
  }
  if (
    tx.transaction.message.instructions.at(1)?.programId.toBase58() !==
    PROGRAM_ID.toBase58()
  ) {
    throw new Error(
      `tx.transaction.message.instructions.at(1) is not ${PROGRAM_ID.toBase58()}`
    );
  }
  const sigverify_ix = tx.transaction.message.instructions.at(0);
  if (sigverify_ix && "data" in sigverify_ix && sigverify_ix.data) {
    return sigverify_ix;
  }
  throw new Error(`sigverify_ix is undefined or has no data field`);
};

export const parseOrderFromSettlePaymentTx = (
  tx: ParsedTransactionWithMeta
): ParsedOrder => {
  const sigverify_ix = getSigverifyIx(tx);
  const data = Buffer.from(base58.decode(sigverify_ix.data)).subarray(112);
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
  const rawUuid = new BN(deserializedOrder.id).toString("hex", 2);
  let offset = 0;
  const uuid = [8, 4, 4, 4, 12]
    .reduce(
      (acc, n) => acc.concat(rawUuid.substring(offset, (offset += n))),
      [] as string[]
    )
    .join("-");
  return {
    ...deserializedOrder,
    cashRegisterId: deserializedOrder.cash_register_id,
    createdAt: deserializedOrder.created_at,
    notBefore: deserializedOrder.not_before,
    id: uuid,
  };
};

export const enum OrderItemOperation {
  CREDIT_CUSTOMER = 0,
  DEBIT_CUSTOMER = 1,
}
