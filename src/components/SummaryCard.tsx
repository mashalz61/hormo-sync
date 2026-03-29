import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme";

interface SummaryCardProps {
  label: string;
  value: string;
  accent?: string;
}

export const SummaryCard = ({ label, value, accent }: SummaryCardProps) => (
  <View style={[styles.card, accent ? { backgroundColor: accent } : null]}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 96,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  value: {
    ...theme.typography.title2,
    color: theme.colors.text,
  },
});
