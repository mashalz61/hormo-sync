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
        <View style={[globalStyles.content, { flex: 1 }, contentStyle]}>{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.screen}>
      <ScrollView
        contentContainerStyle={[
          globalStyles.content,
          { paddingTop: theme.spacing.lg, gap: theme.spacing.lg },
          scrollResolvedContentStyle,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};
