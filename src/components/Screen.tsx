import { PropsWithChildren } from "react";
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { globalStyles, theme } from "@/theme";

interface ScreenProps extends PropsWithChildren {
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}

export const Screen = ({ children, scroll = true, contentStyle }: ScreenProps) => {
  const insets = useSafeAreaInsets();
  const flattenedContentStyle = StyleSheet.flatten(contentStyle) || {};
  const customPaddingBottom =
    typeof flattenedContentStyle.paddingBottom === "number"
      ? flattenedContentStyle.paddingBottom
      : 0;

  const scrollResolvedContentStyle = {
    ...flattenedContentStyle,
    paddingBottom: 120 + insets.bottom + customPaddingBottom,
  };

  if (!scroll) {
    return (
      <SafeAreaView style={globalStyles.screen}>
        <View style={styles.backgroundOrbTop} />
        <View style={styles.backgroundOrbBottom} />
        <View style={[globalStyles.content, { flex: 1 }, contentStyle]}>{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.screen}>
      <View pointerEvents="none" style={styles.backgroundOrbTop} />
      <View pointerEvents="none" style={styles.backgroundOrbBottom} />
      <ScrollView
        contentContainerStyle={[
          globalStyles.content,
          { paddingTop: theme.spacing.lg, gap: theme.spacing.xl },
          scrollResolvedContentStyle,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backgroundOrbTop: {
    position: "absolute",
    top: -90,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: theme.colors.backgroundTint,
    opacity: 0.9,
  },
  backgroundOrbBottom: {
    position: "absolute",
    bottom: 90,
    left: -90,
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: theme.colors.backgroundStrong,
    opacity: 0.7,
  },
});
