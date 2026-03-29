import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import { CustomButton } from "@/components/CustomButton";
import { InputField } from "@/components/InputField";
import { Screen } from "@/components/Screen";
import { SectionTitle } from "@/components/SectionTitle";
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

    // TODO: Replace mock sign-up with API mutation and secure auth flow.
    login(email);
    router.replace("/home");
  };

  return (
    <Screen contentStyle={styles.container}>
      <SectionTitle
        title="Create your account"
        subtitle="Start with a secure space for supportive cycle and health tracking."
      />
      <View style={styles.form}>
        <InputField label="Full name" value={name} onChangeText={setName} />
        <InputField
          autoCapitalize="none"
          keyboardType="email-address"
          label="Email"
          value={email}
          onChangeText={setEmail}
        />
        <InputField
          helperText="Use at least 8 characters for production."
          label="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <CustomButton label="Create Account" onPress={handleSignup} />
      <Link href="/login" style={styles.footerLink}>
        Already have an account? Log in
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
  footerLink: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    textAlign: "center",
  },
});
