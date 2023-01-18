
import { View, Text, List, Button, useNavigation, Image, useConnection, usePublicKey } from "react-xnft";
import type { Connection, PublicKey } from "@solana/web3.js";
import type { StakeAccount } from "../hooks/useStakeAccounts";
import type { Validator } from "../hooks/useValidators";
import React from "react";
import { useState } from "react";
import { useEpochInfo } from "../hooks/useEpochInfo";
import { useCustomTheme } from "../hooks/useCustomTheme";
import { StakePool } from "../hooks/useStakePools";

export function LiquidStakeDetail({ stakePool }: { stakePool: StakePool }) {
    const THEME = useCustomTheme();

    const nav = useNavigation();
    const publicKey = usePublicKey();
    const connection = useConnection();

    return (
        <View style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <View style={{ flex: 1 }}>
                {stakePool.poolName}
            </View>
        </View >
    )
}


