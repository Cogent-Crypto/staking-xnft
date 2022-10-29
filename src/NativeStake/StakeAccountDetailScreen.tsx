
import { View, Text, Button, useNavigation, Image, useConnection, usePublicKey, LocalStorage } from "react-xnft";
import type { Connection, PublicKey } from "@solana/web3.js";
import { StakeProgram } from "@solana/web3.js";
import type { StakeAccount} from "../hooks/useStakeAccounts";
import { stakeAccountCacheKey } from "../hooks/useStakeAccounts";
import { StakeAccountDetail } from "../components/StakeAccountDetail";
import type { Validator } from "../hooks/useValidators";
import React from "react";


export function StakeAccountDetailScreen({stakeAccount, validator, mergableStakeAccounts} : {stakeAccount: StakeAccount, validator: Validator, mergableStakeAccounts: StakeAccount[]}) {
    console.log("StakeAccountDetailScreen", stakeAccount, validator);
    const nav = useNavigation();
    const publicKey = usePublicKey();
    const connection = useConnection();
    
    return (
        <View style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <View style={{ flex: 1, margin: '0px 12px' }}>
            
                <StakeAccountDetail stakeAccount={stakeAccount} validator={validator} />
                
                <Button style={{width: "150px"}}>Instant Unstake</Button>
                <Button>Deactivate</Button>
                <Button onClick={() =>withdrawStake(stakeAccount, publicKey, connection, nav)}>Withdraw</Button>
                <Button onClick={() => { nav.push("selectvalidator", {onSelectScreen: "redelegate", data: stakeAccount}) }}>Redelegate</Button>
                <Button onClick={() => { nav.push("send", {stakeAccount, validator})} } >Send</Button>
                <Button onClick={ () => { console.log("merge"); nav.push("merge", {stakeAccount, validator, mergableStakeAccounts})}}>Merge</Button>
                <Button onClick={() => { nav.push("split", {stakeAccount, validator})} } >Split</Button> 

            </View>
        </View>

    )
}

async function deactivateStake(stakeAccount: StakeAccount, publicKey: PublicKey, connection: Connection, nav: any) {
}

async function withdrawStake(stakeAccount: StakeAccount, publicKey: PublicKey, connection: Connection, nav: any) { 

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
        console.log("error",error);
        return
    }

    // const newStakeAccounts = stakeAccounts.filter((account: StakeAccount) => account.accountAddress.toString() !== stakeAccount.accountAddress.toString());
    // await LocalStorage.set(stakeAccountCacheKey+publicKey.toString(), newStakeAccounts);
    nav.pop()
    nav.push("overview",{expectingStakeAccountsToUpdate: true})

    
}
