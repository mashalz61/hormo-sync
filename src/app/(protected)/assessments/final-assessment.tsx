import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AssessmentRouteHeader } from "@/components/AssessmentRouteHeader";
import { CustomButton } from "@/components/CustomButton";
import { FormSection } from "@/components/FormSection";
import { InputField } from "@/components/InputField";
import { PredictionResultCard } from "@/components/PredictionResultCard";
import { ProgressStepper } from "@/components/ProgressStepper";
import { Screen } from "@/components/Screen";
import { SelectChips } from "@/components/SelectChips";
import { AppApiError } from "@/services/api/client";
import { getApiHealth, predictIr, predictPcos } from "@/services/api/predictions";
import { useAppStore } from "@/store/appStore";
import { theme } from "@/theme";
import { HealthResponse, PredictionUiResult } from "@/types/api";
import {
  buildPredictionPayload,
  formatPredictionResult,
  toUserFacingApiError,
  validatePredictionInputs,
} from "@/utils/predictions";

export default function FinalAssessmentScreen() {
  const draft = useAppStore((state) => state.pcosAssessmentDraft);
  const updateDraft = useAppStore((state) => state.updatePcosAssessmentDraft);
  const [age, setAge] = useState(draft.age);
  const [weight, setWeight] = useState(draft.weight);
  const [cyclePattern, setCyclePattern] = useState<"Regular" | "Irregular">(draft.cyclePattern);
  const [weightGain, setWeightGain] = useState(draft.weightGain);
  const [healthResponse, setHealthResponse] = useState<HealthResponse | null>(null);
  const [healthError, setHealthError] = useState<AppApiError | null>(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [pcosResult, setPcosResult] = useState<PredictionUiResult | null>(null);
  const [irResult, setIrResult] = useState<PredictionUiResult | null>(null);
  const [pcosError, setPcosError] = useState<AppApiError | null>(null);
  const [irError, setIrError] = useState<AppApiError | null>(null);
  const [pcosLoading, setPcosLoading] = useState(false);
  const [irLoading, setIrLoading] = useState(false);

  const payloadPreview = useMemo(
    () =>
      buildPredictionPayload({
        age,
        weight,
        cyclePattern,
        weightGain,
      }),
    [age, cyclePattern, weight, weightGain],
  );
  const validationErrors = useMemo(() => validatePredictionInputs({ age, weight }), [age, weight]);
  const hasValidationErrors = Object.keys(validationErrors).length > 0;

  useEffect(() => {
    updateDraft({
      age,
      weight,
      cyclePattern,
      weightGain,
    });
  }, [age, cyclePattern, updateDraft, weight, weightGain]);

  useEffect(() => {
    void runHealthCheck();
  }, []);

  const runHealthCheck = async () => {
    setHealthLoading(true);
    setHealthError(null);

    try {
      const response = await getApiHealth();
      setHealthResponse(response);
    } catch (error) {
      setHealthError(toUserFacingApiError(error));
      setHealthResponse(null);
    } finally {
      setHealthLoading(false);
    }
  };

  const handleRunPrediction = async (endpoint: "pcos" | "ir") => {
    const requestPayload = payloadPreview;

    if (endpoint === "pcos") {
      setPcosLoading(true);
      setPcosError(null);
    } else {
      setIrLoading(true);
      setIrError(null);
    }

    try {
      const response =
        endpoint === "pcos"
          ? await predictPcos(requestPayload)
          : await predictIr(requestPayload);

      const formatted = formatPredictionResult(endpoint, response);

      if (endpoint === "pcos") {
        setPcosResult(formatted);
      } else {
        setIrResult(formatted);
      }
    } catch (error) {
      const normalizedError = toUserFacingApiError(error);

      if (endpoint === "pcos") {
        setPcosError(normalizedError);
        setPcosResult(null);
      } else {
        setIrError(normalizedError);
        setIrResult(null);
      }
    } finally {
      if (endpoint === "pcos") {
        setPcosLoading(false);
      } else {
        setIrLoading(false);
      }
    }
  };

  return (
    <Screen contentStyle={styles.content}>
      <AssessmentRouteHeader
        title="Step 4: Summary and Risk Interpretation"
        subtitle="Verify the feature inputs, check backend availability, and run live PCOS or insulin-resistance predictions."
      />
      <ProgressStepper currentStep={4} totalSteps={4} label="Step 4 of 4 - Final interpretation" />

      <FormSection>
        <Text style={styles.cardTitle}>Backend health</Text>
        <Text style={styles.copy}>
          {healthResponse
            ? `Backend reachable${healthResponse.status ? `: ${healthResponse.status}` : "."}`
            : "Check the API before submitting a prediction so failures are easier to diagnose."}
        </Text>
        {healthResponse ? (
          <View style={styles.statusCard}>
            <Text style={styles.statusTitle}>Health response</Text>
            <Text style={styles.statusBody}>{JSON.stringify(healthResponse, null, 2)}</Text>
          </View>
        ) : null}
        {healthError ? <ErrorBanner error={healthError} /> : null}
        <CustomButton
          label={healthLoading ? "Checking backend..." : "Run health check"}
          loading={healthLoading}
          onPress={() => void runHealthCheck()}
          variant="secondary"
        />
      </FormSection>

      <FormSection>
        <Text style={styles.cardTitle}>Prediction inputs</Text>
        <Text style={styles.copy}>
          These values are sent as the JSON feature payload for both prediction endpoints.
        </Text>
        <InputField
          label="Age (yrs)"
          keyboardType="number-pad"
          value={age}
          onChangeText={setAge}
          errorText={validationErrors.age}
        />
        <InputField
          label="Weight (Kg)"
          keyboardType="decimal-pad"
          value={weight}
          onChangeText={setWeight}
          errorText={validationErrors.weight}
        />

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Cycle pattern</Text>
          <SelectChips
            options={["Regular", "Irregular"]}
            value={cyclePattern}
            onChange={(value) => setCyclePattern(value as "Regular" | "Irregular")}
          />
          <Text style={styles.helperText}>Sent as `Cycle(R/I)` with `2` for regular and `4` for irregular.</Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Weight gain (Y/N)</Text>
          <SelectChips
            options={["Yes", "No"]}
            value={weightGain ? "Yes" : "No"}
            onChange={(value) => setWeightGain(value === "Yes")}
          />
        </View>

        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>Outgoing request</Text>
          <Text style={styles.statusBody}>{JSON.stringify(payloadPreview, null, 2)}</Text>
        </View>
      </FormSection>

      <View style={styles.actionStack}>
        <CustomButton
          label="Run PCOS Prediction"
          loading={pcosLoading}
          disabled={irLoading || hasValidationErrors}
          onPress={() => void handleRunPrediction("pcos")}
        />
        <CustomButton
          label="Run Insulin Resistance Prediction"
          loading={irLoading}
          disabled={pcosLoading || hasValidationErrors}
          onPress={() => void handleRunPrediction("ir")}
          variant="secondary"
        />
      </View>

      {pcosError ? <ErrorBanner error={pcosError} /> : null}
      {pcosResult ? <PredictionResultCard result={pcosResult} /> : null}

      {irError ? <ErrorBanner error={irError} /> : null}
      {irResult ? <PredictionResultCard result={irResult} /> : null}

      <FormSection>
        <Text style={styles.cardTitle}>How to read this result</Text>
        <Text style={styles.copy}>
          These predictions are supportive signals, not a definitive diagnosis. Clinicians typically diagnose PCOS in adults when two of three core features are present, after excluding other causes.
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
  actionStack: {
    gap: theme.spacing.sm,
  },
  statusCard: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  statusTitle: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    textTransform: "uppercase",
  },
  statusBody: {
    ...theme.typography.caption,
    color: theme.colors.text,
  },
  errorBanner: {
    backgroundColor: "#FFF1F3",
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: "#E5A3B1",
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  errorTitle: {
    ...theme.typography.bodyStrong,
    color: theme.colors.danger,
  },
  errorDetail: {
    ...theme.typography.small,
    color: theme.colors.text,
  },
  ctaContainer: {
    marginTop: theme.spacing.sm,
  },
});
