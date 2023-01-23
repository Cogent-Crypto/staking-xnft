import React from "react";
import { View, Text, Image, useNavigation } from "react-xnft";
import { useCustomTheme } from "../hooks/useCustomTheme";
import { useStakePools, StakePool } from "../hooks/useStakePools"
import { useStakingTokenBalances } from '../hooks/useStakingTokenBalances';
import { LoadingScreen } from "../components/LoadingScreen";
import { stakePoolInfo } from '@solana/spl-stake-pool';

export const LiquidStakeAccountsScreen = () => {
    const THEME = useCustomTheme();
    const nav = useNavigation();
    const stakePools = useStakePools();
    const tokenBalances = useStakingTokenBalances();
    
    if (!tokenBalances) {
        return <LoadingScreen />
    }
    return (
        <View tw={`grid grid-cols-2`}>
            {stakePools.sort((a,b) => tokenBalances[a.poolPublicKey.toString()] - tokenBalances[b.poolPublicKey.toString()] ).map((pool: StakePool) => {
                return (
                    <View
                        style={{ padding: "4px", paddingTop: "3px", paddingBottom: "3px", minHeight: "100px" }}
                        key={pool.tokenMint}
                        onClick={() => nav.push("liquidstakedetail", { stakePool: pool })}
                    >
                        <View
                            tw={`flex flex-col`}
                            style={{
                                backgroundColor: THEME.colors?.bg2,
                                height: "100%",
                                cursor: "pointer",
                                width: "100%",
                                padding: "3px",
                                paddingTop: "4px",
                                paddingBottom: "4px",
                                borderRadius: "5px",
                            }}
                        >
                            <View tw={`flex items-center`}>
                                <Image
                                    tw={`mr-2`}
                                    src={pool.tokenImageURL}
                                    style={{ height: "40px", borderRadius: "9999px" }}
                                ></Image>
                                <View tw={`text-white text-center`}>
                                    {pool.poolName}
                                </View>
                            </View>
                            <View style={{ paddingLeft: "4px", paddingTop: "3px", marginTop: "auto" }}>
                                <Text tw={`font-light opacity-75`}>
                                    {Math.round(pool.apy * 100)/100}% APY
                                </Text>
                            </View>
                            <View style={{ paddingLeft: "4px", paddingTop: "3px", marginTop: "auto" }}>
                                <Text tw={`font-light opacity-75`}>
                                    {tokenBalances?.get(pool.tokenMint.toString())?.toFixed(2) || 0} {pool.tokenSymbol}
                                </Text>
                            </View>
                        </View>
                    </View>
                )
            })}
        </View>
    )
}
