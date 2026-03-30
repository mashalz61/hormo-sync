import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { AssessmentRouteHeader } from "@/components/AssessmentRouteHeader";
import { CustomButton } from "@/components/CustomButton";
import { FormSection } from "@/components/FormSection";
import { ProgressStepper } from "@/components/ProgressStepper";
import { ResultCard } from "@/components/ResultCard";
import { Screen } from "@/components/Screen";
import { assessmentResults } from "@/data/mockData";
import { theme } from "@/theme";

export default function FinalAssessmentScreen() {
  return (
    <Screen contentStyle={styles.content}>
      <AssessmentRouteHeader
        title="Step 4: Summary and Risk Interpretation"
        subtitle="Review the combined findings from cycle history, symptoms, and labs to guide next clinical discussion."
      />
      <ProgressStepper currentStep={4} totalSteps={4} label="Step 4 of 4 - Final interpretation" />

      <ResultCard result={assessmentResults[0]} />

      <FormSection>
        <Text style={styles.cardTitle}>How to read this result</Text>
        <Text style={styles.copy}>
          This tool provides risk-oriented pattern detection, not a definitive diagnosis. Clinicians typically diagnose PCOS in adults when two of three core features are present, after excluding other causes.
        </Text>
        <View style={styles.bulletList}>
          <Text style={styles.bullet}>• Ovulatory dysfunction (cycle irregularity)</Text>
          <Text style={styles.bullet}>• Clinical or biochemical hyperandrogenism</Text>
          <Text style={styles.bullet}>• Ovarian ultrasound or AMH evidence (when needed)</Text>
        </View>
      </FormSection>

      <FormSection>
        <Text style={styles.cardTitle}>Useful next steps</Text>
        <View style={styles.bulletList}>
          <Text style={styles.bullet}>• Review glucose markers (A1C, fasting glucose, OGTT) with your clinician.</Text>
          <Text style={styles.bullet}>• Discuss androgen profile and menstrual pattern over time.</Text>
          <Text style={styles.bullet}>• Build a lifestyle plan focused on sleep, movement, and insulin-sensitive nutrition.</Text>
          <Text style={styles.bullet}>• Repeat tracking in 8-12 weeks to monitor trend changes.</Text>
        </View>
      </FormSection>

      <View style={styles.ctaContainer}>
        <CustomButton
          label="View Final Recommendations"
          onPress={() => router.push("/assessments/final-recommendations")}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: theme.spacing.xxxl,
  },
  cardTitle: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  copy: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  bulletList: {
    gap: theme.spacing.sm,
  },
  bullet: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  ctaContainer: {
    marginTop: theme.spacing.sm,
  },
});
