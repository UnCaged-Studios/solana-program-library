import { useCallback, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import nacl from "tweetnacl";
import {
  Keypair,
  Transaction,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { SolanaWalletProvider } from "../../context/solana-wallet";
import { V1 } from "./sdk";
import styles from "../../styles/Home.module.css";

const CreateCashRegister = ({
  consumedOrders,
  sendTx,
  cashier,
}: {
  consumedOrders: {
    get: () => PublicKey | null;
    set: (val: PublicKey) => void;
  };
  sendTx: Function;
  cashier: PublicKey;
}) => {
  const onClick = useCallback(async () => {
    const { createAccountParams, cashRegisterInitParams } =
      V1.adminSDK.CreateConsumedOrdersAccount.createParams();

    let consumedOrdersAccount = consumedOrders.get();
    console.log("$$$$$$$$$$$$$$$$ ", consumedOrdersAccount);
    if (consumedOrdersAccount === null) {
      const targetAccount = Keypair.generate();
      const createConsumedOrdersAccountIx =
        V1.adminSDK.CreateConsumedOrdersAccount.createTx(
          cashier,
          targetAccount.publicKey,
          LAMPORTS_PER_SOL * 0.63, // 0.62670624 is Rent-exempt minimum for 89916 bytes
          createAccountParams
        );
      const signature = await sendTx(
        new Transaction().add(createConsumedOrdersAccountIx),
        targetAccount
      );
      consumedOrders.set(targetAccount.publicKey);
      console.log(
        ">>>>>>>>> CreateConsumedOrdersAccount signature: ",
        signature
      );
      return;
    }

    try {
      const createCashRegisterTx =
        await V1.adminSDK.CreateCashRegister.createTx({
          cashier,
          cashRegisterId: "hello_cashregister_2",
          consumedOrders: {
            account: consumedOrdersAccount,
            ...cashRegisterInitParams,
          },
          orderSignersWhitelist: [
            // ~/.config/solana/demo-app-cashier-mainnet.json
            new PublicKey("2MkusVe9QYN69zxLYiiGF6FtUdLV33q6QiEsuuMLAzdq"),
          ],
        });
      const sig = await sendTx(createCashRegisterTx);
      console.log(">>>>>>>>> CreateCashRegister sig: ", sig);
    } catch (error) {
      console.error(error);
    }
  }, [cashier, sendTx, consumedOrders]);

  return (
    <button disabled={true} onClick={onClick}>
      Create CashRegister
    </button>
  );
};

const CreateCashRegisterForm = () => {
  const [consumedOrdersAccountAddress, setConsumedOrdersAccount] =
    useState<PublicKey>(
      new PublicKey("Ccw4eeiCNh3Pf23g2unQvy283eGDcNo7oMCjA48xNHgJ")
    );
  const { connection } = useConnection();
  const { publicKey: cashier, connected, signTransaction } = useWallet();

  const sendTx = useCallback(
    async (tx: Transaction, additionalSigner?: Keypair) => {
      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext();

      if (!connected || !signTransaction || !cashier) {
        throw new Error("signTransaction or cashier SRE not defined");
      }
      tx.recentBlockhash = blockhash;
      tx.lastValidBlockHeight = lastValidBlockHeight;
      tx.feePayer = cashier;
      const signedTx = await signTransaction(tx);
      if (additionalSigner) {
        signedTx.partialSign(additionalSigner);
      }
      const signature = await connection.sendRawTransaction(
        signedTx.serialize(),
        {
          minContextSlot,
        }
      );
      await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      });
      return signature;
    },
    [cashier, connected, connection, signTransaction]
  );

  const createTokenCashbox = async () => {
    const tx = await V1.adminSDK.CreateTokenCashbox.createTx({
      cashRegisterId: "hello_cashregister_2",
      cashier: cashier!,
      currency: new PublicKey("Fm9rHUTF5v3hwMLbStjZXqNBBoZyGriQaFM6sTFz3K8A"),
    });
    const signature = await sendTx(tx);
    console.log("create token cashbox ", signature);
  };

  const aUUID = () =>
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
      var t = (16 * Math.random()) | 0;
      return ("x" === e ? t : (3 & t) | 8).toString(16);
    });

  const settlePayment = async () => {
    const orderItems = [
      {
        amount: 1 * Math.pow(10, 6),
        currency: new PublicKey("Fm9rHUTF5v3hwMLbStjZXqNBBoZyGriQaFM6sTFz3K8A"),
        op: V1.orderSignerSDK.OrderItemOperation.DEBIT_CUSTOMER,
      },
    ];
    const customer = cashier!;
    const id = aUUID();
    const serializedOrder = V1.orderSignerSDK.serializeOrder({
      id,
      customer,
      cashRegisterId: "hello_cashregister_2",
      expiry: Date.now() / 1000 + 1000, // 1000 seconds into the future
      notBefore: Date.now() / 1000 - 1000, // 1000 seconds ago
      createdAt: Date.now() / 1000,
      items: orderItems,
    });
    const signer = Keypair.fromSecretKey(
      Uint8Array.from([
        43, 142, 158, 166, 168, 143, 112, 221, 204, 130, 250, 240, 155, 81, 102,
        59, 158, 46, 125, 226, 161, 29, 1, 77, 175, 179, 222, 52, 137, 127, 196,
        111, 20, 44, 244, 61, 222, 86, 106, 149, 21, 101, 214, 96, 75, 218, 249,
        19, 192, 180, 164, 41, 95, 201, 55, 44, 163, 55, 19, 100, 153, 125, 128,
        116,
      ])
    );
    const signature = nacl.sign.detached(serializedOrder, signer.secretKey);
    const tx = await V1.customerSDK.SettleOrderPayment.createTx({
      cashRegister: new PublicKey(
        "5FxmZKVh9FWPGQFsoghYBscXWF2oyakAYPXuuC3sWTyV"
      ),
      cashRegisterId: "hello_cashregister_2",
      serializedOrder,
      signature,
      signerPublicKey: new PublicKey(
        "2MkusVe9QYN69zxLYiiGF6FtUdLV33q6QiEsuuMLAzdq"
      ),
      customer,
      orderItems,
      consumedOrders: new PublicKey(
        "Ccw4eeiCNh3Pf23g2unQvy283eGDcNo7oMCjA48xNHgJ"
      ),
    });
    const sigi = await sendTx(tx);
    console.log("✅ ", sigi);
  };

  return (
    <div>
      {" "}
      <CreateCashRegister
        sendTx={sendTx}
        cashier={cashier!}
        consumedOrders={{
          get: () => consumedOrdersAccountAddress,
          set: setConsumedOrdersAccount,
        }}
      />
      <label htmlFor="consumed_orders_account">Consumed Orders Account</label>
      <input
        id="consumed_orders_account"
        type="text"
        placeholder="account address (base 58)"
        disabled={true}
        value={consumedOrdersAccountAddress.toBase58()}
        onChange={(e) => {
          const val = e.target.value;
          try {
            const pubkey = new PublicKey(val);
            setConsumedOrdersAccount(pubkey);
          } catch (error) {
            console.error(error);
          }
        }}
      ></input>
      <div>
        <button disabled={true} onClick={() => createTokenCashbox()}>
          Create TokenCashbox
        </button>
        <label htmlFor="cash_register_address">Cash-Register Account</label>
        <input
          id="cash_register_address"
          type="text"
          value={"5FxmZKVh9FWPGQFsoghYBscXWF2oyakAYPXuuC3sWTyV"}
          disabled={true}
        ></input>
      </div>
      <label htmlFor="token_cashbox_address">MBS Token Cashbox Account</label>
      <input
        id="token_cashbox_address"
        type="text"
        value={"BjFEKSHapQoEjZYfE6hU1FEkQkrSf4imm8oarw5XBHKN"}
        disabled={true}
      ></input>
      <button onClick={() => settlePayment()}>settle payment</button>
    </div>
  );
};

function Admin() {
  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>Admin Panel</h1>
        <SolanaWalletProvider>
          <main className={styles.main}>
            <CreateCashRegisterForm />
          </main>
        </SolanaWalletProvider>
      </div>
    </>
  );
}

export default Admin;
