
import { View, Text, List, Button, useNavigation, Image, useConnection, usePublicKey, TextField } from "react-xnft";
import { Connection, PublicKey, Transaction, LAMPORTS_PER_SOL } from "@solana/web3.js";
import type { StakeAccount } from "../hooks/useStakeAccounts";
import type { Validator } from "../hooks/useValidators";
import React from "react";
import { useCustomTheme } from "../hooks/useCustomTheme";
import { useStakingTokenBalances } from '../hooks/useStakingTokenBalances';
import { StakePool } from "../hooks/useStakePools";
import { depositSol, depositStake, withdrawSol, withdrawStake, stakePoolInfo } from '@solana/spl-stake-pool';
import { publicKey } from '@project-serum/anchor/dist/cjs/utils';
import { useSolBalance } from '../hooks/useSolBalance';
import { MarinadeMint } from "@marinade.finance/marinade-ts-sdk"
import { CheckIcon, RedXIcon } from "../components/Icons";
import { useDebounce } from '../hooks/useDebounce';


export function LiquidStakeDetail({ stakePool }: { stakePool: StakePool }) {
    const tokenBalances = useStakingTokenBalances();
    const [bestRoute, setBestRoute] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

    const balance = tokenBalances?.get(stakePool.tokenMint.toString())

    const THEME = useCustomTheme();


    const nav = useNavigation();
    const publicKey = usePublicKey();
    // const connection = useConnection();

    const getJupiterRoute = async (inputMint: string, outPutMint: string, amount: number) => {
        amount = amount * 1000000000;

        setIsLoading(true);
        const { data } = await (
            await fetch(`https://quote-api.jup.ag/v4/quote?inputMint=${inputMint}&outputMint=${outPutMint}&amount=${amount}&slippageBps=50`)
        ).json()

        setIsLoading(false);

        setBestRoute(data[0])
    }

    return (
        <View tw="text-bold px-2 h-full" style={{
            fontSize: "1rem",
            fontWeight: "bold",
            color: THEME.colors?.fontColor,
            display: "flex",
            flexDirection: "column"
        }}>
            <View tw="flex items-center mx-auto px-2 pt-4 text-center  w-4/5 cursor-pointer">
                <Image style={{ height: "50px", maxWidth: "unset", borderRadius: "999px" }} src={stakePool.tokenImageURL} />
                <Text tw="mx-auto px-1 text-lg mb--1">
                    {stakePool.poolName}
                    <Text tw="text-green-500 text-md">
                        {balance?.toFixed(2) || 0}
                    </Text>
                </Text>
                <View tw="leading-none">
                    <Text tw="text-green-500 text-md">
                        {/* {balance?.toFixed(2) || 0} */}
                        {/* {stakePool?.apy || 0} */}
                        {Math.round(stakePool.apy * 100) / 100}%
                    </Text>
                    <Text style={{ color: "#A9A9A9", fontSize: "1rem" }}>
                        APY
                        {/* {stakePool.tokenSymbol} */}
                    </Text>
                </View>
            </View>
            {/* <View tw={`flex items-center mt-4`}>
                {stakePool.MEVDelegation ? <CheckIcon /> : <RedXIcon />}
                <Text tw="ml-2">
                    MEV Enabled
                </Text>

            </View> */}



            <TabLayout setBestRoute={setBestRoute} isLoading={isLoading} bestRoute={bestRoute} getJupiterRoute={getJupiterRoute} tokenBalance={balance} stakePool={stakePool} />
        </View>
    )
}

const TabLayout = ({ isLoading, setBestRoute, bestRoute, getJupiterRoute, tokenBalance, stakePool }: { setBestRoute: any, isLoading: boolean, bestRoute: any, getJupiterRoute: (inputMint: String, outPutMint: String, amount: number) => any, tokenBalance: any, stakePool: StakePool }) => {
    const solBalance = useSolBalance();

    const THEME = useCustomTheme();
    const publicKey = usePublicKey();
    const [stakeAmount, setStakeAmount] = React.useState(solBalance);
    const [unStakeAmount, setUnStakeAmount] = React.useState(tokenBalance);
    const [tabIndex, setTabIndex] = React.useState(0);

    const debouncedStakeAmount = useDebounce(stakeAmount, 500);
    const debouncedUnstakeAmount = useDebounce(unStakeAmount, 500);


    const connection = new Connection("https://patient-aged-voice.solana-mainnet.quiknode.pro/bbaca28510a593ccd2b18cb59460f7a43a1f6a36/");

    async function submitTransaction(transaction: Transaction) {
        try {
            await window.xnft.solana.sendAndConfirm(transaction)
        } catch (error) {
            console.log("failed to send stakepool txn:", JSON.stringify(transaction), error);
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
        let stakePoolinstruction = await withdrawSol(connection, pool.poolPublicKey, publicKey, publicKey, lamports)
        transaction.add(...stakePoolinstruction.instructions);
        return transaction
    }

    async function withdrawSolSPL(pool: StakePool, lamports: number) {
        let txn = await withdrawSolSPLTransaction(pool, lamports)
        submitTransaction(txn)
    }

    async function withdrawStakeSPLTransaction(pool: StakePool, lamports: number): Promise<Transaction> {
        const recentBlockhash = await connection.getLatestBlockhash();
        const transaction = new Transaction({
            feePayer: publicKey,
            blockhash: recentBlockhash.blockhash,
            lastValidBlockHeight: recentBlockhash.lastValidBlockHeight
        });
        let stakePoolinstruction = await withdrawStake(connection, stakePool.poolPublicKey, publicKey, lamports,)
        transaction.add(...stakePoolinstruction.instructions)
        transaction.partialSign(stakePoolinstruction.signers[0]);
        return transaction
    }

    async function withdrawStakeSPL(pool: StakePool, lamports: number) {
        let txn = await withdrawStakeSPLTransaction(pool, lamports)
        submitTransaction(txn)
    }

    async function depositSPLPoolTransaction(pool: StakePool, lamports: number) {
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
        return transaction
    }

    async function depositSPLPool(pool: StakePool, lamports: number) {
        //amount needs to be lamports
        // different logic if marinade need to be implemented
        console.log("depositing", lamports)
        let txn = await depositSPLPoolTransaction(pool, lamports)
        submitTransaction(txn);
    }


    React.useEffect(() => {
        if (tabIndex === 0) {
            if (!stakeAmount) {
                setBestRoute(null)
                return
            }

            getJupiterRoute("So11111111111111111111111111111111111111112", stakePool.tokenMint, stakeAmount)
        }
        if (tabIndex === 1) {
            if (!unStakeAmount) {
                setBestRoute(null)
                return
            }

            getJupiterRoute(stakePool.tokenMint, "So11111111111111111111111111111111111111112", unStakeAmount)
        }
    }, [tabIndex, debouncedStakeAmount, debouncedUnstakeAmount])

    return (
        <View tw={`flex flex-col h-full`}>
            <View tw={`flex text-center items-center mt-4 w-full justify-evenly `}>
                <View style={{ border: "solid", borderColor: THEME.colors?.bg2, backgroundColor: tabIndex == 0 ? THEME.colors?.bg2 : "#18181b", opacity: tabIndex == 0 ? 1 : .5 }} tw={`py-3 w-1/2 cursor-pointer rounded-l transition ease-linear`} onClick={() => setTabIndex(0)}>Stake</View>
                <View style={{ border: "solid", borderColor: THEME.colors?.bg2, backgroundColor: tabIndex == 1 ? THEME.colors?.bg2 : "#18181b", opacity: tabIndex == 1 ? 1 : .5 }} tw={`py-3 w-1/2 cursor-pointer rounded-r transition ease-linear`} onClick={() => setTabIndex(1)}>Unstake</View>
            </View>

            <View tw={`w-full mt-6 h-full`}>
                {
                    tabIndex === 0 &&
                    <View tw={`w-full flex flex-col h-full`}>
                        <TextField value={stakeAmount} onChange={(v) => setStakeAmount(v.target.value)} />
                        <View tw={`flex items-baseline mt-2`}>
                            <View tw={`mr-auto`}>Balance: {solBalance / LAMPORTS_PER_SOL} SOL</View><Button onClick={() => setStakeAmount(solBalance / LAMPORTS_PER_SOL - .05)} tw={`text-sm cursor-pointer`}>Max</Button>
                        </View>
                        {bestRoute && (
                            <View>
                                {isLoading ? "Fetching Best Route" :
                                    <View>
                                        Best Route: {bestRoute.outAmount / LAMPORTS_PER_SOL}
                                    </View>
                                }
                            </View>
                        )}
                        <Button onClick={() => depositSPLPool(stakePool, stakeAmount * LAMPORTS_PER_SOL)} tw="mt-auto w-full mb-1">Stake SOL</Button>

                    </View>
                }
                {
                    tabIndex === 1 &&
                    <View tw={`w-full flex flex-col h-full`}>
                        <TextField value={unStakeAmount} onChange={(v) => setUnStakeAmount(v.target.value)} />
                        <View tw={`flex items-baseline mt-2`}>
                            <View tw={`mr-auto`}>Balance: {tokenBalance} {stakePool.tokenSymbol}</View><Button onClick={() => setUnStakeAmount(tokenBalance)} tw={`text-sm cursor-pointer`}>Max</Button>
                        </View>

                        {bestRoute && (
                            <View>
                                {isLoading ? "Fetching Best Route" :
                                    <View>
                                        Best Route: {bestRoute.outAmount / LAMPORTS_PER_SOL}
                                    </View>
                                }
                            </View>
                        )}

                        <Button onClick={() => withdrawStake(connection, stakePool.poolPublicKey, publicKey, unStakeAmount)} tw="w-full mt-auto mb-1">Unstake</Button>
                    </View>
                }
            </View>
        </View >
    )
}


