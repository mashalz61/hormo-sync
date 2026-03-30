import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useMemo, useState } from "react";
import { Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme";

interface TimePickerFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  errorText?: string;
}

const toDisplayTime = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  const normalizedHour = ((hours + 11) % 12) + 1;

  return `${String(normalizedHour).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
};

const parseTimeString = (time: string) => {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
  const now = new Date();

  if (!match) {
    return now;
  }

  const hourPart = Number(match[1]);
  const minutePart = Number(match[2]);
  const period = match[3].toUpperCase();
  const normalizedHour =
    period === "PM" ? (hourPart % 12) + 12 : hourPart % 12;

  now.setHours(normalizedHour, minutePart, 0, 0);
  return now;
};

export const TimePickerField = ({
  label,
  value,
  onChange,
  helperText,
  errorText,
}: TimePickerFieldProps) => {
  const selectedDate = useMemo(() => parseTimeString(value), [value]);
  const [iosPickerVisible, setIosPickerVisible] = useState(false);
  const [iosDraftDate, setIosDraftDate] = useState(selectedDate);

  const openTimePicker = () => {
    if (Platform.OS === "ios") {
      setIosDraftDate(selectedDate);
      setIosPickerVisible(true);
      return;
    }

    DateTimePickerAndroid.open({
      mode: "time",
      value: selectedDate,
      is24Hour: false,
      onChange: (_event, date) => {
        if (!date) {
          return;
        }

        onChange(toDisplayTime(date));
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable onPress={openTimePicker} style={[styles.input, errorText && styles.inputError]}>
        <Text style={styles.value}>{value || "Select time"}</Text>
      </Pressable>
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
      {helperText ? <Text style={styles.helper}>{helperText}</Text> : null}

      {Platform.OS === "ios" ? (
        <Modal animationType="slide" transparent visible={iosPickerVisible}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={styles.modalActions}>
                <Pressable onPress={() => setIosPickerVisible(false)} style={styles.modalActionButton}>
                  <Text style={styles.modalActionText}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    onChange(toDisplayTime(iosDraftDate));
                    setIosPickerVisible(false);
                  }}
                  style={styles.modalActionButton}
                >
                  <Text style={styles.modalActionTextPrimary}>Done</Text>
                </Pressable>
              </View>
              <DateTimePicker
                mode="time"
                value={iosDraftDate}
                onChange={(_event, date) => {
                  if (!date) {
                    return;
                  }

                  setIosDraftDate(date);
                }}
                display="spinner"
              />
            </View>
          </View>
        </Modal>
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
  },
  inputError: {
    borderColor: theme.colors.danger,
  },
  value: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  helper: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
  error: {
    ...theme.typography.small,
    color: theme.colors.danger,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.28)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    paddingBottom: theme.spacing.xl,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  modalActionButton: {
    minHeight: 36,
    justifyContent: "center",
  },
  modalActionText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  modalActionTextPrimary: {
    ...theme.typography.bodyStrong,
    color: theme.colors.primary,
  },
});
