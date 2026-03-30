import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { AssessmentRouteHeader } from "@/components/AssessmentRouteHeader";
import { CustomButton } from "@/components/CustomButton";
import { FormSection } from "@/components/FormSection";
import { Screen } from "@/components/Screen";
import { theme } from "@/theme";
import { getBmiCategory } from "@/utils/health";

export default function BmiResultScreen() {
  const params = useLocalSearchParams<{
    bmi?: string | string[];
    weight?: string | string[];
    height?: string | string[];
  }>();

  const bmi = getNumericParam(params.bmi) || 24.8;
  const weight = getNumericParam(params.weight);
  const height = getNumericParam(params.height);
  const category = getBmiCategory(bmi);
  const categoryBadge = getCategoryBadge(category);
  const categoryNote = getCategoryNote(category);
  const recommendation = getCategoryRecommendation(category);

  return (
    <Screen contentStyle={styles.content}>
      <AssessmentRouteHeader title="BMI Result" />
      <LinearGradient
        colors={["#FFFFFF", "#FAEEF3", "#F6E8EF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.summaryCard}
      >
        <View style={styles.summaryHeader}>
          <View>
            <Text style={styles.summaryEyebrow}>BMI Summary</Text>
            <Text style={styles.summaryTitle}>Your current category</Text>
          </View>
          <View style={styles.summaryIconWrap}>
            <Ionicons color="#CC5C89" name="analytics-outline" size={20} />
          </View>
        </View>

        <View style={styles.resultRow}>
          <Text style={styles.bmiValue}>{bmi.toFixed(1)}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: categoryBadge.backgroundColor }]}>
            <Text style={[styles.categoryBadgeText, { color: categoryBadge.textColor }]}>{category}</Text>
          </View>
        </View>
        <Text style={styles.categoryText}>{categoryNote}</Text>
      </LinearGradient>

      <FormSection>
        <Text style={styles.sectionTitle}>Measurement Snapshot</Text>
        <View style={styles.metricRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Weight</Text>
            <Text style={styles.metricValue}>{weight ? `${weight} kg` : "--"}</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Height</Text>
            <Text style={styles.metricValue}>{height ? `${height} cm` : "--"}</Text>
          </View>
        </View>
      </FormSection>

      <View style={styles.insightSection}>
        <FormSection>
          <Text style={styles.sectionTitle}>Insight</Text>
          <View style={styles.infoRow}>
            <Ionicons color={theme.colors.primary} name="information-circle-outline" size={18} />
            <Text style={styles.infoText}>
              BMI is a useful screening metric and should be interpreted with body composition,
              symptoms, and lab context.
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons color={theme.colors.primary} name="heart-outline" size={18} />
            <Text style={styles.infoText}>{recommendation}</Text>
          </View>
        </FormSection>
      </View>

      <FormSection>
        <Text style={styles.sectionTitle}>BMI Categories</Text>
        {BMI_RANGES.map((item) => {
          const isActive = item.name === category;
          return (
            <View key={item.name} style={[styles.rangeRow, isActive && styles.rangeRowActive]}>
              <Text style={[styles.rangeName, isActive && styles.rangeNameActive]}>{item.name}</Text>
              <Text style={styles.rangeValue}>{item.range}</Text>
            </View>
          );
        })}
      </FormSection>

      <View style={styles.ctaContainer}>
        <CustomButton label="Recalculate BMI" onPress={() => router.back()} variant="secondary" />
      </View>
    </Screen>
  );
}

const BMI_RANGES = [
  { name: "Underweight", range: "< 18.5" },
  { name: "Normal", range: "18.5 - 24.9" },
  { name: "Overweight", range: "25 - 29.9" },
  { name: "Obese", range: ">= 30" },
];

const getNumericParam = (value?: string | string[]) => {
  const normalized = Array.isArray(value) ? value[0] : value;
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

const getCategoryBadge = (category: string) => {
  if (category === "Underweight") {
    return { backgroundColor: "#F4D4DE", textColor: "#A94770" };
  }
  if (category === "Normal") {
    return { backgroundColor: "#D6F0DC", textColor: "#2F7A4E" };
  }
  if (category === "Overweight") {
    return { backgroundColor: "#FBE6C5", textColor: "#9B6B00" };
  }
  return { backgroundColor: "#F6D1D7", textColor: "#9D3B4A" };
};

const getCategoryNote = (category: string) => {
  if (category === "Underweight") {
    return "You are below the standard BMI range. Focus on balanced nutrition and follow-up guidance.";
  }
  if (category === "Normal") {
    return "You are currently within the healthy BMI range.";
  }
  if (category === "Overweight") {
    return "You are above the healthy BMI range. Small lifestyle shifts can improve trends over time.";
  }
  return "You are in the obesity range. A personalized care plan can support safe progress.";
};

const getCategoryRecommendation = (category: string) => {
  if (category === "Underweight") {
    return "Prioritize consistent meal timing, protein-rich foods, and clinician review if weight loss is unintentional.";
  }
  if (category === "Normal") {
    return "Continue your current balanced eating and regular movement routine.";
  }
  if (category === "Overweight") {
    return "Aim for sustainable daily movement, portion awareness, and sleep consistency.";
  }
  return "Discuss a structured nutrition and activity plan with your healthcare provider.";
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  summaryCard: {
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: "#EACFDC",
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryEyebrow: {
    ...theme.typography.small,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: theme.colors.textMuted,
  },
  summaryTitle: {
    ...theme.typography.title3,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  summaryIconWrap: {
    height: 44,
    width: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7EAF0",
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bmiValue: {
    ...theme.typography.display,
    color: theme.colors.text,
  },
  categoryBadge: {
    borderRadius: theme.radius.pill,
    paddingVertical: 6,
    paddingHorizontal: theme.spacing.md,
  },
  categoryBadgeText: {
    ...theme.typography.caption,
  },
  categoryText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  sectionTitle: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  metricRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  metricItem: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  metricLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSoft,
  },
  metricValue: {
    ...theme.typography.title2,
    color: theme.colors.text,
  },
  metricDivider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    alignItems: "flex-start",
  },
  infoText: {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  rangeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: "#FFF8FB",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  rangeRowActive: {
    borderColor: theme.colors.primary,
    backgroundColor: "#FBEAF1",
  },
  rangeName: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  rangeNameActive: {
    color: theme.colors.primaryDark,
  },
  rangeValue: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  ctaContainer: {
    marginTop: theme.spacing.sm,
  },
  insightSection: {
    marginTop: -theme.spacing.sm,
  },
});
