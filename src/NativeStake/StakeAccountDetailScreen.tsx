
import { View, Text, Button, useNavigation, Image } from "react-xnft";
import type { StakeAccount } from "../hooks/useStakeAccounts";
import { ValidatorInfo } from "../components/ValidatorInfo";
import { StakeAccountDetail } from "../components/StakeAccountDetail";
import type { Validator } from "../hooks/useValidators";
import React from "react";
import { prettifyAddress } from "../utils";



export function StakeAccountDetailScreen({stakeAccount, validator} : {stakeAccount: StakeAccount, validator: Validator}) {
    console.log("StakeAccountDetailScreen", stakeAccount, validator);
    const nav = useNavigation();
    return (
        <View> 
            <StakeAccountDetail stakeAccount={stakeAccount} validator={validator} />
            
            <Button>Instant Unstake</Button>
            <Button>Delayed Unstake</Button>
            <Button onClick={() => {nav.push("send", {stakeAccount, validator})}} >Send</Button>
            <Button>Merge</Button>
            <Button>Split</Button> 

        </View>

    )
}

