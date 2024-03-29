import { View, Text, Image, Button } from "react-xnft";
import React from "react";
import type { Validator } from "../hooks/useValidators";
import { useCustomTheme } from "../hooks/useCustomTheme";
import { ExpandIcon, LinkIcon, CheckIcon, RedXIcon} from "./Icons";


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
        <View tw="text-bold px-2 text-center" style={{
            fontSize: "1rem",
            fontWeight: "bold",
            color: THEME.colors?.fontColor,
            margin: "auto",
            display: "flex",
            flexDirection: "column"

        }}>
            {validator.commission_rugger && <View tw="text-red-500">Validator is manipulating commissions!</View>}
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
                <View tw="grid grid-cols-3 mx-auto mt-4 gap-y-4">
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
                    <StatContainer tw="cursor-pointer" onClick={() => window.xnft.openWindow(`https://stakewiz.com/validator/${validator.vote_identity}`)}>
                        <LinkIcon lightMode={THEME.colors?.lightMode} tw="mx-auto h-{4.5} -mt-2" />
                        <SubTitle>Stakewiz Profile</SubTitle>
                    </StatContainer>
                    <StatContainer>
                        <Text style={{ fontSize: "1rem" }}>
                            {validator.commission.toFixed(2)}%
                        </Text>
                        <SubTitle>Commission</SubTitle>
                    </StatContainer>
                    <StatContainer>
                        <Text style={{ fontSize: "1rem" }}>
                            {validator.mev_commission != null ? `${validator.mev_commission}%` : "N/A"}
                        </Text>
                        <SubTitle>MEV Commission</SubTitle>
                    </StatContainer>
                    <StatContainer>
                        <View tw="pl-10 -mt-4">
                            {validator.mev_commission != null ? 
                            <CheckIcon /> : <RedXIcon />}
                        </View>
                        <SubTitle>MEV Support</SubTitle>
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
                <ExpandIcon lightMode={THEME.colors?.lightMode} expanded={expanded} />
            </View>

        </View >
    )
}