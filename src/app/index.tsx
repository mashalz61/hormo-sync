import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useAppStore } from "@/store/appStore";
import { theme } from "@/theme";

export default function IndexScreen() {
  const hasSeenOnboarding = useAppStore((state) => state.hasSeenOnboarding);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasSeenOnboarding) {
        router.replace("/onboarding");
        return;
      }

      if (!isAuthenticated) {
        router.replace("/welcome");
        return;
      }

      router.replace("/home");
    }, 1500);

    return () => clearTimeout(timer);
  }, [hasSeenOnboarding, isAuthenticated]);

  return (
    <LinearGradient colors={["#FCFAF9", "#F4E8E6", "#F6EFE7"]} style={styles.container}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>H</Text>
      </View>
      <Text style={styles.title}>HormoSync</Text>
      <Text style={styles.subtitle}>
        Personalized nutrition and lifestyle monitoring for women with PCOS.
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.xxxl,
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.xl,
    ...theme.shadows.card,
  },
  logoText: {
    fontSize: 42,
    fontWeight: "700",
    color: theme.colors.white,
  },
  title: {
    ...theme.typography.display,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    textAlign: "center",
    maxWidth: 280,
  },
});
