import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useAppStore } from "@/store/appStore";
import { theme } from "@/theme";

export default function IndexScreen() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.replace("/welcome");
        return;
      }

      router.replace("/home");
    }, 1500);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  return (
    <LinearGradient colors={["#FEFBFC", "#F8E7EE", "#F7F1ED"]} style={styles.container}>
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <View style={styles.brandCard}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>H</Text>
        </View>
        <Text style={styles.title}>HormoSync</Text>
        <Text style={styles.subtitle}>
          Cycle, meal, and routine tracking with a calmer first step.
        </Text>

        <View style={styles.statusPill}>
          <Text style={styles.statusText}>Preparing your dashboard</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.xxxl,
    backgroundColor: "#FFF8FB",
  },
  glowTop: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 999,
    top: -48,
    right: -60,
    backgroundColor: "rgba(241, 204, 221, 0.6)",
  },
  glowBottom: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 999,
    bottom: -52,
    left: -54,
    backgroundColor: "rgba(246, 226, 235, 0.7)",
  },
  brandCard: {
    width: "100%",
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: "#ECD5E0",
    backgroundColor: "rgba(255, 250, 252, 0.96)",
    padding: theme.spacing.xxxl,
    alignItems: "center",
    gap: theme.spacing.lg,
    ...theme.shadows.card,
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.sm,
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
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    textAlign: "center",
    maxWidth: 290,
  },
  statusPill: {
    marginTop: theme.spacing.sm,
    borderRadius: theme.radius.pill,
    backgroundColor: "#FCEEF4",
    borderWidth: 1,
    borderColor: "#EDD4E0",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  statusText: {
    ...theme.typography.caption,
    color: theme.colors.primaryDark,
  },
});
