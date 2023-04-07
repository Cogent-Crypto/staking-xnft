import { useState, useEffect } from "react";
import { usePublicKey, useSolanaConnection as useConnection } from "../hooks/xnft-hooks";


import AsyncStorage from '@react-native-async-storage/async-storage';


export function useSolBalance() { //lamports
    const publicKey = usePublicKey();
    const connection = useConnection();

    const [balance, setBalance] = useState(0);

    useEffect(() => {
        if (publicKey) {

            const cacheKey = "solbalance" + publicKey.toString();
            const val = AsyncStorage.getItem(cacheKey).then((val) => {
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
    AsyncStorage.setItem(cacheKey, JSON.stringify({ value: solBalance, ts: Date.now() }));

    return solBalance;
}