import { Image, StyleProp, View, ViewStyle } from "react-native";

export const appLogoSource = require("../../assets/images/logo.png");

type AppLogoProps = Readonly<{
  size?: number;
  /** When true, clips to a circle (matches round mark-style assets). */
  circular?: boolean;
  style?: StyleProp<ViewStyle>;
}>;

export function AppLogo({ size = 96, circular = true, style }: AppLogoProps) {
  const borderRadius = circular ? size / 2 : Math.round(size * 0.33);

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius,
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <Image
        accessibilityIgnoresInvertColors
        accessibilityLabel="HormoSync logo"
        resizeMode="contain"
        source={appLogoSource}
        style={{ width: size, height: size }}
      />
    </View>
  );
}
