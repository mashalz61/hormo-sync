import { Switch, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme";

interface ToggleRowProps {
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange?: (value: boolean) => void;
  errorText?: string;
}

export const ToggleRow = ({ title, subtitle, value, onValueChange, errorText }: ToggleRowProps) => (
  <View style={styles.wrapper}>
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <Switch
        trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
        thumbColor={theme.colors.white}
        value={value}
        onValueChange={onValueChange}
      />
    </View>
    {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    gap: theme.spacing.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  title: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  subtitle: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  error: {
    ...theme.typography.small,
    color: theme.colors.danger,
  },
});
