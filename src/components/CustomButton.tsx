import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

import { theme } from "@/theme";

interface CustomButtonProps {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
  disabled?: boolean;
}

export const CustomButton = ({
  label,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
}: CustomButtonProps) => (
  <Pressable
    disabled={disabled || loading}
    onPress={onPress}
    style={[styles.base, styles[variant], disabled && styles.disabled]}
  >
    {loading ? (
      <ActivityIndicator
        color={variant === "primary" ? theme.colors.white : theme.colors.text}
      />
    ) : (
      <Text
        style={[
          styles.label,
          variant !== "primary" && styles.labelAlt,
          disabled && styles.labelDisabled,
        ]}
      >
        {label}
      </Text>
    )}
  </Pressable>
);

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    borderRadius: theme.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xl,
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  ghost: {
    backgroundColor: theme.colors.surfaceMuted,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    ...theme.typography.bodyStrong,
    color: theme.colors.white,
  },
  labelAlt: {
    color: theme.colors.text,
  },
  labelDisabled: {
    color: theme.colors.white,
  },
});
