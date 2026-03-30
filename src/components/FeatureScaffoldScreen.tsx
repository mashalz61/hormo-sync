import { Href, router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { AssessmentResult } from "@/types";
import { theme } from "@/theme";
import { CustomButton } from "./CustomButton";
import { FormSection } from "./FormSection";
import { InfoCard } from "./InfoCard";
import { ProgressStepper } from "./ProgressStepper";
import { ResultCard } from "./ResultCard";
import { Screen } from "./Screen";
import { ChildRouteHeader } from "./ChildRouteHeader";

interface FeatureScaffoldScreenProps {
  title: string;
  subtitle: string;
  progress?: {
    step: number;
    total: number;
    label?: string;
  };
  sections?: Array<{
    title: string;
    description: string;
    bullets?: string[];
  }>;
  result?: AssessmentResult;
  ctaLabel?: string;
  onCtaPress?: () => void;
  fallbackRoute?: Href;
  backLabel?: string;
}

export const FeatureScaffoldScreen = ({
  title,
  subtitle,
  progress,
  sections = [],
  result,
  ctaLabel = "Continue",
  onCtaPress,
  fallbackRoute,
  backLabel,
}: FeatureScaffoldScreenProps) => (
  <Screen>
    <ChildRouteHeader
      title={title}
      subtitle={subtitle}
      fallbackRoute={fallbackRoute}
      backLabel={backLabel}
    />
    {progress ? (
      <ProgressStepper
        currentStep={progress.step}
        label={progress.label}
        totalSteps={progress.total}
      />
    ) : null}
    {sections.map((section) => (
      <FormSection key={section.title}>
        <InfoCard description={section.description} title={section.title} />
        {section.bullets?.length ? (
          <View style={styles.list}>
            {section.bullets.map((bullet) => (
              <Text key={bullet} style={styles.item}>
                • {bullet}
              </Text>
            ))}
          </View>
        ) : null}
      </FormSection>
    ))}
    {result ? <ResultCard result={result} /> : null}
    <CustomButton label={ctaLabel} onPress={onCtaPress || (() => router.back())} />
  </Screen>
);

const styles = StyleSheet.create({
  list: {
    gap: theme.spacing.sm,
  },
  item: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
});
