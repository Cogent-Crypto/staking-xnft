import React from "react";
import {
  useNavigation,
  View,
  Text,
  Loading,
  Image,
  Button,
  useConnection,
  usePublicKey

} from "react-xnft";
import { useStakeAccounts } from "../hooks/useStakeAccounts";
import { useCustomTheme, statusColor } from "../hooks/useCustomTheme";
import type { StakeAccount } from "../hooks/useStakeAccounts";
import { useValidators } from "../hooks/useValidators";
import type { Validator } from "../hooks/useValidators";
import { LoadingScreen } from "../components/LoadingScreen";
import { useEpochInfo } from "../hooks/useEpochInfo";
import { LAMPORTS_PER_SOL, Transaction, SystemProgram, StakeProgram } from '@solana/web3.js';
import { AlertIcon } from "../components/Icons";
import { useStakingTokenBalances } from "../hooks/useStakingTokenBalances";
 
export function StakeAccountsOverviewScreen({ expectingStakeAccountsToUpdate }: { expectingStakeAccountsToUpdate: boolean }) {
  const fetchedStakeAccounts = useStakeAccounts();
  const validators = useValidators();
  const nav = useNavigation();
  const THEME = useCustomTheme();
  const epochInfo = useEpochInfo();
  const connection = useConnection();
  const publicKey = usePublicKey();
  // const tokens = useStakingTokenBalances();

  if (fetchedStakeAccounts === null || validators === null) {
    return <LoadingScreen />
  }

  const totalExcessLamports = fetchedStakeAccounts.stakeAccounts.reduce((a, b) => a + b.excessLamports, 0);
  const { cached, stakeAccounts } = fetchedStakeAccounts

  const clickStakeAccount = (account: StakeAccount) => {
    console.log("Clicked", JSON.stringify(account));
    const mergableStakeAccounts = stakeAccounts?.filter((mergeAccount) => {
      return account.validatorAddress.toString() == mergeAccount.validatorAddress.toString()
        && account.accountAddress.toString() != mergeAccount.accountAddress.toString()
        && account.status == mergeAccount.status
    })
    nav.push("detail", { stakeAccount: account, validator: validators[account.validatorAddress.toString()], mergableStakeAccounts: mergableStakeAccounts });
    console.log("After Clicked", JSON.stringify(account));
  };

  const clickNewStakeAccount = () => {
    nav.push("selectvalidator", { onSelectScreen: "create" });
  };

  const claimExcessLamports = async () => {
    const recentBlockhash = await connection.getLatestBlockhash();
    const transaction = new Transaction({
      feePayer: publicKey,
      blockhash: recentBlockhash.blockhash,
      lastValidBlockHeight: recentBlockhash.lastValidBlockHeight
    });
    // loop through all stake accounts and add a transfer instruction to the transaction
    for (const account of fetchedStakeAccounts.stakeAccounts) {
      if (account.excessLamports > 0 && transaction.serializeMessage().length < 1232 - 49) {
        transaction.add(
          StakeProgram.withdraw({
            stakePubkey: account.accountAddress,
            authorizedPubkey: publicKey,
            toPubkey: publicKey,
            lamports: account.excessLamports
          }))
      }
    }

    // send the transaction
    try {
      const signature = await window.xnft.solana.sendAndConfirm(transaction)
    } catch (e) {
      console.log(e);
      return
    }
    nav.push("overview", { expectingStakeAccountsToUpdate: true })


  }

  return (
    <View style={{ height: "100%" }}>
      <View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: THEME.colors?.secondary,
            textAlign: "center",
          }}
        >
          {cached && expectingStakeAccountsToUpdate ? (<View tw="-z-10"><Loading></Loading></View>) : ""}
          Total Sol Staked:{" "}
          {stakeAccounts.reduce((a, b) => a + b.stakeSol, 0).toFixed(1)} SOL
        </Text>
      </View>
      <View tw="py-1 px-1">
        {totalExcessLamports > 0 && <Button tw="w-full mb-2" style={{ borderRadius: "5px" }} onClick={claimExcessLamports}>Claim MEV rewards: {Math.round(totalExcessLamports / LAMPORTS_PER_SOL * 1000) / 1000} SOL</Button>}
        <Button tw="w-full" style={{ borderRadius: "5px" }} onClick={clickNewStakeAccount}>Create New +</Button>
      </View>

      {stakeAccounts.length == 0 ? (
        <Text>No stake accounts found</Text>
      ) : (
        stakeAccounts.map((account) => {
          const validator: Validator = validators[account.validatorAddress.toString()]
          return (
            <View
              style={{ padding: "4px", paddingTop: "3px", paddingBottom: "3px", width: "100%" }}
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
                {validator.commission_rugger ? <AlertIcon /> :
                  <Image
                    src={validator.image}
                    style={{ height: "50px", borderRadius: "9999px" }}
                  ></Image>}
                <View style={{ paddingLeft: "4px", width: "100%", paddingTop: "3px" }}>
                  <Text style={{ maringTop: "100px" }}>{validator.name}</Text>
                  <View style={{ display: "flex", justifyContent: "space-between", marginTop: "-3px" }}>
                    <Text
                      style={{
                        color: statusColor(account.status),
                      }}
                    >
                      {validator.commission_rugger ? <Text
                        style={{
                          color: "#b8260d",
                          fontSize: "15px"
                        }}
                      >MANIPULATING COMMISSIONS</Text> : account.status}
                      {account.status == "activating" || account.status == "deactivating" ? " (" + epochInfo?.remaining_dhm + ")" : ""}
                    </Text>
                    <Text style={{}}>
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
