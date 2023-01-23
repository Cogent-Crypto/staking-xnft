import React from "react";
import { Stack, Tab } from "react-xnft";
import { StakeAccountDetailScreen } from "./StakeAccountDetailScreen";
import { StakeAccountsOverviewScreen } from "./StakeAccountsOverviewScreen";
import { SelectValidatorScreen } from "./SelectValidatorScreen";
import { CreateStakeAccountScreen } from "./CreateStakeAccountScreen";
import { SendStakeAccountScreen } from './SendStakeAccountScreen';
import { SplitStakeAccountScreen } from './SplitStakeAccountScreen';
import { MergeStakeAccountScreen } from './MergeStakeAccountScreen';
import { RedelegateScreen } from './RedelegateScreen';
import { InstantUnstakeScreen } from './InstantUnstakeScreen';
import { useCustomTheme } from "../hooks/useCustomTheme";
import { HomeIcon, LiquidIcon } from "../components/Icons";
import { LiquidStakeAccountsScreen } from "../LiquidStake/LiquidStaking";
import { LiquidStakeDetail } from "../LiquidStake/LiquidStakeDetail";


export function StakeAccountsScreen() {
  const THEME = useCustomTheme();

  return (
    <Stack.Navigator
      initialRoute={{ name: "overview" }}
      options={({ route }) => {

        switch (route.name) {
          case "overview":
            return {
              title: "Solana Staking　　",
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
          case "instantunstake":
            return {
              title: "Instant Unstake　　　",
            };
          case "liquidstake":
            return {
                title: "",
            };
          case "liquidstakedetail":
            return {
                title: "",
            };
          default:
            throw new Error("unknown route ");
        }
      }}
      style={{}}
      titleStyle={{ color: THEME.colors?.fontColor }}
    >
      <Stack.Screen
        name={"overview"}
        component={(props: any) => <TabNavigator  {...props} />}
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
      <Stack.Screen
        name={"instantunstake"}
        component={(props: any) => <InstantUnstakeScreen {...props} />}
      />
      <Stack.Screen
              name={"LiquidStakeAccountsScreen"}
              component={(props: any) => <LiquidStakeAccountsScreen  {...props} />}
          />
      <Stack.Screen
          name={"liquidstakedetail"}
          component={(props: any) => <LiquidStakeDetail  {...props} />}
      />
      {/* <Stack.Screen
        name={"confirm"}
        component={(props: any) => <ConfirmTransaction {...props} />}
      /> */}
    </Stack.Navigator>
  );
}



export function TabNavigator(props) {
  const THEME = useCustomTheme();

  return (
    <Tab.Navigator
      initialRouteName="Stake Accounts"
      style={{
        backgroundColor: "#272727",
        borderTop: "none",
      }}
      options={({ route }) => {
        return {
          tabBarIcon: ({ focused }) => {
            const color = focused
              ? THEME?.colors?.activeTab
              : THEME?.colors?.inactiveTab;
            if (route.name === "Stake Accounts") {
              return <Tab.Icon element={<HomeIcon />} />;
            } else {
              return <Tab.Icon element={<LiquidIcon />} />;
            }
          },
          tabBarStyle: {
            backgroundColor: THEME?.colors?.bg2,
          },
        };
      }}
    >
      <Tab.Screen
        name="Stake Accounts"
        component={() => <StakeAccountsOverviewScreen expectingStakeAccountsToUpdate={false} {...props} />}
      />
      <Tab.Screen
        name="Liquid Staking"
        component={() => <LiquidStakeAccountsScreen {...props} />}
      />
    </Tab.Navigator>
  );
}