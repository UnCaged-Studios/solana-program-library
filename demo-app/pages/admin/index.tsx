import { useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { Keypair, Transaction, PublicKey } from "@solana/web3.js";
import { SolanaWalletProvider } from "../../context/solana-wallet";
import { V1 } from "./sdk";
import styles from "../../styles/Home.module.css";

const CreateCashRegister = () => {
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

  const onClick = useCallback(async () => {
    if (!cashier) throw new WalletNotConnectedError();

    const { createAccountParams, cashRegisterInitParams } =
      V1.adminSDK.CreateConsumedOrdersAccount.createParams();

    // const targetAccount = Keypair.generate();
    // const createConsumedOrdersAccountIx =
    //   V1.adminSDK.CreateConsumedOrdersAccount.createTx(
    //     cashier,
    //     targetAccount.publicKey,
    //     10000000, // 0.01 SOL
    //     createAccountParams
    //   );
    // await sendTx(
    //   new Transaction().add(createConsumedOrdersAccountIx),
    //   targetAccount
    // );
    // console.log(
    //   ">>>>>>>>> CreateConsumedOrdersAccount: ",
    //   targetAccount.publicKey
    // );
    try {
      const createCashRegisterTx =
        await V1.adminSDK.CreateCashRegister.createTx({
          cashier,
          cashRegisterId: "hello_cashregister",
          consumedOrders: {
            account: new PublicKey(
              "DRfWAqCvfZndKsfjKxSgtyHPRWPX8Fw8xDB2tUpSdfR6"
            ),
            ...cashRegisterInitParams,
          },
          orderSignersWhitelist: [
            new PublicKey("2MkusVe9QYN69zxLYiiGF6FtUdLV33q6QiEsuuMLAzdq"),
          ],
        });
      const sig = await sendTx(createCashRegisterTx);
      console.log(">>>>>>>>> CreateCashRegister sig: ", sig);
    } catch (error) {
      console.error(error);
    }
  }, [cashier, sendTx]);

  return (
    <button disabled={!connected} onClick={onClick}>
      Create CashRegister
    </button>
  );
};

function Admin() {
  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>Admin Panel</h1>

        <SolanaWalletProvider>
          <main className={styles.main}>
            <CreateCashRegister />
          </main>
        </SolanaWalletProvider>
      </div>
    </>
  );
}

export default Admin;
