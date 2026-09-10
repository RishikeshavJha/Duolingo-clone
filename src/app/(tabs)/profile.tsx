import { useLanguageStore } from "@/store/languageStore";
import { useAuth, useUser } from "@clerk/expo";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const { selectedLanguage } = useLanguageStore();

  const userEmail = user?.primaryEmailAddress?.emailAddress || "User";
  const userName = user?.fullName || user?.firstName || "Learner";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FD" }}>
      <View className="flex-1 px-6 pt-8 pb-4 items-center justify-between">
        <View className="items-center w-full">
          <View className="w-20 h-20 rounded-full bg-[#F1EEFF] items-center justify-center border-2 border-[#6C4EF5]">
            <Text className="font-poppins-bold text-[28px] text-[#6C4EF5]">
              {userName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text className="font-poppins-bold text-[22px] text-[#0D132B] mt-4">
            {userName}
          </Text>
          <Text className="font-poppins text-[14px] text-[#6B7280]">
            {userEmail}
          </Text>

          {selectedLanguage && (
            <View className="flex-row items-center bg-white border border-[#E5E7EB] px-4 py-2 rounded-full mt-4">
              <Text className="text-[16px] mr-2">{selectedLanguage.flag}</Text>
              <Text className="font-poppins-medium text-[14px] text-[#0D132B]">
                Learning {selectedLanguage.name}
              </Text>
            </View>
          )}
        </View>

        <View className="w-full">
          <Pressable
            onPress={() => signOut()}
            className="w-full h-[52px] items-center justify-center rounded-[18px] bg-[#FFF0F0] border border-[#FFE0E0] active:opacity-80"
          >
            <Text className="font-poppins-semibold text-[16px] text-[#FF4D4F]">
              Sign Out
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
