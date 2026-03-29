import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Service } from "@/types";
import { theme } from "@/theme";

interface ServiceCardProps {
  service: Service;
  onPress?: () => void;
}

export const ServiceCard = ({ service, onPress }: ServiceCardProps) => (
  <Pressable onPress={onPress} style={[styles.card, { backgroundColor: service.accent }]}>
    <View style={styles.iconWrap}>
      <Ionicons
        color={theme.colors.text}
        name={service.icon as keyof typeof Ionicons.glyphMap}
        size={20}
      />
    </View>
    <Text style={styles.title}>{service.title}</Text>
    <Text style={styles.description}>{service.description}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 176,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    borderWidth: 1,
    borderColor: "rgba(36, 27, 26, 0.06)",
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.md,
    backgroundColor: "rgba(255,255,255,0.75)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  description: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
});
