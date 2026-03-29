import { router } from "expo-router";

import { CustomButton } from "@/components/CustomButton";
import { ReminderItem } from "@/components/ReminderItem";
import { Screen } from "@/components/Screen";
import { SectionTitle } from "@/components/SectionTitle";
import { useAppStore } from "@/store/appStore";

export default function ReminderListScreen() {
  const reminders = useAppStore((state) => state.reminders);
  const toggleReminder = useAppStore((state) => state.toggleReminder);

  return (
    <Screen>
      <SectionTitle
        title="Reminder list"
        subtitle="See all active reminders and adjust them as your routine changes."
      />
      {reminders.map((item) => (
        <ReminderItem
          key={item.id}
          reminder={item}
          onPress={() => router.push("/reminders/reminder-details")}
          onToggle={() => toggleReminder(item.id)}
        />
      ))}
      <CustomButton label="Add reminder" onPress={() => router.push("/reminders/add-reminder")} />
    </Screen>
  );
}
