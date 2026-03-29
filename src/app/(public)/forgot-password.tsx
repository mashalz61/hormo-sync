import { router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet } from "react-native";

import { CustomButton } from "@/components/CustomButton";
import { InfoCard } from "@/components/InfoCard";
import { InputField } from "@/components/InputField";
import { Screen } from "@/components/Screen";
import { SectionTitle } from "@/components/SectionTitle";
import { theme } from "@/theme";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");

  const handleReset = () => {
    if (!email) {
      Alert.alert("Email required", "Please enter your email address.");
      return;
    }

    Alert.alert("Reset link sent", "This is a mock confirmation for now.");
    router.back();
  };

  return (
    <Screen contentStyle={styles.container}>
      <SectionTitle
        title="Reset your password"
        subtitle="We’ll send a secure link so you can get back to your health plan."
      />
      <InfoCard
        title="Mock flow"
        description="TODO: Connect this screen to your real password reset endpoint."
      />
      <InputField
        autoCapitalize="none"
        keyboardType="email-address"
        label="Email address"
        value={email}
        onChangeText={setEmail}
      />
      <CustomButton label="Send Reset Link" onPress={handleReset} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.xl,
    paddingTop: theme.spacing.xxxl,
  },
});
