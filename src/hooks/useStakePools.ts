import { PublicKey, Connection } from "@solana/web3.js";
import { stakePoolInfo } from '@solana/spl-stake-pool';
import { useEffect, useState } from 'react';
import { useValidators } from "./useValidators";
import type { Validator } from "./useValidators";
import ReactXnft, { usePublicKey, useConnection, LocalStorage } from "react-xnft";

export type StakePool = {
    poolName: String,
    apy: number | null,
    exchangeRate: number | null,
    tokenSymbol: String,
    tokenMint: PublicKey,
    tokenImageURL: String,
    poolPublicKey: PublicKey,
    MEVDelegation: Boolean,
    website: String


}

export const defualtStakePools: Array<StakePool> = [
    {
        poolName: "Cogent",
        apy: null,
        exchangeRate: null,
        tokenSymbol: "cgntSOL",
        tokenMint: new PublicKey("CgnTSoL3DgY9SFHxcLj6CgCgKKoTBr6tp4CPAEWy25DE"),
        tokenImageURL: "https://cogent-cogs.s3.us-west-2.amazonaws.com/cgntSOL.png",
        poolPublicKey: new PublicKey("CgntPoLka5pD5fesJYhGmUCF8KU1QS1ZmZiuAuMZr2az"),
        MEVDelegation: true,
        website: "https://cogentcrypto.io/app"
    },
    {
        poolName: "Laine",
        apy: null,
        exchangeRate: null,
        tokenSymbol: "laineSOL",
        tokenMint: new PublicKey("LAinEtNLgpmCP9Rvsf5Hn8W6EhNiKLZQti1xfWMLy6X"),
        tokenImageURL: "https://shdw-drive.genesysgo.net/4DUkKJB966oMk8zq57KkAUxqg9HpuWtZ3BKobhmYph39/laineSOL.webp",
        poolPublicKey: new PublicKey("2qyEeSAWKfU18AFthrF7JA8z8ZCi1yt76Tqs917vwQTV"),
        MEVDelegation: true,
        website: "https://stake.laine.one/"
    },
    {
        poolName: "Jito",
        apy: null,
        exchangeRate: null,
        tokenSymbol: "JitoSOL",
        tokenMint: new PublicKey("J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn"),
        tokenImageURL: "https://storage.googleapis.com/token-metadata/JitoSOL-256.png",
        poolPublicKey: new PublicKey("Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb"),
        MEVDelegation: true,
        website: "https://www.jito.network/"
    },
    {
        poolName: "Marinade",
        apy: null,
        exchangeRate: null,
        tokenSymbol: "mSOL",
        tokenMint: new PublicKey("mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So"),
        tokenImageURL: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png",
        poolPublicKey: new PublicKey("Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb"), //TODO: needs to be marinade's contract
        MEVDelegation: false,
        website: "https://marinade.finance/"
    },
    { //TODO finish
        poolName: "BlazeStake",
        apy: null,
        exchangeRate: null,
        tokenSymbol: "bSOL",
        tokenMint: new PublicKey("bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1"),
        tokenImageURL: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1/logo.png",
        poolPublicKey: new PublicKey("stk9ApL5HeVAwPLr3TLhDXdZS8ptVu7zp6ov8HFDuMi"),
        MEVDelegation: true,
        website: "https://stake.solblaze.org/"
    },
    {
        poolName: "JPOOL",
        apy: null,
        exchangeRate: null,
        tokenSymbol: "jSOL",
        tokenMint: new PublicKey("7Q2afV64in6N6SeZsAAB81TJzwDoD6zpqmHkzi9Dcavn"),
        tokenImageURL: "https://raw.githubusercontent.com/mfactory-lab/jpool-pub/main/assets/images/jsol.png",
        poolPublicKey: new PublicKey("CtMyWsrUtAwXWiGr9WjHT5fC3p3fgV8cyGpLTo2LJzG1"),
        MEVDelegation: false,
        website: "https://jpool.one/"
    },

    { //TODO finish
        poolName: "Socean",
        apy: null,
        exchangeRate: null,
        tokenSymbol: "scnSOL",
        tokenMint: new PublicKey("7Q2afV64in6N6SeZsAAB81TJzwDoD6zpqmHkzi9Dcavn"),
        tokenImageURL: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/5oVNBeEEQvYi1cX3ir8Dx5n1P7pdxydbGF2X4TxVusJm/logo.png",
        poolPublicKey: new PublicKey("5oc4nmbNTda9fx8Tw57ShLD132aqDK65vuHH4RU1K4LZ"),
        MEVDelegation: false,
        website: "https://socean.fi/"
    },
    { //TODO finish
        poolName: "DAO Pool",
        apy: null,
        exchangeRate: null,
        tokenSymbol: "daoSOL",
        tokenMint: new PublicKey("GEJpt3Wjmr628FqXxTgxMce1pLntcPV4uFi8ksxMyPQh"),
        tokenImageURL: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/GEJpt3Wjmr628FqXxTgxMce1pLntcPV4uFi8ksxMyPQh/logo.png",
        poolPublicKey: new PublicKey("7ge2xKsZXmqPxa3YmXxXmzCp9Hc2ezrTxh6PECaxCwrL"),
        MEVDelegation: false,
        website: "https://socean.fi/"
    },

]
const stakePoolCacheKey = "stakepools"
export function useStakePools() {

    const [stakePools, setStakePools] = useState<StakePool[]>(defualtStakePools)
    const validators = useValidators();

    useEffect(() => {
        if (validators) {
            console.log("fetching stakepool information");
            LocalStorage.get(stakePoolCacheKey).then((val) => {
                if (val) {
                    const resp = JSON.parse(val);
                    if (

                        Object.keys(resp.value).length > 0 &&
                        Date.now() - resp.ts < 1000 * 60 * 5 * 60 // 5 hours
                    ) {
                        return JSON.parse(resp.value)
                    } else {
                        fetchStakePoolData(stakePools, validators).then((new_stakePools) => {
                            let new_stringifiedStakePools = JSON.stringify(new_stakePools)
                            console.log("new_stringifiedStakePools", new_stringifiedStakePools)
                            if (new_stringifiedStakePools !== JSON.stringify(stakePools)) {
                                setStakePools(stakePools)
                                LocalStorage.set(stakePoolCacheKey, JSON.stringify({ ts: Date.now(), value: JSON.stringify(stakePools) }))
                            }
                        })
                    }
                } else {
                    fetchStakePoolData(stakePools, validators).then((new_stakePools) => {
                        let new_stringifiedStakePools = JSON.stringify(new_stakePools)
                        console.log("no stake pool information found in local storage", new_stringifiedStakePools)
                        if (new_stringifiedStakePools !== JSON.stringify(stakePools)) {
                            setStakePools(stakePools)
                            LocalStorage.set(stakePoolCacheKey, JSON.stringify({ ts: Date.now(), value: JSON.stringify(stakePools) }))
                        }
                    })
                }
            })
        }
    }, [validators])

    return stakePools
}

async function fetchStakePoolData(stakePools: StakePool[], validators: { [key: string]: Validator }) {
    const connection = new Connection("https://patient-aged-voice.solana-mainnet.quiknode.pro/bbaca28510a593ccd2b18cb59460f7a43a1f6a36/");
    const stakePoolData = await Promise.all(stakePools.map(async (stakePool) => {
        const stakePoolData = await stakePoolInfo(connection, stakePool.poolPublicKey)
        const exchangeRate = parseFloat(stakePoolData.poolTokenSupply) / parseFloat(stakePoolData.totalLamports)

        const stakedLamportsWithAPY = stakePoolData.details.stakeAccounts.map((stakeAccount) => {
            try {
                return [parseFloat(stakeAccount.validatorLamports), validators[stakeAccount.voteAccountAddress].apy_estimate]
            } catch (e) {
                console.log("error fetching apy for stake account", stakeAccount)
                return [parseFloat(stakeAccount.validatorLamports), 0]
            }
        })

        // stakedLamportsWithAPY.push([stakePoolData.details.reserveStakeLamports ?  stakePoolData.details.reserveStakeLamports:0, 0])
        const summed = stakedLamportsWithAPY.reduce((acc, [lamports, apy]) => {
            return [acc[0] + lamports * apy, acc[1] + lamports]
        }, [0, 0])
        const apy = summed[0] / summed[1] * stakePoolData.epochFee.denominator.toNumber() / stakePoolData.epochFee.numerator.toNumber() / 10000;
        console.log("fee", stakePoolData.epochFee.denominator.toNumber())

        console.log("fetched stake pool info")
        return {
            ...stakePool,
            exchangeRate,
            apy
        }
    }))
    return stakePoolData
}

