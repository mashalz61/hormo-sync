import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppLogo } from "@/components/AppLogo";
import { theme } from "@/theme";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
}

export const AppHeader = ({ title, subtitle, rightIcon, onRightPress }: AppHeaderProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, theme.spacing.md) }]}>
      <View style={styles.titleWrap}>
        <View style={styles.kicker}>
          <AppLogo circular size={22} style={styles.kickerLogo} />
          <Text style={styles.kickerText}>Hormo Sync</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightIcon ? (
        <Pressable onPress={onRightPress} style={styles.iconButton}>
          <Ionicons color={theme.colors.text} name={rightIcon} size={20} />
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.md,
  },
  titleWrap: {
    flex: 1,
  },
  kicker: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255, 255, 255, 0.88)",
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  kickerLogo: {
    marginVertical: -2,
  },
  kickerText: {
    ...theme.typography.small,
    color: theme.colors.primaryDark,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  title: {
    ...theme.typography.title1,
    color: theme.colors.text,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
    maxWidth: "92%",
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
});
