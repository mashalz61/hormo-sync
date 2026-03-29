import { Pressable, StyleSheet, Text, View } from "react-native";

import { Reminder } from "@/types";
import { theme } from "@/theme";
import { ToggleRow } from "./ToggleRow";

interface ReminderItemProps {
  reminder: Reminder;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

export const ReminderItem = ({ reminder, onPress, onToggle }: ReminderItemProps) => (
  <Pressable onPress={onPress} style={styles.card}>
    <Text style={styles.time}>{reminder.time}</Text>
    <ToggleRow
      title={reminder.activity}
      subtitle={`${reminder.frequency} • ${reminder.purpose}`}
      value={reminder.enabled}
      onValueChange={onToggle}
    />
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  time: {
    ...theme.typography.small,
    color: theme.colors.textSoft,
    textTransform: "uppercase",
    marginBottom: theme.spacing.sm,
  },
});
