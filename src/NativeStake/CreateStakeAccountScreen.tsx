
import { View, Text, Button, TextField, usePublicKey, useConnection, useNavigation } from "react-xnft";
import type { Validator } from "../hooks/useValidators";
import React from "react";
import { useSolBalance } from '../hooks/useSolBalance';
import { PublicKey, Authorized, LAMPORTS_PER_SOL, Keypair, StakeProgram, Lockup } from "@solana/web3.js";
import { ValidatorInfo } from "../components/ValidatorInfo";
import { PrimaryButton, ButtonStatus } from "../components/PrimaryButton";

export function CreateStakeAccountScreen({ validator }: { validator: Validator }) {

    const publicKey = usePublicKey();
    const connection = useConnection();
    const solbalance = useSolBalance()
    const nav = useNavigation();
    const [stakeAmount, setStakeAmount] = React.useState(0);
    const onSolInputChange = (e) => {
        const input = e.target.value.replace(/[^0-9.]/g, '').replace(/^0+/, '');
        setStakeAmount(input);
    }

    let buttonText = "Create Stake Account With " + stakeAmount + " SOL";
    let buttonDisabled = false;
    let buttonStatus = ButtonStatus.Ok;

    console.log("StakeAmount", stakeAmount, solbalance);

    if (stakeAmount == 0 || stakeAmount === null) {
        buttonDisabled = true;
        buttonText = "Create Stake Account";
    }

    if (stakeAmount > solbalance / LAMPORTS_PER_SOL) {
        buttonStatus = ButtonStatus.Error;
        buttonDisabled = true;
        buttonText = "Insufficient SOL";
    }

    const onStake = async () => {
        if (buttonDisabled) {
            return
        }

        let stakeKeys = Keypair.generate();
        let auth = new Authorized(publicKey, publicKey);

        let stakeTx = StakeProgram.createAccount({
            authorized: auth,
            fromPubkey: publicKey,
            lamports: stakeAmount * LAMPORTS_PER_SOL,
            lockup: new Lockup(0, 0, publicKey),
            stakePubkey: stakeKeys.publicKey
        });

        let recentBlockhash = await connection.getLatestBlockhash();

        let votePubkey = new PublicKey(validator.vote_identity);

        let delegateIx = StakeProgram.delegate({
            authorizedPubkey: publicKey,
            stakePubkey: stakeKeys.publicKey,
            votePubkey: votePubkey
        });
        console.log("selected_validator", validator);
        stakeTx.add(delegateIx);
        stakeTx.feePayer = publicKey;
        stakeTx.recentBlockhash = recentBlockhash.blockhash;
        stakeTx.partialSign(stakeKeys);

        let txnSignature: any
        try {
            txnSignature = await window.xnft.solana.sendAndConfirm(stakeTx)
        } catch (error) {
            console.log("Here is the error", JSON.stringify(error));
            return
        }
        console.log("txnSignature", txnSignature);
        nav.pop()
        nav.pop()
        nav.push("overview", { expectingStakeAccountsToUpdate: true })
    }

    return (

        <View tw="h-full flex flex-col">
            <ValidatorInfo {...validator} />
            <View style={{ flex: 1, paddingTop: "20px", margin: '0px 12px' }}>
                <TextField
                    onChange={onSolInputChange}
                    style={{ width: "100%" }}
                ></TextField>
                <Text>{(solbalance / LAMPORTS_PER_SOL).toFixed(2)} Sol in wallet</Text>
            </View>
            <PrimaryButton status={buttonStatus} disabled={buttonDisabled} text={buttonText} onClick={onStake} />

        </View>

        // <View style={{ height: "100%" }}>
        //     <TextField onChange={onSolInputChange} value={stakeAmount}></TextField>
        //     <Text>{(solbalance/LAMPORTS_PER_SOL).toFixed(2)} Sol in wallet</Text>
        //     <Text>{validator.name}</Text>
        //     <Button onClick={onStake}>Stake</Button>
        // </View>



    )
}