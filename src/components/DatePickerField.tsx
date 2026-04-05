import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme";
import { formatCycleDateLabel, parseCycleDate, toCycleDateInput } from "@/utils/cycleTracker";

interface DatePickerFieldProps {
  label: string;
  value: string;
  helperText?: string;
  onChange?: (value: string) => void;
  minimumDate?: string;
  maximumDate?: string;
  errorText?: string;
}

export const DatePickerField = ({
  label,
  value,
  helperText,
  onChange,
  minimumDate,
  maximumDate,
  errorText,
}: DatePickerFieldProps) => {
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [draftDate, setDraftDate] = useState<Date>(parseCycleDate(value) ?? new Date());

  const openPicker = () => {
    setDraftDate(parseCycleDate(value) ?? new Date());
    setPickerVisible(true);
  };

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setPickerVisible(false);
      return;
    }

    if (!selectedDate) {
      return;
    }

    setDraftDate(selectedDate);

    if (Platform.OS !== "ios") {
      setPickerVisible(false);
      onChange?.(toCycleDateInput(selectedDate));
    }
  };

  const commitIosValue = () => {
    setPickerVisible(false);
    onChange?.(toCycleDateInput(draftDate));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable onPress={openPicker} style={[styles.input, errorText && styles.inputError]}>
        <View style={styles.inputRow}>
          <Text style={[styles.value, !value && styles.placeholder]}>
            {value ? formatCycleDateLabel(value) : "Select a date"}
          </Text>
          <Ionicons color={theme.colors.primaryDark} name="calendar-outline" size={18} />
        </View>
      </Pressable>
      <Text style={[styles.helper, errorText && styles.helperError]}>
        {errorText || helperText || "Select the first day of bleeding for each period."}
      </Text>

      {isPickerVisible ? (
        <View style={styles.pickerCard}>
          <DateTimePicker
            display={Platform.OS === "ios" ? "spinner" : "default"}
            maximumDate={parseCycleDate(maximumDate) ?? undefined}
            minimumDate={parseCycleDate(minimumDate) ?? undefined}
            mode="date"
            onChange={handleChange}
            value={draftDate}
          />
          {Platform.OS === "ios" ? (
            <View style={styles.iosActions}>
              <Pressable onPress={() => setPickerVisible(false)} style={styles.iosAction}>
                <Text style={styles.iosActionText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={commitIosValue} style={styles.iosActionPrimary}>
                <Text style={styles.iosActionPrimaryText}>Done</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  label: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  input: {
    minHeight: 54,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
    ...theme.shadows.card,
  },
  inputError: {
    borderColor: theme.colors.danger,
    backgroundColor: "#FFF6F7",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  value: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  placeholder: {
    color: theme.colors.textSoft,
  },
  helper: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
  helperError: {
    color: theme.colors.danger,
  },
  pickerCard: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceElevated,
    padding: theme.spacing.md,
  },
  iosActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  iosAction: {
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceMuted,
  },
  iosActionPrimary: {
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
  },
  iosActionText: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  iosActionPrimaryText: {
    ...theme.typography.bodyStrong,
    color: theme.colors.white,
  },
});
