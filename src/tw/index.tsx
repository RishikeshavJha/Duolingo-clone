import { useCssElement } from "react-native-css";
import type React from "react";
import { Pressable as RNPressable, Text as RNText, View as RNView } from "react-native";

type ClassNameProps = { className?: string };
// Narrow the library's deeply generic return type to keep TypeScript responsive.
const cssElement: any = useCssElement;

/** CSS-enabled React Native primitives for NativeWind v5. */
export const View = (props: React.ComponentProps<typeof RNView> & ClassNameProps) =>
  cssElement(RNView, props, { className: "style" });
export const Text = (props: React.ComponentProps<typeof RNText> & ClassNameProps) =>
  cssElement(RNText, props, { className: "style" });
export const Pressable = (props: React.ComponentProps<typeof RNPressable> & ClassNameProps) =>
  cssElement(RNPressable, props, { className: "style" });
