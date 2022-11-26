import React from "react";
import { Stack } from "react-xnft";
import { StakeAccountDetailScreen } from "./StakeAccountDetailScreen";
import { StakeAccountsOverviewScreen } from "./StakeAccountsOverviewScreen";
import { SelectValidatorScreen } from "./SelectValidatorScreen";
import { CreateStakeAccountScreen } from "./CreateStakeAccountScreen";
import { SendStakeAccountScreen } from './SendStakeAccountScreen';
import { SplitStakeAccountScreen } from './SplitStakeAccountScreen';
import { MergeStakeAccountScreen } from './MergeStakeAccountScreen';
import { RedelegateScreen } from './RedelegateScreen';
import { InstantUnstakeScreen } from './InstantUnstakeScreen';
import { prettifyAddress } from '../utils'


export function StakeAccountsScreen() {
  return (
    <Stack.Navigator
      initialRoute={{ name: "overview" }}
      options={({ route }) => {
        switch (route.name) {
          case "overview":
            return {
              title: "🏦 Stake Accounts　　",
            };
          case "detail":
            return {
              title: "Stake Account Details　　　",
            };
          case "create":
            return {
              title: "Create Stake Account　　　",
            };
          case "selectvalidator":
            return {
              title: "Select Validator　　　",
            };
          case "send":
            return {
              title: "Send Stake Account　　　",
            };
          case "split":
            return {
              title: "Split Stake Account　　　",
            };
          case "merge":
            return {
              title: "Merge Stake Accounts　　　",
            };
          case "redelegate":
            return {
              title: "Redelegate Stake　　　",
            };
          default:
            throw new Error("unknown route ");
        }
      }}
      style={{}}
    >
      <Stack.Screen
        name={"overview"}
        component={(props: any) => <StakeAccountsOverviewScreen {...props} />}
      />
      <Stack.Screen
        name={"detail"}
        component={(props: any) => <StakeAccountDetailScreen {...props} />}
      />
      <Stack.Screen
        name={"selectvalidator"}
        component={(props: any) => <SelectValidatorScreen {...props} />}
      />
      <Stack.Screen
        name={"create"}
        component={(props: any) => <CreateStakeAccountScreen {...props} />}
      />
      <Stack.Screen
        name={"send"}
        component={(props: any) => <SendStakeAccountScreen {...props} />}
      />
      <Stack.Screen
        name={"split"}
        component={(props: any) => <SplitStakeAccountScreen {...props} />}
      />
      <Stack.Screen
        name={"merge"}
        component={(props: any) => <MergeStakeAccountScreen {...props} />}
      />
      <Stack.Screen
        name={"redelegate"}
        component={(props: any) => <RedelegateScreen {...props} />}
      />
      {/* <Stack.Screen
        name={"instantunstake"}
        component={(props: any) => <InstantUnstakeScreen {...props} />}
      /> */}
      {/* <Stack.Screen
        name={"confirm"}
        component={(props: any) => <ConfirmTransaction {...props} />}
      /> */}
    </Stack.Navigator>
  );
}
