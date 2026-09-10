import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AITeacherScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FD" }}>
      <View className="flex-1 items-center justify-center p-6">
        <Text className="font-poppins-bold text-[24px] text-[#0D132B]">
          AI Teacher
        </Text>
        <Text className="font-poppins text-[14px] text-[#6B7280] text-center mt-2">
          Interactive AI teacher video & speech sessions.
        </Text>
      </View>
    </SafeAreaView>
  );
}
