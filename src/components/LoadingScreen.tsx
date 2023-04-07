import {
    View,
} from "react-native";

import tw from "twrnc";

export const LoadingScreen = () => (
    <View key="loading" style={tw`flex items-center justify-center h-screen align-top -top-10`}>
        Loading
    </View>
)