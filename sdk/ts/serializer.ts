import { PublicKey } from "@solana/web3.js";
import * as borsh from "borsh";

const getItemsBuffAllocation = (items: Array<unknown>) => 4 + items.length * 41;

class OrderItemEncoderContainer {
  constructor(
    public amount: number,
    public currency: Uint8Array,
    public op: number
  ) {}
}

class OrderEncoderContainer {
  constructor(
    public id: Uint8Array,
    public expiry: number,
    public customer: Uint8Array,
    public not_before: number,
    public created_at: number,
    public cash_register_id: String,
    public items: Uint8Array
  ) {}
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
    new OrderItemEncoderContainer(item.amount, item.currency.toBytes(), item.op)
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
    new OrderEncoderContainer(
      encodeUUID(order.id),
      order.expiry,
      order.customer.toBytes(),
      order.notBefore,
      order.createdAt,
      order.cashRegisterId,
      serializeOrderItems(order.items)
    )
  );

export const enum OrderItemOperation {
  CREDIT_CUSTOMER = 0,
  DEBIT_CUSTOMER = 1,
}

// debit customer with 𝑛1 amount of mint X.
export type OrderItemModel = {
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
