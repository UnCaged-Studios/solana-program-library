import { parseOrderFromSettlePaymentTx } from "../../../sdk/ts/ka-ching/v1/order-signer";
import {
  mockCashierOrderService,
  anOrder,
  settleOrderPaymentTest,
  aUUID,
} from "../../utils/settle-payment";
import { getParsedTransaction } from "../../utils/solana";
import { shouldSucceed } from "../../utils/testing";
import { registerSettleOrderPaymentTest } from "./runner";

registerSettleOrderPaymentTest(
  "should successfully extract order from settle-payment transaction",
  ({
    cashRegisterId,
    cashRegister,
    knownOrderSigner,
    customer,
    consumedOrders,
  }) =>
    shouldSucceed(async () => {
      const orderId = aUUID();
      const { serializedOrder, signature } = mockCashierOrderService(
        knownOrderSigner,
        anOrder({
          id: orderId,
          cashRegisterId,
          customer: customer.publicKey,
        })
      );
      const sig = await settleOrderPaymentTest({
        cashRegister,
        cashRegisterId,
        serializedOrder,
        signature,
        signerPublicKey: knownOrderSigner.publicKey,
        customer,
        orderItems: [],
        consumedOrders,
      });

      const ptx = await getParsedTransaction(sig);
      expect(ptx).toBeDefined();

      const deserializedOrder = parseOrderFromSettlePaymentTx(ptx!);
      expect(deserializedOrder.id).toEqual(orderId);
      expect(deserializedOrder.cashRegisterId).toEqual(cashRegisterId);
      expect(Buffer.from(deserializedOrder.customer)).toStrictEqual(
        customer.publicKey.toBuffer()
      );
    })
);
