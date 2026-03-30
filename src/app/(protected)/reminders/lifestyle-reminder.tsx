import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ChildRouteHeader } from "@/components/ChildRouteHeader";
import { CustomButton } from "@/components/CustomButton";
import { FormSection } from "@/components/FormSection";
import { InfoCard } from "@/components/InfoCard";
import { Screen } from "@/components/Screen";
import { theme } from "@/theme";

const categories = [
  {
    id: "hydration",
    label: "Hydration",
    icon: "water-outline",
    description: "Keep water intake consistent during work blocks and meals.",
  },
  {
    id: "movement",
    label: "Movement",
    icon: "walk-outline",
    description: "Add short walks or stretch breaks to reduce sedentary time.",
  },
  {
    id: "sleep",
    label: "Sleep",
    icon: "moon-outline",
    description: "Set evening wind-down cues for better sleep regularity.",
  },
  {
    id: "stress",
    label: "Stress care",
    icon: "leaf-outline",
    description: "Schedule breathing, journaling, or quiet reset moments.",
  },
] as const;

export default function LifestyleReminderScreen() {
  return (
    <Screen contentStyle={styles.content}>
      <ChildRouteHeader
        fallbackRoute="/reminders"
        title="Lifestyle reminders"
        subtitle="Build gentle nudges for the habits that support hormone balance and daily consistency."
      />

      <InfoCard
        title="Best practice"
        description="Start with one to two reminders first. After they feel easy, add more categories gradually."
      />

      <FormSection>
        <Text style={styles.sectionTitle}>Reminder categories</Text>
        <View style={styles.stack}>
          {categories.map((item) => (
            <View key={item.id} style={styles.categoryCard}>
              <View style={styles.categoryIconWrap}>
                <Ionicons color={theme.colors.primary} name={item.icon} size={18} />
              </View>
              <View style={styles.categoryBody}>
                <Text style={styles.categoryLabel}>{item.label}</Text>
                <Text style={styles.categoryDescription}>{item.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </FormSection>

      <View style={styles.actions}>
        <CustomButton label="Create a reminder" onPress={() => router.push("/reminders/add-reminder")} />
        <CustomButton
          label="Open reminder list"
          variant="secondary"
          onPress={() => router.push("/reminders/reminder-list")}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: theme.spacing.xxxl,
  },
  sectionTitle: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  stack: {
    gap: theme.spacing.sm,
  },
  categoryCard: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceMuted,
    padding: theme.spacing.md,
    flexDirection: "row",
    gap: theme.spacing.md,
    alignItems: "flex-start",
  },
  categoryIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryBody: {
    flex: 1,
    gap: 4,
  },
  categoryLabel: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  categoryDescription: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
  actions: {
    gap: theme.spacing.sm,
  },
});
