import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { AppHeader } from "@/components/AppHeader";
import { InfoCard } from "@/components/InfoCard";
import { Screen } from "@/components/Screen";
import { SectionTitle } from "@/components/SectionTitle";
import { ServiceCard } from "@/components/ServiceCard";
import { services } from "@/data/mockData";
import { theme } from "@/theme";

export default function TrackerTabScreen() {
  const trackerServices = services.filter((service) =>
    ["cycle", "food", "seed"].includes(service.id),
  );

  return (
    <Screen contentStyle={styles.content}>
      <AppHeader
        subtitle="Stay close to your cycle, meals, and seed routine in one place."
        title="Tracker"
      />

      <View style={styles.highlightCard}>
        <View style={styles.highlightTopRow}>
          <View style={styles.highlightBadge}>
            <Ionicons color={theme.colors.primaryDark} name="sparkles-outline" size={14} />
            <Text style={styles.highlightBadgeText}>Tracker Hub</Text>
          </View>
          <View style={styles.highlightPulse} />
        </View>
        <View style={styles.highlightContent}>
          <Text style={styles.highlightTitle}>Build a clearer picture of your daily rhythm</Text>
          <Text style={styles.highlightBody}>
            Log food, cycle, and seed routines in one place so patterns feel easier to spot and
            easier to act on.
          </Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>core tools</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>1 min</Text>
            <Text style={styles.statLabel}>to check in</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>Daily</Text>
            <Text style={styles.statLabel}>small wins</Text>
          </View>
        </View>
      </View>

      <SectionTitle
        title="Tracking tools"
        subtitle="Low-friction check-ins designed to feel fast, focused, and easy to return to."
      />
      <View style={styles.serviceStack}>
        {trackerServices.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onPress={() => router.push(service.route as never)}
          />
        ))}
      </View>

      <View style={styles.tipShell}>
        <InfoCard
          title="Consistency tip"
          description="Track around the same time each day to make patterns easier to review in weekly summaries."
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.lg,
  },
  highlightCard: {
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: "#E9D5DF",
    backgroundColor: "#FFF9FB",
    padding: theme.spacing.xl,
    gap: theme.spacing.lg,
    ...theme.shadows.card,
  },
  highlightTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  highlightBadge: {
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
  highlightBadgeText: {
    ...theme.typography.small,
    color: theme.colors.primaryDark,
    letterSpacing: 0.4,
  },
  highlightPulse: {
    width: 12,
    height: 12,
    borderRadius: theme.radius.pill,
    backgroundColor: "#D68CAA",
  },
  highlightContent: {
    gap: theme.spacing.xs,
  },
  highlightTitle: {
    ...theme.typography.title2,
    color: theme.colors.text,
  },
  highlightBody: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  statsRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: "#F0DFE7",
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    gap: 2,
  },
  statValue: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  statLabel: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
  serviceStack: {
    gap: theme.spacing.lg,
  },
  tipShell: {
    borderRadius: theme.radius.xl,
    overflow: "hidden",
  },
});
