import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import { CustomButton } from "@/components/CustomButton";
import { InputField } from "@/components/InputField";
import { Screen } from "@/components/Screen";
import { SectionTitle } from "@/components/SectionTitle";
import { useAppStore } from "@/store/appStore";
import { theme } from "@/theme";

export default function LoginScreen() {
  const login = useAppStore((state) => state.login);
  const [email, setEmail] = useState("ayla@example.com");
  const [password, setPassword] = useState("password123");

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Missing details", "Please enter both email and password.");
      return;
    }

    login(email);
    router.replace("/home");
  };

  return (
    <Screen contentStyle={styles.container}>
      <SectionTitle
        title="Welcome back"
        subtitle="Continue your wellness plan, reminders, and assessment progress."
      />
      <View style={styles.form}>
        <InputField
          autoCapitalize="none"
          keyboardType="email-address"
          label="Email"
          value={email}
          onChangeText={setEmail}
        />
        <InputField
          label="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Link href="/forgot-password" style={styles.link}>
          Forgot password?
        </Link>
      </View>
      <CustomButton label="Log In" onPress={handleLogin} />
      <View style={styles.socialRow}>
        <CustomButton label="Continue with Apple" variant="ghost" />
        <CustomButton label="Continue with Google" variant="ghost" />
      </View>
      <Link href="/signup" style={styles.footerLink}>
        Need an account? Sign up
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.xl,
    paddingTop: theme.spacing.xxxl,
  },
  form: {
    gap: theme.spacing.lg,
  },
  link: {
    ...theme.typography.bodyStrong,
    color: theme.colors.primaryDark,
  },
  socialRow: {
    gap: theme.spacing.md,
  },
  footerLink: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    textAlign: "center",
  },
});
