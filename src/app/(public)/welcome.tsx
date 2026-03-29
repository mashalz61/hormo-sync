import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { CustomButton } from "@/components/CustomButton";
import { Screen } from "@/components/Screen";
import { theme } from "@/theme";

export default function WelcomeScreen() {
  return (
    <Screen scroll={false} contentStyle={styles.container}>
      <LinearGradient colors={["#F9E4E1", "#F6EFE7"]} style={styles.hero}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>H</Text>
        </View>
        <Text style={styles.heroTitle}>HormoSync</Text>
        <Text style={styles.heroCopy}>
          Personalized nutrition and lifestyle monitoring for women with PCOS, designed with a calm and supportive experience.
        </Text>
      </LinearGradient>
      <View style={styles.actions}>
        <CustomButton label="Log In" onPress={() => router.push("/login")} />
        <CustomButton
          label="Create Account"
          variant="secondary"
          onPress={() => router.push("/signup")}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    gap: theme.spacing.xxxl,
  },
  hero: {
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xxxl,
    gap: theme.spacing.lg,
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 28,
    fontWeight: "700",
    color: theme.colors.white,
  },
  heroTitle: {
    ...theme.typography.display,
    color: theme.colors.text,
  },
  heroCopy: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  actions: {
    gap: theme.spacing.md,
  },
});
