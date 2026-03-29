import { StyleSheet, Text, View } from "react-native";

import { AssessmentResult } from "@/types";
import { theme } from "@/theme";
import { MEDICAL_DISCLAIMER, SUPPORTIVE_GUIDANCE } from "@/constants/disclaimer";
import { RiskBadge } from "./RiskBadge";

interface ResultCardProps {
  result: AssessmentResult;
}

export const ResultCard = ({ result }: ResultCardProps) => (
  <View style={styles.card}>
    <RiskBadge risk={result.risk} />
    <Text style={styles.title}>{result.stage}</Text>
    <Text style={styles.summary}>{result.summary}</Text>
    <View style={styles.list}>
      {result.recommendations.map((item) => (
        <Text key={item} style={styles.item}>
          • {item}
        </Text>
      ))}
    </View>
    <View style={styles.footer}>
      <Text style={styles.disclaimer}>{MEDICAL_DISCLAIMER}</Text>
      <Text style={styles.guidance}>{SUPPORTIVE_GUIDANCE}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.md,
    ...theme.shadows.card,
  },
  title: {
    ...theme.typography.title2,
    color: theme.colors.text,
  },
  summary: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  list: {
    gap: theme.spacing.sm,
  },
  item: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  footer: {
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
  },
  disclaimer: {
    ...theme.typography.caption,
    color: theme.colors.text,
  },
  guidance: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
});
