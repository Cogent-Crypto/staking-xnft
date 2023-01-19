
import { View, Text, useNavigation, Image, useConnection, usePublicKey, Button } from "react-xnft";
import type { Connection, PublicKey } from "@solana/web3.js";
import React from "react";
import { useCustomTheme } from "../hooks/useCustomTheme";
import { useStakingTokenBalances } from '../hooks/useStakingTokenBalances';
import { StakePool } from "../hooks/useStakePools";
import { CheckIcon, RedXIcon } from "../components/Icons";

export function LiquidStakeDetail({ stakePool }: { stakePool: StakePool }) {
    const THEME = useCustomTheme();

    const nav = useNavigation();
    const publicKey = usePublicKey();
    const connection = useConnection();

    const tokenBalances = useStakingTokenBalances();

    const balance = tokenBalances?.get(stakePool.tokenMint.toString())

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

                <Button tw="mt-4">Stake</Button>
                <Button tw="mt-4">Unstake</Button>
            </View>
        </View>
    )
}


