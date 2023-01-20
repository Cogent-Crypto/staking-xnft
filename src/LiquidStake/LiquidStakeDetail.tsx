
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
import { useSolBalance } from '../hooks/useSolBalance';
import {MarinadeMint} from "@marinade.finance/marinade-ts-sdk"



export function LiquidStakeDetail({ stakePool }: { stakePool: StakePool }) {
    const THEME = useCustomTheme();

    const nav = useNavigation();
    const publicKey = usePublicKey();
    // const connection = useConnection();
    const connection = new Connection("https://patient-aged-voice.solana-mainnet.quiknode.pro/bbaca28510a593ccd2b18cb59460f7a43a1f6a36/");
    const solabalance = useSolBalance();

    async function submitTransaction(transaction:Transaction) {
        try {
            await window.xnft.solana.sendAndConfirm(transaction)
        } catch (error) {
            console.log("Here is the error", error);
            return
        }
    }

    async function depositMarinade(lamports) {
        // MarinadeMint.build()
    }
    async function withdrawSolSPLTransaction(pool: StakePool, lamports: number): Promise<Transaction> {
        const recentBlockhash = await connection.getLatestBlockhash();
        const transaction = new Transaction({
            feePayer: publicKey,
            blockhash: recentBlockhash.blockhash,
            lastValidBlockHeight: recentBlockhash.lastValidBlockHeight
        });
        let stakePoolinstruction = await withdrawSol(connection,pool.poolPublicKey,publicKey,publicKey,lamports)
        transaction.add(...stakePoolinstruction.instructions);
        return transaction
    }

    async function withdrawSolSPL(pool: StakePool, lamports: number) {
        let txn = await withdrawSolSPLTransaction(pool,lamports)
        submitTransaction(txn)
    }

    async function withdrawStakeSPLTransaction(pool: StakePool, lamports: number): Promise<Transaction> {
        const recentBlockhash = await connection.getLatestBlockhash();
        const transaction = new Transaction({
            feePayer: publicKey,
            blockhash: recentBlockhash.blockhash,
            lastValidBlockHeight: recentBlockhash.lastValidBlockHeight
        });
        let stakePoolinstruction = await withdrawStake(connection,stakePool.poolPublicKey, publicKey, lamports,)
        transaction.add(...stakePoolinstruction.instructions)
        transaction.partialSign(stakePoolinstruction.signers[0]);
        return transaction
    }

    async function withdrawStakeSPL(pool: StakePool, lamports: number) {
        let txn = await withdrawStakeSPLTransaction(pool,lamports)
        submitTransaction(txn)
    }

    async function depositSPLTransaction(pool: StakePool, lamports: number) {
        //amount needs to be lamports
        // different logic if marinade need to be implemented
        
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
        return transaction
       
       
    }

    async function depositSPL(pool: StakePool, lamports: number) {
        let txn = await depositSPLTransaction(pool,lamports)
        submitTransaction(txn)
    }

    return (
        <View style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <View style={{ flex: 1 }}>
                {stakePool.poolName}
                <Button onClick={() => depositSPL(stakePool, 10000)}>Deposit</Button> 
                {/* need to tie this in to an input */}
            </View>
        </View >
    )
}


