
import { View, FlatList as List, Button, Image } from "react-native";
import { usePublicKey, useSolanaConnection as useConnection, } from "../hooks/xnft-hooks";
import { useNavigation } from '@react-navigation/native';


import type { Connection, PublicKey } from "@solana/web3.js";
import { StakeProgram, Transaction } from "@solana/web3.js";
import type { StakeAccount } from "../hooks/useStakeAccounts";
import { stakeAccountCacheKey } from "../hooks/useStakeAccounts";
import { StakeAccountDetail } from "../components/StakeAccountDetail";
import type { Validator } from "../hooks/useValidators";
import React from "react";
import { useState } from "react";
import tw from "twrnc";
import { useEpochInfo } from "../hooks/useEpochInfo";

import { useCustomTheme } from "../hooks/useCustomTheme";

export function StakeAccountDetailScreen({ stakeAccount, validator, mergableStakeAccounts }: { stakeAccount: StakeAccount, validator: Validator, mergableStakeAccounts: StakeAccount[] }) {
    const [expanded, setExpanded] = useState(false)
    const THEME = useCustomTheme();

    const nav = useNavigation();
    const publicKey = usePublicKey();
    const connection = useConnection();
    const epochInfo = useEpochInfo();

    console.log(publicKey)

    const ListChildren = () => {
        let buttons: any[] = [];
        const claimMevButton = <Button key={"claimMev"} onPress={() => claimMev(stakeAccount, publicKey, connection, nav)} title="Claim Mev" />
        const unstakeButton = <Button key={"instantunstake"} onPress={() => { nav.push("instantunstake", { stakeAccount }) }} title="Instant Unstake" />
        const deactivateUnstakeButton = <Button key={"deactivateunstake"} onPress={() => { deactivateStake(stakeAccount, publicKey, connection, nav) }} title={`Unstake (Availble to withdraw in ${epochInfo?.remaining_dhm})`} />
        const withdrawButton = <Button key={"withdraw"} onPress={() => withdrawStake(stakeAccount, publicKey, connection, nav)} title={"Withdraw"} />
        const redelegateButton = <Button key={"inactive"} onPress={() => { nav.push("selectvalidator", { onSelectScreen: "redelegate", data: stakeAccount }) }} title={"Redelegate"} />
        const sendButton = <Button key={"send"} onPress={() => { nav.push("send", { stakeAccount, validator }) }} title={"Send"} />
        const mergeButton = <Button onPress={() => { console.log("merge"); nav.push("merge", { stakeAccount, validator, mergableStakeAccounts }) }} title={"Merge"} />
        const splitButton = <Button key="active" onPress={() => { nav.push("split", { stakeAccount, validator }) }} title={"Split"} />

        if (stakeAccount.excessLamports > 0) {
            buttons.push(claimMevButton)
        }

        buttons.push(unstakeButton)

        if (stakeAccount.status === "active") {
            buttons.push(deactivateUnstakeButton)
        }
        if (stakeAccount.status === "inactive") {
            buttons.push(withdrawButton)
        }
        if (stakeAccount.status === "inactive") {
            buttons.push(redelegateButton)
        }

        buttons.push(sendButton)

        if (mergableStakeAccounts.length > 0) {
            buttons.push(mergeButton)
        }
        if (stakeAccount.status === "active" || stakeAccount.status === "inactive") {
            buttons.push(splitButton)
        }

        return buttons
    }

    return (
        <View style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <View style={{ flex: 1 }}>

                <StakeAccountDetail stakeAccount={stakeAccount} validator={validator} />

                <View style={{ overflow: "hidden", position: "fixed", bottom: 0, width: "100%", display: "flex", flexDirection: "column" }}>
                    <Button onPress={() => setExpanded(!expanded)} style={{ width: "100%", borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }} style={tw`py-3`} title={"Stake Account Actions"} />
                    <View style={{ maxHeight: expanded ? "400px" : "0", transition: "max-height 0.5s linear" }}>
                        <List style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, backgroundColor: THEME.colors?.bg2 }}>
                            {ListChildren()}
                        </List>
                    </View>
                </View>
            </View>
        </View >

    )
}

async function deactivateStake(stakeAccount: StakeAccount, publicKey: PublicKey, connection: Connection, nav: any) {
    let transaction = StakeProgram.deactivate({ stakePubkey: stakeAccount.accountAddress, authorizedPubkey: publicKey })
    let recentBlockhash = await connection.getLatestBlockhash();
    transaction.feePayer = publicKey;
    transaction.recentBlockhash = recentBlockhash.blockhash;
    try {
        let txnSignature = await window.xnft.solana.sendAndConfirm(transaction);
    } catch (error) {
        console.log("error", error);
        return
    }
    nav.pop()
    nav.push("overview", { expectingStakeAccountsToUpdate: true })
}

async function claimMev(stakeAccount: StakeAccount, publicKey: PublicKey, connection: Connection, nav: any) {
    const recentBlockhash = await connection.getLatestBlockhash();
    const transaction = new Transaction({
        feePayer: publicKey,
        blockhash: recentBlockhash.blockhash,
        lastValidBlockHeight: recentBlockhash.lastValidBlockHeight
    });

    if (stakeAccount.excessLamports > 0) {
        transaction.add(
            StakeProgram.withdraw({
                stakePubkey: stakeAccount.accountAddress,
                authorizedPubkey: publicKey,
                toPubkey: publicKey,
                lamports: stakeAccount.excessLamports
            }))
    }

    // send the transaction
    try {
        const signature = await window.xnft.solana.sendAndConfirm(transaction)
    } catch (e) {
        console.log(e);
        return
    }

    nav.pop()
    nav.push("overview", { expectingStakeAccountsToUpdate: true })
}


async function withdrawStake(stakeAccount: StakeAccount, publicKey: PublicKey, connection: Connection, nav: any) {
    if (stakeAccount.status !== "inactive") {
        return;
    }

    let balance_in_lamports = await connection.getBalance(stakeAccount.accountAddress);
    let withdrawTxn = StakeProgram.withdraw({
        stakePubkey: stakeAccount.accountAddress,
        authorizedPubkey: publicKey,
        toPubkey: publicKey,
        lamports: balance_in_lamports
    });
    let recentBlockhash = await connection.getLatestBlockhash();
    withdrawTxn.feePayer = publicKey;
    withdrawTxn.recentBlockhash = recentBlockhash.blockhash;
    try {
        let txnSignature = await window.xnft.solana.sendAndConfirm(withdrawTxn);
    } catch (error) {
        console.log("error", error);
        return
    }

    // const newStakeAccounts = stakeAccounts.filter((account: StakeAccount) => account.accountAddress.toString() !== stakeAccount.accountAddress.toString());
    // await AsyncStorage.setItem(stakeAccountCacheKey + publicKey.toString(), newStakeAccounts);
    nav.pop()
    nav.push("overview", { expectingStakeAccountsToUpdate: true })
}
