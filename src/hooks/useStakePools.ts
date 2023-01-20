import { PublicKey, Connection } from "@solana/web3.js";
import { stakePoolInfo} from '@solana/spl-stake-pool';
import { useEffect, useState } from 'react';
import ReactXnft, { usePublicKey, useConnection, LocalStorage } from "react-xnft";

export type StakePool = {
    poolName: String,
    apy: number
    exchangeRate: number
    tokenSymbol: String,
    tokenMint: PublicKey,
    tokenImageURL: String,
    poolPublicKey: PublicKey,
    MEVDelegation: Boolean,
    website: String


}

const stakePoolCacheKey = "stakepools"
export function useStakePools() {
    
    const [stakePools, setStakePools] = useState<StakePool[] | null>(null)
    const stakePoolCacheKey = "stakepooldata"

    useEffect(() => {
        LocalStorage.get(stakePoolCacheKey).then((val) => {
            fetch("localhost:3000/stakepoolinfomock").then((res) => {
                return res.json()
            })
            .then((data) => {
                let stakepooldata: StakePool[] = data.stake_pool_data.map((pool)=> {
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
