/** Lingua design-system tokens. Use these outside NativeWind class names. */
export const colors = {
  brand: { purple: "#6C4EF5", deepPurple: "#5B3BF6", blue: "#4D8BFF", green: "#21C16B" },
  semantic: { success: "#21C16B", warning: "#FFC800", streak: "#FF8A00", error: "#FF4D4F", info: "#4D8BFF" },
  neutral: { textPrimary: "#0D132B", textSecondary: "#6B7280", border: "#E5E7EB", surface: "#F6F7FB", background: "#FFFFFF" },
} as const;

export const typography = {
  h1: { fontFamily: "Poppins-Bold", fontSize: 32, lineHeight: 38.4 },
  h2: { fontFamily: "Poppins-SemiBold", fontSize: 24, lineHeight: 31.2 },
  h3: { fontFamily: "Poppins-SemiBold", fontSize: 20, lineHeight: 26 },
  h4: { fontFamily: "Poppins-Medium", fontSize: 16, lineHeight: 22.4 },
  bodyLarge: { fontFamily: "Poppins-Regular", fontSize: 16, lineHeight: 25.6 },
  bodyMedium: { fontFamily: "Poppins-Regular", fontSize: 14, lineHeight: 22.4 },
  bodySmall: { fontFamily: "Poppins-Regular", fontSize: 13, lineHeight: 20.8 },
  caption: { fontFamily: "Poppins-Regular", fontSize: 11, lineHeight: 15.4 },
} as const;

export const radii = { card: 20, control: 14, pill: 9999 } as const;
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 } as const;
export const designTokens = { colors, typography, radii, spacing } as const;
