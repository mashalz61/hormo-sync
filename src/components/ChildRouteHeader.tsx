import { Href, router } from "expo-router";
import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme";
import { SectionTitle } from "./SectionTitle";
import { StackBackButton } from "./StackBackButton";

interface ChildRouteHeaderProps {
  title: string;
  subtitle?: string;
  backLabel?: string;
  fallbackRoute?: Href;
  onBackPress?: () => void;
  rightAction?: ReactNode;
  showBackButton?: boolean;
}

export const ChildRouteHeader = ({
  title,
  subtitle,
  backLabel = "Back",
  fallbackRoute,
  onBackPress,
  rightAction,
  showBackButton = true,
}: ChildRouteHeaderProps) => {
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }

    if (router.canGoBack()) {
      router.back();
      return;
    }

    if (fallbackRoute) {
      router.replace(fallbackRoute);
    }
  };

  return (
    <View style={styles.container}>
      {showBackButton || rightAction ? (
        <View style={styles.topRow}>
          {showBackButton ? (
            <View style={styles.backGroup}>
              <StackBackButton onPress={handleBackPress} />
              <Text style={styles.backLabel}>{backLabel}</Text>
            </View>
          ) : (
            <View />
          )}
          {rightAction}
        </View>
      ) : null}
      <SectionTitle title={title} subtitle={subtitle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  backGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  backLabel: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
});
