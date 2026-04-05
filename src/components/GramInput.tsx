import { StyleSheet, View } from "react-native";

import { InputField } from "@/components/InputField";

interface GramInputProps {
  value?: number;
  onChange: (value?: number) => void;
  errorText?: string;
  label?: string;
  helperText?: string;
  placeholder?: string;
  maxLength?: number;
}

export const GramInput = ({
  value,
  onChange,
  errorText,
  label = "Grams",
  helperText,
  placeholder = "e.g. 150",
  maxLength = 4,
}: GramInputProps) => {
  const handleChangeText = (text: string) => {
    const digitsOnly = text.replace(/[^0-9]/g, "");

    if (!digitsOnly) {
      onChange(undefined);
      return;
    }

    onChange(Number(digitsOnly));
  };

  return (
    <View style={styles.container}>
      <InputField
        errorText={errorText}
        helperText={helperText}
        keyboardType="numeric"
        label={label}
        maxLength={maxLength}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        returnKeyType="done"
        value={value ? String(value) : ""}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: 112,
  },
});
