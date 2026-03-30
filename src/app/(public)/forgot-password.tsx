import { router } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

import { AuthShell } from "@/components/AuthShell";
import { CustomButton } from "@/components/CustomButton";
import { InputField } from "@/components/InputField";

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
    <AuthShell
      eyebrow="Password help"
      title="Reset password"
      subtitle="Enter your email to receive a reset link."
    >
      <InputField
        autoCapitalize="none"
        keyboardType="email-address"
        label="Email address"
        value={email}
        onChangeText={setEmail}
      />
      <CustomButton label="Send Reset Link" onPress={handleReset} />
    </AuthShell>
  );
}
