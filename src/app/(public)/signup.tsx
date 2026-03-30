import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet } from "react-native";

import { AuthShell } from "@/components/AuthShell";
import { CustomButton } from "@/components/CustomButton";
import { InputField } from "@/components/InputField";
import { useAppStore } from "@/store/appStore";
import { theme } from "@/theme";

export default function SignUpScreen() {
  const login = useAppStore((state) => state.login);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    if (!name || !email || !password) {
      Alert.alert("Incomplete form", "Please fill in all required fields.");
      return;
    }

    login(email);
    router.replace("/home");
  };

  return (
    <AuthShell
      eyebrow="Create account"
      title="Create your account"
      subtitle="Get started in a few quick steps."
      footer={
        <Link href="/login" style={styles.footerLink}>
          Already have an account? Log in
        </Link>
      }
    >
      <InputField
        label="Full name"
        value={name}
        onChangeText={setName}
      />
      <InputField
        autoCapitalize="none"
        keyboardType="email-address"
        label="Email"
        value={email}
        onChangeText={setEmail}
      />
      <InputField
        helperText="Use at least 8 characters for a production-ready password."
        label="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <CustomButton label="Create Account" onPress={handleSignup} />
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  footerLink: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    textAlign: "center",
  },
});
