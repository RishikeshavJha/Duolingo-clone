import Constants from "expo-constants";
import PostHog from "posthog-react-native";

const extra = Constants.expoConfig?.extra;
const projectToken = extra?.posthogProjectToken;
const host = extra?.posthogHost;
const hasProjectToken =
  typeof projectToken === "string" &&
  projectToken.length > 0 &&
  !projectToken.includes("your_project_token");
const hasHost = typeof host === "string" && host.length > 0;

if (__DEV__ && !hasProjectToken) {
  console.error(
    "EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN is configured",
  );
}

if (__DEV__ && !hasHost) {
  console.error(
    "EXPO_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once EXPO_PUBLIC_POSTHOG_HOST is configured",
  );
}

export const posthog =
  hasProjectToken && hasHost
    ? new PostHog(projectToken, {
        host,
        captureAppLifecycleEvents: true,
        errorTracking: {
          autocapture: {
            uncaughtExceptions: true,
            unhandledRejections: true,
            console: [],
          },
        },
      })
    : null;
