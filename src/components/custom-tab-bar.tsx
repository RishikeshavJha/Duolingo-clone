import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type CustomTabBarProps = Parameters<
  NonNullable<React.ComponentProps<typeof Tabs>["tabBar"]>
>[0];

/** Map each tab route name to its Ionicons icon pair (active, inactive). */
const TAB_ICONS: Record<
  string,
  { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }
> = {
  index: { active: "home", inactive: "home-outline" },
  learn: { active: "book", inactive: "book-outline" },
  "ai-teacher": { active: "headset", inactive: "headset-outline" },
  chat: { active: "chatbubble-ellipses", inactive: "chatbubble-ellipses-outline" },
  profile: { active: "person", inactive: "person-outline" },
};

const TAB_LABELS: Record<string, string> = {
  index: "Home",
  learn: "Learn",
  "ai-teacher": "AI Teacher",
  chat: "Chat",
  profile: "Profile",
};

const ACTIVE_CIRCLE_SIZE = 48;
const ACTIVE_COLOR = "#6C4EF5";
const INACTIVE_COLOR = "#6B7280";
const ICON_SIZE_ACTIVE = 24;
const ICON_SIZE_INACTIVE = 22;

export function CustomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [containerWidth, setContainerWidth] = useState(0);
  const translateX = useSharedValue(0);
  const isFirstRender = useRef(true);

  const numTabs = state.routes.length;

  useEffect(() => {
    if (containerWidth > 0 && numTabs > 0) {
      const tabWidth = containerWidth / numTabs;
      const targetX = state.index * tabWidth + (tabWidth - ACTIVE_CIRCLE_SIZE) / 2;

      if (isFirstRender.current) {
        translateX.value = targetX;
        isFirstRender.current = false;
      } else {
        translateX.value = withTiming(targetX, {
          duration: 200,
          easing: Easing.out(Easing.quad),
        });
      }
    }
  }, [state.index, containerWidth, numTabs, translateX]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    if (width > 0 && width !== containerWidth) {
      setContainerWidth(width);
    }
  };

  return (
    <View
      onLayout={handleLayout}
      style={{
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "#F0F0F5",
        paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
        paddingTop: 8,
        position: "relative",
      }}
    >
      {/* Animated active circle background */}
      {containerWidth > 0 && (
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 8,
              left: 0,
              height: ACTIVE_CIRCLE_SIZE,
              width: ACTIVE_CIRCLE_SIZE,
              borderRadius: ACTIVE_CIRCLE_SIZE / 2,
              backgroundColor: ACTIVE_COLOR,
              zIndex: 0,
            },
            circleStyle,
          ]}
          pointerEvents="none"
        />
      )}

      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const iconConfig = TAB_ICONS[route.name];
        const label = TAB_LABELS[route.name] ?? options.title ?? route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              flex: 1,
              height: ACTIVE_CIRCLE_SIZE,
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            {isFocused ? (
              /* Active tab: icon only inside colored circle */
              <View
                style={{
                  width: ACTIVE_CIRCLE_SIZE,
                  height: ACTIVE_CIRCLE_SIZE,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name={iconConfig?.active ?? "help"}
                  size={ICON_SIZE_ACTIVE}
                  color="#FFFFFF"
                />
              </View>
            ) : (
              /* Inactive tab: icon + label */
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name={iconConfig?.inactive ?? "help-outline"}
                  size={ICON_SIZE_INACTIVE}
                  color={INACTIVE_COLOR}
                />
                <Text
                  style={{
                    fontFamily: "Poppins-Medium",
                    fontSize: 10.5,
                    color: INACTIVE_COLOR,
                    marginTop: 2,
                  }}
                  numberOfLines={1}
                >
                  {label}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
