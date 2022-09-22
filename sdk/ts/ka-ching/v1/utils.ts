import { PublicKey } from "@solana/web3.js";

export const deserializeCashRegisterAccountData = (data: Buffer) => {
  const raw = data.subarray(8); // remove 8 bytes descriminator
  const cashRegisterIdLength = raw[0];
  const buff_cashRegisterId = Buffer.alloc(cashRegisterIdLength);
  const bumpOffset = 4 + cashRegisterIdLength;
  raw.copy(buff_cashRegisterId, 0, 4, bumpOffset);
  const raw2 = raw.subarray(bumpOffset); // remove cash_resgister_id
  const bump = Number(raw2[0]);
  const cashierPublicKey = raw2.subarray(1, 33); // cashier (PublicKey)
  const orderSignersRawBuffer = raw2.subarray(33, 33 + 160);
  const length = orderSignersRawBuffer[0]; // MSB - length of order_signers_whitelist: Vec<Pubkey>
  const orderSignersBuffer = orderSignersRawBuffer.subarray(4); // order_signers_whitelist: Vec<Pubkey>
  const orderSignersWhitelist = new Array(length)
    .fill(0)
    .map(
      (_, i) => new PublicKey(orderSignersBuffer.subarray(i * 32, i * 32 + 32))
    );
  return {
    cashRegisterId: buff_cashRegisterId.toString("ascii"),
    bump,
    cashierPublicKey: new PublicKey(cashierPublicKey),
    orderSignersWhitelist,
  };
};
