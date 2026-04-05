import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

import { Reminder } from "@/types";
import { theme } from "@/theme";

interface ReminderItemProps {
  reminder: Reminder;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

const getReminderIcon = (activity: string): keyof typeof Ionicons.glyphMap => {
  const value = activity.toLowerCase();

  if (value.includes("hydration") || value.includes("water")) {
    return "water-outline";
  }

  if (value.includes("walk") || value.includes("exercise") || value.includes("move")) {
    return "walk-outline";
  }

  if (value.includes("sleep")) {
    return "moon-outline";
  }

  if (value.includes("stress") || value.includes("calm")) {
    return "leaf-outline";
  }

  return "notifications-outline";
};

export const ReminderItem = ({ reminder, onPress, onToggle }: ReminderItemProps) => {
  const iconName = getReminderIcon(reminder.activity);

  return (
    <View style={styles.card}>
      <Pressable onPress={onPress} style={styles.header} accessibilityRole={onPress ? "button" : undefined}>
        <View style={styles.timeGroup}>
          <View style={styles.iconWrap}>
            <Ionicons color={theme.colors.primary} name={iconName} size={16} />
          </View>
          <Text style={styles.time}>{reminder.time}</Text>
        </View>
        <View style={[styles.statusPill, reminder.enabled ? styles.statusPillActive : styles.statusPillPaused]}>
          <Text style={[styles.statusText, reminder.enabled ? styles.statusTextActive : styles.statusTextPaused]}>
            {reminder.enabled ? "Active" : "Paused"}
          </Text>
        </View>
      </Pressable>

      <Pressable onPress={onPress} style={styles.body} accessibilityRole={onPress ? "button" : undefined}>
        <Text style={styles.activity}>{reminder.activity}</Text>
        <Text style={styles.purpose}>{reminder.purpose}</Text>
      </Pressable>

      <View style={styles.footer}>
        <View style={styles.frequencyChip}>
          <Text style={styles.frequencyText}>{reminder.frequency}</Text>
        </View>
        <View style={styles.switchWrap}>
          <Text style={styles.switchLabel}>{reminder.enabled ? "On" : "Off"}</Text>
          <Switch
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={theme.colors.white}
            value={reminder.enabled}
            onValueChange={onToggle}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.md,
    ...theme.shadows.card,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  timeGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    flex: 1,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceAccent,
  },
  time: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  statusPill: {
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderWidth: 1,
    maxWidth: "100%",
  },
  statusPillActive: {
    backgroundColor: "#E7F6F0",
    borderColor: "#B7E6D4",
  },
  statusPillPaused: {
    backgroundColor: "#F9EEF2",
    borderColor: theme.colors.border,
  },
  statusText: {
    ...theme.typography.small,
    flexShrink: 1,
  },
  statusTextActive: {
    color: theme.colors.success,
  },
  statusTextPaused: {
    color: theme.colors.textMuted,
  },
  body: {
    gap: 8,
  },
  activity: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  purpose: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    lineHeight: 21,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.spacing.sm,
    flexWrap: "wrap",
  },
  frequencyChip: {
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    backgroundColor: theme.colors.surfaceMuted,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  frequencyText: {
    ...theme.typography.small,
    color: theme.colors.text,
  },
  switchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  switchLabel: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
});
