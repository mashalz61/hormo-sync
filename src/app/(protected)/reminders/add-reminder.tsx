import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { CustomButton } from "@/components/CustomButton";
import { ChildRouteHeader } from "@/components/ChildRouteHeader";
import { FormSection } from "@/components/FormSection";
import { InfoCard } from "@/components/InfoCard";
import { InputField } from "@/components/InputField";
import { Screen } from "@/components/Screen";
import { SelectChips } from "@/components/SelectChips";
import { TimePickerField } from "@/components/TimePickerField";
import { useAppStore } from "@/store/appStore";
import { ReminderFrequency } from "@/types";
import { theme } from "@/theme";

export default function AddReminderScreen() {
  const addReminder = useAppStore((state) => state.addReminder);
  const setReminderFeedback = useAppStore((state) => state.setReminderFeedback);
  const [activity, setActivity] = useState("Morning hydration");
  const [time, setTime] = useState("09:00 AM");
  const [frequency, setFrequency] = useState<ReminderFrequency>("Daily");
  const [purpose, setPurpose] = useState("Support hydration and steady daytime energy.");
  const [activityError, setActivityError] = useState<string | null>(null);
  const [timeError, setTimeError] = useState<string | null>(null);

  const saveReminder = () => {
    const trimmedActivity = activity.trim();
    const trimmedTime = time.trim();
    const trimmedPurpose = purpose.trim();

    const activityValidationMessage = trimmedActivity ? null : "Activity is required.";
    const timeValidationMessage = trimmedTime ? null : "Time is required.";

    setActivityError(activityValidationMessage);
    setTimeError(timeValidationMessage);

    if (activityValidationMessage || timeValidationMessage) {
      return;
    }

    const reminderId = `rem-${Date.now()}`;

    addReminder({
      id: reminderId,
      activity: trimmedActivity,
      time: trimmedTime,
      frequency,
      enabled: true,
      purpose: trimmedPurpose || "Support daily wellness consistency.",
    });

    setReminderFeedback("Reminder saved successfully.");
    router.replace("/reminders");
  };

  return (
    <Screen contentStyle={styles.content}>
      <ChildRouteHeader
        fallbackRoute="/reminders"
        title="Create reminder"
        subtitle="Set a focused cue that supports your daily routine without overwhelming your schedule."
      />

      <InfoCard
        title="Quick setup tip"
        description="Pick one behavior, one clear time, and one specific purpose. Simpler reminders are easier to keep."
      />

      <FormSection>
        <InputField
          label="Activity"
          value={activity}
          onChangeText={(value) => {
            setActivity(value);
            if (activityError) {
              setActivityError(null);
            }
          }}
          helperText="Short and specific works best, e.g. Morning hydration."
          errorText={activityError || undefined}
        />
        <TimePickerField
          label="Time"
          value={time}
          onChange={(value) => {
            setTime(value);
            if (timeError) {
              setTimeError(null);
            }
          }}
          helperText="Use a readable format like 07:30 AM."
          errorText={timeError || undefined}
        />

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Frequency</Text>
          <SelectChips
            options={["Daily", "Weekdays", "Custom"]}
            value={frequency}
            onChange={(value) => setFrequency(value as ReminderFrequency)}
          />
        </View>

        <InputField
          label="Purpose"
          value={purpose}
          onChangeText={setPurpose}
          helperText="Example: Keep hydration and focus steady in the first half of the day."
        />
      </FormSection>

      <FormSection>
        <Text style={styles.previewTitle}>Preview</Text>
        <View style={styles.previewCard}>
          <Text style={styles.previewTime}>{time || "09:00 AM"}</Text>
          <Text style={styles.previewActivity}>{activity || "Wellness reminder"}</Text>
          <Text style={styles.previewMeta}>
            {frequency} • {purpose || "Support daily consistency."}
          </Text>
        </View>
      </FormSection>

      <CustomButton label="Save reminder" onPress={saveReminder} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: theme.spacing.xxxl,
  },
  fieldGroup: {
    gap: theme.spacing.sm,
  },
  fieldLabel: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  previewTitle: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  previewCard: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceMuted,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  previewTime: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    textTransform: "uppercase",
  },
  previewActivity: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  previewMeta: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
});
