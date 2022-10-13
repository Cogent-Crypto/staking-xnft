import React, { useState, useEffect } from "react";
import ReactXnft, { Text, View, useConnection, usePublicKey, Loading, useTheme } from "react-xnft";
import Validator from "./components/Validator";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useStakeAccounts } from "./hooks/useStakeAccounts";
import { StakeAccountsScreen } from "./NativeStake";
import { THEME } from "./utils/theme";
//
// On connection to the host environment, warm the cache.
//
ReactXnft.events.on("connect", () => {
  // no-op
});



export function App() {

  return (
    <View style={{ height: "100%" }}>
      <StakeAccountsScreen />
    </View>
  );
}
