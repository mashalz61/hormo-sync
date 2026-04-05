import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme";

interface ActionCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  onPress: () => void;
}

export const ActionCard = ({ icon, title, description, onPress }: ActionCardProps) => {
  const tone = getActionTone(title);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.shell, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={tone.gradient}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={[styles.card, { borderColor: tone.border }]}
      >
        <View style={[styles.glow, { backgroundColor: tone.glow }]} />

        <View style={styles.topRow}>
          <View style={[styles.iconShell, { backgroundColor: tone.iconBackground, borderColor: tone.iconBorder }]}>
            <Ionicons color={tone.iconColor} name={icon} size={21} />
          </View>
          <View style={[styles.badge, { backgroundColor: tone.badgeBackground, borderColor: tone.badgeBorder }]}>
            <Text style={[styles.badgeText, { color: tone.badgeText }]}>
              {title === "Log Meal" ? "Nutrition" : "Movement"}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        <View style={styles.metaRow}>
          <View style={[styles.metaChip, { backgroundColor: tone.metaBackground, borderColor: tone.metaBorder }]}>
            <Ionicons color={tone.iconColor} name="flash-outline" size={14} />
            <Text style={[styles.metaText, { color: tone.metaText }]}>{tone.helper}</Text>
          </View>
        </View>

        <View style={[styles.footer, { borderTopColor: tone.divider }]}>
          <View>
            <Text style={styles.ctaLabel}>Tap to continue</Text>
            <Text style={styles.ctaText}>Open logger</Text>
          </View>
          <View style={[styles.arrowShell, { backgroundColor: tone.arrowBackground }]}>
            <Ionicons color={tone.iconColor} name="arrow-forward" size={18} />
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  shell: {
    borderRadius: 24,
    ...theme.shadows.card,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: theme.spacing.xl,
    gap: theme.spacing.lg,
    overflow: "hidden",
    minHeight: 208,
  },
  pressed: {
    opacity: 0.97,
    transform: [{ translateY: 1 }, { scale: 0.992 }],
  },
  glow: {
    position: "absolute",
    right: -22,
    top: -26,
    width: 120,
    height: 120,
    borderRadius: 999,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  iconShell: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  badge: {
    borderRadius: theme.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
  },
  badgeText: {
    ...theme.typography.small,
  },
  content: {
    gap: 6,
  },
  title: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    lineHeight: 21,
  },
  metaRow: {
    marginTop: "auto",
  },
  metaChip: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
  },
  metaText: {
    ...theme.typography.small,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    paddingTop: theme.spacing.md,
  },
  ctaLabel: {
    ...theme.typography.small,
    color: theme.colors.textSoft,
    marginBottom: 2,
  },
  ctaText: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  arrowShell: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
});

const getActionTone = (title: string) => {
  if (title.toLowerCase().includes("meal")) {
    return {
      gradient: ["#FFFFFF", "#FFF8F1"] as [string, string],
      border: "#EADACB",
      glow: "#FFF0DA",
      iconBackground: "#FFF3E1",
      iconBorder: "#ECDDC7",
      iconColor: "#AA7A2D",
      badgeBackground: "#FFF5E9",
      badgeBorder: "#ECDDC7",
      badgeText: "#8C6725",
      metaBackground: "#FFF7ED",
      metaBorder: "#ECDDC7",
      metaText: "#8C6725",
      divider: "#F0E2D5",
      arrowBackground: "#FFF1DE",
      helper: "Quick meal check",
    };
  }

  return {
    gradient: ["#FFFFFF", "#F7FBF8"] as [string, string],
    border: "#D8E6DB",
    glow: "#E8F6EC",
    iconBackground: "#EAF6EE",
    iconBorder: "#D2E6D8",
    iconColor: "#4D8661",
    badgeBackground: "#EFF8F2",
    badgeBorder: "#D2E6D8",
    badgeText: "#447455",
    metaBackground: "#F3FAF5",
    metaBorder: "#D2E6D8",
    metaText: "#447455",
    divider: "#DDEADF",
    arrowBackground: "#EAF6EE",
    helper: "Sync burned calories",
  };
};
