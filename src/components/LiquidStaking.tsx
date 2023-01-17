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
                {stakePools.map((pool: StakePool) => {
                    return (
                        <View tw="flex">
                            <Image style={{ maxHeight: 20 }} src={pool.tokenImageURL} />
                            <Text>{pool.poolName}</Text>
                        </View>
                    )
                })}
            </View>
        </View>
    )
}
