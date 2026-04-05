import { StyleSheet, Text, View } from "react-native";

import { ChildRouteHeader } from "@/components/ChildRouteHeader";
import { Screen } from "@/components/Screen";
import { theme } from "@/theme";

const realisticBenefits = [
  "Seeds can make meals richer in fiber, healthy fats, and micronutrients.",
  "A repeatable food routine may make it easier to stick with balanced meals and snacks.",
  "Some early studies suggest seed-based dietary interventions may be a reasonable adjunct for PMS or PCOS care, but the evidence is still limited.",
];

const notProven = [
  "The app should not claim that seed cycling reliably balances estrogen or progesterone.",
  "The app should not imply that a seed routine can diagnose ovulation, infertility, or PCOS.",
  "If symptoms are severe, irregular, or worsening, food routines should not delay medical care.",
];

export default function BenefitsInformationScreen() {
  return (
    <Screen contentStyle={styles.content}>
      <ChildRouteHeader
        fallbackRoute="/seed/seed-cycle-tracker"
        title="Benefits information"
        subtitle="This page keeps the likely nutrition benefits separate from stronger claims that the current evidence cannot fully support."
      />

      <View style={styles.card}>
        <Text style={styles.title}>Reasonable expectations</Text>
        {realisticBenefits.map((item) => (
          <View key={item} style={styles.row}>
            <View style={styles.dot} />
            <Text style={styles.text}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>What remains unproven</Text>
        {notProven.map((item) => (
          <View key={item} style={styles.row}>
            <View style={[styles.dot, styles.warningDot]} />
            <Text style={styles.text}>{item}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.lg,
  },
  card: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: "#E6DBCF",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  title: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#B8C693",
    marginTop: 7,
  },
  warningDot: {
    backgroundColor: theme.colors.warning,
  },
  text: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    flex: 1,
  },
});
