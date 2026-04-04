import { StyleSheet, Text, View } from "react-native";

import { PredictionUiResult } from "@/types/api";
import { theme } from "@/theme";

interface PredictionResultCardProps {
  result: PredictionUiResult;
}

export const PredictionResultCard = ({ result }: PredictionResultCardProps) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <Text style={styles.eyebrow}>{result.title}</Text>
      <Text style={styles.verdict}>{result.verdict}</Text>
    </View>

    <Text style={styles.detail}>{result.detail}</Text>

    {result.scoreLabel && result.scoreValue ? (
      <View style={styles.metricPill}>
        <Text style={styles.metricLabel}>{result.scoreLabel}</Text>
        <Text style={styles.metricValue}>{result.scoreValue}</Text>
      </View>
    ) : null}

    <View style={styles.rawBlock}>
      <Text style={styles.rawLabel}>Backend response</Text>
      <Text style={styles.rawText}>{JSON.stringify(result.raw, null, 2)}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    ...theme.shadows.card,
  },
  header: {
    gap: theme.spacing.xs,
  },
  eyebrow: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
    textTransform: "uppercase",
  },
  verdict: {
    ...theme.typography.title2,
    color: theme.colors.text,
  },
  detail: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  metricPill: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  metricLabel: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    textTransform: "uppercase",
  },
  metricValue: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  rawBlock: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  rawLabel: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    textTransform: "uppercase",
  },
  rawText: {
    ...theme.typography.caption,
    color: theme.colors.text,
  },
});
