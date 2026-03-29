import { StyleSheet, Text, View } from "react-native";

import { CyclePhase } from "@/types";
import { theme } from "@/theme";

interface CyclePhaseCardProps {
  phase: CyclePhase;
  description: string;
}

export const CyclePhaseCard = ({ phase, description }: CyclePhaseCardProps) => (
  <View style={styles.card}>
    <Text style={styles.label}>Current cycle phase</Text>
    <Text style={styles.phase}>{phase}</Text>
    <Text style={styles.description}>{description}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.textSoft,
  },
  phase: {
    ...theme.typography.title2,
    color: theme.colors.text,
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
});
