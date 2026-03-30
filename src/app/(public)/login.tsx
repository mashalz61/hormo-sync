import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import { AuthShell } from "@/components/AuthShell";
import { CustomButton } from "@/components/CustomButton";
import { InputField } from "@/components/InputField";
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
    <AuthShell
      eyebrow="Welcome back"
      title="Log in"
      subtitle="Continue to your dashboard."
      footer={
        <Link href="/signup" style={styles.footerLink}>
          Need an account? Sign up
        </Link>
      }
    >
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
      </View>

      <Link href="/forgot-password" style={styles.link}>
        Forgot password?
      </Link>

      <CustomButton label="Log In" onPress={handleLogin} />
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: theme.spacing.lg,
  },
  link: {
    ...theme.typography.bodyStrong,
    color: theme.colors.primaryDark,
    textAlign: "right",
  },
  footerLink: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    textAlign: "center",
  },
});
