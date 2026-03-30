import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { Service } from "@/types";
import { theme } from "@/theme";

interface ServiceCardProps {
  service: Service;
  onPress?: () => void;
}

export const ServiceCard = ({ service, onPress }: ServiceCardProps) => {
  const tone = getCardTone(service.id);
  const gradientColors = service.gradientColors ?? [theme.colors.primary, theme.colors.secondary];

  return (
    <Pressable
      accessibilityLabel={`Open ${service.title}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.cardShell, pressed && styles.cardPressed]}
    >
      <LinearGradient
        colors={["#FFFDFE", tone.cardBackground]}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={[styles.card, { borderColor: tone.border }]}
      >
        <LinearGradient
          colors={[`${gradientColors[0]}22`, `${gradientColors[1]}10`]}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 1 }}
          style={styles.glow}
        />

        <View style={styles.header}>
          <View style={styles.metaGroup}>
            <View style={[styles.iconWrap, { backgroundColor: tone.iconBackground }]}>
              <Ionicons
                color={tone.iconColor}
                name={service.icon as keyof typeof Ionicons.glyphMap}
                size={16}
              />
            </View>
            <Text style={styles.helperText}>{getServiceDetail(service.id)}</Text>
          </View>
          <View
            style={[
              styles.statusPill,
              { backgroundColor: tone.pillBackground, borderColor: tone.pillBorder },
            ]}
          >
            <Text style={[styles.statusText, { color: tone.pillText }]}>
              {getServiceCategory(service.title)}
            </Text>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.title}>{service.title}</Text>
          <Text style={styles.description}>{service.description}</Text>
        </View>

        <View style={styles.footer}>
          <View
            style={[
              styles.frequencyChip,
              {
                backgroundColor: tone.frequencyBackground,
                borderColor: tone.frequencyBorder,
              },
            ]}
          >
            <Text style={[styles.frequencyText, { color: tone.frequencyText }]}>
              {getServiceCadence(service.id)}
            </Text>
          </View>
          <View style={styles.actionWrap}>
            <Text style={styles.ctaText}>Open tool</Text>
            <View
              style={[
                styles.actionIcon,
                {
                  backgroundColor: tone.actionBackground,
                  borderColor: tone.actionBorder,
                },
              ]}
            >
              <Ionicons color={tone.iconColor} name="arrow-forward" size={14} />
            </View>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardShell: {
    borderRadius: theme.radius.lg,
    shadowColor: "#8A5C6F",
    shadowOpacity: Platform.OS === "ios" ? 0.12 : 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  card: {
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    gap: 14,
    overflow: "hidden",
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
  },
  cardPressed: {
    opacity: 0.97,
    transform: [{ translateY: -2 }, { scale: 0.995 }],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  metaGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    flex: 1,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(204, 92, 137, 0.12)",
  },
  helperText: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    flex: 1,
  },
  statusPill: {
    borderRadius: theme.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    maxWidth: "100%",
  },
  statusText: {
    ...theme.typography.small,
    flexShrink: 1,
  },
  body: {
    gap: 6,
  },
  title: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.spacing.sm,
    flexWrap: "wrap",
  },
  frequencyChip: {
    borderRadius: theme.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
  },
  frequencyText: {
    ...theme.typography.small,
  },
  actionWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  actionIcon: {
    width: 28,
    height: 28,
    borderRadius: theme.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  ctaText: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
});

const getServiceCategory = (title: string): string => {
  const value = title.toLowerCase();

  if (value.includes("cycle")) return "Cycle";
  if (value.includes("food") || value.includes("meal")) return "Nutrition";
  if (value.includes("seed")) return "Seed";

  return "Tracker";
};

const getCardTone = (serviceId: string) => {
  switch (serviceId) {
    case "cycle":
      return {
        border: "#EACDDA",
        cardBackground: "#FFF7FA",
        iconBackground: "#FCEEF4",
        iconColor: "#B65D86",
        pillBackground: "#F9EAF2",
        pillBorder: "#E9CFE0",
        pillText: "#99506F",
        frequencyBackground: "#FFF0F5",
        frequencyBorder: "#EDD7E3",
        frequencyText: "#8F6075",
        actionBackground: "#FCEEF4",
        actionBorder: "#E8CCDA",
      };
    case "food":
      return {
        border: "#E8D5D8",
        cardBackground: "#FFF9F5",
        iconBackground: "#FBF1E5",
        iconColor: "#9A7B34",
        pillBackground: "#FAF1E5",
        pillBorder: "#EADFC8",
        pillText: "#7C6529",
        frequencyBackground: "#FFF4EA",
        frequencyBorder: "#EBDCCB",
        frequencyText: "#896A37",
        actionBackground: "#FBF1E5",
        actionBorder: "#EADFC8",
      };
    case "seed":
      return {
        border: "#DFD9C9",
        cardBackground: "#FAFBF6",
        iconBackground: "#F1F4E8",
        iconColor: "#5E8455",
        pillBackground: "#EFF4E7",
        pillBorder: "#DDE6D0",
        pillText: "#4F7147",
        frequencyBackground: "#F7F8EE",
        frequencyBorder: "#DCE2CB",
        frequencyText: "#5C7552",
        actionBackground: "#F1F4E8",
        actionBorder: "#DCE2CB",
      };
    default:
      return {
        border: theme.colors.border,
        cardBackground: theme.colors.surface,
        iconBackground: theme.colors.surfaceMuted,
        iconColor: theme.colors.primaryDark,
        pillBackground: "#F7EEF2",
        pillBorder: "#E6CBD8",
        pillText: theme.colors.primaryDark,
        frequencyBackground: theme.colors.surfaceAccent,
        frequencyBorder: "#EAD2DD",
        frequencyText: theme.colors.textMuted,
        actionBackground: theme.colors.surfaceMuted,
        actionBorder: "#E6CBD8",
      };
  }
};

const getServiceDetail = (serviceId: string) => {
  switch (serviceId) {
    case "cycle":
      return "Cycle insights";
    case "food":
      return "Meal guidance";
    case "seed":
      return "Routine support";
    default:
      return "Daily check-in";
  }
};

const getServiceCadence = (serviceId: string) => {
  switch (serviceId) {
    case "cycle":
      return "Track phases";
    case "food":
      return "Log meals";
    case "seed":
      return "Match your phase";
    default:
      return "Daily check-in";
  }
};
