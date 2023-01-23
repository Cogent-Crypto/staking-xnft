import { AccountInfo, LAMPORTS_PER_SOL, ParsedAccountData, PublicKey } from "@solana/web3.js";
import { StakeProgram, Connection, } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useState, useEffect } from "react";
import ReactXnft, { usePublicKey, useConnection, LocalStorage } from "react-xnft";
import { useStakePools } from "./useStakePools";

type parsedTokenAccount = {
    isNative: boolean,
    mint: string
    owner: string,
    state: string,
    tokenAmount: {
        amount: string,
        decimals: number,
        uiAmount: number,
        uiAmountString: number
    }
}

export function useStakingTokenBalances() { //maps token mint to balance, scale is in SOL decimals e.g. not lamports
    const publicKey = usePublicKey();
    const connection = new Connection("https://patient-aged-voice.solana-mainnet.quiknode.pro/bbaca28510a593ccd2b18cb59460f7a43a1f6a36/");
    const stakePools = useStakePools();
    const [balances, setBalances] = useState<Map<string, number> | null>(null);

    useEffect(() => {
        if (publicKey && connection && stakePools) {
            let  sorted_map_entries: Array<[string, number]>;
            const cacheKey = "stakepooltokenbalances" + publicKey.toString();
            LocalStorage.get(cacheKey).then((val) => {
                if (val) {
                    const resp = JSON.parse(val);
                    if ( 
                        Object.keys(resp.value).length > 0 &&
                        Date.now() - resp.ts < 1000 * 60 * 60  // 1 hour
                    ) {
                        console.log("loading cached stakepool balances")
                        sorted_map_entries = resp.value.sort((a, b) => {return (a[0] < b[0]) ? -1 : (a[0] > b[0]) ? 1 : 0;});                        
                    }
                } 
                console.log("about to fetch token  balances from: ", stakePools)
                let mints = new Set(stakePools.map((value) => value.tokenMint.toString()))
                fetchTokenBalances(publicKey, connection, mints).then((newBalances) => {
                    let new_sorted_map_entries = Array.from(newBalances.entries()).sort((a, b) => {return (a[0] < b[0]) ? -1 : (a[0] > b[0]) ? 1 : 0;});
                    console.log("new_sorted_map_entries", new_sorted_map_entries)
                    console.log("sorted_map_entries", sorted_map_entries)
                    if (JSON.stringify(sorted_map_entries) != JSON.stringify(new_sorted_map_entries) || !balances) {
                        console.log("setting new balances")
                        setBalances(newBalances); 
                    }
                    
                }) 
            }).catch((err) => {
                
                console.error("failed to proccess stakepool balances", err, stakePools)
            })
        }
    }, [publicKey,stakePools]);
    console.log("returning balances", balances)
    return balances;
}


async function fetchTokenBalances(publicKey, connection, stakePoolMintAddresses) { 
    const cacheKey = "stakepooltokenbalances" + publicKey.toString();
    console.log("connection", connection)
    console.log("connection.getParsedTokenAccountsByOwner", connection.getParsedTokenAccountsByOwner)
    let connection2 = new Connection("https://patient-aged-voice.solana-mainnet.quiknode.pro/bbaca28510a593ccd2b18cb59460f7a43a1f6a36/", "processed");
    const tokensInWallet = await connection2.getParsedTokenAccountsByOwner(publicKey, {
        programId: TOKEN_PROGRAM_ID
    });
    console.log("stakePoolMintAddress", stakePoolMintAddresses)
   
    let parsedStakePoolTokens = tokensInWallet.value.map((token)=>{ return token.account.data.parsed.info}).filter((token: parsedTokenAccount) => { return stakePoolMintAddresses.has(token.mint)})

    const stakePoolTokenBalanceMap = new Map<string, number>(parsedStakePoolTokens.map(
        (token: parsedTokenAccount) => {
            return [token.mint, token.tokenAmount.uiAmount]
        }
    ));
    console.log("fetched stakepool balances")


    console.log("stakepool balances", stakePoolTokenBalanceMap);
    LocalStorage.set(cacheKey, JSON.stringify({value: Array.from(stakePoolTokenBalanceMap.entries()), ts: Date.now()}));
    return new Map<string, number>(stakePoolTokenBalanceMap);
}