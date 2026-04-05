import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme";

interface AssessmentHeroCardProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradientColors?: [string, string, string];
}

export const AssessmentHeroCard = ({
  eyebrow,
  title,
  description,
  icon,
  gradientColors = ["#F7E4ED", "#FCEFF5", "#FFFFFF"],
}: AssessmentHeroCardProps) => (
  <LinearGradient colors={gradientColors} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={styles.gradient}>
    <View style={styles.card}>
      <View style={styles.glowTop} />
      <View style={styles.row}>
        <View style={styles.copyWrap}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={styles.iconWrap}>
          <Ionicons color={theme.colors.primary} name={icon} size={20} />
        </View>
      </View>
    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 22,
    padding: 2,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    overflow: "hidden",
  },
  glowTop: {
    position: "absolute",
    right: -24,
    top: -30,
    width: 120,
    height: 120,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(247, 228, 237, 0.7)",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing.lg,
  },
  copyWrap: {
    flex: 1,
  },
  eyebrow: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  title: {
    ...theme.typography.title2,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  description: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
    lineHeight: 20,
  },
  iconWrap: {
    height: 50,
    width: 50,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9EDF2",
    borderWidth: 1,
    borderColor: "#EFD5E1",
  },
});
