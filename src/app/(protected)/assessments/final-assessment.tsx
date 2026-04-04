import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";

import { AssessmentRouteHeader } from "@/components/AssessmentRouteHeader";
import { CustomButton } from "@/components/CustomButton";
import { FormSection } from "@/components/FormSection";
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

export default function FinalAssessmentScreen() {
  const pcosForm = useAppStore((state) => state.pcosForm);
  const updatePcosForm = useAppStore((state) => state.updatePcosForm);

  const {
    control,
    formState: { errors },
    getValues,
    trigger,
  } = useForm<PCOSFormInputValues, unknown, PCOSFormValues>({
    resolver: zodResolver(pcosSchema),
    mode: "onBlur",
    shouldFocusError: true,
    defaultValues: {
      ...pcosFormDefaults,
      ...pcosForm,
    },
  });

  const handleContinue = async () => {
    const isValid = await trigger(pcosStepFields[4]);

    if (!isValid) {
      return;
    }

    updatePcosForm(pcosSchema.parse(getValues()));
    router.push("/assessments/final-recommendations");
  };

  return (
    <Screen contentStyle={styles.content}>
      <AssessmentRouteHeader
        title="Step 4: Hormones and Symptoms"
        subtitle="Capture remaining hormone values and symptom indicators before reviewing the overall risk summary."
      />
      <ProgressStepper
        currentStep={4}
        totalSteps={4}
        label="Step 4 of 4 - Hormones and symptoms"
      />

      <FormSection>
        <Text style={styles.cardTitle}>Hormonal panel</Text>
        <Controller
          control={control}
          name="fsh"
          render={({ field }) => (
            <InputField
              label="FSH (mIU/mL)"
              keyboardType="decimal-pad"
              placeholder="e.g. 5.1"
              value={toInputValue(field.value)}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              helperText="Optional. Latest follicle-stimulating hormone result. Range: 0-50 mIU/mL."
              errorText={errors.fsh?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="lh"
          render={({ field }) => (
            <InputField
              label="LH (mIU/mL)"
              keyboardType="decimal-pad"
              placeholder="e.g. 8.2"
              value={toInputValue(field.value)}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              helperText="Optional. Latest luteinizing hormone result. Range: 0-50 mIU/mL."
              errorText={errors.lh?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="tsh"
          render={({ field }) => (
            <InputField
              label="TSH (mIU/L)"
              keyboardType="decimal-pad"
              placeholder="e.g. 2.1"
              value={toInputValue(field.value)}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              helperText="Optional. Thyroid-stimulating hormone. Range: 0.1-10 mIU/L."
              errorText={errors.tsh?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="amh"
          render={({ field }) => (
            <InputField
              label="AMH (ng/mL)"
              keyboardType="decimal-pad"
              placeholder="e.g. 4.2"
              value={toInputValue(field.value)}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              helperText="Optional. Anti-Mullerian hormone level. Range: 0-20 ng/mL."
              errorText={errors.amh?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="prl"
          render={({ field }) => (
            <InputField
              label="PRL (ng/mL)"
              keyboardType="decimal-pad"
              placeholder="e.g. 18"
              value={toInputValue(field.value)}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              helperText="Optional. Prolactin result. Range: 0-100 ng/mL."
              errorText={errors.prl?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="vitD3"
          render={({ field }) => (
            <InputField
              label="VitD3 (ng/mL)"
              keyboardType="decimal-pad"
              placeholder="e.g. 28"
              value={toInputValue(field.value)}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              helperText="Optional. Latest vitamin D3 value. Range: 0-150 ng/mL."
              errorText={errors.vitD3?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="prg"
          render={({ field }) => (
            <InputField
              label="PRG (ng/mL)"
              keyboardType="decimal-pad"
              placeholder="e.g. 1.2"
              value={toInputValue(field.value)}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              helperText="Optional. Progesterone value. Range: 0-40 ng/mL."
              errorText={errors.prg?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="rbs"
          render={({ field }) => (
            <InputField
              label="RBS (mg/dL)"
              keyboardType="decimal-pad"
              placeholder="e.g. 118"
              value={toInputValue(field.value)}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              helperText="Optional. Random blood sugar measured any time. Range: 50-400 mg/dL."
              errorText={errors.rbs?.message}
            />
          )}
        />
      </FormSection>

      <FormSection>
        <Text style={styles.cardTitle}>Symptoms</Text>
        <View style={styles.toggleStack}>
          <Controller
            control={control}
            name="hairGrowth"
            render={({ field }) => (
              <ToggleRow
                title="Hair growth"
                subtitle="Excess face, chest, or abdominal hair growth."
                value={Boolean(field.value)}
                onValueChange={field.onChange}
                errorText={errors.hairGrowth?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="skinDarkening"
            render={({ field }) => (
              <ToggleRow
                title="Skin darkening"
                subtitle="Darkened skin patches around the neck or underarms."
                value={Boolean(field.value)}
                onValueChange={field.onChange}
                errorText={errors.skinDarkening?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="pimples"
            render={({ field }) => (
              <ToggleRow
                title="Pimples"
                subtitle="Persistent breakouts or acne flare-ups."
                value={Boolean(field.value)}
                onValueChange={field.onChange}
                errorText={errors.pimples?.message}
              />
            )}
          />
        </View>
      </FormSection>

      <View style={styles.ctaContainer}>
        <CustomButton
          label="View Final Recommendations"
          onPress={handleContinue}
        />
      </View>
    </Screen>
  );
}

function ErrorBanner({ error }: { error: AppApiError }) {
  return (
    <View style={styles.errorBanner}>
      <Text style={styles.errorTitle}>{error.message}</Text>
      {error.details?.map((item: string) => (
        <Text key={item} style={styles.errorDetail}>
          • {item}
        </Text>
      ))}
    </View>
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
  helperText: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
  cardTitle: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  toggleStack: {
    gap: theme.spacing.xs,
  },
  ctaContainer: {
    marginTop: theme.spacing.sm,
  },
});
