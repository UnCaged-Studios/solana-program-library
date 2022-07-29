import { PublicKey } from "@solana/web3.js";
import * as borsh from "borsh";

const getItemsBuffAllocation = (items: Array<unknown>) => 4 + items.length * 35;

class OrderItemEncoderContainer {
  constructor(
    public amount: number,
    public currency: Uint8Array,
    public op: number
  ) {}
}

class OrderEncoderContainer {
  constructor(
    public id: number,
    public expiry: number,
    public customer: Uint8Array,
    public not_before: number,
    public created_at: number,
    public cashbox_id: String,
    public items: Uint8Array
  ) {}
}

const serializeOrderItems = (items: OrderModel["items"]) => {
  const result = new Uint8Array(getItemsBuffAllocation(items));

  items
    .reduce(
      (acc, item) => {
        const serialized = borsh.serialize(
          new Map([
            [
              OrderItemEncoderContainer,
              {
                kind: "struct",
                fields: [
                  ["amount", "u16"],
                  ["currency", [32]],
                  ["op", "u8"],
                ],
              },
            ],
          ]),
          new OrderItemEncoderContainer(
            item.amount,
            item.currency.toBytes(),
            item.op
          )
        );
        acc.push(serialized);
        return acc;
      },
      [Uint8Array.from([items.length, 0, 0, 0])]
    )
    .reduce((offset, item) => {
      result.set(item, offset);
      return offset + item.length;
    }, 0);

  return result;
};

export const serializeOrder = (order: OrderModel) =>
  borsh.serialize(
    new Map([
      [
        OrderEncoderContainer,
        {
          kind: "struct",
          fields: [
            ["id", "u64"],
            ["expiry", "u32"],
            ["customer", [32]],
            ["not_before", "u32"],
            ["created_at", "u32"],
            ["cashbox_id", "string"],
            ["items", [getItemsBuffAllocation(order.items)]],
          ],
        },
      ],
    ]),
    new OrderEncoderContainer(
      order.id,
      order.expiry,
      order.customer.toBytes(),
      order.notBefore,
      order.createdAt,
      order.cashboxId,
      serializeOrderItems(order.items)
    )
  );

export const enum OrderItemOperation {
  CREDIT = 0,
  DEBIT = 1,
}

// debit customer with 𝑛1 amount of mint X.
export type OrderItemModel = {
  amount: number;
  currency: PublicKey;
  op: OrderItemOperation;
};

export type OrderModel = {
  id: number;
  expiry: number;
  customer: PublicKey;
  notBefore: number;
  createdAt: number;
  cashboxId: string;
  items: Array<OrderItemModel>;
};
