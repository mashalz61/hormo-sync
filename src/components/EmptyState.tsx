import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme";

interface EmptyStateProps {
  title: string;
  description: string;
}

export const EmptyState = ({ title, description }: EmptyStateProps) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.description}>{description}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.xl,
    borderRadius: theme.radius.xl,
    backgroundColor: "rgba(255,255,255,0.88)",
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
    alignItems: "center",
  },
  title: {
    ...theme.typography.title3,
    color: theme.colors.text,
    textAlign: "center",
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    textAlign: "center",
  },
});
