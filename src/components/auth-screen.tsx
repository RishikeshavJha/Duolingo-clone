import { images } from "@/constants/images";
import { Pressable, Text, View } from "@/tw";
import { useSignIn, useSignUp, useSSO } from "@clerk/expo";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { VerificationModal } from "./verification-modal";

type AuthScreenProps = {
  mode: "sign-up" | "sign-in";
};

// Standard email format validation RFC 5322 compatible
const isValidEmail = (value: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
};

export function AuthScreen({ mode }: AuthScreenProps) {
  const router = useRouter();
  const isSignUp = mode === "sign-up";

  const fullNameInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const [fullName, setFullName] = useState("");
  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { signIn, errors: signInErrors, fetchStatus: signInFetchStatus } = useSignIn();
  const { signUp, errors: signUpErrors, fetchStatus: signUpFetchStatus } = useSignUp();
  const { startSSOFlow } = useSSO();

  const isFetching =
    signInFetchStatus === "fetching" || signUpFetchStatus === "fetching";

  const title = isSignUp ? "Create your account" : "Welcome back";
  const subtitle = isSignUp
    ? "Start your language journey today ✨"
    : "Continue your language journey ✨";
  const action = isSignUp ? "Sign Up" : "Sign In";

  const handleFullNameChange = (val: string) => {
    setFullName(val);
    setApiError(null);
    if (fullNameError && val.trim()) setFullNameError(null);
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    setApiError(null);
    if (emailError && isValidEmail(val)) setEmailError(null);
  };

  const handleEmailBlur = () => {
    const trimmed = email.trim();
    if (trimmed && !isValidEmail(trimmed)) {
      setEmailError("Please enter a valid email address");
    } else if (!trimmed) {
      setEmailError(null);
    }
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    setApiError(null);
    if (passwordError && (isSignUp ? val.length >= 8 : val.length > 0)) {
      setPasswordError(null);
    }
  };

  const handleSubmit = async () => {
    let hasError = false;
    const trimmedEmail = email.trim();
    const trimmedName = fullName.trim();

    if (isSignUp && !trimmedName) {
      setFullNameError("Please enter your name");
      hasError = true;
    } else {
      setFullNameError(null);
    }

    if (!trimmedEmail) {
      setEmailError("Please enter your email address");
      hasError = true;
    } else if (!isValidEmail(trimmedEmail)) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    } else {
      setEmailError(null);
    }

    if (!password.trim()) {
      setPasswordError("Please enter your password");
      hasError = true;
    } else if (isSignUp && password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      hasError = true;
    } else {
      setPasswordError(null);
    }

    if (hasError) return;

    setApiError(null);

    if (isSignUp) {
      // Split name into first and last if provided
      const nameParts = trimmedName.split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || undefined;

      // Sign Up flow with Name
      const { error } = await signUp.password({
        emailAddress: trimmedEmail,
        password,
        firstName,
        lastName,
      });
      if (error) {
        setApiError(error.message ?? "Sign up failed. Please try again.");
        return;
      }
      // Send verification email
      await signUp.verifications.sendEmailCode();
      setShowVerification(true);
    } else {
      // Sign In flow
      const { error } = await signIn.password({
        emailAddress: trimmedEmail,
        password,
      });
      if (error) {
        setApiError(error.message ?? "Sign in failed. Please check your credentials.");
        return;
      }
      if (signIn.status === "complete") {
        await signIn.finalize({ navigate: () => router.replace("/") });
      } else if (signIn.status === "needs_second_factor") {
        setShowVerification(true);
      }
    }
  };

  const handleSocialAuth = async (strategy: "oauth_google" | "oauth_facebook" | "oauth_apple") => {
    try {
      const { createdSessionId, setActive, signUp } = await startSSOFlow({
        strategy,
      });

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
        router.replace("/");
      } else if (signUp?.status === "missing_requirements") {
        setApiError("Cannot complete sign-in. Missing account requirements.");
      }
    } catch (err: any) {
      if (err.code === "SIGN_IN_CANCELLED" || err.code === "-5") return; // user cancelled
      console.error("SSO error:", JSON.stringify(err, null, 2));
      const clerkMsg = err?.errors?.[0]?.long_message || err?.errors?.[0]?.message || err?.message;
      setApiError(clerkMsg || "Authentication failed.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 24,
              paddingTop: 50,
              paddingBottom: 40,
            }}
            bounces={true}
            alwaysBounceVertical={true}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View>
              {/* Header Title & Subtitle */}
              <View className="mt-3">
                <Text className="font-poppins-bold text-[28px] leading-[34px] tracking-[-0.8px] text-[#0D132B]">
                  {title}
                </Text>
                <Text className="mt-1.5 font-poppins text-[14px] leading-5 text-[#727A98]">
                  {subtitle}
                </Text>
              </View>

              {/* Mascot graphic */}
              <View className="items-center justify-center my-4">
                <Image
                  source={images.mascotAuth}
                  contentFit="contain"
                  style={{ width: 130, height: 110 }}
                />
              </View>

              {/* API Error Banner */}
              {apiError && (
                <View className="mb-2 rounded-[12px] bg-[#FFF0F0] px-4 py-3">
                  <Text className="font-poppins text-[13px] text-[#FF4D4F]">
                    {apiError}
                  </Text>
                </View>
              )}

              {/* Input Form Fields */}
              <View className="gap-2.5">
                {/* Full Name Field (Sign Up Only) */}
                {isSignUp && (
                  <View>
                    <Pressable
                      onPress={() => fullNameInputRef.current?.focus()}
                      android_ripple={{ color: "transparent" }}
                      style={({ pressed }) => [{ opacity: 1 }]}
                      className={`rounded-[16px] border ${
                        fullNameError ? "border-[#FF4D4F] bg-[#FFF8F8]" : "border-[#EEF0F5] bg-white"
                      } px-4 py-2`}
                    >
                      <Text
                        className={`font-poppins-medium text-[11.5px] leading-4 ${
                          fullNameError ? "text-[#FF4D4F]" : "text-[#75809D]"
                        }`}
                      >
                        Full Name
                      </Text>
                      <TextInput
                        ref={fullNameInputRef}
                        value={fullName}
                        onChangeText={handleFullNameChange}
                        autoCapitalize="words"
                        autoComplete="name"
                        placeholder="Alex Morgan"
                        placeholderTextColor="#A0A7BC"
                        selectionColor="#6845F4"
                        cursorColor="#6845F4"
                        style={{
                          fontFamily: "Poppins-Regular",
                          fontSize: 15,
                          color: "#0D132B",
                          padding: 0,
                          marginTop: 2,
                          outlineStyle: "none",
                        } as any}
                      />
                    </Pressable>
                    {fullNameError && (
                      <Text className="mt-1 px-1 font-poppins text-[11.5px] text-[#FF4D4F]">
                        {fullNameError}
                      </Text>
                    )}
                  </View>
                )}

                {/* Email Field Container */}
                <View>
                  <Pressable
                    onPress={() => emailInputRef.current?.focus()}
                    android_ripple={{ color: "transparent" }}
                    style={({ pressed }) => [{ opacity: 1 }]}
                    className={`rounded-[16px] border ${
                      emailError ? "border-[#FF4D4F] bg-[#FFF8F8]" : "border-[#EEF0F5] bg-white"
                    } px-4 py-2`}
                  >
                    <Text
                      className={`font-poppins-medium text-[11.5px] leading-4 ${
                        emailError ? "text-[#FF4D4F]" : "text-[#75809D]"
                      }`}
                    >
                      Email
                    </Text>
                    <TextInput
                      ref={emailInputRef}
                      value={email}
                      onChangeText={handleEmailChange}
                      onBlur={handleEmailBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      placeholder="alex@gmail.com"
                      placeholderTextColor="#A0A7BC"
                      selectionColor="#6845F4"
                      cursorColor="#6845F4"
                      style={{
                        fontFamily: "Poppins-Regular",
                        fontSize: 15,
                        color: "#0D132B",
                        padding: 0,
                        marginTop: 2,
                        outlineStyle: "none",
                      } as any}
                    />
                  </Pressable>
                  {emailError && (
                    <Text className="mt-1 px-1 font-poppins text-[11.5px] text-[#FF4D4F]">
                      {emailError}
                    </Text>
                  )}
                </View>

                {/* Password Field Container */}
                <View>
                  <Pressable
                    onPress={() => passwordInputRef.current?.focus()}
                    android_ripple={{ color: "transparent" }}
                    style={({ pressed }) => [{ opacity: 1 }]}
                    className={`rounded-[16px] border ${
                      passwordError ? "border-[#FF4D4F] bg-[#FFF8F8]" : "border-[#EEF0F5] bg-white"
                    } px-4 py-2`}
                  >
                    <Text
                      className={`font-poppins-medium text-[11.5px] leading-4 ${
                        passwordError ? "text-[#FF4D4F]" : "text-[#75809D]"
                      }`}
                    >
                      Password
                    </Text>
                    <View className="flex-row items-center justify-between">
                      <TextInput
                        ref={passwordInputRef}
                        value={password}
                        onChangeText={handlePasswordChange}
                        secureTextEntry={!showPassword}
                        autoComplete={isSignUp ? "new-password" : "current-password"}
                        placeholder="••••••••"
                        placeholderTextColor="#A0A7BC"
                        selectionColor="#6845F4"
                        cursorColor="#6845F4"
                        style={{
                          fontFamily: "Poppins-Regular",
                          fontSize: 15,
                          letterSpacing: !showPassword && password ? 2 : 0,
                          color: "#0D132B",
                          padding: 0,
                          marginTop: 2,
                          flex: 1,
                          outlineStyle: "none",
                        } as any}
                      />
                      <Pressable
                        onPress={() => setShowPassword((prev) => !prev)}
                        className="p-1"
                        hitSlop={8}
                      >
                        <Image
                          source={showPassword ? images.eyeOpen : images.eyeClosed}
                          style={{ width: 18, height: 18 }}
                          contentFit="contain"
                        />
                      </Pressable>
                    </View>
                  </Pressable>
                  {passwordError && (
                    <Text className="mt-1 px-1 font-poppins text-[11.5px] text-[#FF4D4F]">
                      {passwordError}
                    </Text>
                  )}
                </View>

                {/* Main Action Button */}
                <Pressable
                  className="mt-1 h-[48px] items-center justify-center rounded-[16px] bg-[#6845F4] active:opacity-90 shadow-sm"
                  onPress={handleSubmit}
                  disabled={isFetching}
                >
                  {isFetching ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text className="font-poppins-semibold text-[16px] text-white">
                      {action}
                    </Text>
                  )}
                </Pressable>
              </View>

              {/* Divider */}
              <View className="my-3 flex-row items-center gap-3">
                <View className="h-[1px] flex-1 bg-[#EEF0F5]" />
                <Text className="font-poppins text-[13px] text-[#8F95B2]">
                  or continue with
                </Text>
                <View className="h-[1px] flex-1 bg-[#EEF0F5]" />
              </View>

              {/* Social Auth Buttons */}
              <View className="gap-2.5">
                {/* Google */}
                <Pressable
                  className="relative h-[48px] w-full flex-row items-center justify-center rounded-[16px] border border-[#EEF0F5] bg-white active:bg-gray-50"
                  onPress={() => handleSocialAuth("oauth_google")}
                >
                  <View className="absolute left-4 h-6 w-6 items-center justify-center">
                    <Image
                      source={images.googleLogo}
                      style={{ width: 21, height: 21 }}
                      contentFit="contain"
                    />
                  </View>
                  <Text className="font-poppins-medium text-[14.5px] text-[#0D132B]">
                    Continue with Google
                  </Text>
                </Pressable>

                {/* Facebook */}
                <Pressable
                  className="relative h-[48px] w-full flex-row items-center justify-center rounded-[16px] border border-[#EEF0F5] bg-white active:bg-gray-50"
                  onPress={() => handleSocialAuth("oauth_facebook")}
                >
                  <View className="absolute left-4 h-6 w-6 items-center justify-center">
                    <Image
                      source={images.facebookLogo}
                      style={{ width: 21, height: 21 }}
                      contentFit="contain"
                    />
                  </View>
                  <Text className="font-poppins-medium text-[14.5px] text-[#0D132B]">
                    Continue with Facebook
                  </Text>
                </Pressable>

                {/* Apple */}
                <Pressable
                  className="relative h-[48px] w-full flex-row items-center justify-center rounded-[16px] border border-[#EEF0F5] bg-white active:bg-gray-50"
                  onPress={() => handleSocialAuth("oauth_apple")}
                >
                  <View className="absolute left-4 h-6 w-6 items-center justify-center">
                    <Image
                      source={images.appleLogo}
                      style={{ width: 21, height: 21 }}
                      contentFit="contain"
                    />
                  </View>
                  <Text className="font-poppins-medium text-[14.5px] text-[#0D132B]">
                    Continue with Apple
                  </Text>
                </Pressable>
              </View>

              {/* Bot protection captcha mount point (hidden from UI) */}
              <View nativeID="clerk-captcha" style={{ position: "absolute", width: 0, height: 0, opacity: 0, pointerEvents: "none" }} />
            </View>

            {/* Footer toggle */}
            <View className="mt-7 mb-2">
              <Text className="text-center font-poppins text-[14px] text-[#727A98]">
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
                <Link
                  href={isSignUp ? "/sign-in" : "/sign-up"}
                  className="font-poppins-semibold text-[#6845F4]"
                >
                  {isSignUp ? "Log in" : "Sign up"}
                </Link>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <VerificationModal
        email={email}
        visible={showVerification}
        mode={mode}
        signIn={signIn}
        signUp={signUp}
        onClose={() => setShowVerification(false)}
      />
    </View>
  );
}
