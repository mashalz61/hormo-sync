import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AssessmentHeroCard } from "@/components/AssessmentHeroCard";
import { AssessmentRouteHeader } from "@/components/AssessmentRouteHeader";
import { CustomButton } from "@/components/CustomButton";
import { FormSection } from "@/components/FormSection";
import { InfoCard } from "@/components/InfoCard";
import { InputField } from "@/components/InputField";
import { Screen } from "@/components/Screen";
import { theme } from "@/theme";
import { calculateBmi } from "@/utils/health";

export default function BmiCalculationScreen() {
  const [weight, setWeight] = useState("68");
  const [height, setHeight] = useState("165");
  const weightValue = parseMeasurement(weight);
  const heightValue = parseMeasurement(height);
  const hasMeasurements = weightValue > 0 && heightValue > 0;
  const bmi = useMemo(
    () => (hasMeasurements ? calculateBmi(weightValue, heightValue) : 0),
    [hasMeasurements, heightValue, weightValue],
  );
  const bmiValue = bmi ? Number(bmi) : null;
  const bmiLabel = getBmiStatusLabel(bmiValue);
  const meterProgress = getMeterProgress(bmiValue);

  return (
    <Screen contentStyle={styles.content}>
      <AssessmentRouteHeader title="BMI Calculator" />
      <AssessmentHeroCard
        description="Enter your current measurements to review your body-mass index and category."
        eyebrow="Body Composition"
        icon="body-outline"
        title="BMI Calculator"
      />

      <FormSection>
        <InfoCard
          title="Formula"
          description="BMI = weight (kg) / height (m)^2"
        />
        <InputField
          helperText="Example: 68"
          label="Weight (kg)"
          keyboardType="decimal-pad"
          value={weight}
          onChangeText={setWeight}
        />
        <InputField
          helperText="Example: 165"
          label="Height (cm)"
          keyboardType="decimal-pad"
          value={height}
          onChangeText={setHeight}
        />
      </FormSection>

      <View style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <View>
            <Text style={styles.heroEyebrow}>
              Your Result
            </Text>
            <Text style={styles.resultValue}>{bmi || "--"}</Text>
          </View>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryPillText}>{bmiLabel}</Text>
          </View>
        </View>

        <View style={styles.meterTrack}>
          <View style={styles.meterSegmentUnderweight} />
          <View style={styles.meterSegmentHealthy} />
          <View style={styles.meterSegmentOverweight} />
          <View style={styles.meterSegmentObesity} />
          {bmiValue ? (
            <View style={[styles.meterIndicator, { left: `${meterProgress * 100}%` }]} />
          ) : null}
        </View>

        <View style={styles.rangeLabels}>
          <Text style={styles.rangeLabel}>18.5</Text>
          <Text style={styles.rangeLabel}>25</Text>
          <Text style={styles.rangeLabel}>30</Text>
        </View>

        <Text style={styles.resultCopy}>
          This is a screening metric and should be interpreted with overall health context.
        </Text>

        <View style={styles.rangeHint}>
          <Ionicons color="#CC5C89" name="information-circle-outline" size={16} />
          <Text style={styles.rangeHintText}>
            Underweight &lt; 18.5, Healthy 18.5-24.9, Overweight 25-29.9, Obesity ≥ 30
          </Text>
        </View>
      </View>

      <View style={[styles.ctaContainer, !hasMeasurements ? styles.ctaDisabled : undefined]}>
        <CustomButton
          label="View BMI Category"
          onPress={() => {
            if (!hasMeasurements) {
              return;
            }

            router.push({
              pathname: "/assessments/bmi-result",
              params: {
                bmi: bmi.toString(),
                weight: weightValue.toString(),
                height: heightValue.toString(),
              },
            });
          }}
        />
      </View>
    </Screen>
  );
}

const parseMeasurement = (value: string) => Number(value.replace(",", "."));

const getMeterProgress = (bmi: number | null): number => {
  if (!bmi) return 0;
  const bounded = Math.max(14, Math.min(36, bmi));
  return (bounded - 14) / 22;
};

const getBmiStatusLabel = (bmi: number | null): string => {
  if (!bmi) return "Awaiting input";
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Healthy range";
  if (bmi < 30) return "Overweight";
  return "Obesity range";
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  heroEyebrow: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  resultCard: {
    borderWidth: 1,
    borderColor: "#ECD7E2",
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultValue: {
    ...theme.typography.display,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  categoryPill: {
    backgroundColor: "#F9EDF2",
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
  },
  categoryPillText: {
    ...theme.typography.small,
    color: theme.colors.primary,
  },
  meterTrack: {
    height: 10,
    borderRadius: theme.radius.pill,
    overflow: "hidden",
    flexDirection: "row",
    marginTop: theme.spacing.xs,
    position: "relative",
  },
  meterSegmentUnderweight: {
    flex: 4.5,
    backgroundColor: "#F4D4DE",
  },
  meterSegmentHealthy: {
    flex: 6.5,
    backgroundColor: "#D3ECD7",
  },
  meterSegmentOverweight: {
    flex: 5,
    backgroundColor: "#F9E3BB",
  },
  meterSegmentObesity: {
    flex: 6,
    backgroundColor: "#F3C7CE",
  },
  meterIndicator: {
    position: "absolute",
    top: -3,
    marginLeft: -6,
    height: 16,
    width: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.text,
  },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: theme.spacing.md,
  },
  rangeLabel: {
    ...theme.typography.small,
    color: theme.colors.textSoft,
  },
  resultCopy: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  rangeHint: {
    backgroundColor: "#FFF7FA",
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  rangeHintText: {
    flex: 1,
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
  ctaDisabled: {
    opacity: 0.55,
  },
  ctaContainer: {
    marginTop: theme.spacing.sm,
  },
});
