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
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { StakeAccount } from "../hooks/useStakeAccounts";
import { PrimaryButton, ButtonStatus } from "../components/PrimaryButton";
import type { Validator } from "../hooks/useValidators";
import { ValidatorInfo } from "../components/ValidatorInfo";
import { StakeAccountDetail } from "../components/StakeAccountDetail";

export function SendStakeAccountScreen({stakeAccount, validator}: {stakeAccount: StakeAccount, validator: Validator}) {
  const connection = useConnection();
  const publicKey = usePublicKey();
  const nav = useNavigation();
  const showInvalidKeyToast = false;

  const [addressError, setAddressError] = useState<boolean>(false);
  const [isFreshAccount, setIsFreshAccount] = useState<boolean>(false); // Not used for now.
  const [accountValidated, setAccountValidated] = useState<boolean>(false);

  const [address, setAddress] = React.useState("");

  const onAddressChange = async (e) => {
    const address = e.data.value;
    setAddress(address);
    
    if (address === "") {
        setAccountValidated(false);
        setAddressError(false);
        return;
      }
    
    let pubkey;
    try {
        pubkey = new PublicKey(address);
    } catch (err) {
        console.log("Invalid address", addressError);
        setAddressError(true);
        return;
    }

    const account = await connection.getAccountInfo(pubkey);

    // Null data means the account has no lamports. This is valid.
    if (!account) {
        setIsFreshAccount(true);
        setAccountValidated(true);
    return;
    }

    // Only allow system program accounts to be given. ATAs only!
    if (!account.owner.equals(SystemProgram.programId)) {
        setAddressError(true);
        return;
    }

    // The account data has been successfully validated.
    setAddressError(false);
    setAccountValidated(true);

  };

  const onSend = async () => {};

  let buttonText = "Send";
  let buttonStatus = ButtonStatus.Ok;
  let disabled = false;

  if (addressError) {
    buttonText = "Invalid Address";
    buttonStatus = ButtonStatus.Error
    disabled = true;
  }
  if (!accountValidated) {
    buttonStatus = ButtonStatus.Error
    disabled = true;
  } 

  if(isFreshAccount) {
    buttonText = "Send (Destination is a New Account)";
  }


  return (
    <View style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <View style={{ flex: 1, margin: '0px 12px' }}>
        <StakeAccountDetail stakeAccount={stakeAccount} validator={validator} />
          <TextField
          onChange={onAddressChange}
          value={address}
          style={{ width: "100%" }}
          ></TextField>
      </View>
      <PrimaryButton status={buttonStatus} disabled={!accountValidated} onClick={onSend} text={buttonText} />
      {/* {showInvalidKeyToast ? <Toast  message="Invalid Solana Address" status={ToastType.warn} />:""} */}
    </View>
  );
}