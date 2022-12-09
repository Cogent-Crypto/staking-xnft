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
  import { PublicKey, StakeProgram, LAMPORTS_PER_SOL, Keypair } from "@solana/web3.js";
  import { StakeAccount, stakeAccountRentExempt } from "../hooks/useStakeAccounts";
  import { PrimaryButton, ButtonStatus } from "../components/PrimaryButton";
  import type { Validator } from "../hooks/useValidators";
  import { ValidatorInfo } from "../components/ValidatorInfo";
  import { StakeAccountDetail } from "../components/StakeAccountDetail";
  import { useSolBalance } from '../hooks/useSolBalance';

  export function SplitStakeAccountScreen({stakeAccount, validator}: {stakeAccount: StakeAccount, validator: Validator}) {
    const connection = useConnection();
    const publicKey = usePublicKey();
    const nav = useNavigation();
    const solBalance = useSolBalance();

    const [splitAmount, setSplitAmount] = useState<number>(stakeAccount.stakeLamports/2/LAMPORTS_PER_SOL);
    const [splitAmountDisplay, setSplitAmountDisplay] = useState<string>((stakeAccount.stakeLamports/2/LAMPORTS_PER_SOL).toString());
    const buildingSmallNumberRegex = /^0\.0*$/
    
    const hasSolToCoverRent = solBalance > stakeAccountRentExempt

    const onSend = async () => {};
  
    let buttonText = "Split";
    let buttonStatus = ButtonStatus.Ok;
    let buttonDisabled = false;
    

    if (!hasSolToCoverRent) {
      buttonText = "Insufficient SOL In Wallet";
      buttonStatus = ButtonStatus.Error
      buttonDisabled = true;
    } else if (splitAmount == 0 || buildingSmallNumberRegex.test(splitAmountDisplay)) {
      buttonText = "Enter Amount";
      buttonDisabled= true;
    } else {
      buttonText = `Split ${splitAmount} SOL to New Account`;
    }

    function onSplitAmountChange(e) {
      let input = e.target.value.replace(/[^0-9.]/g, '').replace(/^0+/, '');
      //remove all . except the first one
      input = input.replace(/\./g, (c, i, text) => text.indexOf(c) === i ? c : '')
      input = input.slice(0,10)

      
      if (input == "") {
        setSplitAmountDisplay("0");
        setSplitAmount(0);
        return
      }

      setSplitAmountDisplay(input);
      if (buildingSmallNumberRegex.test(input)) {
        setSplitAmount(0);
        return
      }
      
      let splitAmount = parseFloat(input);
      if (splitAmount == NaN) {
        setSplitAmount(0);
        setSplitAmountDisplay("0");
        return
      }

      let splitLamports = splitAmount * LAMPORTS_PER_SOL;

      if (splitLamports > stakeAccount.stakeLamports) {
        splitLamports = stakeAccount.stakeLamports - LAMPORTS_PER_SOL/1000000
        input = (splitLamports / LAMPORTS_PER_SOL).toString();
      }
      splitAmount = splitLamports / LAMPORTS_PER_SOL;
      setSplitAmount(splitAmount)
      setSplitAmountDisplay(input)
    }

    const onSplitStakeAccount = async () => {
      let splitStakeKeys = Keypair.generate();
      let splitTransaction = StakeProgram.split({
        authorizedPubkey: publicKey,
        stakePubkey: new PublicKey(stakeAccount.accountAddress),
        splitStakePubkey: splitStakeKeys.publicKey,
        lamports: splitAmount * LAMPORTS_PER_SOL
      });
      splitTransaction.feePayer = publicKey;
      let recentBlockhash = await connection.getLatestBlockhash();
      splitTransaction.recentBlockhash = recentBlockhash.blockhash;

      splitTransaction.partialSign(splitStakeKeys);
      try {
        const signature = await window.xnft.solana.sendAndConfirm(splitTransaction)
      } catch (e) {
        console.log(e);
        return 
      }
      nav.pop()
      nav.pop()
      nav.push("overview",{expectingStakeAccountsToUpdate: true})

    }
  
    return (
      <View style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <View style={{ flex: 1, margin: '0px 12px' }}>
          <StakeAccountDetail stakeAccount={stakeAccount} validator={validator} />
            <TextField
            onChange={onSplitAmountChange}
            value={splitAmountDisplay}
            style={{ width: "100%" }}
            ></TextField>
        </View>
        <PrimaryButton status={buttonStatus} disabled={buttonDisabled} onClick={onSplitStakeAccount} text={buttonText} />
      </View>
    );
  }