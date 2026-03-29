import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme";

interface DatePickerFieldProps {
  label: string;
  value: string;
  helperText?: string;
  onPress?: () => void;
}

export const DatePickerField = ({ label, value, helperText, onPress }: DatePickerFieldProps) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <Pressable onPress={onPress} style={styles.input}>
      <Text style={[styles.value, !value && styles.placeholder]}>
        {value || "Select a date"}
      </Text>
    </Pressable>
    <Text style={styles.helper}>
      {helperText || "TODO: Connect a native date picker for production."}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  label: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  input: {
    minHeight: 54,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  value: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  placeholder: {
    color: theme.colors.textSoft,
  },
  helper: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
});
