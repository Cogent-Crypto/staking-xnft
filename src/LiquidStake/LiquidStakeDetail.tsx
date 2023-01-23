
import { View, Text, List, Button, useNavigation, Image, useConnection, usePublicKey, TextField } from "react-xnft";
import { Connection, PublicKey, Transaction, LAMPORTS_PER_SOL } from "@solana/web3.js";
import type { StakeAccount } from "../hooks/useStakeAccounts";
import type { Validator } from "../hooks/useValidators";
import React from "react";
import { useCustomTheme } from "../hooks/useCustomTheme";
import { useStakingTokenBalances } from '../hooks/useStakingTokenBalances';
import { StakePool } from "../hooks/useStakePools";
import { depositSol, depositStake, withdrawSol, withdrawStake, stakePoolInfo} from '@solana/spl-stake-pool';
import { publicKey } from '@project-serum/anchor/dist/cjs/utils';
import { useSolBalance } from '../hooks/useSolBalance';
import {MarinadeMint} from "@marinade.finance/marinade-ts-sdk"
import { CheckIcon, RedXIcon } from "../components/Icons";


export function LiquidStakeDetail({ stakePool }: { stakePool: StakePool }) {
    const tokenBalances = useStakingTokenBalances();

    const balance = tokenBalances?.get(stakePool.tokenMint.toString())

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
            {/* <View tw={`flex items-center mt-4`}>
                {stakePool.MEVDelegation ? <CheckIcon /> : <RedXIcon />}
                <Text tw="ml-2">
                    MEV Enabled
                </Text>

            </View> */}



            <TabLayout solbalance={solbalance} tokenBalance={balance} />
            {/* <View tw={`flex items-center mt-4`}>
                <TextField onChange={(v) => setAmount(v.target.value)} />
                <Button onClick={() => depositStake(connection, stakePool.poolPublicKey, amount)} tw="mt-4">Stake</Button>
            </View>
            <Button tw="mt-4" onClick={() => deposit(stakePool, amount)}>Deposit</Button>

            {balance && balance > 0 &&
            <Button onClick={() => withdrawStake(connection, stakePool.poolPublicKey, amount)} tw="mt-4">Unstake</Button>} */}
        </View>
    )
}

const TabLayout = ({ tokenBalance, solbalance }) => {
    const THEME = useCustomTheme();
    const [stakeAmount, setStakeAmount] = React.useState(solbalance);
    const [unStakeAmount, setUnStakeAmount] = React.useState(tokenBalance);

    const [tabIndex, setTabIndex] = React.useState(0);

    return (
        <View>
            <View tw={`flex text-center items-center mt-4 w-full justify-evenly `}>
                <View style={{ border: "solid", borderColor: THEME.colors?.bg2, backgroundColor: tabIndex == 0 ? THEME.colors?.bg2 : "#18181b", opacity: tabIndex == 0 ? 1 : .5 }} tw={`py-3 w-1/2 cursor-pointer rounded-l transition ease-linear`} onClick={() => setTabIndex(0)}>Stake</View>
                <View style={{ border: "solid", borderColor: THEME.colors?.bg2, backgroundColor: tabIndex == 1 ? THEME.colors?.bg2 : "#18181b", opacity: tabIndex == 1 ? 1 : .5 }} tw={`py-3 w-1/2 cursor-pointer rounded-r transition ease-linear`} onClick={() => setTabIndex(1)}>Unstake</View>
            </View>

            <View tw={`w-full flex flex-col items-center mt-6 h-full`}>
                {
                    tabIndex === 0 &&
                    <View tw={`w-full`}>
                        <TextField value={stakeAmount} onChange={(v) => setStakeAmount(v.target.value)} />
                        <View tw={`flex items-baseline mt-2`}>
                            <View tw={`mr-auto`}>Balance: {solbalance / LAMPORTS_PER_SOL} SOL</View><Button onClick={() => setStakeAmount(solbalance / LAMPORTS_PER_SOL - .05)} tw={`text-sm cursor-pointer`}>Max</Button>
                        </View>
                        <Button onClick={() => depositStake(connection, stakePool.poolPublicKey, amount)} tw="mt-60 w-full">Stake SOL</Button>
                    </View>
                }
                {
                    tabIndex === 1 &&
                    <View tw={`w-full h-full`}>
                        <TextField value={unStakeAmount} onChange={(v) => setUnStakeAmount(v.target.value)} />
                        <View tw={`flex items-baseline mt-2`}>
                            <View tw={`mr-auto`}>Balance: {tokenBalance} SOL</View><Button onClick={() => setUnStakeAmount(tokenBalance)} tw={`text-sm cursor-pointer`}>Max</Button>
                        </View>
                        <Button onClick={() => withdrawStake(connection, stakePool.poolPublicKey, amount)} tw="mt-60 w-full">Unstake</Button>
                    </View>
                }
            </View>
        </View >
    )
}


