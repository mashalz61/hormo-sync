import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";

import { AssessmentRouteHeader } from "@/components/AssessmentRouteHeader";
import { CustomButton } from "@/components/CustomButton";
import { FormSection } from "@/components/FormSection";
import { InfoCard } from "@/components/InfoCard";
import { InputField } from "@/components/InputField";
import { ProgressStepper } from "@/components/ProgressStepper";
import { Screen } from "@/components/Screen";
import {
  PCOSFormInputValues,
  PCOSFormValues,
  pcosFormDefaults,
  pcosRequiredStepFields,
  pcosSchema,
  pcosStepFields,
} from "@/app/(protected)/assessments/pcosForm.schema";
import { useAppStore } from "@/store/appStore";
import { theme } from "@/theme";

const toInputValue = (value: unknown) => (value === undefined || value === null ? "" : String(value));
const hasRequiredValue = (value: unknown) =>
  value !== null && value !== undefined && !(typeof value === "string" && value.trim() === "");

export default function LabResultsInputScreen() {
  const pcosForm = useAppStore((state) => state.pcosForm);
  const updatePcosForm = useAppStore((state) => state.updatePcosForm);

  const {
    control,
    formState: { errors },
    getValues,
    setValue,
    trigger,
    watch,
  } = useForm<PCOSFormInputValues, unknown, PCOSFormValues>({
    resolver: zodResolver(pcosSchema),
    mode: "onBlur",
    shouldFocusError: true,
    defaultValues: {
      ...pcosFormDefaults,
      ...pcosForm,
    },
  });

  const fastingGlucose = watch("fastingGlucose");
  const fastingInsulin = watch("fastingInsulin");
  const insulinResistance = watch("insulinResistance");
  const requiredValues = watch(pcosRequiredStepFields[3]);
  const canContinue = requiredValues.every(hasRequiredValue);

  useEffect(() => {
    const nextValue = Number(
      ((Number(fastingInsulin) * Number(fastingGlucose)) / 405).toFixed(2),
    );
    const sanitizedValue = Number.isFinite(nextValue) ? nextValue : 0;

    if (sanitizedValue !== insulinResistance) {
      setValue("insulinResistance", sanitizedValue, { shouldValidate: true });
    }
  }, [fastingGlucose, fastingInsulin, insulinResistance, setValue]);

  const handleContinue = async () => {
    if (!canContinue) {
      await trigger(pcosRequiredStepFields[3]);
      return;
    }

    const isValid = await trigger(pcosStepFields[3]);

    if (!isValid) {
      return;
    }

    updatePcosForm(pcosSchema.parse(getValues()));
    router.push("/assessments/final-assessment");
  };

  return (
    <Screen contentStyle={styles.content}>
      <AssessmentRouteHeader
        title="Step 3: Clinical and Ultrasound Data"
        subtitle="Enter glucose context, blood pressure, and ultrasound findings used during PCOS and metabolic-risk evaluation."
      />
      <ProgressStepper currentStep={3} totalSteps={4} label="Step 3 of 4 - Clinical context" />

      <InfoCard
        title="Useful glucose thresholds"
        description="Prediabetes ranges often used in clinical screening: A1C 5.7-6.4%, fasting glucose 100-125 mg/dL, and 2-hour OGTT 140-199 mg/dL."
      />

      <FormSection>
        <Text style={styles.sectionHeading}>Glucose metabolism panel</Text>
        <Controller
          control={control}
          name="a1c"
          render={({ field }) => (
            <InputField
              label="Hemoglobin A1C (%)"
              keyboardType="decimal-pad"
              placeholder="e.g. 5.8"
              value={toInputValue(field.value)}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              helperText="Optional. Common screening marker for average glucose trend. Range: 0-20%."
              errorText={errors.a1c?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="fastingGlucose"
          render={({ field }) => (
            <InputField
              label="Fasting plasma glucose (mg/dL)"
              keyboardType="decimal-pad"
              placeholder="e.g. 102"
              value={toInputValue(field.value)}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              helperText="Enter fasting glucose from your latest lab report. Range: 40-400 mg/dL."
              errorText={errors.fastingGlucose?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="ogtt2h"
          render={({ field }) => (
            <InputField
              label="2-hour OGTT glucose (mg/dL)"
              keyboardType="decimal-pad"
              placeholder="e.g. 148"
              value={toInputValue(field.value)}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              helperText="Optional. Use if oral glucose tolerance data is available. Range: 40-500 mg/dL."
              errorText={errors.ogtt2h?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="fastingInsulin"
          render={({ field }) => (
            <InputField
              label="Fasting insulin (uIU/mL)"
              keyboardType="decimal-pad"
              placeholder="e.g. 15"
              value={toInputValue(field.value)}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              helperText="Required for HOMA-IR. Range: 0-300 uIU/mL."
              errorText={errors.fastingInsulin?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="insulinResistance"
          render={({ field }) => (
            <InputField
              label="Insulin resistance (HOMA-IR)"
              placeholder="Auto-calculated"
              value={toInputValue(field.value)}
              editable={false}
              helperText="Auto-calculated as (fasting insulin x fasting glucose) / 405."
              errorText={errors.insulinResistance?.message}
            />
          )}
        />
      </FormSection>

      <FormSection>
        <Text style={styles.sectionHeading}>Clinical vitals</Text>
        <Controller
          control={control}
          name="bpSystolic"
          render={({ field }) => (
            <InputField
              label="Blood pressure systolic (mmHg)"
              keyboardType="number-pad"
              placeholder="e.g. 118"
              value={toInputValue(field.value)}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              helperText="Optional. Top blood pressure number. Range: 70-200 mmHg."
              errorText={errors.bpSystolic?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="bpDiastolic"
          render={({ field }) => (
            <InputField
              label="Blood pressure diastolic (mmHg)"
              keyboardType="number-pad"
              placeholder="e.g. 78"
              value={toInputValue(field.value)}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              helperText="Optional. Bottom blood pressure number. Range: 40-130 mmHg."
              errorText={errors.bpDiastolic?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="totalTestosterone"
          render={({ field }) => (
            <InputField
              label="Total testosterone (ng/dL)"
              keyboardType="decimal-pad"
              placeholder="e.g. 56"
              value={toInputValue(field.value)}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              helperText="Optional. Biochemical hyperandrogenism marker. Range: 0-300 ng/dL."
              errorText={errors.totalTestosterone?.message}
            />
          )}
        />
      </FormSection>

      <FormSection>
        <Text style={styles.sectionHeading}>Ultrasound data</Text>
        <Controller
          control={control}
          name="follicleNumberLeft"
          render={({ field }) => (
            <InputField
              label="Follicle number left ovary"
              keyboardType="number-pad"
              placeholder="e.g. 8"
              value={toInputValue(field.value)}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              helperText="Optional. Follicle count in the left ovary. Range: 0-50."
              errorText={errors.follicleNumberLeft?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="follicleNumberRight"
          render={({ field }) => (
            <InputField
              label="Follicle number right ovary"
              keyboardType="number-pad"
              placeholder="e.g. 9"
              value={toInputValue(field.value)}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              helperText="Optional. Follicle count in the right ovary. Range: 0-50."
              errorText={errors.follicleNumberRight?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="follicleSizeLeft"
          render={({ field }) => (
            <InputField
              label="Follicle size left ovary (mm)"
              keyboardType="decimal-pad"
              placeholder="e.g. 7.5"
              value={toInputValue(field.value)}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              helperText="Optional. Follicle size for the left ovary. Range: 0-40 mm."
              errorText={errors.follicleSizeLeft?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="follicleSizeRight"
          render={({ field }) => (
            <InputField
              label="Follicle size right ovary (mm)"
              keyboardType="decimal-pad"
              placeholder="e.g. 8.2"
              value={toInputValue(field.value)}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              helperText="Optional. Follicle size for the right ovary. Range: 0-40 mm."
              errorText={errors.follicleSizeRight?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="endometrium"
          render={({ field }) => (
            <InputField
              label="Endometrium (mm)"
              keyboardType="decimal-pad"
              placeholder="e.g. 8"
              value={toInputValue(field.value)}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              helperText="Optional. Endometrial thickness in millimeters. Range: 1-20 mm."
              errorText={errors.endometrium?.message}
            />
          )}
        />
      </FormSection>

      <View style={styles.ctaContainer}>
        <CustomButton label="Continue to Step 4" onPress={handleContinue} disabled={!canContinue} />
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
  ctaContainer: {
    marginTop: theme.spacing.sm,
  },
});
