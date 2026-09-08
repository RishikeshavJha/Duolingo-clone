import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function SSOCallbackScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF" }}>
      <ActivityIndicator size="large" color="#6845F4" />
      <Redirect href="/" />
    </View>
  );
}
