import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { CustomButton } from "@/components/CustomButton";
import { ChildRouteHeader } from "@/components/ChildRouteHeader";
import { EmptyState } from "@/components/EmptyState";
import { FormSection } from "@/components/FormSection";
import { InputField } from "@/components/InputField";
import { Screen } from "@/components/Screen";
import { SelectChips } from "@/components/SelectChips";
import { TimePickerField } from "@/components/TimePickerField";
import { useAppStore } from "@/store/appStore";
import { ReminderFrequency } from "@/types";
import { theme } from "@/theme";

export default function EditReminderScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const reminders = useAppStore((state) => state.reminders);
  const updateReminder = useAppStore((state) => state.updateReminder);
  const setReminderFeedback = useAppStore((state) => state.setReminderFeedback);

  const reminder = useMemo(
    () => reminders.find((item) => item.id === id) || reminders[0],
    [id, reminders],
  );

  const [activity, setActivity] = useState("");
  const [time, setTime] = useState("");
  const [frequency, setFrequency] = useState<ReminderFrequency>("Daily");
  const [purpose, setPurpose] = useState("");
  const [activityError, setActivityError] = useState<string | null>(null);
  const [timeError, setTimeError] = useState<string | null>(null);

  useEffect(() => {
    if (!reminder) {
      return;
    }

    setActivity(reminder.activity);
    setTime(reminder.time);
    setFrequency(reminder.frequency);
    setPurpose(reminder.purpose);
  }, [reminder]);

  if (!reminder) {
    return (
      <Screen>
        <EmptyState
          title="Reminder not found"
          description="The selected reminder no longer exists. Return to the list and choose another item."
        />
        <CustomButton label="Back to reminders" onPress={() => router.replace("/reminders")} />
      </Screen>
    );
  }

  const saveChanges = () => {
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

    updateReminder(reminder.id, {
      activity: trimmedActivity,
      time: trimmedTime,
      frequency,
      purpose: trimmedPurpose || reminder.purpose,
    });

    setReminderFeedback("Reminder updated successfully.");
    router.replace("/reminders");
  };

  return (
    <Screen contentStyle={styles.content}>
      <ChildRouteHeader
        fallbackRoute="/reminders"
        title="Edit reminder"
        subtitle="Refine timing and wording so this reminder feels actionable, specific, and easy to follow."
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

        <InputField label="Purpose" value={purpose} onChangeText={setPurpose} />
      </FormSection>

      <View style={styles.actions}>
        <CustomButton label="Save changes" onPress={saveChanges} />
        <CustomButton
          label="Cancel"
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
  fieldGroup: {
    gap: theme.spacing.sm,
  },
  fieldLabel: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  actions: {
    gap: theme.spacing.sm,
  },
});
