import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";

import { AssessmentRouteHeader } from "@/components/AssessmentRouteHeader";
import { CustomButton } from "@/components/CustomButton";
import { FormSection } from "@/components/FormSection";
import { InputField } from "@/components/InputField";
import { ProgressStepper } from "@/components/ProgressStepper";
import { Screen } from "@/components/Screen";
import { SelectChips } from "@/components/SelectChips";
import { ToggleRow } from "@/components/ToggleRow";
import {
  bloodGroupOptions,
  marriageStatusOptions,
  missedPeriodOptions,
  PCOSFormInputValues,
  PCOSFormValues,
  pcosFormDefaults,
  pcosRequiredStepFields,
  pcosSchema,
  pcosStepFields,
  cyclePatternOptions,
} from "@/app/(protected)/assessments/pcosForm.schema";
import { useAppStore } from "@/store/appStore";
import { theme } from "@/theme";
import { calculateBmi } from "@/utils/health";

const toInputValue = (value: unknown) =>
  value === undefined || value === null ? "" : String(value);
const hasRequiredValue = (value: unknown) =>
  value !== null &&
  value !== undefined &&
  !(typeof value === "string" && value.trim() === "");

export default function BasicHealthScreen() {
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

  const weight = watch("weight");
  const height = watch("height");
  const bmi = watch("bmi");
  const requiredValues = watch(pcosRequiredStepFields[1]);
  const canContinue = requiredValues.every(hasRequiredValue);

  useEffect(() => {
    const nextBmi = calculateBmi(Number(weight), Number(height));

    if (nextBmi && nextBmi !== bmi) {
      setValue("bmi", nextBmi, { shouldValidate: true });
    }
  }, [bmi, height, setValue, weight]);

  const handleContinue = async () => {
    if (!canContinue) {
      await trigger(pcosRequiredStepFields[1]);
      return;
    }

    const isValid = await trigger(pcosStepFields[1]);

    if (!isValid) {
      return;
    }

    updatePcosForm(pcosSchema.parse(getValues()));
    router.push("/assessments/symptoms-metabolic");
  };

  return (
    <Screen contentStyle={styles.content}>
      <AssessmentRouteHeader
        title="Step 1: Baseline Health and Cycle Pattern"
        subtitle="Capture cycle timing and body metrics that can indicate ovulatory dysfunction and metabolic risk."
      />
      <ProgressStepper
        currentStep={1}
        totalSteps={4}
        label="Step 1 of 4 - Baseline profile"
      />

      <FormSection>
        <Controller
          control={control}
          name="age"
          render={({ field }) => (
            <InputField
              label="Age (years)"
              keyboardType="number-pad"
              placeholder="e.g. 28"
              value={toInputValue(field.value)}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              helperText="Enter your age in completed years. Range: 10-100."
              errorText={errors.age?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="weight"
          render={({ field }) => (
            <InputField
              label="Weight (kg)"
              keyboardType="decimal-pad"
              placeholder="e.g. 68"
              value={toInputValue(field.value)}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              helperText="Used with height to estimate BMI context. Range: 20-300 kg."
              errorText={errors.weight?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="height"
          render={({ field }) => (
            <InputField
              label="Height (cm)"
              keyboardType="decimal-pad"
              placeholder="e.g. 165"
              value={toInputValue(field.value)}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              helperText="Enter height in centimeters. Range: 100-250 cm."
              errorText={errors.height?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="bmi"
          render={({ field }) => (
            <InputField
              label="BMI"
              placeholder="Auto-calculated"
              value={toInputValue(field.value)}
              editable={false}
              helperText="Auto-calculated from weight and height. Range: 5-80."
              errorText={errors.bmi?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="cycleLength"
          render={({ field }) => (
            <InputField
              label="Average cycle length (days)"
              keyboardType="number-pad"
              placeholder="e.g. 31"
              value={toInputValue(field.value)}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              helperText="Adult cycles <21 or >35 days can suggest ovulatory dysfunction. Range: 10-120 days."
              errorText={errors.cycleLength?.message}
            />
          )}
        />

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Cycle pattern</Text>
          <Controller
            control={control}
            name="cyclePattern"
            render={({ field }) => (
              <SelectChips
                options={[...cyclePatternOptions]}
                value={field.value}
                onChange={field.onChange}
                errorText={errors.cyclePattern?.message}
              />
            )}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Missed periods</Text>
          <Controller
            control={control}
            name="missedPeriods"
            render={({ field }) => (
              <SelectChips
                options={[...missedPeriodOptions]}
                value={field.value}
                onChange={field.onChange}
                errorText={errors.missedPeriods?.message}
              />
            )}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Blood group</Text>
          <Controller
            control={control}
            name="bloodGroup"
            render={({ field }) => (
              <SelectChips
                options={[...bloodGroupOptions]}
                value={field.value ?? undefined}
                onChange={field.onChange}
                errorText={errors.bloodGroup?.message}
              />
            )}
          />
        </View>

        <Controller
          control={control}
          name="pulseRate"
          render={({ field }) => (
            <InputField
              label="Pulse rate (bpm)"
              keyboardType="number-pad"
              placeholder="e.g. 72"
              value={toInputValue(field.value)}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              helperText="Optional. Enter resting pulse rate if known. Range: 40-180 bpm."
              errorText={errors.pulseRate?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="respiratoryRate"
          render={({ field }) => (
            <InputField
              label="Respiratory rate (breaths/min)"
              keyboardType="number-pad"
              placeholder="e.g. 16"
              value={toInputValue(field.value)}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              helperText="Optional. Breaths per minute while at rest. Range: 10-40."
              errorText={errors.respiratoryRate?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="hemoglobin"
          render={({ field }) => (
            <InputField
              label="Hemoglobin (g/dL)"
              keyboardType="decimal-pad"
              placeholder="e.g. 12.5"
              value={toInputValue(field.value)}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              helperText="Optional. Enter the latest hemoglobin result if available. Range: 5-20 g/dL."
              errorText={errors.hemoglobin?.message}
            />
          )}
        />

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Marriage status</Text>
          <Controller
            control={control}
            name="marriageStatus"
            render={({ field }) => (
              <SelectChips
                options={[...marriageStatusOptions]}
                value={field.value ?? undefined}
                onChange={field.onChange}
                errorText={errors.marriageStatus?.message}
              />
            )}
          />
        </View>

        <Controller
          control={control}
          name="pregnant"
          render={({ field }) => (
            <ToggleRow
              title="Pregnant"
              subtitle="Turn on if currently pregnant."
              value={Boolean(field.value)}
              onValueChange={field.onChange}
              errorText={errors.pregnant?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="abortions"
          render={({ field }) => (
            <InputField
              label="Abortions"
              keyboardType="number-pad"
              placeholder="e.g. 0"
              value={toInputValue(field.value)}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              helperText="Optional. Enter the total number of prior abortions. Minimum: 0."
              errorText={errors.abortions?.message}
            />
          )}
        />
      </FormSection>

      <FormSection>
        <Text style={styles.cardTitle}>Why this step matters</Text>
        <Text style={styles.copy}>
          International PCOS guidance uses combined features, not one test
          alone. In adults, diagnosis is generally based on two of three
          findings: ovulatory dysfunction, hyperandrogenism, and ovarian/AMH
          evidence.
        </Text>
        <View style={styles.bulletList}>
          <Text style={styles.bullet}>
            • Irregular cycles can be an early ovulation signal.
          </Text>
          <Text style={styles.bullet}>
            • BMI and weight trend help interpret insulin-related risk.
          </Text>
          <Text style={styles.bullet}>
            • Final diagnosis requires clinician review and exclusion of other
            causes.
          </Text>
        </View>
      </FormSection>

      <View style={styles.ctaContainer}>
        <CustomButton
          label="Continue to Step 2"
          onPress={handleContinue}
          disabled={!canContinue}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: theme.spacing.xxxl,
  },
  fieldGroup: {
    gap: theme.spacing.sm,
  },
  fieldLabel: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
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
