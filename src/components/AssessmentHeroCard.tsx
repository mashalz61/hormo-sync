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
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md,
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
    marginTop: theme.spacing.xs,
  },
  iconWrap: {
    height: 44,
    width: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9EDF2",
  },
});

