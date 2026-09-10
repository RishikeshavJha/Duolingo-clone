import { AuthScreen } from "@/components/auth-screen";
import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";

export default function SignInScreen() {
  const { isSignedIn, isLoaded } = useAuth();
  
  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  return <AuthScreen mode="sign-in" />;
}
