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
import { ToggleRow } from "@/components/ToggleRow";
import {
  PCOSFormInputValues,
  PCOSFormValues,
  pcosFormDefaults,
  pcosSchema,
  pcosStepFields,
} from "@/app/(protected)/assessments/pcosForm.schema";
import { useAppStore } from "@/store/appStore";
import { theme } from "@/theme";

const toInputValue = (value: unknown) =>
  value === undefined || value === null ? "" : String(value);

export default function SymptomsMetabolicScreen() {
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

  const waist = watch("waist");
  const hip = watch("hip");
  const waistHipRatio = watch("waistHipRatio");

  useEffect(() => {
    const nextRatio =
      waist !== null && hip !== null && Number(hip) > 0
        ? Number((Number(waist) / Number(hip)).toFixed(2))
        : null;

    if (nextRatio !== waistHipRatio) {
      setValue("waistHipRatio", nextRatio, { shouldValidate: true });
    }
  }, [hip, setValue, waist, waistHipRatio]);

  const handleContinue = async () => {
    const isValid = await trigger(pcosStepFields[2]);

    if (!isValid) {
      return;
    }

    updatePcosForm(pcosSchema.parse(getValues()));
    router.push("/assessments/lab-results-input");
  };

  return (
    <Screen contentStyle={styles.content}>
      <AssessmentRouteHeader
        title="Step 2: Body Measurements and Lifestyle"
        subtitle="Track central body measurements and lifestyle markers linked to metabolic risk."
      />
      <ProgressStepper
        currentStep={2}
        totalSteps={4}
        label="Step 2 of 4 - Body and lifestyle"
      />

      <InfoCard
        title="Clinical context"
        description="Waist, hip, and day-to-day lifestyle patterns help add metabolic context. Waist-hip ratio is calculated automatically to avoid manual entry errors."
      />

      <FormSection>
        <Text style={styles.sectionHeading}>Body measurements</Text>
        <Controller
          control={control}
          name="waist"
          render={({ field }) => (
            <InputField
              label="Waist (cm)"
              keyboardType="decimal-pad"
              placeholder="e.g. 88"
              value={toInputValue(field.value)}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              helperText="Optional. Measure the narrowest part of your waist. Range: 40-200 cm."
              errorText={errors.waist?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="hip"
          render={({ field }) => (
            <InputField
              label="Hip (cm)"
              keyboardType="decimal-pad"
              placeholder="e.g. 102"
              value={toInputValue(field.value)}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              helperText="Optional. Measure around the widest part of your hips. Range: 40-200 cm."
              errorText={errors.hip?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="waistHipRatio"
          render={({ field }) => (
            <InputField
              label="Waist-hip ratio"
              placeholder="Auto-calculated"
              value={toInputValue(field.value)}
              editable={false}
              helperText="Auto-calculated from waist and hip measurements when both are entered."
              errorText={errors.waistHipRatio?.message}
            />
          )}
        />
      </FormSection>

      <FormSection>
        <Text style={styles.sectionHeading}>Lifestyle markers</Text>
        <View style={styles.stack}>
          <Controller
            control={control}
            name="hairLoss"
            render={({ field }) => (
              <ToggleRow
                title="Hair loss"
                subtitle="Scalp shedding or visible thinning."
                value={Boolean(field.value)}
                onValueChange={field.onChange}
                errorText={errors.hairLoss?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="fastFood"
            render={({ field }) => (
              <ToggleRow
                title="Fast food"
                subtitle="Frequent intake of fried or ultra-processed meals."
                value={Boolean(field.value)}
                onValueChange={field.onChange}
                errorText={errors.fastFood?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="regularExercise"
            render={({ field }) => (
              <ToggleRow
                title="Regular exercise"
                subtitle="Consistent structured movement during the week."
                value={Boolean(field.value)}
                onValueChange={field.onChange}
                errorText={errors.regularExercise?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="weightGain"
            render={({ field }) => (
              <ToggleRow
                title="Weight gain"
                subtitle="Recent gain or difficulty managing weight trend."
                value={Boolean(field.value)}
                onValueChange={field.onChange}
                errorText={errors.weightGain?.message}
              />
            )}
          />
        </View>
      </FormSection>

      <FormSection>
        <Text style={styles.cardTitle}>Step 2 summary</Text>
        <Text style={styles.copy}>
          Waist-hip ratio and lifestyle markers help identify whether body-fat
          distribution and daily habits may be reinforcing insulin-resistance
          patterns.
        </Text>
      </FormSection>

      <View style={styles.ctaContainer}>
        <CustomButton label="Continue to Step 3" onPress={handleContinue} />
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
  stack: {
    gap: theme.spacing.xs,
  },
  cardTitle: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  copy: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  ctaContainer: {
    marginTop: theme.spacing.sm,
  },
});
