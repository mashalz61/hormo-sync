import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

import { theme } from "@/theme";

interface InputFieldProps extends TextInputProps {
  label: string;
  helperText?: string;
  errorText?: string;
}

export const InputField = ({ label, helperText, errorText, ...props }: InputFieldProps) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      placeholderTextColor={theme.colors.textSoft}
      style={[styles.input, errorText && styles.inputError]}
      {...props}
    />
    {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    {!errorText && helperText ? <Text style={styles.helper}>{helperText}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  label: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  input: {
    minHeight: 54,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
    color: theme.colors.text,
    ...theme.typography.body,
  },
  inputError: {
    borderColor: theme.colors.danger,
  },
  helper: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
  error: {
    ...theme.typography.small,
    color: theme.colors.danger,
  },
});
