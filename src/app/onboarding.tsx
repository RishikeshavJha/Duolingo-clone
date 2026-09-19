import { images } from "@/constants/images";
import { posthog } from "@/lib/posthog";
import { Pressable, Text, View } from "@/tw";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingScreen() {
  const { height } = useWindowDimensions();
  const illustrationHeight = Math.min(360, Math.max(260, height * 0.4));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 bg-background px-8 pb-9 pt-7 ">
        <View className="flex-row items-center gap-2.5 left-12">
          <Image
            source={images.mascotLogo}
            contentFit="contain"
            style={{ width: 50, height: 50 }}


          />
          <Text className="font-poppins-bold text-[30px] leading-[42px] tracking-[-1.5px] text-text-primary">
            muolingo
          </Text>
        </View>

        <View className="mt-12">
          <Text className="  font-poppins-bold text-[32px] leading-[1.35] tracking-[-1.2px] text-text-primary">
            Your AI language{"\n"}
            <Text className="text-lingua-purple">teacher.</Text>
          </Text>
          <Text className="font-poppins text-[15px] leading-[30px] text-text-secondary">
            Real conversations, personalized{"\n"}
            lessons, anytime, anywhere.
          </Text>
        </View>

        <View
          className="relative mt-10 items-center justify-end"
          style={{ height: illustrationHeight }}
        >
          <View className="absolute left-1 top-10 -rotate-[7deg] rounded-[22px] bg-[#EFF7FF] px-6 py-4">
            <Text className="font-poppins-medium text-[18px] leading-8 text-[#101424]">Hello!</Text>
            <View className="absolute -bottom-1 left-8 size-4 rotate-[-25deg] bg-[#EFF7FF]" />
          </View>
          <View className="absolute right-10 top-2 rotate-[15deg] rounded-[22px] bg-[#F5F3FF] px-6 py-4">
            <Text className="font-poppins-medium text-[18px] leading-8 text-lingua-purple">¡Hola!</Text>
            <View className="absolute -bottom-1 left-8 size-4 rotate-[-25deg] bg-[#F5F3FF]" />
          </View>
          <View className="absolute right-0 top-[200px] rotate-[150deg] rounded-[22px] bg-[#FFF4EE] px-6 py-4">
            <Text className="font-poppins-medium text-[18px] rotate-[-180deg] leading-8 text-[#F23A43]">你好!</Text>
            <View className="absolute -bottom-1 left-8 size-4 rotate-[-25deg] bg-[#FFF4EE]" />
          </View>
          <Image
            source={images.mascotWelcome}
            contentFit="contain"
            style={{ width: "100%", height: illustrationHeight * 1.05, transform: [{ translateY: 38 }] }}
          />
        </View>

        <Link href="/sign-up" asChild>
          <Pressable
            onPress={() => posthog?.capture("onboarding_started")}
            className="relative mt-auto items-center rounded-[24px] bg-lingua-purple py-5 shadow-button"
          >
            <Text className="font-poppins-semibold text-[24px] leading-8 text-white">Get Started</Text>
            <Text className="absolute right-10 top-[15px] font-poppins text-[42px] leading-[40px] text-white">›</Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}
