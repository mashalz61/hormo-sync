import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { AssessmentRouteHeader } from "@/components/AssessmentRouteHeader";
import { CustomButton } from "@/components/CustomButton";
import { FormSection } from "@/components/FormSection";
import { InfoCard } from "@/components/InfoCard";
import { ProgressStepper } from "@/components/ProgressStepper";
import { Screen } from "@/components/Screen";
import { theme } from "@/theme";

const recommendedPanels = [
  {
    id: "androgen",
    title: "Hyperandrogenism panel",
    level: "Core panel",
    description: "Used to check biochemical androgen excess, which can support PCOS evaluation.",
    tests: [
      {
        name: "Total testosterone",
        purpose: "Primary androgen marker used in most first-line assessments.",
      },
      {
        name: "Free testosterone or Free Androgen Index (FAI)",
        purpose: "Improves sensitivity when total testosterone appears borderline.",
      },
      {
        name: "DHEAS",
        purpose: "Adds adrenal androgen context when symptoms are significant.",
      },
    ],
  },
  {
    id: "metabolic",
    title: "Metabolic risk panel",
    level: "Core panel",
    description: "Screens glucose handling and cardiometabolic risk commonly associated with PCOS patterns.",
    tests: [
      {
        name: "HbA1c",
        purpose: "Gives an average glucose trend over recent months.",
      },
      {
        name: "Fasting plasma glucose",
        purpose: "Baseline glucose status at the time of testing.",
      },
      {
        name: "75 g OGTT with 2-hour glucose",
        purpose: "Most sensitive screen for impaired glucose tolerance when risk is elevated.",
      },
      {
        name: "Fasting lipid profile",
        purpose: "Assesses cardiometabolic risk profile alongside glucose markers.",
      },
    ],
  },
  {
    id: "ovulatory",
    title: "Ovulatory context panel",
    level: "Supportive panel",
    description: "Supportive hormone context for cycle interpretation; these markers are not diagnostic on their own.",
    tests: [
      {
        name: "LH",
        purpose: "Provides pituitary-ovarian signaling context with symptom and cycle history.",
      },
      {
        name: "FSH",
        purpose: "Interpreted with LH and cycle pattern to guide broader evaluation.",
      },
      {
        name: "Estradiol (when clinically indicated)",
        purpose: "May add cycle-phase context when ovulatory status is uncertain.",
      },
    ],
  },
  {
    id: "exclude-mimics",
    title: "Rule-out and context panel",
    level: "Order when indicated",
    description: "Helps exclude other endocrine conditions that can mimic irregular cycles or androgen symptoms.",
    tests: [
      {
        name: "TSH",
        purpose: "Screens thyroid dysfunction as an alternate cause of cycle disturbance.",
      },
      {
        name: "Prolactin",
        purpose: "Evaluates hyperprolactinemia when cycles are irregular or absent.",
      },
      {
        name: "17-hydroxyprogesterone",
        purpose: "Used when nonclassic congenital adrenal hyperplasia needs exclusion.",
      },
    ],
  },
  {
    id: "imaging",
    title: "Imaging and ovarian context",
    level: "Use selectively",
    description: "Useful in specific clinical scenarios and not always required in every initial workup.",
    tests: [
      {
        name: "Pelvic ultrasound",
        purpose: "Assesses ovarian morphology when diagnostic uncertainty remains.",
      },
      {
        name: "AMH (adults, context-dependent)",
        purpose: "Can be considered as ovarian context support in adults per clinician judgment.",
      },
    ],
  },
] as const;

export default function RecommendedTestsScreen() {
  return (
    <Screen contentStyle={styles.content}>
      <AssessmentRouteHeader
        title="Step 2: Recommended follow-up tests"
        subtitle="Use this list to prepare for a clinician conversation. Panels are prioritized for screening, interpretation, and rule-out support."
      />
      <ProgressStepper currentStep={2} totalSteps={2} label="Step 2 of 2 - Suggested test panels" />

      <InfoCard
        title="Before ordering tests"
        description="This screen is educational and not a diagnosis. Your clinician should tailor test selection to symptom pattern, cycle history, medications, and personal risk factors. Routine insulin assays alone are not diagnostic."
      />

      {recommendedPanels.map((panel) => (
        <FormSection key={panel.id}>
          <View style={styles.panelHeading}>
            <Text style={styles.panelTitle}>{panel.title}</Text>
            <View
              style={[
                styles.levelPill,
                panel.level === "Core panel" ? styles.levelPillCore : styles.levelPillOptional,
              ]}
            >
              <Text
                style={[
                  styles.levelText,
                  panel.level === "Core panel" ? styles.levelTextCore : styles.levelTextOptional,
                ]}
              >
                {panel.level}
              </Text>
            </View>
          </View>

          <Text style={styles.panelDescription}>{panel.description}</Text>

          <View style={styles.testList}>
            {panel.tests.map((test) => (
              <View key={test.name} style={styles.testItem}>
                <Text style={styles.testName}>{test.name}</Text>
                <Text style={styles.testPurpose}>{test.purpose}</Text>
              </View>
            ))}
          </View>
        </FormSection>
      ))}

      <FormSection>
        <Text style={styles.summaryTitle}>Practical sequence to discuss</Text>
        <View style={styles.bulletList}>
          <Text style={styles.bullet}>• Start with androgen and metabolic core panels.</Text>
          <Text style={styles.bullet}>• Add rule-out markers if cycle pattern or symptoms are atypical.</Text>
          <Text style={styles.bullet}>• Use ultrasound or AMH only when diagnostic uncertainty remains.</Text>
        </View>
      </FormSection>

      <View style={styles.ctaContainer}>
        <CustomButton
          label="Continue to lab input"
          onPress={() => router.push("/assessments/lab-results-input")}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: theme.spacing.xxxl,
  },
  panelHeading: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  panelTitle: {
    ...theme.typography.title3,
    color: theme.colors.text,
    flex: 1,
    minWidth: 190,
  },
  levelPill: {
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderWidth: 1,
    maxWidth: "100%",
  },
  levelPillCore: {
    backgroundColor: "#E7F6F0",
    borderColor: "#B7E6D4",
  },
  levelPillOptional: {
    backgroundColor: "#FFF3E1",
    borderColor: "#F2D8A6",
  },
  levelText: {
    ...theme.typography.small,
    flexShrink: 1,
  },
  levelTextCore: {
    color: theme.colors.success,
  },
  levelTextOptional: {
    color: theme.colors.warning,
  },
  panelDescription: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  testList: {
    gap: theme.spacing.sm,
  },
  testItem: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceMuted,
    padding: theme.spacing.md,
    gap: 6,
  },
  testName: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  testPurpose: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
  summaryTitle: {
    ...theme.typography.title3,
    color: theme.colors.text,
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
