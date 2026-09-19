import "../../global.css";
import { ClerkProvider, ClerkLoaded, useAuth, useUser } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { poppinsFonts } from "@/theme";
import { useFonts } from "expo-font";
import { Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { PostHogErrorBoundary, PostHogProvider } from "posthog-react-native";
import { useEffect, useRef } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { posthog } from "@/lib/posthog";

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file");
}

function PostHogScreenTracking() {
  const pathname = usePathname();

  useEffect(() => {
    posthog?.screen(pathname);
  }, [pathname]);

  return null;
}

function PostHogIdentity() {
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { isLoaded: isUserLoaded, user } = useUser();
  const identifiedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!posthog || !isAuthLoaded || !isUserLoaded) return;

    if (!isSignedIn || !user) {
      if (identifiedUserId.current) {
        posthog.reset();
        identifiedUserId.current = null;
      }
      return;
    }

    if (identifiedUserId.current === user.id) return;

    if (identifiedUserId.current) {
      posthog.reset();
    }

    posthog.identify(user.id, {
      $set: {
        ...(user.primaryEmailAddress?.emailAddress
          ? { email: user.primaryEmailAddress.emailAddress }
          : {}),
        ...(user.fullName ? { name: user.fullName } : {}),
      },
    });
    identifiedUserId.current = user.id;
  }, [isAuthLoaded, isSignedIn, isUserLoaded, user]);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(poppinsFonts);

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontError, fontsLoaded]);

  if (!fontsLoaded && !fontError) return null;

  const app = (
    <SafeAreaProvider>
      <StatusBar style="dark" animated />
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <ClerkLoaded>
          <PostHogScreenTracking />
          <PostHogIdentity />
          <Stack screenOptions={{ headerShown: false }} />
        </ClerkLoaded>
      </ClerkProvider>
    </SafeAreaProvider>
  );

  return posthog ? (
    <PostHogProvider client={posthog}>
      <PostHogErrorBoundary fallback={RootErrorFallback}>
        {app}
      </PostHogErrorBoundary>
    </PostHogProvider>
  ) : (
    app
  );
}

function RootErrorFallback() {
  return <Stack screenOptions={{ headerShown: false }} />;
}

