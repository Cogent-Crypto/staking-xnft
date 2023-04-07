import React from "react";
import { View } from "react-native";
// import Reacft, { View } from "react-native";

import { StakeAccountsScreen } from "./NativeStake";
//
// On connection to the host environment, warm the cache.
//
// ReactXnft.events.on("connect", () => {
//   // no-op
// });



export function App() {
  return (
    <View style={{ height: "100%" }}>
      <StakeAccountsScreen />
    </View>
  );
}
