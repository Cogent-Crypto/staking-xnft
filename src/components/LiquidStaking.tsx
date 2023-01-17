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

                                        <Text tw={`font-white`}>
                                            {pool.tokenSymbol}
                                        </Text>
                                    </View>
                                    {/* <View style={{ paddingLeft: "4px", paddingTop: "3px" }}>
                                        <View style={{ display: "flex", justifyContent: "space-between", marginTop: "-3px" }}>
                                            <Text >
                                                {pool.apy} APY
                                            </Text>
                                        </View>
                                    </View> */}
                                </View>
                            </View>
                        )
                    })}
                </View>
            </View>
        </View>
    )
}
