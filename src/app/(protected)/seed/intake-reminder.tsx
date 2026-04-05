import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { ChildRouteHeader } from "@/components/ChildRouteHeader";
import { CustomButton } from "@/components/CustomButton";
import { Screen } from "@/components/Screen";
import { TimePickerField } from "@/components/TimePickerField";
import { useSeedCycleStore } from "@/store/seedCycleStore";
import { theme } from "@/theme";

const reminderHints = [
  "Breakfast works well if seeds usually go into oats, yogurt, or smoothies.",
  "An afternoon reminder may be better if you tend to eat seeds with snacks or salads.",
  "This screen stores your preferred reminder time in the app flow. It does not yet create an operating-system notification.",
];

export default function IntakeReminderScreen() {
  const { reminderTime, setReminderTime } = useSeedCycleStore();

  return (
    <Screen contentStyle={styles.content}>
      <ChildRouteHeader
        fallbackRoute="/seed/seed-cycle-tracker"
        title="Intake reminder"
        subtitle="Pick a reminder time that fits your meals. The goal is consistency, not perfection."
      />

      <LinearGradient colors={["#F2F2E8", "#FCFBF6", "#F5EFE5"]} style={styles.heroCard}>
        <Text style={styles.heroEyebrow}>Reminder rhythm</Text>
        <Text style={styles.heroTitle}>{reminderTime}</Text>
        <Text style={styles.heroBody}>
          Pick the time you are most likely to already be eating so the reminder reinforces a real
          habit instead of interrupting your day.
        </Text>
      </LinearGradient>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Reminder preference</Text>
        <TimePickerField
          label="Preferred reminder time"
          value={reminderTime}
          onChange={setReminderTime}
          helperText="Choose the time that most naturally matches when you already eat."
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>How to use it well</Text>
        {reminderHints.map((item) => (
          <View key={item} style={styles.row}>
            <View style={styles.dot} />
            <Text style={styles.text}>{item}</Text>
          </View>
        ))}
      </View>

      <CustomButton label="Continue to meal ideas" onPress={() => router.push("/seed/how-to-consume")} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.lg,
  },
  heroCard: {
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: "#E6DDD1",
    padding: theme.spacing.xl,
    gap: theme.spacing.sm,
    ...theme.shadows.card,
  },
  heroEyebrow: {
    ...theme.typography.small,
    color: "#6A7A49",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  heroTitle: {
    ...theme.typography.title1,
    color: theme.colors.text,
  },
  heroBody: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  card: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: "#E4DACF",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
    ...theme.shadows.card,
  },
  sectionTitle: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  row: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    alignItems: "flex-start",
    borderRadius: theme.radius.md,
    backgroundColor: "#FAF8F2",
    padding: theme.spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#A6BA7C",
    marginTop: 7,
  },
  text: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    flex: 1,
  },
});
