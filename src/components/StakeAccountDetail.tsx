import { Text, View, Image } from "react-xnft";
import React from "react";
import type { StakeAccount } from "../hooks/useStakeAccounts";
import type { Validator } from "../hooks/useValidators";
import { prettifyAddress } from "../utils";
import { ValidatorInfo } from "../components/ValidatorInfo";
import { useCustomTheme, statusColor } from "../hooks/useCustomTheme";
import { LinkIcon } from "./Icons";
import { StakeRewardHistory } from "./StakeRewardHistory";

const SubTitle = ({ children }: { children: React.ReactNode }) => (
    <Text style={{ color: "#A9A9A9", fontSize: ".8rem", lineHeight: 0.2 }}>
        {children}
    </Text>
)

export function StakeAccountDetail({ stakeAccount, validator }: { stakeAccount: StakeAccount, validator: Validator }) {
    console.log("StakeAccountDetailScreen", stakeAccount, validator);

    const onClick = () => {
        window.xnft.openWindow("https://solscan.io/account/" + stakeAccount.accountAddress.toString());
    }
    return (
        <View style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
        }}>
            <ValidatorInfo {...validator} />

            <View tw="grid grid-cols-2 mx-auto mt-4 gap-y-4">
                <View>
                    <Text style={{ fontSize: "1.5rem" }} >
                        {parseInt(validator.activated_stake).toLocaleString()}
                    </Text>
                    <SubTitle>
                        Total Sol Staked
                    </SubTitle>
                </View>
                <View>
                    <Text style={{ fontSize: "1.5rem" }} >
                        {validator.apy_estimate}%
                    </Text>
                    <SubTitle>
                        APY
                    </SubTitle>
                </View>
                <View>
                    <Text style={{ fontSize: "1.5rem" }} >
                        {validator.skip_rate.toFixed(2)}%
                    </Text>
                    <SubTitle>
                        Skip Rate
                    </SubTitle>
                </View>
                <View>
                    <Text style={{ fontSize: "1.5rem" }} >
                        {validator.commission}%
                    </Text>
                    <SubTitle>
                        Commission
                    </SubTitle>
                </View>
            </View>
            <View tw="font-medium cursor-pointer mt-12 flex items-center justify-center gap-x-2" onClick={onClick}>
                Stake Account
                {/* {prettifyAddress(stakeAccount.accountAddress.toString(), 4)} */}
                <LinkIcon />
            </View>
            <View tw="grid grid-cols-2">
                <View>
                    <Text style={{ fontSize: "1.5rem" }}>
                        {(Math.round(stakeAccount.stakeSol * 1000) / 1000).toLocaleString()}
                    </Text>
                    <SubTitle>
                        Sol Staked
                    </SubTitle>
                </View>
                <View>
                    <Text style={{
                        fontSize: "1.5rem",
                        color: statusColor(stakeAccount.status)
                    }}>
                        {stakeAccount.status}
                    </Text>
                    <SubTitle>
                        Status
                    </SubTitle>
                </View>
            </View>
            <StakeRewardHistory stakeAccountPK={stakeAccount.accountAddress} />
        </View>
    )
}