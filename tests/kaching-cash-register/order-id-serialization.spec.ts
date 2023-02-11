import { PublicKey, ParsedTransactionWithMeta } from "@solana/web3.js";
import { parseOrderFromSettlePaymentTx } from "../../sdk/ts/ka-ching/v1/order-signer";

function mockParsedTxn(data: { ed25519SigVerify_ix_data: string }) {
  return {
    meta: {
      err: null,
    },
    transaction: {
      message: {
        instructions: [
          {
            accounts: [],
            data: data.ed25519SigVerify_ix_data,
            programId: new PublicKey(
              "Ed25519SigVerify111111111111111111111111111"
            ),
          },
          {
            programId: new PublicKey(
              "9Pg1X5SXH4m2VXFLBd711GYc98aYAG5DVJW5ssFL28pF"
            ),
          },
        ],
      },
    },
  } as unknown as ParsedTransactionWithMeta;
}

test("two zero", async () => {
  // EyArysNc7U7oWuXH3t6hdP4FPGTPBrZuYRskUaV2KahmCSrRH1NCvLuun5HsUCbShfb6PfvzEegpQ6Bm7fbhvm2
  const deserializedOrder = parseOrderFromSettlePaymentTx(
    mockParsedTxn({
      ed25519SigVerify_ix_data:
        "N2hsiAgJVxmAvev3oMXeDuByoVPuugFFgSMptu48dNczPRvT4waVGBec3DxtCKTkVevyLtzQkebjYRMxNWAmkrce67Uvm1giSpw55MwPdv9888k3HGkxJzJwX8QeEwX6KD58iYsdfW8FZXRq9WRKnLUPKsxmW5sTfRgxUSRpfophCRoPSkhcPq6sR44DfZA6BAtg56ZKjG2NS11rL85K4ikUonjUhNjpwgzdhuk8VSjXGDypYgG2sF7kWAPBpA88idFVn24TRzJPNvj9BKBvxtXLDuEMmZcd4YVMiCn65yMrGxbCWKMNqDUPL4mkca2Rg7qZfoeBx78MGCSYh6fN4RYdXPSe1H1CkiQAYWtJEi1cKH4JQjVyEVFFDYPCFGec",
    })
  );
  expect(deserializedOrder.id).toBe("008f9d5c8f17478d94743114f3aee053");
});

test("one-zero padding", async () => {
  // 5BbTFMjZTqdGsXU9nXVzkekSSjU13RXxY9Tta7roFcC9zt8ye3zcMDWmx9NdDSkuTXgU2oMtwp1LHPhBYvYi1Bc3
  const deserializedOrder = parseOrderFromSettlePaymentTx(
    mockParsedTxn({
      ed25519SigVerify_ix_data:
        "N2hsiAgJVxmAvev3oMXeDuByoVPuugFFgSMptu48dNczPRvT4waVGBec3DxtCKTkNVxw6fhZmjs5WBRCTkdYwuowZngqdFm7RLKmMYWqivs86NkMXpjVgwzbvbdPX94jbYYLA1N4BS3XBVsPUD7yeymG3GwRRCgjet3cgqV4FBXdcu4113vgxeFKf7XJCJPLmJUWiA2Z6KgGYK6bavvKahbo2V6vanT9DKxxwjFkx943cypVHAr77GaTskJc3zmoXpMP9oWmu6sitvLXWjPPvX1stUo5V8ff8XF42QMKhbJxVVegSeqwpQY1pxtx8YpNqCE7kbG4Y1w6B9PWxDCgCYcLs8659zsTkdZVbUBeanRFBsJDMACsHTaEdeCbhov8",
    })
  );
  expect(deserializedOrder.id).toBe("0cea1610aa2740edbeba9a5d8164eaf0");
});

test("no padding with idParsing option", async () => {
  // 2Pw6orp11az62BsrbmKfDmt3DvGhUb7KmKfYR5CuV9bx3j1b48rZ8VZkvTUQKFVmRvftasaV9DpGNtd5hM6HR5Gj
  const deserializedOrder = parseOrderFromSettlePaymentTx(
    mockParsedTxn({
      ed25519SigVerify_ix_data:
        "N2hsiAgJVxmAvev3oMXeF9Fx5qFD5js8RpEZvUnhiCMKDqGSYUeebyzJu1HHSsh9EDivR2UcpcLBNVHKBJ9Di9SFZiMj3QfrERpYCVWGDAaddgQVwcX8BN7dUEXmiuqEHru4PQU2o14PjuYFMKG8UrKRcUCHN9icnSsVUGRuZ2SinT1qPFBK2rFJDr7YXE9zqWptA3jWF1oBZtJTfc5g9tHgQB4tjxbVqkhqhUPDui2F4ZhifrGVdVpNC8TXXXeEScDjj6H5g8bZsvo3rtqVhmKsn4UMsDGQDoxh2fKMbdZg7gmZY3zVLLHgjfEU2T4gYx2maohdMUYwewNsc8UfpWujoMPrG763VNXJm7nNisCY95dku4j28rgUfk6eLNuW",
    })
  );
  expect(deserializedOrder.id).toBe("9ce2ef4f4cb94cecbc85d1ce770ab0ab");
});

test("no padding wihtout idParsing option", async () => {
  // 2Pw6orp11az62BsrbmKfDmt3DvGhUb7KmKfYR5CuV9bx3j1b48rZ8VZkvTUQKFVmRvftasaV9DpGNtd5hM6HR5Gj
  const deserializedOrder = parseOrderFromSettlePaymentTx(
    mockParsedTxn({
      ed25519SigVerify_ix_data:
        "N2hsiAgJVxmAvev3oMXeF9Fx5qFD5js8RpEZvUnhiCMKDqGSYUeebyzJu1HHSsh9EDivR2UcpcLBNVHKBJ9Di9SFZiMj3QfrERpYCVWGDAaddgQVwcX8BN7dUEXmiuqEHru4PQU2o14PjuYFMKG8UrKRcUCHN9icnSsVUGRuZ2SinT1qPFBK2rFJDr7YXE9zqWptA3jWF1oBZtJTfc5g9tHgQB4tjxbVqkhqhUPDui2F4ZhifrGVdVpNC8TXXXeEScDjj6H5g8bZsvo3rtqVhmKsn4UMsDGQDoxh2fKMbdZg7gmZY3zVLLHgjfEU2T4gYx2maohdMUYwewNsc8UfpWujoMPrG763VNXJm7nNisCY95dku4j28rgUfk6eLNuW",
    })
  );
  expect(deserializedOrder.id).toBe("9ce2ef4f4cb94cecbc85d1ce770ab0ab");
});
