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
import { Toast, ToastType } from "../components/Toast";

export function SendStakeAccountScreen(stakeAccount: StakeAccount) {
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

  let buttonText = "send"
  const sendButtonStyle = {
    width: "100%",
    height: "48px",
    borderRadius: "12px",
  } as any

  if (addressError) {
    
    sendButtonStyle.backgroundColor = "rgb(233, 80, 80)";  //Red
    sendButtonStyle.color = "white";
    buttonText = "Invalid Address";
  }
  if (!accountValidated) {
    sendButtonStyle.opacity = "0.5";
  } 

  if(isFreshAccount) {
    sendButtonStyle.backgroundColor = "#ffc209"; //Yellow 
    sendButtonStyle.color = "black";
    buttonText = "Send (Destination is a New Account)";
    sendButtonStyle.opacity = "0.75";
  }


  return (
    <View style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <View style={{ flex: 1, paddingTop: "20px",margin: '0px 12px' }}>
            <TextField
            onChange={onAddressChange}
            value={address}
            style={{ width: "100%" }}
            ></TextField>
      </View>
      <View
        style={{
          display: "flex",
          paddingTop: "25px",
          paddingLeft: "12px",
          paddingRight: "12px",
          paddingBottom: "24px",
          justifyContent: "space-between",
        }}
      >
        <Button
          style={sendButtonStyle}
          onClick={onSend}
          disabled={addressError}
        >
          {buttonText}
        </Button>
      </View>
      {/* {showInvalidKeyToast ? <Toast  message="Invalid Solana Address" status={ToastType.warn} />:""} */}
    </View>
  );
}