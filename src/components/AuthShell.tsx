import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/Screen";
import { theme } from "@/theme";

interface AuthShellProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  footer?: ReactNode;
  children: ReactNode;
}

export const AuthShell = ({
  eyebrow,
  title,
  subtitle,
  footer,
  children,
}: AuthShellProps) => (
  <Screen scroll={false} contentStyle={styles.container}>
    <LinearGradient colors={["#FAE6EE", "#FFF6FA"]} style={styles.heroShell}>
      <View style={styles.heroPanel}>
        <View style={styles.heroGlowLarge} />

        <View style={styles.brandRow}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandBadgeText}>H</Text>
          </View>
          <View style={styles.brandCopy}>
            <Text style={styles.brandLabel}>HormoSync</Text>
          </View>
        </View>

        <View style={styles.copyBlock}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
    </LinearGradient>

    <View style={styles.formCard}>{children}</View>
    {footer ? <View style={styles.footer}>{footer}</View> : null}
  </Screen>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    gap: theme.spacing.lg,
  },
  heroShell: {
    borderRadius: theme.radius.lg,
    padding: 2,
  },
  heroPanel: {
    overflow: "hidden",
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: "#EDD5E0",
    backgroundColor: "#FFF9FB",
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  heroGlowLarge: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 999,
    right: -34,
    top: -28,
    backgroundColor: "rgba(244, 205, 223, 0.45)",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  brandBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  brandBadgeText: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.white,
  },
  brandCopy: {
    flex: 1,
  },
  brandLabel: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  copyBlock: {
    gap: theme.spacing.xs,
  },
  eyebrow: {
    ...theme.typography.small,
    color: theme.colors.primaryDark,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  title: {
    ...theme.typography.title1,
    color: theme.colors.text,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  formCard: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: "#E8D3DE",
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    ...theme.shadows.card,
  },
  footer: {
    gap: theme.spacing.sm,
  },
});
