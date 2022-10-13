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
import { useCustomTheme } from "../hooks/useCustomTheme";
import type { StakeAccount } from "../hooks/useStakeAccounts";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Toast } from "../components/Toast";

const STATS = "https://api.degods.com/v1/stats";

export function StakeAccountOverviewScreen({expectingStakeAccountsToUpdate}: {expectingStakeAccountsToUpdate: boolean}) {
  const fetchedStakeAccounts = useStakeAccounts();
  const nav = useNavigation();
  const THEME = useCustomTheme();
  console.log("Theme", THEME);

  if (fetchedStakeAccounts === null) {
    return <Loading></Loading>;
  }

  const {cached, stakeAccounts} = fetchedStakeAccounts

  const clickStakeAccount = (account: StakeAccount) => {
    nav.push("detail", account);
  };

  const clickNewStakeAccount = () => {
    nav.push("selectvalidator");
  };

  const statusColor = (status: string) => {
    if (status == "active") return "#00d41c";
    if (status == "inactive") return "#b8260d";
    if (status == "deactivating" || status == "activating") return "yellow";
    
    console.log("got an unknown status: " + status);
    return "white";
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
                    src={account.validatorImageUrl}
                    style={{ height: "50px", borderRadius: "9999px" }}
                  ></Image>
                <View style={{ paddingLeft: "4px", width:"100%", paddingTop:"3px"}}>
                  <Text style={{maringTop:"100px"}}>{account.validatorName}</Text>
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
