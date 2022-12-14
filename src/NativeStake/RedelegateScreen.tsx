import React from "react";
import { Button, View, Text, usePublicKey, useConnection, useNavigation } from "react-xnft";
import type { StakeAccount } from "../hooks/useStakeAccounts";
import type { Validator } from "../hooks/useValidators";
import { StakeAccountDetail } from "../components/StakeAccountDetail";
import { ValidatorInfo } from "../components/ValidatorInfo";
import { useValidators } from "../hooks/useValidators";
import { StakeProgram, PublicKey } from "@solana/web3.js";
import type { DelegateStakeParams } from "@solana/web3.js";
import { PrimaryButton, ButtonStatus } from "../components/PrimaryButton";

export function RedelegateScreen({
  validator,
  stakeAccount,
}: {
  validator: Validator;
  stakeAccount: StakeAccount;
}) {
  const validators = useValidators();
  const walletPublicKey = usePublicKey();
  const connection = useConnection();
  const nav = useNavigation();

  const onRedelegate = async () => {

    const delegateTxn = StakeProgram.delegate({
      stakePubkey: stakeAccount.accountAddress,
      authorizedPubkey: walletPublicKey,
      votePubkey: new PublicKey(validator.vote_identity),
    });

    let recentBlockhash = await connection.getLatestBlockhash();
    delegateTxn.feePayer = walletPublicKey;
    delegateTxn.recentBlockhash = recentBlockhash.blockhash;

    try {
        await window.xnft.solana.sendAndConfirm(delegateTxn);
        }
    catch (error) {
        console.log("error",error);
        return
    }   

    nav.pop()
    nav.pop()
    nav.push("overview",{expectingStakeAccountsToUpdate: true})
  };

  if (!validators) {
    return <Text>Error loading validators</Text>;
  }

  const existingValidator =
    validators[stakeAccount.validatorAddress.toString()];
    
  return (
    <View style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <View style={{ flex: 1, margin: "0px 12px" }}>
        <StakeAccountDetail
          stakeAccount={stakeAccount}
          validator={existingValidator}
        />
        <Text>Switching To</Text>

        <ValidatorInfo {...validator} />
       
      </View>
      <PrimaryButton
          status={ButtonStatus.Ok}
          disabled={false}
          onClick={onRedelegate}
          text="Redelegate"
        />
    </View>
  );
}
