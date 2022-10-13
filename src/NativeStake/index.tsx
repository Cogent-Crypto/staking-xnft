import React from "react";
import { Stack } from "react-xnft";
import { StakeAccountDetailScreen } from "./StakeAccountDetail";
import { StakeAccountOverviewScreen } from "./StakeAccountOverview";
import { SelectValidatorScreen } from "./SelectValidatorToStake"; 
import { CreateStakeAccountScreen } from "./CreateStakeAccount";
import { ConfirmationScreen } from "./ConfirmTransaction";
import { SendStakeAccountScreen } from './SendStakeAccount';

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
              title: route.props.accountAddress.toString(),
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
          default:
            throw new Error("unknown route ");
        }
      }}
      style={{}}
    >
      <Stack.Screen
        name={"overview"}
        component={(props: any) => <StakeAccountOverviewScreen {...props} />}
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
      {/* <Stack.Screen
        name={"confirm"}
        component={(props: any) => <ConfirmTransaction {...props} />}
      /> */}
    </Stack.Navigator>
  );
}
