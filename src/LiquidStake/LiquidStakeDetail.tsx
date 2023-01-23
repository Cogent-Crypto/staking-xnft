
import { View, Text, List, Button, useNavigation, Image, useConnection, usePublicKey, TextField, Loading } from "react-xnft";
import { Connection, PublicKey, Transaction, LAMPORTS_PER_SOL, VersionedTransaction } from "@solana/web3.js";
import type { StakeAccount } from "../hooks/useStakeAccounts";
import type { Validator } from "../hooks/useValidators";
import React from "react";
import { useCustomTheme } from "../hooks/useCustomTheme";
import { useStakingTokenBalances } from '../hooks/useStakingTokenBalances';
import { StakePool } from "../hooks/useStakePools";
import { depositSol, depositStake, withdrawSol, withdrawStake, stakePoolInfo } from '@solana/spl-stake-pool';
import { publicKey } from '@project-serum/anchor/dist/cjs/utils';
import { useSolBalance } from '../hooks/useSolBalance';
import { Marinade } from "@marinade.finance/marinade-ts-sdk"
import { CheckIcon, RedXIcon } from "../components/Icons";
import { useDebounce } from '../hooks/useDebounce';
import { useTokens } from '../hooks/useTokenMetaData'


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
                <Text tw="mx-auto px-1 text-lg leading-none">
                    {stakePool.poolName}
                    <Text tw="text-green-500 text-sm">
                        {balance?.toFixed(2) || 0} {stakePool.tokenSymbol}
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
    const [stakeAmount, setStakeAmount] = React.useState(null);
    const [unStakeAmount, setUnStakeAmount] = React.useState(null);
    const [tabIndex, setTabIndex] = React.useState(0);
    const [selectedSwap, setSelectedSwap] = React.useState(null);

    const debouncedStakeAmount = useDebounce(stakeAmount, 500);
    const debouncedUnstakeAmount = useDebounce(unStakeAmount, 500);
    const marinade = new Marinade()

    const connection = new Connection("https://patient-aged-voice.solana-mainnet.quiknode.pro/bbaca28510a593ccd2b18cb59460f7a43a1f6a36/");

    async function submitTransaction(transaction: Transaction | VersionedTransaction) {
        try {
            await window.xnft.solana.sendAndConfirm(transaction)
        } catch (error) {
            console.log("failed to send stakepool txn:", JSON.stringify(transaction), error);
            return
        }
    }

    async function depositMarinadeTransaction(lamports): Promise<Transaction> {
        const {
            associatedMSolTokenAccountAddress,
            transaction,
        } = await marinade.deposit(lamports)
        return transaction
    }

    async function depositMarinade(lamports) {
        let txn = await depositMarinadeTransaction(lamports)
        submitTransaction(txn)
    }

    async function withdrawMarinadeTransaction(lamports): Promise<Transaction> {
        const {
            associatedMSolTokenAccountAddress,
            transaction,
        } = await marinade.liquidUnstake(lamports)
        // sign and send the `transaction`
        return transaction
    }

    async function withdrawMarinade(lamports) {
        let txn = await withdrawMarinadeTransaction(lamports)
        submitTransaction(txn)
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

    async function jupiterSwap(bestRoute) {
        const transactions = await (
            await fetch('https://quote-api.jup.ag/v4/swap', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    // route from /quote api
                    route: bestRoute,
                    // user public key to be used for the swap
                    userPublicKey: publicKey.toString(),
                    // auto wrap and unwrap SOL. default is true
                    wrapUnwrapSOL: true,
                    // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
                    // This is the ATA account for the output token where the fee will be sent to. If you are swapping from SOL->USDC then this would be the USDC ATA you want to collect the fee.
                    // feeAccount: "fee_account_public_key"  
                })
            })
        ).json()

        const { swapTransaction } = transactions

        const transaction = VersionedTransaction.deserialize(
            Buffer.from(swapTransaction, "base64")
        );

        submitTransaction(transaction)
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


    const handleDepositSwapPath = async () => {
        if (selectedSwap === "DIRECT") {
            depositSPLPool(stakePool, stakeAmount * LAMPORTS_PER_SOL)
        } else if (selectedSwap === "JUPITER") {
            jupiterSwap(bestRoute)
        }
    }

    const handleUnstakeSwapPath = async () => {
        if (selectedSwap === "DIRECT") {
            withdrawStake(connection, stakePool.poolPublicKey, publicKey, unStakeAmount)
        } else if (selectedSwap === "JUPITER") {
            jupiterSwap(bestRoute)
        }
    }

    return (
        <View tw={`flex flex-col h-full`}>
            <View tw={`flex text-center items-center mt-4 w-full justify-evenly `}>
                <View style={{ border: "solid", borderColor: THEME.colors?.bg2, backgroundColor: tabIndex == 0 ? THEME.colors?.bg2 : "#18181b", opacity: tabIndex == 0 ? 1 : .5 }} tw={`py-3 w-1/2 cursor-pointer rounded-l transition ease-linear`} onClick={() => setTabIndex(0)}>Stake</View>
                <View style={{ border: "solid", borderColor: THEME.colors?.bg2, backgroundColor: tabIndex == 1 ? THEME.colors?.bg2 : "#18181b", opacity: tabIndex == 1 ? 1 : .5 }} tw={`py-3 w-1/2 cursor-pointer rounded-r transition ease-linear`} onClick={() => setTabIndex(1)}>Unstake</View>
            </View>

            <View tw={`w-full mt-6 h-full`}>
                {
                    // STAKE TAB
                    tabIndex === 0 &&
                    <View tw={`w-full flex flex-col h-full`}>
                        <TextField value={stakeAmount} onChange={(v) => setStakeAmount(v.target.value)} />
                        <View tw={`flex items-baseline mt-2`}>
                            <View tw={`mr-auto`}>Balance: {(solBalance / LAMPORTS_PER_SOL).toFixed(3)} SOL</View><Button onClick={() => setStakeAmount(solBalance > 0 ? solBalance / LAMPORTS_PER_SOL - .05 : 0)} tw={`text-sm cursor-pointer`}>Max</Button>
                        </View>
                        <View tw={"mt-4"}>
                            <DirectStakeRoute setSelectedSwap={setSelectedSwap} active={selectedSwap === "DIRECT"} amount={stakeAmount} pool={stakePool} />
                            <BestMarketRoute pool={stakePool} setSelectedSwap={setSelectedSwap} active={selectedSwap === "JUPITER"} isLoading={isLoading} bestRoute={bestRoute} />
                        </View>
                        <Button disabled={true} onClick={handleDepositSwapPath} tw="mt-auto w-full mb-1">Stake SOL</Button>

                    </View>
                }
                {
                    // UNSTAKE TAB
                    tabIndex === 1 &&
                    <View tw={`w-full flex flex-col h-full`}>
                        <TextField value={unStakeAmount} onChange={(v) => setUnStakeAmount(v.target.value)} />
                        <View tw={`flex items-baseline mt-2`}>
                            <View tw={`mr-auto`}>Balance: {tokenBalance.toFixed(3)} {stakePool.tokenSymbol}</View><Button onClick={() => setUnStakeAmount(tokenBalance)} tw={`text-sm cursor-pointer`}>Max</Button>
                        </View>
                        <View tw={"mt-4"}>
                            <DirectStakeRoute pool={stakePool} setSelectedSwap={setSelectedSwap} active={selectedSwap === "DIRECT"} amount={unStakeAmount} isUnstake={true} />
                            <BestMarketRoute pool={stakePool} setSelectedSwap={setSelectedSwap} active={selectedSwap === "JUPITER"} isLoading={isLoading} bestRoute={bestRoute} />
                        </View>
                        <Button disabled={true} onClick={handleUnstakeSwapPath} tw="w-full mt-auto mb-1">Unstake</Button>
                    </View>
                }
            </View>
        </View >
    )
}

const DirectStakeRoute = ({ active, setSelectedSwap, amount, isUnstake = false, pool }: { pool: StakePool, isUnstake?: boolean, active: boolean, setSelectedSwap: any, amount: any }) => {
    const THEME = useCustomTheme()
    if (!amount) return null

    let displayAmount = amount * pool.exchangeRate * (1 - pool.solDepositFee)
    if (isUnstake) {
        displayAmount = amount / pool.exchangeRate * (1 - pool.solWithdrawalFee)
    }

    const routeText = isUnstake ? `${amount} ${pool.tokenSymbol} -> ${pool.poolName} -> ${displayAmount.toFixed(3)} SOL` : `${amount} SOL -> ${pool.poolName} -> ${displayAmount.toFixed(3)} ${pool.tokenSymbol}`

    return (
        <View tw={`relative p-3 mb-2 cursor-pointer rounded transition ease-linear`} style={{ border: "solid", borderColor: THEME.colors?.bg2, backgroundColor: THEME.colors?.bg2, opacity: active ? 1 : 0.5 }} onClick={() => setSelectedSwap("DIRECT")}>
            <View tw="absolute top-0 right-0 text-xs">Stake Pool</View>
            <View>
                {displayAmount.toFixed(3)}
                <View tw={`font-light text-sm`}>
                    {routeText}
                </View>
            </View>
        </View >
    )
}


const BestMarketRoute = ({ active, setSelectedSwap, bestRoute, isLoading }: { pool: StakePool, active: boolean, setSelectedSwap: any, bestRoute: any, isLoading: boolean }) => {
    const THEME = useCustomTheme()
    const tokensMap = useTokens();

    if (isLoading) {
        return (
            <View tw={`animate-pulse relative p-3 cursor-pointer rounded`} style={{ height: 72, border: "solid", borderColor: THEME.colors?.bg2, backgroundColor: THEME.colors?.bg2, opacity: active ? 1 : 0.5 }} onClick={() => setSelectedSwap("JUPITER")}>
                <View tw="animate-pulse absolute top-0 right-2 text-xs">Jupiter Swap</View>
            </View>
        )
    }

    if (!bestRoute?.marketInfos?.length) return null

    let inAmount = (bestRoute.inAmount / LAMPORTS_PER_SOL).toFixed(3)
    let outAmount = (bestRoute.outAmount / LAMPORTS_PER_SOL).toFixed(3)

    let stops = `${(bestRoute.marketInfos?.map((s: any) => tokensMap[s.inputMint].symbol)).join(" -> ")} -> `
    let outputMint = tokensMap[bestRoute.marketInfos[bestRoute.marketInfos?.length - 1].outputMint].symbol

    const routeText = `${inAmount} ${stops} ${outAmount} ${outputMint}`

    return (
        <View tw={`relative p-3 cursor-pointer rounded transition ease-linear`} style={{ border: "solid", borderColor: THEME.colors?.bg2, backgroundColor: THEME.colors?.bg2, opacity: active ? 1 : 0.5 }} onClick={() => setSelectedSwap("JUPITER")}>
            <View tw="absolute top-0 right-2 text-xs">Jupiter Swap</View>
            <View>
                {outAmount}
                <View tw={`font-light text-sm`}>
                    {routeText || ""}
                </View>
            </View>
        </View>
    )
}


