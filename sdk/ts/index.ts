import { PublicKey } from "@solana/web3.js";

// debit customer with 𝑛1 amount of mint X.
export type OrderItem = {
  amount: number; // u16
  currency: PublicKey;
  op: "dbt" | "crd";
};

const BORSH_SERIALIZE_NUM_OF_BYTES = {
  U16: () => 2, // https://docs.rs/borsh/0.2.4/src/borsh/ser/mod.rs.html#30
  PUBKEY: () => 32, // https://docs.rs/solana-program/latest/src/solana_program/pubkey.rs.html#87
  STRING: (strLength: number) => 4 + strLength, // https://docs.rs/borsh/0.2.4/src/borsh/ser/mod.rs.html#91-98
  // TOTAL: 41 == 2 + 32 + 4 + 3
};

const toU16 = (num) => Uint8Array.from([num & 255, (num >> 8) & 255]);

const ORDER_ITEM_OP_LEN_AS_U8 = 3;

const orderItemLayout =
  BORSH_SERIALIZE_NUM_OF_BYTES.U16() /* amount (u16) */ + // TODO - increase to support bigger numbers
  BORSH_SERIALIZE_NUM_OF_BYTES.PUBKEY() /* currency (PublicKey) */ +
  BORSH_SERIALIZE_NUM_OF_BYTES.STRING(ORDER_ITEM_OP_LEN_AS_U8); // crd | dbt

const numOfItemsLaoyt = 1;

const lengthOfOpString = Uint8Array.from([ORDER_ITEM_OP_LEN_AS_U8, 0, 0, 0]);

export const serializeOrder = ({ items }: { items: Array<OrderItem> }) => {
  if (items.length > 255) {
    throw new Error(`can only supprt up to 255 items`);
  }

  const orderItemData = Buffer.alloc(
    numOfItemsLaoyt + orderItemLayout * items.length
  );
  orderItemData.fill(items.length);

  let offsets = 1;

  return items.reduce((acc, item) => {
    // 'amount'
    acc.fill(toU16(item.amount), offsets);
    offsets += BORSH_SERIALIZE_NUM_OF_BYTES.U16();

    // 'pubkey'
    acc.fill(item.currency.toBytes(), offsets);
    offsets += BORSH_SERIALIZE_NUM_OF_BYTES.PUBKEY();

    // length of 'op' string (=3)
    acc.fill(lengthOfOpString, offsets);
    offsets += lengthOfOpString.length;
    // 'op' string
    acc.fill(Buffer.from((item.op, "ascii")), offsets);
    offsets += ORDER_ITEM_OP_LEN_AS_U8;

    return acc;
  }, orderItemData);
};
