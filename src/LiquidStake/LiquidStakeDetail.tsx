
import { View, Text, List, Button, useNavigation, Image, useConnection, usePublicKey, TextField } from "react-xnft";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import type { StakeAccount } from "../hooks/useStakeAccounts";
import type { Validator } from "../hooks/useValidators";
import React from "react";
import { useCustomTheme } from "../hooks/useCustomTheme";
import { useStakingTokenBalances } from '../hooks/useStakingTokenBalances';
import { StakePool } from "../hooks/useStakePools";
import { CheckIcon, RedXIcon } from "../components/Icons";
import { depositSol, depositStake, withdrawSol, withdrawStake, stakePoolInfo } from '@solana/spl-stake-pool';
import { useSolBalance } from "../hooks/useSolBalance";

export function LiquidStakeDetail({ stakePool }: { stakePool: StakePool }) {
    const [amount, setAmount] = React.useState(0);
    const THEME = useCustomTheme();

    const nav = useNavigation();
    const publicKey = usePublicKey();
    const connection = useConnection();
    const solbalance = useSolBalance()

    const tokenBalances = useStakingTokenBalances();

    const balance = tokenBalances?.get(stakePool.tokenMint.toString())

    async function deposit(pool: StakePool, lamports: number) {
        //amount needs to be lamports
        // different logic if marinade need to be implemented

        const connection = new Connection("https://patient-aged-voice.solana-mainnet.quiknode.pro/bbaca28510a593ccd2b18cb59460f7a43a1f6a36/");
        // stakePoolInfo(connection, pool.poolPublicKey).then(console.log).catch(console.log);

        const recentBlockhash = await connection.getLatestBlockhash();
        const transaction = new Transaction({
            feePayer: publicKey,
            blockhash: recentBlockhash.blockhash,
            lastValidBlockHeight: recentBlockhash.lastValidBlockHeight
        });

        let stakePoolinstruction = await depositSol(connection, pool.poolPublicKey, publicKey, lamports);
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
        <View tw="text-bold px-2" style={{
            fontSize: "1rem",
            fontWeight: "bold",
            color: THEME.colors?.fontColor,
            display: "flex",
            flexDirection: "column"

        }}>
            <View tw="flex items-center mx-auto px-2 pt-4 text-center  w-4/5 cursor-pointer">
                <Image style={{ height: "50px", maxWidth: "unset", borderRadius: "999px" }} src={stakePool.tokenImageURL} />
                <Text tw="mx-auto px-1 text-lg">
                    {stakePool.poolName}
                </Text>
                <View tw="leading-none">
                    <Text tw="text-green-500 text-md">
                        {balance?.toFixed(2) || 0}
                    </Text>
                    <Text style={{ color: "#A9A9A9", fontSize: "1rem" }}>
                        {stakePool.tokenSymbol}
                    </Text>
                </View>
            </View>
            <View tw={`flex items-center mt-4`}>
                {stakePool.MEVDelegation ? <CheckIcon /> : <RedXIcon />}
                <Text tw="ml-2">
                    MEV Enabled
                </Text>

                <TextField onChange={(v) => setAmount(v.target.value)} />
            </View>

            <Button onClick={() => depositStake(connection, stakePool.poolPublicKey, amount)} tw="mt-4">Stake</Button>
            <Button tw="mt-4" onClick={() => deposit(stakePool, amount)}>Deposit</Button>
            {balance && balance > 0 &&
                <Button onClick={() => withdrawStake(connection, stakePool.poolPublicKey, amount)} tw="mt-4">Unstake</Button>}
        </View>
    )
}


