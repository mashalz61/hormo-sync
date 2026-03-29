import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { CustomButton } from "@/components/CustomButton";
import { Screen } from "@/components/Screen";
import { onboardingSlides } from "@/data/mockData";
import { useAppStore } from "@/store/appStore";
import { theme } from "@/theme";

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const markOnboardingComplete = useAppStore((state) => state.markOnboardingComplete);
  const slide = useMemo(() => onboardingSlides[index], [index]);
  const isLast = index === onboardingSlides.length - 1;

  const finishOnboarding = () => {
    markOnboardingComplete();
    router.replace("/welcome");
  };

  return (
    <Screen scroll={false} contentStyle={styles.container}>
      <View style={[styles.visual, { backgroundColor: slide.accent }]}>
        <View style={styles.visualInner} />
      </View>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>Supportive women’s wellness</Text>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.description}>{slide.description}</Text>
      </View>
      <View style={styles.dots}>
        {onboardingSlides.map((item, itemIndex) => (
          <View
            key={item.id}
            style={[styles.dot, itemIndex === index && styles.dotActive]}
          />
        ))}
      </View>
      <View style={styles.footer}>
        <Pressable onPress={finishOnboarding}>
          <Text style={styles.skip}>Skip</Text>
        </Pressable>
        <CustomButton
          label={isLast ? "Get Started" : "Next"}
          onPress={() => (isLast ? finishOnboarding() : setIndex((value) => value + 1))}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: theme.spacing.xxxl,
  },
  visual: {
    height: 320,
    borderRadius: theme.radius.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  visualInner: {
    width: 180,
    height: 220,
    borderRadius: theme.radius.xl,
    backgroundColor: "rgba(255,255,255,0.55)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
  },
  content: {
    gap: theme.spacing.md,
  },
  eyebrow: {
    ...theme.typography.caption,
    color: theme.colors.primaryDark,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  title: {
    ...theme.typography.display,
    color: theme.colors.text,
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  dots: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    justifyContent: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: theme.colors.border,
  },
  dotActive: {
    width: 28,
    backgroundColor: theme.colors.primary,
  },
  footer: {
    gap: theme.spacing.lg,
  },
  skip: {
    ...theme.typography.bodyStrong,
    color: theme.colors.textMuted,
    textAlign: "center",
  },
});
