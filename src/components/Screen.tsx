import { PropsWithChildren } from "react";
import { ScrollView, StyleProp, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { globalStyles, theme } from "@/theme";

interface ScreenProps extends PropsWithChildren {
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}

export const Screen = ({ children, scroll = true, contentStyle }: ScreenProps) => {
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
          { paddingTop: theme.spacing.lg, paddingBottom: 120, gap: theme.spacing.lg },
          contentStyle,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};
