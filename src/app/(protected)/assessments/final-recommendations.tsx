import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { AssessmentHeroCard } from "@/components/AssessmentHeroCard";
import { AssessmentRouteHeader } from "@/components/AssessmentRouteHeader";
import { CustomButton } from "@/components/CustomButton";
import { FormSection } from "@/components/FormSection";
import { ResultCard } from "@/components/ResultCard";
import { Screen } from "@/components/Screen";
import { assessmentResults } from "@/data/mockData";
import { theme } from "@/theme";

export default function FinalRecommendationsScreen() {
  return (
    <Screen contentStyle={styles.content}>
      <AssessmentRouteHeader title="Final Recommendations" />

      <AssessmentHeroCard
        description="Your 4-step assessment is complete. Use these practical next actions for your follow-up discussion."
        eyebrow="PCOS & Insulin Review"
        icon="clipboard-outline"
        title="Actionable Recommendations"
      />

      <ResultCard result={assessmentResults[0]} />

      <FormSection>
        <Text style={styles.cardTitle}>Priority Actions (Next 2-4 Weeks)</Text>
        <View style={styles.list}>
          <Text style={styles.item}>• Keep cycle and symptom logs daily for pattern clarity.</Text>
          <Text style={styles.item}>• Prioritize protein + fiber at meals to support glucose stability.</Text>
          <Text style={styles.item}>• Add regular activity (walking or resistance training) most days.</Text>
          <Text style={styles.item}>• Review A1C, fasting glucose, and androgen labs with your clinician.</Text>
        </View>
      </FormSection>

      <FormSection>
        <Text style={styles.cardTitle}>When To Escalate Care</Text>
        <View style={styles.list}>
          <Text style={styles.item}>• Cycles remain very irregular or absent for several months.</Text>
          <Text style={styles.item}>• Worsening acne, hair changes, fatigue, or dark skin patches.</Text>
          <Text style={styles.item}>• Glucose markers trend upward or enter diabetes ranges.</Text>
        </View>
      </FormSection>

      <View style={styles.ctaStack}>
        <CustomButton
          label="Go to Insights"
          onPress={() => router.replace("/assessments")}
        />
        <CustomButton
          label="Retake 4-Step Assessment"
          onPress={() => router.replace("/assessments/basic-health")}
          variant="secondary"
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
  list: {
    gap: theme.spacing.sm,
  },
  item: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  ctaStack: {
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
});

