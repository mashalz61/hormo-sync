import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { ChildRouteHeader } from "@/components/ChildRouteHeader";
import { CustomButton } from "@/components/CustomButton";
import { DatePickerField } from "@/components/DatePickerField";
import { FormSection } from "@/components/FormSection";
import { Screen } from "@/components/Screen";
import { theme } from "@/theme";

const cycleHighlights = [
  {
    label: "Current phase",
    value: "Follicular",
    icon: "sparkles-outline" as const,
  },
  {
    label: "Last cycle",
    value: "31 days",
    icon: "calendar-outline" as const,
  },
  {
    label: "Period length",
    value: "5 days",
    icon: "water-outline" as const,
  },
];

const reminders = [
  "Log your dates as close to real time as possible for a clearer summary.",
  "Tracking two cycles is enough to start spotting regularity patterns.",
];

export default function MenstrualCycleTrackerScreen() {
  return (
    <Screen contentStyle={styles.content}>
      <ChildRouteHeader
        fallbackRoute="/tracker"
        title="Menstrual cycle tracker"
        subtitle="Capture your current and previous cycle dates to build a clearer view of timing, flow, and rhythm."
      />

      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroBadge}>
            <Ionicons color={theme.colors.primaryDark} name="heart-outline" size={14} />
            <Text style={styles.heroBadgeText}>Cycle Care</Text>
          </View>
          <View style={styles.heroStatus}>
            <Text style={styles.heroStatusText}>Updated for March</Text>
          </View>
        </View>

        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Keep your cycle history in one calm, consistent place</Text>
          <Text style={styles.heroBody}>
            A few simple date entries help turn scattered notes into a timeline you can actually
            review and use.
          </Text>
        </View>

        <View style={styles.highlightRow}>
          {cycleHighlights.map((item) => (
            <View key={item.label} style={styles.highlightCard}>
              <View style={styles.highlightIcon}>
                <Ionicons color={theme.colors.primaryDark} name={item.icon} size={16} />
              </View>
              <Text style={styles.highlightValue}>{item.value}</Text>
              <Text style={styles.highlightLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <FormSection>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionEyebrow}>Cycle timeline</Text>
          <Text style={styles.sectionTitle}>Add the dates you want included in your summary</Text>
          <Text style={styles.sectionBody}>
            Start with the current cycle, then add the previous cycle start so the app can compare
            your recent pattern.
          </Text>
        </View>

        <DatePickerField
          helperText="The first day bleeding started for your current period."
          label="Current period start date"
          value="2026-03-02"
        />
        <DatePickerField
          helperText="The day your current period fully ended."
          label="Current period end date"
          value="2026-03-06"
        />
        <DatePickerField
          helperText="Use the first day of your last period for comparison."
          label="Previous cycle start date"
          value="2026-02-01"
        />
      </FormSection>

      <View style={styles.insightCard}>
        <View style={styles.insightHeader}>
          <Text style={styles.insightTitle}>What this helps you see</Text>
          <View style={styles.insightPill}>
            <Text style={styles.insightPillText}>Summary ready</Text>
          </View>
        </View>

        <View style={styles.bulletList}>
          {reminders.map((item) => (
            <View key={item} style={styles.bulletRow}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      <CustomButton
        label="View cycle summary"
        onPress={() => router.push("/tracker/cycle-summary")}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.lg,
  },
  heroCard: {
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: "#E8D0DC",
    backgroundColor: "#FFF9FB",
    padding: theme.spacing.xl,
    gap: theme.spacing.lg,
    ...theme.shadows.card,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
    flexWrap: "wrap",
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm + 2,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: "#FBEAF1",
    borderWidth: 1,
    borderColor: "#EDD5E0",
  },
  heroBadgeText: {
    ...theme.typography.small,
    color: theme.colors.primaryDark,
    letterSpacing: 0.3,
  },
  heroStatus: {
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: "#EDD6E2",
    paddingHorizontal: theme.spacing.sm + 2,
    paddingVertical: 6,
  },
  heroStatusText: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
  heroContent: {
    gap: theme.spacing.xs,
  },
  heroTitle: {
    ...theme.typography.title2,
    color: theme.colors.text,
  },
  heroBody: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  highlightRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  highlightCard: {
    flex: 1,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: "#F0DDE6",
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    gap: 4,
  },
  highlightIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FCEEF4",
    borderWidth: 1,
    borderColor: "#ECD3DE",
    marginBottom: 2,
  },
  highlightValue: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  highlightLabel: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
  sectionHeader: {
    gap: theme.spacing.xs,
  },
  sectionEyebrow: {
    ...theme.typography.small,
    color: theme.colors.primaryDark,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  sectionTitle: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  sectionBody: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  insightCard: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: "#E7D3DD",
    backgroundColor: "#FFFDFE",
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  insightTitle: {
    ...theme.typography.title3,
    color: theme.colors.text,
    flex: 1,
  },
  insightPill: {
    borderRadius: theme.radius.pill,
    backgroundColor: "#FBEAF1",
    paddingHorizontal: theme.spacing.sm + 2,
    paddingVertical: 6,
  },
  insightPillText: {
    ...theme.typography.small,
    color: theme.colors.primaryDark,
  },
  bulletList: {
    gap: theme.spacing.sm,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.sm,
  },
  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.secondary,
    marginTop: 7,
  },
  bulletText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    flex: 1,
  },
});
