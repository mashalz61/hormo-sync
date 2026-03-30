import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { Pressable } from "react-native";
import { StyleSheet, Switch, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { CustomButton } from "@/components/CustomButton";
import { ChildRouteHeader } from "@/components/ChildRouteHeader";
import { EmptyState } from "@/components/EmptyState";
import { FormSection } from "@/components/FormSection";
import { Screen } from "@/components/Screen";
import { useAppStore } from "@/store/appStore";
import { theme } from "@/theme";

export default function ReminderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const reminders = useAppStore((state) => state.reminders);
  const toggleReminder = useAppStore((state) => state.toggleReminder);

  const reminder = useMemo(
    () => reminders.find((item) => item.id === id) || reminders[0],
    [id, reminders],
  );

  if (!reminder) {
    return (
      <Screen>
        <EmptyState
          title="Reminder not found"
          description="This reminder is unavailable right now. Return to the list and select another one."
        />
        <CustomButton label="Back to reminders" onPress={() => router.replace("/reminders")} />
      </Screen>
    );
  }

  return (
    <Screen contentStyle={styles.content}>
      <ChildRouteHeader
        fallbackRoute="/reminders"
        title={reminder.activity}
        subtitle={reminder.purpose}
        rightAction={
          <Pressable
            accessibilityRole="button"
            style={styles.editAction}
            onPress={() => router.push(`/reminders/edit-reminder?id=${reminder.id}`)}
          >
            <Ionicons color={theme.colors.primary} name="create-outline" size={16} />
            <Text style={styles.editActionLabel}>Edit reminder</Text>
          </Pressable>
        }
      />

      <View style={styles.heroCard}>
        <View style={styles.heroMeta}>
          <View style={styles.iconWrap}>
            <Ionicons color={theme.colors.primary} name="alarm-outline" size={20} />
          </View>
          <View style={styles.heroTextWrap}>
            <Text style={styles.heroTime}>{reminder.time}</Text>
            <Text style={styles.heroFrequency}>{reminder.frequency} schedule</Text>
          </View>
        </View>
        <View style={styles.switchWrap}>
          <Text style={styles.switchLabel}>{reminder.enabled ? "Enabled" : "Paused"}</Text>
          <Switch
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={theme.colors.white}
            value={reminder.enabled}
            onValueChange={() => toggleReminder(reminder.id)}
          />
        </View>
      </View>

      <FormSection>
        <Text style={styles.sectionTitle}>Reminder overview</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Activity</Text>
          <Text style={styles.detailValue}>{reminder.activity}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Schedule</Text>
          <Text style={styles.detailValue}>
            {reminder.frequency} at {reminder.time}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status</Text>
          <Text style={styles.detailValue}>{reminder.enabled ? "Active" : "Paused"}</Text>
        </View>
      </FormSection>

      <FormSection>
        <Text style={styles.sectionTitle}>Why this reminder matters</Text>
        <View style={styles.bulletList}>
          <Text style={styles.bullet}>• It turns intention into a visible daily cue.</Text>
          <Text style={styles.bullet}>• It supports consistency without relying on memory.</Text>
          <Text style={styles.bullet}>• You can pause and restart anytime as routines change.</Text>
        </View>
      </FormSection>

      <View style={styles.actions}>
        <CustomButton
          label="Edit reminder"
          onPress={() => router.push(`/reminders/edit-reminder?id=${reminder.id}`)}
        />
        <CustomButton
          label="Back to reminders"
          variant="secondary"
          onPress={() => router.replace("/reminders")}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: theme.spacing.xxxl,
  },
  editAction: {
    minHeight: 44,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  editActionLabel: {
    ...theme.typography.caption,
    color: theme.colors.primary,
  },
  heroCard: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    ...theme.shadows.card,
  },
  heroMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceAccent,
  },
  heroTextWrap: {
    gap: 2,
  },
  heroTime: {
    ...theme.typography.title2,
    color: theme.colors.text,
  },
  heroFrequency: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  switchWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchLabel: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  sectionTitle: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  detailLabel: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    flex: 1,
  },
  detailValue: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
    flex: 1,
    textAlign: "right",
  },
  bulletList: {
    gap: theme.spacing.sm,
  },
  bullet: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  actions: {
    gap: theme.spacing.sm,
  },
});
