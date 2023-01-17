import { AccountInfo, LAMPORTS_PER_SOL, ParsedAccountData, PublicKey } from "@solana/web3.js";
import { StakeProgram, Connection, } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useState, useEffect } from "react";
import ReactXnft, { usePublicKey, useConnection, LocalStorage } from "react-xnft";
import { stakePools } from "./useStakePools";

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
    const connection = useConnection();
   
    const [balances, setBalances] = useState<Map<string, number> | null>(null);

    useEffect(() => {
        if (publicKey) {
            let  sorted_map_entries: Array<[string, number]>;
            const cacheKey = "stakepooltokenbalances" + publicKey.toString();
            const val = LocalStorage.get(cacheKey).then((val) => {
                if (val) {
                    const resp = JSON.parse(val);
                    if (
                        Object.keys(resp.value).length > 0 &&
                        Date.now() - resp.ts < 1000 * 60 * 60  // 1 hour
                    ) {
                        sorted_map_entries = resp.value.sort((a, b) => {return (a[0] < b[0]) ? -1 : (a[0] > b[0]) ? 1 : 0;});                        
                    }
                }
                console.log("stakePools", stakePools)
                let mints = new Set(stakePools.map((value) => value.tokenMint.toString()))
                
                fetchTokenBalances(publicKey, connection, mints).then((newBalances) => {
                    let new_sorted_map_entries = Array.from(newBalances.entries()).sort((a, b) => {return (a[0] < b[0]) ? -1 : (a[0] > b[0]) ? 1 : 0;});
                    console.log("new_sorted_map_entries", new_sorted_map_entries)
                    console.log("sorted_map_entries", sorted_map_entries)
                    if (JSON.stringify(sorted_map_entries) != JSON.stringify(new_sorted_map_entries)) {
                        setBalances(newBalances); 
                    }
                })
            }).catch((err) => {
                console.log("failed to proccess stakepool balances", err)
            })
        }
    }, [publicKey]);

    return balances;
}


async function fetchTokenBalances(publicKey, connection, stakePoolMintAddress) { 
    const cacheKey = "stakepooltokenbalances" + publicKey.toString();

    const tokensInWallet = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: TOKEN_PROGRAM_ID
    });
    console.log("stakePoolMintAddress", stakePoolMintAddress)
   
    let parsedStakePoolTokens = tokensInWallet.value.map((token)=>{ return token.account.data.parsed.info}).filter((token: parsedTokenAccount) => { return stakePoolMintAddress.has(token.mint)})

    const stakePoolTokenBalanceMap = new Map<string, number>(parsedStakePoolTokens.map(
        (token: parsedTokenAccount) => {
            return [token.mint, token.tokenAmount.uiAmount]
        }
    ));


    console.log("stakepool balances", stakePoolTokenBalanceMap);
    LocalStorage.set(cacheKey, JSON.stringify({value: Array.from(stakePoolTokenBalanceMap.entries()), ts: Date.now()}));
    return new Map<string, number>(stakePoolTokenBalanceMap);
}