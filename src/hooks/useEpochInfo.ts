import { useState, useEffect } from "react";
import ReactXnft, { usePublicKey, useConnection, LocalStorage } from "react-xnft";
import { Connection } from "@solana/web3.js";

export type EpochInfo = {
    epoch: Number,
    start_slot: Number,
    start_time: Date,
    slot_height: Number,
    duration_seconds: Number,
    elapsed_seconds: Number,
    remaining_seconds: Number,
    epochs_per_year: Number
}

export function useEpochInfo() {
    const [epochInfo, setEpochInfo] = useState<EpochInfo | null>(null);

    useEffect(() => {
        const cacheKey = "epochinfo";
        const val = LocalStorage.get(cacheKey).then((val) => {
            let epochInfo: EpochInfo;
            if (val) {
                const resp = JSON.parse(val);
                if (
                    Object.keys(resp.value).length > 0 &&
                    Date.now() - resp.ts < 1000 * 60 * 60 * 24  // 24 hours
                ) {
                    epochInfo = resp.value;
                    epochInfo.start_time = new Date(epochInfo.start_time);
                    setEpochInfo(epochInfo);
                }
            }

            fetchEpochInfo().then((newEpochInfo) => {
                if (newEpochInfo != epochInfo) {
                    setEpochInfo(newEpochInfo);
                }
            })
        })

    }, []);

    return epochInfo;
}


async function fetchEpochInfo() {
    const cacheKey = "epochinfo";
    const epochInfo = await fetch("https://api.stakewiz.com/epoch_info").then((res) => res.json())
    epochInfo.start_time = new Date(epochInfo.start_time);
    console.log("sol balances", epochInfo);
    LocalStorage.set(cacheKey, JSON.stringify({ value: epochInfo, ts: Date.now() }));

    return epochInfo;
}