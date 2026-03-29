export const colors = {
  background: "#F3F8FC",
  surface: "#FFFFFF",
  surfaceMuted: "#EAF2F8",
  surfaceAccent: "#E8F5F5",
  border: "#D2E0EC",
  text: "#16324F",
  textMuted: "#4D6783",
  textSoft: "#6F879F",
  primary: "#2B7FFF",
  primaryDark: "#1D61D9",
  secondary: "#3AB7B1",
  accent: "#7A8BFF",
  success: "#219A72",
  warning: "#B98A1A",
  danger: "#C75163",
  info: "#4D82D8",
  shadow: "rgba(22, 50, 79, 0.12)",
  white: "#FFFFFF",
  black: "#000000",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
  pill: 999,
};

export const typography = {
  display: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "700" as const,
    letterSpacing: -0.5,
  },
  title1: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "700" as const,
  },
  title2: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "700" as const,
  },
  title3: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "400" as const,
  },
  bodyStrong: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600" as const,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500" as const,
  },
  small: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500" as const,
  },
};

export const shadows = {
  card: {
    shadowColor: colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
};
