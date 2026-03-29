import { StyleSheet, Text, View } from "react-native";

import { RiskLevel } from "@/types";
import { theme } from "@/theme";
import { getRiskColor } from "@/utils/health";

interface RiskBadgeProps {
  risk: RiskLevel;
}

export const RiskBadge = ({ risk }: RiskBadgeProps) => (
  <View style={[styles.badge, { backgroundColor: `${getRiskColor(risk)}16` }]}>
    <Text style={[styles.text, { color: getRiskColor(risk) }]}>{risk} risk</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.pill,
  },
  text: {
    ...theme.typography.caption,
  },
});
