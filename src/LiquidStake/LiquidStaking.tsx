import React from "react";
import { View, Text, Image, useNavigation, Stack } from "react-xnft";
import { useCustomTheme } from "../hooks/useCustomTheme";
import { stakePools, StakePool } from "../hooks/useStakePools"
import { useStakingTokenBalances } from '../hooks/useStakingTokenBalances';

export const LiquidStakeAccountsScreen = () => {
    const THEME = useCustomTheme();
    const nav = useNavigation();
    const tokenBalances = useStakingTokenBalances();

    return (
        <View tw={`grid grid-cols-2`}>
            {stakePools.map((pool: StakePool) => {
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
                                    {tokenBalances?.get(pool.tokenMint.toString())} {pool.tokenSymbol}
                                </Text>
                            </View>
                        </View>
                    </View>
                )
            })}
        </View>
    )
}