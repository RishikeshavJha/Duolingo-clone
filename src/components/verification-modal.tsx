import { posthog } from "@/lib/posthog";
import { Pressable, Text, View } from "@/tw";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Keyboard,
  KeyboardEvent,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
} from "react-native";

type VerificationModalProps = {
  email: string;
  visible: boolean;
  mode: "sign-up" | "sign-in";
  signIn: any;
  signUp: any;
  setActive?: ((params: { session: string | null }) => Promise<void>) | null;
  onClose?: () => void;
};

export function VerificationModal({
  email,
  visible,
  mode,
  signIn,
  signUp,
  setActive,
  onClose,
}: VerificationModalProps) {
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);
  const [code, setCode] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // Smooth fade-in for the full-screen dimmed off-color backdrop
  const [fadeAnim] = useState(() => new Animated.Value(0));

  // Keyboard offset animation so the card sits directly above the keypad
  const [keyboardOffset] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const handleKeyboardShow = (e: KeyboardEvent) => {
      const height = e.endCoordinates?.height || 0;
      Animated.timing(keyboardOffset, {
        toValue: height,
        duration: Platform.OS === "ios" ? e.duration || 250 : 200,
        useNativeDriver: false,
      }).start();
    };

    const handleKeyboardHide = (e?: KeyboardEvent) => {
      Animated.timing(keyboardOffset, {
        toValue: 0,
        duration: Platform.OS === "ios" ? e?.duration || 250 : 200,
        useNativeDriver: false,
      }).start();
    };

    const subscriptions = [
      Keyboard.addListener(
        Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
        handleKeyboardShow
      ),
      Keyboard.addListener(
        Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
        handleKeyboardHide
      ),
    ];

    if (Platform.OS === "android") {
      subscriptions.push(
        Keyboard.addListener("keyboardWillShow", handleKeyboardShow),
        Keyboard.addListener("keyboardWillHide", handleKeyboardHide)
      );
    }

    return () => {
      subscriptions.forEach((sub) => sub.remove());
    };
  }, [keyboardOffset]);

  useEffect(() => {
    if (visible) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCode("");
      setVerifyError(null);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      const t1 = setTimeout(() => {
        inputRef.current?.focus();
      }, 80);
      const t2 = setTimeout(() => {
        inputRef.current?.focus();
      }, 250);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      fadeAnim.setValue(0);
      keyboardOffset.setValue(0);
    }
  }, [visible, fadeAnim, keyboardOffset]);

  const verifyCode = async (enteredCode: string) => {
    setIsVerifying(true);
    setVerifyError(null);

    try {
      if (mode === "sign-up") {
        const { error } = await signUp.verifications.verifyEmailCode({
          code: enteredCode,
        });

        if (error) {
          setVerifyError(error.message ?? "Invalid code. Please try again.");
          setCode("");
          inputRef.current?.focus();
          return;
        }

        if (signUp.status === "complete") {
          inputRef.current?.blur();
          Keyboard.dismiss();
          if (signUp.createdSessionId && setActive) {
            await setActive({ session: signUp.createdSessionId });
          }
          await signUp.finalize();
          posthog?.capture("account_authenticated", {
            authentication_method: "email_verification",
            account_action: "sign_up",
          });
          if (onClose) onClose();
          setTimeout(() => router.replace("/"), 150);
        } else {
          setVerifyError("Verification incomplete. Please check your code.");
          setCode("");
          inputRef.current?.focus();
        }
      } else {
        const { error } = await signIn.mfa.verifyEmailCode({ code: enteredCode });

        if (error) {
          setVerifyError(error.message ?? "Invalid code. Please try again.");
          setCode("");
          inputRef.current?.focus();
          return;
        }

        if (signIn.status === "complete") {
          inputRef.current?.blur();
          Keyboard.dismiss();
          if (signIn.createdSessionId && setActive) {
            await setActive({ session: signIn.createdSessionId });
          }
          await signIn.finalize();
          posthog?.capture("account_authenticated", {
            authentication_method: "email_verification",
            account_action: "sign_in",
          });
          if (onClose) onClose();
          setTimeout(() => router.replace("/"), 150);
        } else {
          setVerifyError("Verification incomplete. Please check your code.");
          setCode("");
          inputRef.current?.focus();
        }
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      const msg =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        err?.message ||
        "Invalid code. Please try again.";
      setVerifyError(msg);
      setCode("");
      inputRef.current?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCodeChange = (value: string) => {
    const nextCode = value.replace(/\D/g, "").slice(0, 6);
    setCode(nextCode);
    setVerifyError(null);

    if (nextCode.length === 6) {
      inputRef.current?.blur();
      Keyboard.dismiss();
      verifyCode(nextCode);
    }
  };

  const handleResend = async () => {
    setCode("");
    setVerifyError(null);
    try {
      if (mode === "sign-up") {
        const { error } = await signUp.verifications.sendEmailCode();
        if (error) setVerifyError(error.message ?? "Could not resend code.");
      } else {
        const { error } = await signIn.mfa.sendEmailCode();
        if (error) setVerifyError(error.message ?? "Could not resend code.");
      }
    } catch (err: any) {
      const msg = err?.message || "Could not resend code.";
      setVerifyError(msg);
    }
    inputRef.current?.focus();
  };

  const handleDismiss = () => {
    inputRef.current?.blur();
    Keyboard.dismiss();
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      if (onClose) onClose();
    });
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleDismiss}
    >
      <View style={styles.overlayRoot}>
        {/* Full-screen off-color dimmed backdrop covering 100% of the display */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.backdrop,
            { opacity: fadeAnim },
          ]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={handleDismiss}
          />
        </Animated.View>

      {/* Animated container that lifts the card directly above the keypad */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            paddingBottom: keyboardOffset,
          },
        ]}
        pointerEvents="box-none"
      >
        {/* Verification Card */}
        <View className="relative mx-4 mb-3 rounded-[28px] bg-white px-6 pb-6 pt-5 shadow-2xl">
          {/* Close button */}
          <Pressable
            onPress={handleDismiss}
            hitSlop={12}
            className="absolute right-4 top-4 h-8 w-8 items-center justify-center rounded-full bg-[#F3F4F8]"
          >
            <Text className="font-poppins-semibold text-[14px] text-[#75809D]">✕</Text>
          </Pressable>

          {/* Sparkle Icon */}
          <View className="mb-3 self-center rounded-full bg-[#F1EEFF] px-3.5 py-2.5">
            <Text className="font-poppins-bold text-[20px] text-[#6845F4]">✦</Text>
          </View>

          {/* Title */}
          <Text className="text-center font-poppins-bold text-[20px] leading-7 text-[#0D132B]">
            Check your email
          </Text>

          {/* Subtitle */}
          <Text className="mt-1 text-center font-poppins text-[13px] leading-5 text-[#727A98]">
            We sent a 6-digit code to{" "}
            <Text className="font-poppins-semibold text-[#0D132B]">
              {email || "your email"}
            </Text>
            . Enter it below to continue.
          </Text>

          {/* Error message */}
          {verifyError && (
            <View className="mt-3 rounded-[10px] bg-[#FFF0F0] px-3 py-2">
              <Text className="text-center font-poppins text-[12.5px] text-[#FF4D4F]">
                {verifyError}
              </Text>
            </View>
          )}

          {/* OTP Container: interactive TextInput covering the visual digit boxes */}
          <View style={styles.digitContainer}>
            {/* Visual digit row */}
            <View style={styles.digitRow} pointerEvents="none">
              {Array.from({ length: 6 }, (_, index) => {
                const isCurrent = isFocused && index === code.length;
                const isFilled = Boolean(code[index]);
                return (
                  <View
                    key={index}
                    style={[
                      styles.digitBox,
                      isFilled
                        ? styles.digitBoxFilled
                        : isCurrent
                        ? styles.digitBoxCurrent
                        : styles.digitBoxEmpty,
                    ]}
                  >
                    {isVerifying && index === 0 ? (
                      <ActivityIndicator size="small" color="#6845F4" />
                    ) : (
                      <Text className="font-poppins-bold text-[20px] text-[#0D132B]">
                        {code[index] ?? ""}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>

            {/* Full-size TextInput covering the 6 boxes */}
            <TextInput
              ref={inputRef}
              value={code}
              onChangeText={handleCodeChange}
              keyboardType="number-pad"
              inputMode="numeric"
              maxLength={6}
              textContentType="oneTimeCode"
              autoComplete="one-time-code"
              caretHidden
              autoFocus
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              style={styles.realInput}
              editable={!isVerifying}
            />
          </View>

          {/* Resend Code Link */}
          <View className="mt-4 flex-row items-center justify-center">
            <Text className="font-poppins text-[13px] text-[#727A98]">
              Didn&apos;t receive it?{" "}
            </Text>
            <Pressable onPress={handleResend} hitSlop={8} disabled={isVerifying}>
              <Text className="font-poppins-semibold text-[13px] text-[#6845F4]">
                Resend code
              </Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </View>
  </Modal>
);
}

const styles = StyleSheet.create({
  overlayRoot: {
    ...StyleSheet.absoluteFill,
    zIndex: 1000,
    elevation: 1000,
  },
  backdrop: {
    backgroundColor: "rgba(13, 19, 43, 0.65)",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  digitContainer: {
    position: "relative",
    width: "100%",
    height: 52,
    marginTop: 20,
  },
  digitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    width: "100%",
    height: 52,
  },
  digitBox: {
    flex: 1,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    borderWidth: 2,
  },
  digitBoxCurrent: {
    borderColor: "#6845F4",
    backgroundColor: "#FBF9FF",
  },
  digitBoxFilled: {
    borderColor: "#6845F4",
    backgroundColor: "#F5F2FF",
  },
  digitBoxEmpty: {
    borderColor: "#EEF0F5",
    backgroundColor: "#FFFFFF",
  },
  realInput: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: 52,
    opacity: 0.01,
    color: "transparent",
    fontSize: 1,
  },
});
