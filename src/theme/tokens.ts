export const colors = {
  background: "#FFF6F9",
  backgroundStrong: "#FCECF3",
  backgroundTint: "#F7E4ED",
  surface: "#FFFFFF",
  surfaceMuted: "#FCEFF4",
  surfaceAccent: "#FBE8F0",
  surfaceElevated: "#FFF9FC",
  border: "#EBCFDC",
  borderStrong: "#E1C0CF",
  text: "#4C3140",
  textMuted: "#7C5B69",
  textSoft: "#A78693",
  primary: "#CC5C89",
  primaryDark: "#A94770",
  secondary: "#E7A1BE",
  accent: "#DA7FA6",
  success: "#219A72",
  warning: "#B98A1A",
  danger: "#C75163",
  info: "#B06A89",
  shadow: "rgba(94, 52, 71, 0.12)",
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
  float: {
    shadowColor: colors.black,
    shadowOpacity: 0.12,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
  },
};
