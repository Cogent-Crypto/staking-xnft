
import { View, Text, List, Button, useNavigation, Image, useConnection, usePublicKey } from "react-xnft";
import  { Connection, PublicKey, Transaction } from "@solana/web3.js";
import type { StakeAccount } from "../hooks/useStakeAccounts";
import type { Validator } from "../hooks/useValidators";
import React from "react";
import { useState } from "react";
import { useEpochInfo } from "../hooks/useEpochInfo";
import { useCustomTheme } from "../hooks/useCustomTheme";
import { StakePool } from "../hooks/useStakePools";
import { depositSol, depositStake, withdrawSol, withdrawStake, stakePoolInfo} from '@solana/spl-stake-pool';
import { publicKey } from '@project-serum/anchor/dist/cjs/utils';



export function LiquidStakeDetail({ stakePool }: { stakePool: StakePool }) {
    const THEME = useCustomTheme();

    const nav = useNavigation();
    const publicKey = usePublicKey();
    const connection = useConnection();

    async function deposit(pool: StakePool, lamports: number) {
        //amount needs to be lamports
        // different logic if marinade need to be implemented
        
        const connection = new Connection("https://patient-aged-voice.solana-mainnet.quiknode.pro/bbaca28510a593ccd2b18cb59460f7a43a1f6a36/");
        stakePoolInfo(connection, pool.poolPublicKey).then(console.log).catch(console.log);
        const recentBlockhash = await connection.getLatestBlockhash();
        const transaction = new Transaction({
            feePayer: publicKey,
            blockhash: recentBlockhash.blockhash,
            lastValidBlockHeight: recentBlockhash.lastValidBlockHeight
        });

        let stakePoolinstruction  = await depositSol(connection, pool.poolPublicKey, publicKey, lamports);
        transaction.add(...stakePoolinstruction.instructions);
        transaction.partialSign(stakePoolinstruction.signers[0]);
        // connection.simulateTransaction(transaction).then(console.log).catch(console.log); //this works
        let txnSignature: any
        try {
            txnSignature = await window.xnft.solana.sendAndConfirm(transaction)
        } catch (error) {
            console.log("Here is the error", error);
            return
        }
       
       
    }

    return (
        <View style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <View style={{ flex: 1 }}>
                {stakePool.poolName}
                <Button onClick={() => deposit(stakePool, 10000)}>Deposit</Button> 
                {/* need to tie this in to an input */}
            </View>
        </View >
    )
}


