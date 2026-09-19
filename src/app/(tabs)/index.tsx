import { images } from "@/constants/images";
import { LANGUAGES } from "@/data/languages";
import { getLessonsByUnitId } from "@/data/lessons";
import { UNITS } from "@/data/units";
import { posthog } from "@/lib/posthog";
import { useLanguageStore } from "@/store/languageStore";
import { colors } from "@/theme/tokens";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/** Greeting helper according to language code */
function getGreeting(languageCode?: string): string {
  switch (languageCode) {
    case "es":
      return "Hola";
    case "fr":
      return "Bonjour";
    case "ja":
      return "Konnichiwa";
    case "ko":
      return "Annyeong";
    case "de":
      return "Hallo";
    case "zh":
      return "Nǐ hǎo";
    default:
      return "Hola";
  }
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { selectedLanguage } = useLanguageStore();

  const selectedCode = typeof selectedLanguage === "string"
    ? selectedLanguage
    : selectedLanguage?.code ?? "es";

  const language = LANGUAGES.find((l) => l.code === selectedCode) ?? LANGUAGES[0];
  const unit = UNITS.find((u) => u.languageCode === selectedCode) ?? UNITS[0];
  const firstName = user?.firstName ?? "Alex";
  const greeting = getGreeting(selectedCode);

  const xpToday = 15;
  const dailyGoal = 20;
  const xpProgress = dailyGoal > 0 ? Math.min((xpToday / dailyGoal) * 100, 100) : 0;

  const lessons = useMemo(
    () => (unit ? getLessonsByUnitId(unit.id) : []),
    [unit]
  );
  const currentLesson = lessons[0];

  const currentLevelText = unit
    ? `A1 • Unit ${unit.unitNumber || 1}`
    : "A1 • Unit 3";

  const openLearning = (entryPoint: "continue" | "view_all" | "lesson" | "vocabulary") => {
    posthog?.capture("learning_opened", {
      entry_point: entryPoint,
      language_code: selectedCode,
    });
    router.navigate("/learn");
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.neutral.background }}
      edges={["top"]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* — Header — */}
        <View className="flex-row items-center justify-between mb-5">
          <View className="flex-row items-center gap-[10px]">
            <Pressable
              onPress={() => router.push("/languages")}
              style={({ pressed }) => [
                styles.flagButton,
                pressed && { opacity: 0.75, transform: [{ scale: 0.96 }] },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Select Language"
            >
              {language?.flag.startsWith("http") ? (
                <Image
                  source={{ uri: language.flag }}
                  className="w-[34px] h-[34px] rounded-full"
                />
              ) : (
                <Text style={styles.flagText}>{language?.flag ?? "🇪🇸"}</Text>
              )}
            </Pressable>

            <Text style={styles.greetingText} numberOfLines={1}>
              {greeting}, {firstName}! 👋
            </Text>
          </View>

          <View className="flex-row items-center gap-3">
            <View style={styles.streakContainer}>
              <Image
                source={images.streakFire}
                style={styles.streakIcon}
                contentFit="contain"
              />
              <Text style={styles.streakText}>12</Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.notificationButton,
                pressed && { opacity: 0.7 },
              ]}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Notifications"
            >
              <Ionicons
                name="notifications-outline"
                size={23}
                color="#0D132B"
              />
            </Pressable>
          </View>
        </View>

        {/* Daily Goal Card */}
        <View style={styles.dailyGoalCard}>
          <View style={styles.dailyGoalContent}>
            <Text style={styles.dailyGoalLabel}>Daily goal</Text>
            <View style={styles.dailyGoalXpRow}>
              <Text style={styles.dailyGoalCurrentXp}>{xpToday}</Text>
              <Text style={styles.dailyGoalTotalXp}> / {dailyGoal} XP</Text>
            </View>

            {/* Progress bar */}
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${xpProgress}%` },
                ]}
              />
            </View>
          </View>

          <Image
            source={images.treasure}
            style={styles.treasureImage}
            contentFit="contain"
          />
        </View>

        {/* Continue Learning Banner */}
        <View style={styles.continueCard}>
          <View style={styles.continueCardContent}>
            <Text style={styles.continueCardSubtitle}>Continue learning</Text>
            <Text style={styles.continueCardTitle}>{language.name}</Text>
            <Text style={styles.continueCardLevel}>{currentLevelText}</Text>

            <Pressable
              onPress={() => openLearning("continue")}
              style={({ pressed }) => [
                styles.continueButton,
                pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Continue learning ${language.name}`}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </Pressable>
          </View>

          <Image
            source={images.palace}
            style={styles.palaceImage}
            contentFit="contain"
          />
        </View>

        {/* Today's Plan Section */}
        <View style={styles.planSection}>
          <View style={styles.planHeaderRow}>
            <Text style={styles.planSectionTitle}>Today&apos;s plan</Text>
            <Pressable
              onPress={() => openLearning("view_all")}
              hitSlop={8}
            >
              <Text style={styles.viewAllText}>View all</Text>
            </Pressable>
          </View>

          {/* Plan Item 1: Lesson */}
          <Pressable
            onPress={() => openLearning("lesson")}
            style={({ pressed }) => [
              styles.planItem,
              pressed && { opacity: 0.8 },
            ]}
          >
            <View style={[styles.planIconWrapper, { backgroundColor: "#6C4EF5" }]}>
              <Ionicons name="book" size={22} color="#FFFFFF" />
            </View>
            <View style={styles.planItemInfo}>
              <Text style={styles.planItemTitle}>Lesson</Text>
              <Text style={styles.planItemSubtitle}>
                {currentLesson ? currentLesson.title : "At the café"}
              </Text>
            </View>
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark" size={15} color="#FFFFFF" />
            </View>
          </Pressable>

          {/* Plan Item 2: AI Conversation */}
          <Pressable
            onPress={() => {
              posthog?.capture("ai_teacher_opened", {
                entry_point: "today_plan",
                language_code: selectedCode,
              });
              router.navigate("/ai-teacher");
            }}
            style={({ pressed }) => [
              styles.planItem,
              pressed && { opacity: 0.8 },
            ]}
          >
            <View style={[styles.planIconWrapper, { backgroundColor: "#6C4EF5" }]}>
              <Ionicons name="headset" size={22} color="#FFFFFF" />
            </View>
            <View style={styles.planItemInfo}>
              <Text style={styles.planItemTitle}>AI Conversation</Text>
              <Text style={styles.planItemSubtitle}>Talk about your day</Text>
            </View>
            <View style={styles.uncompletedBadge} />
          </Pressable>

          {/* Plan Item 3: New Words */}
          <Pressable
            onPress={() => openLearning("vocabulary")}
            style={({ pressed }) => [
              styles.planItem,
              pressed && { opacity: 0.8 },
            ]}
          >
            <View style={[styles.planIconWrapper, { backgroundColor: "#FF6565" }]}>
              <Ionicons name="shapes" size={22} color="#FFFFFF" />
            </View>
            <View style={styles.planItemInfo}>
              <Text style={styles.planItemTitle}>New words</Text>
              <Text style={styles.planItemSubtitle}>
                {currentLesson?.vocabulary?.length
                  ? `${currentLesson.vocabulary.length} words`
                  : "10 words"}
              </Text>
            </View>
            <View style={styles.uncompletedBadge} />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 24,
  },
  flagButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  flagText: {
    fontSize: 22,
    lineHeight: 28,
  },
  greetingText: {
    fontFamily: "Poppins-Bold",
    fontSize: 19,
    color: "#0D132B",
    flexShrink: 1,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8F0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakIcon: {
    width: 22,
    height: 24,
    marginRight: 4,
  },
  streakText: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: "#4B5563",
  },
  notificationButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  dailyGoalCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF9F0",
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 16,
  },
  dailyGoalContent: {
    flex: 1,
    marginRight: 12,
  },
  dailyGoalLabel: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#6B7280",
  },
  dailyGoalXpRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 4,
    marginBottom: 12,
  },
  dailyGoalCurrentXp: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: "#0D132B",
    lineHeight: 28,
  },
  dailyGoalTotalXp: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#6B7280",
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: "#FFE5CA",
    borderRadius: 9999,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#FF8400",
    borderRadius: 9999,
  },
  treasureImage: {
    width: 80,
    height: 76,
  },
  continueCard: {
    backgroundColor: "#6748F7",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 22,
    marginBottom: 24,
    position: "relative",
    overflow: "hidden",
    minHeight: 166,
  },
  continueCardContent: {
    width: "60%",
    zIndex: 2,
  },
  continueCardSubtitle: {
    fontFamily: "Poppins-Medium",
    fontSize: 13.5,
    color: "rgba(255, 255, 255, 0.85)",
  },
  continueCardTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: "#FFFFFF",
    marginTop: 2,
    marginBottom: 2,
  },
  continueCardLevel: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 14,
  },
  continueButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderRadius: 9999,
    alignSelf: "flex-start",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  continueButtonText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#6C4EF5",
  },
  palaceImage: {
    position: "absolute",
    right: -4,
    bottom: -6,
    width: 156,
    height: 166,
    zIndex: 1,
  },
  planSection: {
    marginBottom: 16,
  },
  planHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  planSectionTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: "#0D132B",
  },
  viewAllText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#6C4EF5",
  },
  planItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  planIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  planItemInfo: {
    flex: 1,
  },
  planItemTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 15,
    color: "#0D132B",
    marginBottom: 1,
  },
  planItemSubtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "#6B7280",
  },
  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#6C4EF5",
    alignItems: "center",
    justifyContent: "center",
  },
  uncompletedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#9FA7B8",
  },
});
