import {
  View,
  Text,
  Button,
  TextField,
  usePublicKey,
  useConnection,
  useNavigation,
} from "react-xnft";
import React, { useState, useEffect } from "react";
import { PublicKey, SystemProgram, Transaction, StakeProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { StakeAccount } from "../hooks/useStakeAccounts";
import { PrimaryButton, ButtonStatus } from "../components/PrimaryButton";
import type { Validator } from "../hooks/useValidators";
import { ValidatorInfo } from "../components/ValidatorInfo";
import { StakeAccountDetail } from "../components/StakeAccountDetail";
import { prettifyAddress } from "../utils";

export function SendStakeAccountScreen({ stakeAccount, validator }: { stakeAccount: StakeAccount, validator: Validator }) {
  const connection = useConnection();
  const publicKey = usePublicKey();
  const nav = useNavigation();
  const showInvalidKeyToast = false;

  const [addressError, setAddressError] = useState<boolean>(false);
  const [isFreshAccount, setIsFreshAccount] = useState<boolean>(false); // Not used for now.
  const [accountValidated, setAccountValidated] = useState<boolean>(false);

  const [destinationAddress, setDestinationAddress] = React.useState("");

  const onAddressChange = async (e) => {
    const destinationAddress = e.target.value;
    setDestinationAddress(destinationAddress);

    if (destinationAddress === "") {
      setAccountValidated(false);
      setAddressError(false);
      return;
    }

    let pubkey;
    try {
      pubkey = new PublicKey(destinationAddress);
    } catch (err) {
      console.log("Invalid address from pubkey failure", addressError, destinationAddress, err);
      setAddressError(true);
      return;
    }

    const account = await connection.getAccountInfo(pubkey);

    // Null data means the account has no lamports. This is valid.
    if (!account) {
      setIsFreshAccount(true);
      setAccountValidated(true);
      setAddressError(false);
      return;
    }

    // Only allow system program accounts to be given. ATAs only!
    if (!account.owner.equals(SystemProgram.programId)) {
      setAddressError(true);
      console.log("Invalid address from ownership", addressError, destinationAddress);
      return;
    }

    // The account data has been successfully validated.
    setAddressError(false);
    setAccountValidated(true);

  };

  const onSend = async () => {
    const recentBlockhash = await connection.getLatestBlockhash();
    const transaction = new Transaction({
      feePayer: publicKey,
      blockhash: recentBlockhash.blockhash,
      lastValidBlockHeight: recentBlockhash.lastValidBlockHeight
    });

    let authorized_withdrawer = StakeProgram.authorize({
      stakePubkey: new PublicKey(stakeAccount.accountAddress),
      authorizedPubkey: publicKey,
      newAuthorizedPubkey: new PublicKey(destinationAddress),
      stakeAuthorizationType: { index: 1 }
    });
    transaction.add(authorized_withdrawer);

    let authorized_staker = StakeProgram.authorize({
      stakePubkey: new PublicKey(stakeAccount.accountAddress),
      authorizedPubkey: publicKey,
      newAuthorizedPubkey: new PublicKey(destinationAddress),
      stakeAuthorizationType: { index: 0 }
    });
    transaction.add(authorized_staker);

    try {
      let txnSignature = await window.xnft.solana.sendAndConfirm(transaction);
    } catch (error) {
      console.log("Here is the error", JSON.stringify(error));
      return
    }
    nav.pop()
    nav.pop()
    nav.push("overview", { expectingStakeAccountsToUpdate: true })

  };

  let buttonText = accountValidated ? `Send ${(stakeAccount.stakeLamports / LAMPORTS_PER_SOL).toFixed(2)} Staked SOL ${prettifyAddress(destinationAddress, 4)}` : "Send";
  let buttonStatus = ButtonStatus.Ok;
  let disabled = false;
  console.log("Address error", addressError);

  if (addressError) {
    buttonText = "Invalid Address";
    buttonStatus = ButtonStatus.Error
    disabled = true;
  }
  if (!accountValidated) {
    disabled = true;
  }

  if (isFreshAccount) {
    buttonText = "Send (Destination is a New Account)";
  }


  return (
    <View style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <View style={{ flex: 1, margin: '0px 12px' }}>
        <StakeAccountDetail stakeAccount={stakeAccount} validator={validator} />
        <TextField
          onChange={onAddressChange}
          value={destinationAddress}
          style={{ width: "100%" }}
          tw="mt-2"
        ></TextField>
        <Text style={{ fontSize: "10px" }} tw="mt-2">
          Sending a stake account permanently transfers the withdraw and delegation authority to the desination address
        </Text>
      </View>
      <PrimaryButton key={buttonStatus} status={buttonStatus} disabled={!accountValidated} onClick={onSend} text={buttonText} />
      {/* {showInvalidKeyToast ? <Toast  message="Invalid Solana Address" status={ToastType.warn} />:""} */}
    </View>
  );
}