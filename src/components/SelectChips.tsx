import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme";

interface SelectChipsProps {
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
}

export const SelectChips = ({ options, value, onChange }: SelectChipsProps) => (
  <View style={styles.container}>
    {options.map((option) => {
      const isActive = option === value;
      return (
        <Pressable
          key={option}
          onPress={() => onChange?.(option)}
          style={[styles.chip, isActive && styles.chipActive]}
        >
          <Text style={[styles.text, isActive && styles.textActive]}>{option}</Text>
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  chip: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm + 2,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  text: {
    ...theme.typography.caption,
    color: theme.colors.text,
  },
  textActive: {
    color: theme.colors.white,
  },
});
