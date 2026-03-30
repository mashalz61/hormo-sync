import { router } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { ChildRouteHeader } from "@/components/ChildRouteHeader";
import { CustomButton } from "@/components/CustomButton";
import { EmptyState } from "@/components/EmptyState";
import { ReminderItem } from "@/components/ReminderItem";
import { Screen } from "@/components/Screen";
import { SectionTitle } from "@/components/SectionTitle";
import { useAppStore } from "@/store/appStore";
import { theme } from "@/theme";

export default function ReminderListScreen() {
  const reminders = useAppStore((state) => state.reminders);
  const toggleReminder = useAppStore((state) => state.toggleReminder);
  const sortedReminders = useMemo(
    () => [...reminders].sort((a, b) => Number(b.enabled) - Number(a.enabled)),
    [reminders],
  );
  const activeCount = reminders.filter((item) => item.enabled).length;
  const pausedCount = reminders.length - activeCount;

  return (
    <Screen contentStyle={styles.content}>
      <ChildRouteHeader
        backLabel="Back to reminders"
        fallbackRoute="/reminders"
        title="Reminder List"
        subtitle="Review all routines in one place and tune what should stay active this week."
      />

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total reminders</Text>
          <Text style={styles.summaryValue}>{reminders.length}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Active now</Text>
          <Text style={styles.summaryValue}>{activeCount}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Paused</Text>
          <Text style={styles.summaryValue}>{pausedCount}</Text>
        </View>
      </View>

      <SectionTitle
        title="All reminders"
        subtitle="Tap a reminder to view details, and use the switch to pause or re-enable instantly."
      />

      {sortedReminders.length ? (
        <View style={styles.stack}>
          {sortedReminders.map((item) => (
            <ReminderItem
              key={item.id}
              reminder={item}
              onPress={() => router.push(`/reminders/reminder-details?id=${item.id}`)}
              onToggle={() => toggleReminder(item.id)}
            />
          ))}
        </View>
      ) : (
        <EmptyState
          title="No reminders configured"
          description="Add a reminder to keep hydration, sleep, and movement habits on track."
        />
      )}

      <CustomButton label="Add reminder" onPress={() => router.push("/reminders/add-reminder")} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: theme.spacing.xxxl,
  },
  summaryRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  summaryCard: {
    flex: 1,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    gap: 4,
    alignItems: "center",
  },
  summaryLabel: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
    textAlign: "center",
  },
  summaryValue: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  stack: {
    gap: theme.spacing.md,
  },
});
