
import { View, Text, List, Button, useNavigation, Image, useConnection, usePublicKey, LocalStorage } from "react-xnft";
import type { Connection, PublicKey } from "@solana/web3.js";
import { StakeProgram } from "@solana/web3.js";
import type { StakeAccount } from "../hooks/useStakeAccounts";
import { stakeAccountCacheKey } from "../hooks/useStakeAccounts";
import { StakeAccountDetail } from "../components/StakeAccountDetail";
import type { Validator } from "../hooks/useValidators";
import React from "react";
import { useScrollPosition } from "../hooks/useScrollPosition";
import { useEffect, useState } from "react";
import { useEpochInfo } from "../hooks/useEpochInfo";

export function StakeAccountDetailScreen({ stakeAccount, validator, mergableStakeAccounts }: { stakeAccount: StakeAccount, validator: Validator, mergableStakeAccounts: StakeAccount[] }) {
    const [expanded, setExpanded] = useState(false)

    const nav = useNavigation();
    const publicKey = usePublicKey();
    const connection = useConnection();
    const epochInfo = useEpochInfo();

    return (
        <View style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <View style={{ flex: 1 }}>

                <StakeAccountDetail stakeAccount={stakeAccount} validator={validator} />


                <View style={{ overflow: "hidden", position: "fixed", bottom: 0, width: "100%", display: "flex", flexDirection: "column" }}>
                    <Button onClick={() => setExpanded(!expanded)} style={{ width: "100%", borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }} tw="py-3">Stake Account Actions</Button>
                    <View style={{ maxHeight: expanded ? "400px" : "0", transition: "max-height 0.5s linear" }}>
                        <List style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                            <Button key={"instantunstake"} onClick={() => { nav.push("instantunstake", { stakeAccount }) }}>Instant Unstake</Button>
                            {stakeAccount.status === "active" &&
                                <Button key={"deactivateunstake"} onClick={() => { deactivateStake(stakeAccount, publicKey, connection, nav) }}>Unstake (Availble to withdraw in {epochInfo?.remaining_dhm})</Button>
                            }
                            {stakeAccount.status === "inactive" &&
                                <Button key={"withdraw"} onClick={() => withdrawStake(stakeAccount, publicKey, connection, nav)}>Withdraw</Button>
                            }
                            {stakeAccount.status === "inactive" &&
                                <Button key={"inactive"} onClick={() => { nav.push("selectvalidator", { onSelectScreen: "redelegate", data: stakeAccount }) }}>Redelegate</Button>
                            }
                            <Button key={"send"} onClick={() => { nav.push("send", { stakeAccount, validator }) }}>Send</Button>
                            {mergableStakeAccounts.length > 0
                                && <Button onClick={() => { console.log("merge"); nav.push("merge", { stakeAccount, validator, mergableStakeAccounts }) }}>Merge</Button>
                            }
                            {stakeAccount.status === "active" &&
                                <Button key="active" onClick={() => { nav.push("split", { stakeAccount, validator }) }}>Split</Button>
                            }
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
    // await LocalStorage.set(stakeAccountCacheKey+publicKey.toString(), newStakeAccounts);
    nav.pop()
    nav.push("overview", { expectingStakeAccountsToUpdate: true })
}
