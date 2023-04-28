import { registerRootComponent } from "expo";
import { RecoilRoot } from "recoil";
import { NavigationContainer } from "@react-navigation/native";
import { App } from "./App";

function Index() {
  return (
    <RecoilRoot>
      <NavigationContainer>
        <App />
      </NavigationContainer>
    </RecoilRoot>
  );
}


export default registerRootComponent(Index);