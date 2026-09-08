import { useAuth, useUser } from "@clerk/expo";
import { Redirect } from "expo-router";
import { Image } from "expo-image";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants/images";

export default function Index() {
  const { isSignedIn, isLoaded, signOut } = useAuth();
  const { user } = useUser();

  // Wait for Clerk to restore session from cache
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF" }}>
        <ActivityIndicator size="large" color="#6845F4" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  const userEmail = user?.primaryEmailAddress?.emailAddress || "Logged In User";
  const userName = user?.fullName || user?.firstName || "Language Learner";
  const userAvatar = user?.imageUrl;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FD" }}>
      <View className="flex-1 px-6 pt-10 pb-8 items-center justify-between">
        
        {/* Top Header */}
        <View className="items-center w-full">
          {/* Success Status Pill */}
          <View className="flex-row items-center bg-[#E6F4EA] border border-[#CEEAD6] px-4 py-2 rounded-full mb-6">
            <View className="w-2.5 h-2.5 rounded-full bg-[#137333] mr-2" />
            <Text className="font-poppins-semibold text-[13px] text-[#137333]">
              Successfully Logged In
            </Text>
          </View>

          {/* Mascot Logo */}
          <Image
            source={images.mascotLogo}
            contentFit="contain"
            style={{ width: 80, height: 80 }}
          />

          <Text className="font-poppins-bold text-[28px] text-[#0D132B] mt-3">
            Welcome back!
          </Text>
          <Text className="font-poppins text-[15px] text-[#727A98] text-center mt-1">
            Ready to continue your language learning journey?
          </Text>
        </View>

        {/* User Card */}
        <View className="w-full bg-white rounded-[24px] p-6 border border-[#EEF0F5] shadow-sm items-center my-auto">
          {userAvatar ? (
            <Image
              source={{ uri: userAvatar }}
              style={{ width: 72, height: 72, borderRadius: 36 }}
            />
          ) : (
            <View className="w-18 h-18 rounded-full bg-[#F1EEFF] items-center justify-center">
              <Text className="font-poppins-bold text-[28px] text-[#6845F4]">
                {userName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

          <Text className="font-poppins-bold text-[18px] text-[#0D132B] mt-3">
            {userName}
          </Text>
          
          <Text className="font-poppins text-[13.5px] text-[#75809D] mt-0.5">
            {userEmail}
          </Text>

          {/* Account Details Box */}
          <View className="w-full bg-[#F8F9FD] rounded-[16px] p-4 mt-5">
            <View className="flex-row justify-between items-center py-1">
              <Text className="font-poppins-medium text-[13px] text-[#75809D]">
                Account ID
              </Text>
              <Text className="font-poppins-semibold text-[13px] text-[#0D132B]" numberOfLines={1}>
                {user?.id ? `${user.id.slice(0, 12)}...` : "Active"}
              </Text>
            </View>

            <View className="h-[1px] bg-[#EEF0F5] my-2" />

            <View className="flex-row justify-between items-center py-1">
              <Text className="font-poppins-medium text-[13px] text-[#75809D]">
                Auth Status
              </Text>
              <Text className="font-poppins-semibold text-[13px] text-[#6845F4]">
                Authenticated ✨
              </Text>
            </View>
          </View>
        </View>

        {/* Action Button */}
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
