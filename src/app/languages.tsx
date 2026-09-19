import { images } from "@/constants/images";
import { LANGUAGES } from "@/data/languages";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { useLanguageStore } from "@/store/languageStore";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LanguagesScreen() {
  const { selectedLanguage, setLanguage } = useLanguageStore();
  const [selected, setSelected] = useState<string | null>(selectedLanguage?.code || "es"); // Default Spanish selected
  const [search, setSearch] = useState("");

  const filtered = LANGUAGES.filter(
    (lang) =>
      lang.name.toLowerCase().includes(search.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLang = LANGUAGES.find((l) => l.code === selected);

  function handleConfirm() {
    if (selected) {
      const lang = LANGUAGES.find((l) => l.code === selected);
      if (lang) {
        setLanguage(lang);
      }
    }
    router.replace("/");
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* Header - Compact */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 16,
          paddingTop: 6,
          paddingBottom: 10,
          position: "relative",
        }}
      >
        <Pressable
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            }
          }}
          hitSlop={14}
          style={{
            position: "absolute",
            left: 16,
            width: 36,
            height: 36,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins-SemiBold",
              fontSize: 22,
              color: "#0D132B",
              lineHeight: 26,
            }}
          >
            ‹
          </Text>
        </Pressable>
        <Text
          style={{
            fontFamily: "Poppins-SemiBold",
            fontSize: 17,
            color: "#0D132B",
          }}
        >
          Choose a language
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 10,
          flexGrow: 1,
          justifyContent: "space-between",
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <View>
          {/* Search bar - Compact rounded pill */}
          <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#F8F9FD",
                borderRadius: 22,
                paddingHorizontal: 14,
                height: 42,
                borderWidth: 1,
                borderColor: "#ECEEF3",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#9AA0B8",
                  marginRight: 8,
                }}
              >
                🔍
              </Text>
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search languages"
                placeholderTextColor="#9AA0B8"
                style={{
                  flex: 1,
                  fontFamily: "Poppins-Regular",
                  fontSize: 14,
                  color: "#0D132B",
                  paddingVertical: 0,
                }}
              />
            </View>
          </View>

          {/* Popular section header */}
          {search.length === 0 && (
            <Text
              style={{
                fontFamily: "Poppins-Bold",
                fontSize: 15,
                color: "#0D132B",
                paddingHorizontal: 18,
                marginBottom: 6,
              }}
            >
              Popular
            </Text>
          )}

          {/* Language Cards List - Compact card rows matching mockup */}
          <View style={{ paddingHorizontal: 16 }}>
            {filtered.map((lang) => {
              const isSelected = selected === lang.code;

              return (
                <Pressable
                  key={lang.code}
                  onPress={() => setSelected(lang.code)}
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: isSelected ? "#F6F4FE" : "#FFFFFF",
                    borderRadius: 16,
                    borderWidth: isSelected ? 1.5 : 1,
                    borderColor: isSelected ? "#6C4DF6" : "#ECEEF3",
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    marginBottom: 6,
                    opacity: pressed ? 0.85 : 1,
                  })}
                >
                  {/* Circular Flag Badge */}
                  <View
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 19,
                      backgroundColor: "#F4F5F9",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                      overflow: "hidden",
                    }}
                  >
                    <Text style={{ fontSize: 22 }}>{lang.flag}</Text>
                  </View>

                  {/* Language Name & Learner Count */}
                  <View style={{ flex: 1, justifyContent: "center" }}>
                    <Text
                      style={{
                        fontFamily: "Poppins-SemiBold",
                        fontSize: 15,
                        color: "#0D132B",
                        lineHeight: 20,
                      }}
                    >
                      {lang.name}
                    </Text>
                    {lang.learners ? (
                      <Text
                        style={{
                          fontFamily: "Poppins-Regular",
                          fontSize: 12,
                          color: "#8E95A5",
                          lineHeight: 16,
                        }}
                      >
                        {lang.learners} learners
                      </Text>
                    ) : null}
                  </View>

                  {/* Selection Indicator: Purple checkmark circle or grey chevron */}
                  {isSelected ? (
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: "#6C4DF6",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontSize: 12,
                          fontFamily: "Poppins-Bold",
                          lineHeight: 15,
                        }}
                      >
                        ✓
                      </Text>
                    </View>
                  ) : (
                    <Text
                      style={{
                        fontSize: 17,
                        color: "#C4C9D8",
                        fontFamily: "Poppins-Regular",
                      }}
                    >
                      ›
                    </Text>
                  )}
                </Pressable>
              );
            })}

            {filtered.length === 0 && (
              <Text
                style={{
                  fontFamily: "Poppins-Regular",
                  fontSize: 14,
                  color: "#9AA0B8",
                  textAlign: "center",
                  paddingTop: 24,
                  paddingBottom: 24,
                }}
              >
                No languages found
              </Text>
            )}

            {/* Confirmation Button replacing "See all languages" */}
            <Pressable
              onPress={handleConfirm}
              disabled={!selected}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: selected ? "#6C4DF6" : "#E8E9EF",
                borderRadius: 16,
                height: 46,
                marginTop: 2,
                marginBottom: 4,
                opacity: pressed ? 0.88 : 1,
                shadowColor: selected ? "#5538D4" : "transparent",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
                elevation: selected ? 3 : 0,
              })}
            >
              <Text
                style={{
                  fontFamily: "Poppins-SemiBold",
                  fontSize: 15,
                  color: selected ? "#FFFFFF" : "#9AA0B8",
                }}
              >
                {selectedLang ? `Continue with ${selectedLang.name}` : "Select a language"}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Earth illustration anchored at bottom */}
        <View
          style={{
            width: "100%",
            height: 100,
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "flex-start",
            marginTop: 2,
          }}
        >
          <Image
            source={images.earth}
            contentFit="contain"
            style={{
              width: "100%",
              height: 170,
              marginTop: -10,
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
