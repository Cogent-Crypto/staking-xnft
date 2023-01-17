import { View, Text, Image } from "react-xnft";
import { useCustomTheme } from "../hooks/useCustomTheme";
import { stakePools, StakePool } from "../hooks/useStakePools"

export const LiquidStaking = () => {
    const THEME = useCustomTheme();

    return (
        <View style={{ height: "100%" }}>
            <View>
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: THEME.colors?.secondary,
                        textAlign: "center",
                    }}
                >
                    Liquid Staking
                </Text>
                <View tw={`grid grid-cols-2`}>
                    {stakePools.map((pool: StakePool) => {
                        return (
                            <View
                                style={{ padding: "4px", paddingTop: "3px", paddingBottom: "3px", minHeight: "100px" }}
                                key={pool.tokenMint}
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
                                        <Text tw={`font-light`}>
                                            3 {pool.tokenSymbol}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )
                    })}
                </View>
            </View >
        </View >
    )
}
