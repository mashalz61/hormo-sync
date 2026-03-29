import { router } from "expo-router";

import { AppHeader } from "@/components/AppHeader";
import { ReminderItem } from "@/components/ReminderItem";
import { Screen } from "@/components/Screen";
import { SectionTitle } from "@/components/SectionTitle";
import { useAppStore } from "@/store/appStore";

export default function RemindersTabScreen() {
  const reminders = useAppStore((state) => state.reminders);
  const toggleReminder = useAppStore((state) => state.toggleReminder);

  return (
    <Screen>
      <AppHeader
        rightIcon="add-outline"
        subtitle="Build gentle routines for hydration, movement, sleep, and stress support."
        title="Reminders"
        onRightPress={() => router.push("/reminders/add-reminder")}
      />
      <SectionTitle
        title="Active reminders"
        subtitle="Small, consistent habits can make tracking feel calmer and more sustainable."
      />
      {reminders.map((item) => (
        <ReminderItem
          key={item.id}
          reminder={item}
          onPress={() => router.push("/reminders/reminder-details")}
          onToggle={() => toggleReminder(item.id)}
        />
      ))}
    </Screen>
  );
}
