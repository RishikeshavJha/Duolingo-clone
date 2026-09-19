import { useEffect, useState } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const { selectedLanguage } = useLanguageStore();
  const [isLanguageStoreHydrated, setIsLanguageStoreHydrated] = useState(
    useLanguageStore.persist.hasHydrated()
  );

  useEffect(() => {
    const unsubHydrate = useLanguageStore.persist.onHydrate(() =>
      setIsLanguageStoreHydrated(false)
    );
    const unsubFinish = useLanguageStore.persist.onFinishHydration(() =>
      setIsLanguageStoreHydrated(true)
    );
    setIsLanguageStoreHydrated(useLanguageStore.persist.hasHydrated());
    return () => {
      unsubHydrate();
      unsubFinish();
    };
  }, []);

  // Wait for Clerk and LanguageStore to restore from cache
  if (!isLoaded || !isLanguageStoreHydrated) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF" }}>
        <ActivityIndicator size="large" color="#6C4EF5" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  if (!selectedLanguage) {
    return <Redirect href="/languages" />;
  }

  return <Redirect href="/(tabs)" />;
}
