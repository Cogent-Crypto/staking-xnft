import { PublicKey } from "@solana/web3.js";
// import { stakePoolInfo } from '@solana/spl-stake-pool';
import { useEffect, useState } from 'react';
// import { stakepoolInfoStatic } from "./stakepoolStatic";
import AsyncStorage from '@react-native-async-storage/async-storage';

export type StakePool = {
    poolName: String,
    apy: number
    exchangeRate: number
    tokenSymbol: String,
    tokenMint: PublicKey,
    tokenMintSupply: number,
    tokenImageURL: String,
    poolPublicKey: PublicKey,
    MEVDelegation: Boolean,
    website: String,
    commission: number;
    solDepositFee: number;
    solWithdrawalFee: number;
}

const stakePoolCacheKey = "stakepooldata3"
export function useStakePools() {

    const [stakePools, setStakePools] = useState<StakePool[] | null>(null)
    const stakePoolCacheKey = "stakepooldata"

    useEffect(() => {
        AsyncStorage.getItem(stakePoolCacheKey).then((val) => {

            if (val) {
                const resp = JSON.parse(val);
                if (
                    Object.keys(resp.value).length > 0 &&
                    Date.now() - resp.ts < 1000 * 60 * 48 * 60 // 5 hours
                ) {
                    setStakePools(resp.value)
                    return
                }
            }

            fetch("https://cogentcrypto.io/api/stakepoolinfo").then((res) => {
                return res.json()
            })
                .then((data) => {
                    let stakepooldata: StakePool[] = data.stake_pool_data.map((pool) => {
                        return {
                            ...pool,
                            tokenMint: new PublicKey(pool.tokenMint),
                            poolPublicKey: new PublicKey(pool.poolPublicKey)
                        }
                    })
                    setStakePools(stakepooldata)
                })

        })
    }, [])

    return stakePools
}
