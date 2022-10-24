import { useState, useEffect } from "react";
import ReactXnft, {  usePublicKey, useConnection, LocalStorage } from "react-xnft";
import {Connection } from "@solana/web3.js";


export function useSolBalance() { //lamports
    const publicKey = usePublicKey();
    const connection = useConnection();
    // const connection = new Connection("https://patient-aged-voice.solana-mainnet.quiknode.pro/34de7f944c3ac4fa11d689afa1566e8e605e0979/", "processed");
   
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        if (publicKey) {

            const cacheKey = "solbalance" + publicKey.toString();
            const val = LocalStorage.get(cacheKey).then((val) => {
                let balance: number;
                if (val) {
                    const resp = JSON.parse(val);
                    if (
                    Object.keys(resp.value).length > 0 &&
                    Date.now() - resp.ts < 1000 * 60 * 60  // 1 hour
                    ) {
                        balance = resp.value;
                        setBalance(balance);
                    }
                }

                fetchSolBalance(publicKey, connection).then((newBalance) => {
                    if (balance != newBalance) {
                        setBalance(newBalance);
                    }
                })
            })
        }
    }, [publicKey]);

    return balance;
}


async function fetchSolBalance(publicKey, connection) { 
    const cacheKey = "solbalance" + publicKey.toString();
    const solBalance = await connection.getBalance(publicKey)
    console.log("sol balances", solBalance);
    LocalStorage.set(cacheKey, JSON.stringify({value: solBalance, ts: Date.now()}));
    
    return solBalance;
}