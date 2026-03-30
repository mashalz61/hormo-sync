import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

import { AuthShell } from "@/components/AuthShell";
import { CustomButton } from "@/components/CustomButton";
import { theme } from "@/theme";

export default function WelcomeScreen() {
  return (
    <AuthShell
      eyebrow="Welcome"
      title="Track your health in one place"
      subtitle="Cycle, meals, reminders, and supportive progress tracking."
    >
      <View style={styles.actions}>
        <CustomButton label="Log In" onPress={() => router.push("/login")} />
        <CustomButton
          label="Create Account"
          variant="secondary"
          onPress={() => router.push("/signup")}
        />
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: theme.spacing.md,
  },
});
