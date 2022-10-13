
import { View, Text, Button, useNavigation } from "react-xnft";
import type { stakeAccount } from "../hooks/useStakeAccounts";
import React from "react";


export function StakeAccountDetailScreen(stakeAccount: stakeAccount) {
    const nav = useNavigation();
    return (
        <View style={{ height: "100%" }}>
            <Text>{JSON.stringify(stakeAccount, null, 2)}</Text>
            <Button>Instant Unstake</Button>
            <Button>Delayed Unstake</Button>
            <Button onClick={() => {nav.push("send", stakeAccount)}} >Send</Button>
            <Button>Merge</Button>

        </View>

    )
}