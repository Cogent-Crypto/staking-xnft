import { Text, View } from "react-xnft";
import React from "react";
import type { StakeAccount } from "../hooks/useStakeAccounts";
import type { Validator } from "../hooks/useValidators";
import { prettifyAddress } from "../utils";
import { ValidatorInfo } from "../components/ValidatorInfo";

export function StakeAccountDetail({stakeAccount, validator} : {stakeAccount: StakeAccount, validator: Validator}) {
    console.log("StakeAccountDetailScreen", stakeAccount, validator);
    return (
        <View style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
        }}> 
            <Text>
                {prettifyAddress(stakeAccount.accountAddress.toString(), 4)}
            </Text>
            <Text>
                {(Math.round(stakeAccount.stakeSol*100)/100).toLocaleString()} Sol Staked
            </Text>
            <ValidatorInfo {...validator} />
        </View>

    )
}