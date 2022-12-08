import { View, Text, Image, Button } from "react-xnft";
import React from "react";
import type { Validator } from "../hooks/useValidators";
import { useCustomTheme } from "../hooks/useCustomTheme";
import { ExpandIcon, LinkIcon } from "../components/Icons";


const SubTitle = ({ children }: { children: React.ReactNode }) => (
    <Text style={{ color: "#A9A9A9", fontSize: ".8rem" }}>
        {children}
    </Text>
);

const StatContainer = ({ children, ...rest }: { children: React.ReactNode, rest?: any | null }) => (
    <View tw="leading-none" {...rest}>
        {children}
    </View>
)

export function ValidatorInfo(validator: Validator) {
    const [expanded, setExpanded] = React.useState(false);
    const THEME = useCustomTheme();

    return (
        <View tw="text-bold px-2" style={{
            fontSize: "1rem",
            fontWeight: "bold",
            color: THEME.colors?.fontColor,
            margin: "auto",
            display: "flex",
            flexDirection: "column"
        }}>
            {validator.delinquent && <View tw="text-red-500">Validator is currently delinquent.</View>}
            <View onClick={() => setExpanded(!expanded)} tw="flex items-center px-2 pt-4 cursor-pointer ">
                <Image style={{ height: "35px", maxWidth: "unset", borderRadius: "999px" }} src={validator.image} />
                <Text tw="mx-auto px-1 text-lg">
                    {validator.name}
                </Text>
                <View tw="leading-none">
                    <Text tw="text-green-500">
                        {validator.apy_estimate}%
                    </Text>
                    <Text style={{ color: "#A9A9A9", fontSize: ".7rem" }}>
                        APY after
                    </Text>
                    <Text style={{ color: "#A9A9A9", fontSize: ".7rem" }}>
                        commission
                    </Text>
                </View>
            </View>

            <View tw="overflow-hidden" style={{ maxHeight: expanded ? "400px" : "0", transition: "max-height 0.5s linear" }}>
                <View tw="grid grid-cols-2 mx-auto mt-4 gap-y-4">
                    <StatContainer>
                        <Text style={{ fontSize: "1rem" }}>
                            {parseInt(validator.activated_stake).toLocaleString()}
                        </Text>
                        <SubTitle>Total Sol Staked</SubTitle>
                    </StatContainer>
                    <StatContainer>
                        <Text style={{ fontSize: "1rem" }}>
                            {validator.skip_rate.toFixed(2)}%
                        </Text>
                        <SubTitle>Skip Rate</SubTitle>
                    </StatContainer>
                    <StatContainer>
                        <Text style={{ fontSize: "1rem" }}>
                            {validator.commission.toFixed(2)}%
                        </Text>
                        <SubTitle>Commission</SubTitle>
                    </StatContainer>
                    <StatContainer tw="cursor-pointer" onClick={() => window.xnft.openWindow(`https://stakewiz.com/validator/${validator.vote_identity}`)}>
                        <LinkIcon tw="mx-auto h-{4.5} -mt-2" />
                        <SubTitle>StakeWiz Profile</SubTitle>
                    </StatContainer>
                </View>
                {validator.website &&
                    <View tw="my-2 cursor-pointer hover:underline" onClick={() => window.xnft.openWindow(validator.website)}>
                        <Text style={{ fontSize: ".8rem" }}>{validator.website}</Text>
                    </View>
                }
                <View tw="my-1 px-1">
                    <Text style={{ fontSize: ".8rem" }}>{validator.description}</Text>
                </View>
            </View>
            <View onClick={() => setExpanded(!expanded)} tw="w-6 mx-auto cursor-pointer">
                <ExpandIcon expanded={expanded} />
            </View>

        </View >
    )
}