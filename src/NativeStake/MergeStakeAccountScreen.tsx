import ReactXnft, { View, Image, Text, Button, useConnection, usePublicKey, useNavigation, ScrollBar } from "react-xnft";
import { PublicKey, StakeProgram, Transaction } from "@solana/web3.js";
import React, { useState } from "react";
import { useStakeAccounts } from "../hooks/useStakeAccounts";
import type { StakeAccount } from "../hooks/useStakeAccounts";
import type { Validator } from "../hooks/useValidators";
import { useCustomTheme, statusColor } from "../hooks/useCustomTheme";
import { StakeAccountDetail } from "../components/StakeAccountDetail";

type SelectableStakeAccount = StakeAccount & { selected: boolean };

export function MergeStakeAccountScreen({
  stakeAccount,
  validator,
  mergableStakeAccounts,
}: {
  stakeAccount: StakeAccount;
  validator: Validator;
  mergableStakeAccounts: StakeAccount[];
}) {
  const THEME = useCustomTheme();
  const connection = useConnection();
  const publicKey = usePublicKey();
  const nav = useNavigation();
  const max_num_merges = 22;

  const [mergeAbleAccounts, setMergeAbleAccounts] = useState<SelectableStakeAccount[]>(mergableStakeAccounts.map((stakeAccount) => { return { ...stakeAccount, selected: false } }));

  const selectedCount = mergeAbleAccounts.filter((account) => account.selected).length

  const mergeAccounts = async (accounts: StakeAccount[]) => {
    const recentBlockhash = await connection.getLatestBlockhash();
    const transaction = new Transaction({
      feePayer: publicKey,
      blockhash: recentBlockhash.blockhash,
      lastValidBlockHeight: recentBlockhash.lastValidBlockHeight
    });
    const instructions = accounts.map((account) => {
      return StakeProgram.merge({
        authorizedPubkey: publicKey,
        sourceStakePubKey: account.accountAddress,
        stakePubkey: stakeAccount.accountAddress
      }
      ).instructions[0];
    });
    let i = 0
    transaction.add(...instructions);
    console.log("Transaction before signature", transaction.serializeMessage().length);
    try {
      await window.xnft.solana.sendAndConfirm(transaction);
    } catch (error) {
      console.log("error", error);
      return
    }
    nav.pop()
    nav.pop()
    nav.push("overview", { expectingStakeAccountsToUpdate: true })

  }

  const mergeAll = async () => {
    mergeAccounts(mergeAbleAccounts.slice(0, max_num_merges));
  }

  const mergeSelected = async () => {
    mergeAccounts(mergeAbleAccounts.filter((account) => account.selected));
  }



  let mergeAllButtonStyle = { flex: 1, marginLeft: "6px", } as any
  let mergeAllButtonText = `Merge All (${mergeAbleAccounts.length})`;

  if (mergeAbleAccounts.length >= max_num_merges) {
    mergeAllButtonText = `Merge Max (${max_num_merges})`
  }

  if (mergeAbleAccounts.length == 1) {
    mergeAllButtonText = `Merge`
    mergeAllButtonStyle = { flex: 1 }
    mergeAbleAccounts[0].selected = true

  }

  let mergeSelectedButtonStyle = { flex: 1, height: "48px", marginRight: "6px", } as any
  let mergeSelectedButtonText = "Merge Selected (0)"
  if (selectedCount > 0) {
    mergeSelectedButtonText = `Merge (${selectedCount})`
  }

  if (selectedCount >= max_num_merges) {
    mergeSelectedButtonText = `Selected (${selectedCount})`
    mergeSelectedButtonStyle = { flex: 1, height: "48px", marginRight: "6px", backgroundColor: "red", opacity: 0.5 }
  }
  if (mergeAbleAccounts.length == 1) {
    mergeSelectedButtonStyle = { display: "none" }
  }



  return (
    <View style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "auto" }}>
      <View style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: "1",
        overflow: "auto"
      }}>
        <View style={{ margin: "0px 12px", flex: "0 0 20px" }}>
          <StakeAccountDetail stakeAccount={stakeAccount} validator={validator} />

        </View>
        <ScrollBar style={{ flexGrow: "1", margin: "0px 8px", overflowY: "auto" }}>
          {mergeAbleAccounts.map((account) => {
            return <SelectableStakeAccount key={account.accountAddress + JSON.stringify(account.selected)} stakeAccount={account} validator={validator} mergeAbleAccounts={mergeAbleAccounts} setMergeAbleAccounts={setMergeAbleAccounts} />
          })}
        </ScrollBar>
        <View
          style={{
            display: "flex",
            paddingTop: "10px",
            paddingLeft: "12px",
            paddingRight: "12px",
            paddingBottom: "10px",
            justifyContent: "space-between",
          }}
        >
          <Button
            style={mergeSelectedButtonStyle}
            onClick={mergeSelected}
            disabled={selectedCount == 0}
          >
            {mergeSelectedButtonText}
          </Button>
          <Button
            style={mergeAllButtonStyle}
            onClick={mergeAll}
          >
            {mergeAllButtonText}
          </Button>


        </View>
      </View>
    </View>
  );
}

export function SelectableStakeAccount({
  stakeAccount,
  validator,
  mergeAbleAccounts,
  setMergeAbleAccounts,
}: {
  stakeAccount: SelectableStakeAccount;
  validator: Validator;
  mergeAbleAccounts: SelectableStakeAccount[];
  setMergeAbleAccounts: (selected: SelectableStakeAccount[]) => void;
}) {
  const THEME = useCustomTheme();
  const key = stakeAccount.accountAddress.toString();
  console.log("isSelected", JSON.stringify(stakeAccount.selected));
  return (
    <View
      style={{
        padding: "4px",
        paddingTop: "3px",
        paddingBottom: "3px",
        width: "100%",
      }}
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
          opacity: stakeAccount.selected ? 1 : .5,
        }}
        onClick={() => {
          if (mergeAbleAccounts.length == 1) {
            return
          }
          const newMergeAbleAccounts = mergeAbleAccounts.map((account) => {
            if (account.accountAddress.toString() == key) {
              return { ...account, selected: !account.selected }
            } else {
              return account
            }
          })

          setMergeAbleAccounts(newMergeAbleAccounts);
        }}
      >
        <Image
          src={validator.image}
          style={{ height: "50px", borderRadius: "9999px" }}
        ></Image>
        <View style={{ paddingLeft: "4px", width: "100%", paddingTop: "3px" }}>
          <Text style={{ maringTop: "100px" }}>{validator.name}</Text>
          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "-3px",
            }}
          >
            <Text
              style={{
                color: statusColor(stakeAccount.status),
              }}
            >
              {stakeAccount.status}
            </Text>
            <Text style={{}}>{stakeAccount.stakeSol.toFixed(2)} SOL</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
