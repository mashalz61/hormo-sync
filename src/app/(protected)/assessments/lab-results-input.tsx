import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AssessmentRouteHeader } from "@/components/AssessmentRouteHeader";
import { CustomButton } from "@/components/CustomButton";
import { FormSection } from "@/components/FormSection";
import { InfoCard } from "@/components/InfoCard";
import { InputField } from "@/components/InputField";
import { ProgressStepper } from "@/components/ProgressStepper";
import { Screen } from "@/components/Screen";
import { theme } from "@/theme";

export default function LabResultsInputScreen() {
  const [a1c, setA1c] = useState("5.8");
  const [fastingGlucose, setFastingGlucose] = useState("102");
  const [ogtt2h, setOgtt2h] = useState("148");
  const [fastingInsulin, setFastingInsulin] = useState("15");
  const [totalTestosterone, setTotalTestosterone] = useState("56");
  const [lh, setLh] = useState("8.2");
  const [fsh, setFsh] = useState("5.1");

  return (
    <Screen contentStyle={styles.content}>
      <AssessmentRouteHeader
        title="Step 3: Labs for Insulin and Hormonal Context"
        subtitle="Enter core glucose and hormone markers used during PCOS and metabolic-risk evaluation."
      />
      <ProgressStepper currentStep={3} totalSteps={4} label="Step 3 of 4 - Laboratory context" />

      <InfoCard
        title="Useful glucose thresholds"
        description="Prediabetes ranges often used in clinical screening: A1C 5.7-6.4%, fasting glucose 100-125 mg/dL, and 2-hour OGTT 140-199 mg/dL."
      />

      <FormSection>
        <Text style={styles.sectionHeading}>Glucose metabolism panel</Text>
        <InputField
          label="Hemoglobin A1C (%)"
          keyboardType="decimal-pad"
          value={a1c}
          onChangeText={setA1c}
          helperText="Common screening marker for average glucose trend."
        />
        <InputField
          label="Fasting plasma glucose (mg/dL)"
          keyboardType="decimal-pad"
          value={fastingGlucose}
          onChangeText={setFastingGlucose}
        />
        <InputField
          label="2-hour OGTT glucose (mg/dL)"
          keyboardType="decimal-pad"
          value={ogtt2h}
          onChangeText={setOgtt2h}
          helperText="Use if oral glucose tolerance data is available."
        />
        <InputField
          label="Fasting insulin (uIU/mL)"
          keyboardType="decimal-pad"
          value={fastingInsulin}
          onChangeText={setFastingInsulin}
          helperText="Supportive marker only; not a stand-alone diagnostic test."
        />
      </FormSection>

      <FormSection>
        <Text style={styles.sectionHeading}>Hormonal panel</Text>
        <InputField
          label="Total testosterone (ng/dL)"
          keyboardType="decimal-pad"
          value={totalTestosterone}
          onChangeText={setTotalTestosterone}
          helperText="Biochemical hyperandrogenism can support PCOS diagnosis."
        />
        <InputField label="LH (mIU/mL)" keyboardType="decimal-pad" value={lh} onChangeText={setLh} />
        <InputField label="FSH (mIU/mL)" keyboardType="decimal-pad" value={fsh} onChangeText={setFsh} />
      </FormSection>

      <FormSection>
        <Text style={styles.cardTitle}>How this step is interpreted</Text>
        <View style={styles.bulletList}>
          <Text style={styles.bullet}>• Glucose-based tests are most useful for dysglycemia screening.</Text>
          <Text style={styles.bullet}>• PCOS assessment combines cycle, symptom, and lab features.</Text>
          <Text style={styles.bullet}>• Routine insulin assays alone are not recommended to diagnose PCOS.</Text>
        </View>
      </FormSection>

      <View style={styles.ctaContainer}>
        <CustomButton
          label="Continue to Step 4"
          onPress={() => router.push("/assessments/final-assessment")}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: theme.spacing.xxxl,
  },
  sectionHeading: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  cardTitle: {
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
