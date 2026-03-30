import { router } from "expo-router";
import { useEffect, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppHeader } from "@/components/AppHeader";
import { CustomButton } from "@/components/CustomButton";
import { EmptyState } from "@/components/EmptyState";
import { ReminderItem } from "@/components/ReminderItem";
import { Screen } from "@/components/Screen";
import { SectionTitle } from "@/components/SectionTitle";
import { useAppStore } from "@/store/appStore";
import { theme } from "@/theme";

export default function RemindersTabScreen() {
  const reminders = useAppStore((state) => state.reminders);
  const toggleReminder = useAppStore((state) => state.toggleReminder);
  const reminderFeedback = useAppStore((state) => state.reminderFeedback);
  const clearReminderFeedback = useAppStore((state) => state.clearReminderFeedback);
  const sortedReminders = useMemo(
    () => [...reminders].sort((a, b) => Number(b.enabled) - Number(a.enabled)),
    [reminders],
  );

  const activeCount = reminders.filter((item) => item.enabled).length;
  const pausedCount = reminders.length - activeCount;
  const nextReminder = sortedReminders.find((item) => item.enabled);

  useEffect(() => {
    if (!reminderFeedback) {
      return;
    }

    const timeout = setTimeout(() => {
      clearReminderFeedback();
    }, 2600);

    return () => clearTimeout(timeout);
  }, [clearReminderFeedback, reminderFeedback]);

  return (
    <Screen contentStyle={styles.content}>
      <AppHeader
        rightIcon="add-outline"
        subtitle="Build gentle routines for hydration, movement, sleep, and stress support."
        title="Reminders"
        onRightPress={() => router.push("/reminders/add-reminder")}
      />

      {reminderFeedback ? (
        <View style={styles.feedbackBar} accessibilityRole="alert">
          <Ionicons color={theme.colors.success} name="checkmark-circle" size={16} />
          <Text style={styles.feedbackText}>{reminderFeedback}</Text>
        </View>
      ) : null}

      <View style={styles.snapshotCard}>
        <Text style={styles.snapshotTitle}>Today at a glance</Text>
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Active</Text>
            <Text style={styles.metricValue}>{activeCount}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Paused</Text>
            <Text style={styles.metricValue}>{pausedCount}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Next</Text>
            <Text style={styles.metricValueSmall}>{nextReminder?.time || "None"}</Text>
          </View>
        </View>
      </View>

      <SectionTitle
        title={`Active reminders (${activeCount})`}
        subtitle="Small, consistent habits can make tracking feel calmer and more sustainable."
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
          title="No reminders yet"
          description="Create your first reminder to start building a sustainable wellness routine."
        />
      )}

      <CustomButton
        label="Manage reminder list"
        variant="secondary"
        onPress={() => router.push("/reminders/reminder-list")}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: theme.spacing.xxxl,
  },
  snapshotCard: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  feedbackBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    backgroundColor: "#E7F6F0",
    borderWidth: 1,
    borderColor: "#B7E6D4",
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  feedbackText: {
    ...theme.typography.small,
    color: theme.colors.success,
    flex: 1,
  },
  snapshotTitle: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  metricsRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  metricCard: {
    flex: 1,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceMuted,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    gap: 4,
    alignItems: "center",
  },
  metricLabel: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
  metricValue: {
    ...theme.typography.title2,
    color: theme.colors.text,
  },
  metricValueSmall: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  stack: {
    gap: theme.spacing.md,
  },
});
