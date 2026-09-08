import { AuthScreen } from "@/components/auth-screen";
import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";

export default function SignUpScreen() {
  const { isSignedIn } = useAuth();
  
  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  return <AuthScreen mode="sign-up" />;
}
