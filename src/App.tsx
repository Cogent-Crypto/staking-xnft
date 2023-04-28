import React from "react";
import { Screen } from "./components/Screen";
// import Reacft, { View } from "react-native";

import { StakeAccountsScreen } from "./NativeStake";
import { View, Text, Image } from "react-native";
//
// On connection to the host environment, warm the cache.
//
// ReactXnft.events.on("connect", () => {
//   // no-op
// });




export function App() {
  return (
    <Screen>
      <StakeAccountsScreen />
    </Screen>
  );
}
