import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme";

interface ProgressStepperProps {
  currentStep: number;
  totalSteps: number;
  label?: string;
}

export const ProgressStepper = ({
  currentStep,
  totalSteps,
  label,
}: ProgressStepperProps) => (
  <View style={styles.wrapper}>
    <View style={styles.row}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const active = index < currentStep;
        return <View key={index} style={[styles.bar, active && styles.barActive]} />;
      })}
    </View>
    <Text style={styles.label}>{label || `Step ${currentStep} of ${totalSteps}`}</Text>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    gap: theme.spacing.sm,
  },
  row: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  bar: {
    flex: 1,
    height: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.border,
  },
  barActive: {
    backgroundColor: theme.colors.primary,
  },
  label: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
});
