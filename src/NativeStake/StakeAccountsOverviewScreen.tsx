import React from "react";
import {
  useNavigation,
  View,
  Text,
  Loading,
  List,
  Image,
  Button,

} from "react-xnft";
import { useStakeAccounts } from "../hooks/useStakeAccounts";
import { useCustomTheme, statusColor } from "../hooks/useCustomTheme";
import type { StakeAccount } from "../hooks/useStakeAccounts";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useValidators } from "../hooks/useValidators";
import type { Validator } from "../hooks/useValidators";

const STATS = "https://api.degods.com/v1/stats";

export function StakeAccountsOverviewScreen({expectingStakeAccountsToUpdate}: {expectingStakeAccountsToUpdate: boolean}) {
  const fetchedStakeAccounts = useStakeAccounts();
  const validators = useValidators();
  const nav = useNavigation();
  const THEME = useCustomTheme();
  console.log("Theme", THEME);

  if (fetchedStakeAccounts === null) {
    return <Loading></Loading>;
  }

  if (validators === null) {
    return <Loading></Loading>;
  }

  const {cached, stakeAccounts} = fetchedStakeAccounts

  const clickStakeAccount = (account: StakeAccount) => {
    console.log("Clicked", JSON.stringify( account));
    const mergableStakeAccounts = stakeAccounts?.filter((mergeAccount) => {
      return account.validatorAddress.toString() == mergeAccount.validatorAddress.toString()
        && account.accountAddress.toString() != mergeAccount.accountAddress.toString()
        && account.status == mergeAccount.status
    })
    nav.push("detail", {stakeAccount: account, validator: validators[account.validatorAddress.toString()], mergableStakeAccounts: mergableStakeAccounts});
    console.log("After Clicked", JSON.stringify( account));
  };

  const clickNewStakeAccount = () => {
    nav.push("selectvalidator", {onSelectScreen: "create"});
  };



  return (
    <View style={{ height: "100%" }}>
      <View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
          }}
        >
          Total Sol Staked:{" "}
          {stakeAccounts.reduce((a, b) => a + b.stakeSol, 0).toFixed(1)} SOL
        </Text>
      </View>
      <Button onClick={clickNewStakeAccount}>+</Button>
      {cached && expectingStakeAccountsToUpdate ? (<Loading></Loading>): ""}
      {stakeAccounts.length == 0 ? (
        <Text>No stake accounts found</Text>
      ) : (
        stakeAccounts.map((account) => {
          const validator: Validator = validators[account.validatorAddress.toString()]
          return (

            <View
              style={{ padding: "4px", paddingTop:"3px", paddingBottom:"3px", width: "100%" }}
              key={account.accountAddress.toString()}
            >
              <View
                style={{
                  display: "flex",
                  backgroundColor: THEME.colors?.bg2,
                  height: "100%",
                  cursor: "pointer",
                  width: "100%",
                  padding: "3px",
                  paddingTop: "4px",
                  paddingBottom: "4px",
                  borderRadius: "5px",
                }}
                onClick={() => clickStakeAccount(account)}
              >
                  <Image
                    src={validator.image}
                    style={{ height: "50px", borderRadius: "9999px" }}
                  ></Image>
                <View style={{ paddingLeft: "4px", width:"100%", paddingTop:"3px"}}>
                  <Text style={{maringTop:"100px"}}>{validator.name}</Text>
                  <View style={{display:"flex", justifyContent:"space-between", marginTop:"-3px"}}>
                    <Text
                      style={{
                        color: statusColor(account.status),
                      }}
                    >
                      {account.status}
                    </Text>
                    <Text style={{ }}>
                      {account.stakeSol.toFixed(2)} SOL
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })
      )}
    </View>
  )
}
