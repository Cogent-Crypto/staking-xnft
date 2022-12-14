import { Text, View, Image } from "react-xnft";
import React from "react";
import type { StakeAccount } from "../hooks/useStakeAccounts";
import type { Validator } from "../hooks/useValidators";
import { ValidatorInfo } from "../components/ValidatorInfo";
import { useCustomTheme, statusColor } from "../hooks/useCustomTheme";
import { LinkIcon } from "./Icons";
import { StakeRewardHistory } from "./StakeRewardHistory";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const SubTitle = ({ children }: { children: React.ReactNode }) => (
    <Text style={{ color: "#A9A9A9", fontSize: ".8rem" }}>
        {children}
    </Text>
);

const StatContainer = ({ children }: { children: React.ReactNode }) => (
    <Text tw="leading-none">
        {children}
    </Text>
)

export function StakeAccountDetail({
    stakeAccount,
    validator,
}: {
    stakeAccount: StakeAccount;
    validator: Validator;
}) {
    const THEME = useCustomTheme();
    console.log("theme", THEME);
    // console.log("StakeAccountDetailScreen", stakeAccount, validator);
    const stakeAccountRent = stakeAccount.excessLamports;
    const onClick = () => {
        window.xnft.openWindow(
            "https://solscan.io/account/" + stakeAccount.accountAddress.toString()
        );
    };
    return (
        <View
            style={{
                fontSize: 20,
                fontWeight: "bold",
                textAlign: "center",
            }}
        >
            <ValidatorInfo {...validator} />

            <View
                tw="font-medium text-lg cursor-pointer mt-4 mb-2 flex items-center justify-center gap-x-2"
                style={{ color: THEME.colors?.secondary }}
                onClick={onClick}
            >
                Stake Account
                <LinkIcon lightMode={THEME.colors?.lightMode} />
            </View>
            <View tw="grid grid-cols-3">
                <StatContainer>
                    <Text style={{ fontSize: "1rem" }}>
                        {(Math.round(stakeAccount.stakeSol * 1000) / 1000).toLocaleString()}
                    </Text>
                    <SubTitle>Sol Staked</SubTitle>
                </StatContainer>
                <StatContainer>
                    <Text style={{ fontSize: "1rem" }}>
                        {stakeAccountRent / LAMPORTS_PER_SOL}
                    </Text>
                    <SubTitle>Claimable MEV Rewards</SubTitle>
                </StatContainer>
                <StatContainer>
                    <Text
                        style={{
                            fontSize: "1rem",
                            color: statusColor(stakeAccount.status),
                        }}
                    >
                        {stakeAccount.status}
                    </Text>
                    <SubTitle>Status</SubTitle>
                </StatContainer>
            </View>
            <StakeRewardHistory stakeAccountPK={stakeAccount.accountAddress} />
        </View>
    );
}
