import { Ionicons } from "@expo/vector-icons";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Service } from "@/types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface DashboardCardProps {
  service: Service;
  onPress?: () => void;
}

export const DashboardCard = ({ service, onPress }: DashboardCardProps) => {
  const pressed = useSharedValue(0);
  const category = getServiceCategory(service.title);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pressed.value, [0, 1], [1, 0.98]) }],
    opacity: interpolate(pressed.value, [0, 1], [1, 0.95]),
  }));

  return (
    <AnimatedPressable
      accessibilityLabel={`Open ${service.title}`}
      accessibilityRole="button"
      onHoverIn={() => {
        pressed.value = withSpring(1, { damping: 18, stiffness: 220 });
      }}
      onHoverOut={() => {
        pressed.value = withSpring(0, { damping: 18, stiffness: 220 });
      }}
      onPress={onPress}
      onPressIn={() => {
        pressed.value = withSpring(1, { damping: 18, stiffness: 220 });
      }}
      onPressOut={() => {
        pressed.value = withSpring(0, { damping: 18, stiffness: 220 });
      }}
      style={[styles.cardWrap, animatedStyle]}
    >
      <View className="h-[194px] rounded-[18px] border border-healthcare-border bg-white p-4">
        <View className="mb-3 flex-row items-start justify-between">
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-[#F9EDF2]">
            <Ionicons
              color="#CC5C89"
              name={service.icon as keyof typeof Ionicons.glyphMap}
              size={18}
            />
          </View>
          <View className="rounded-full bg-[#FDEFF5] px-2 py-1">
            <Text className="text-[10px] font-semibold tracking-[0.3px] text-healthcare-muted">
              {category}
            </Text>
          </View>
        </View>

        <Text
          className="text-[14px] font-semibold leading-5 text-healthcare-text"
          numberOfLines={2}
        >
          {service.title}
        </Text>
        <Text
          className="mt-1 text-[12px] leading-4 text-healthcare-muted"
          numberOfLines={3}
        >
          {service.description}
        </Text>

        <View className="mt-auto flex-row items-center justify-between border-t border-[#F3DBE7] pt-2.5">
          <Text className="text-[12px] font-semibold text-healthcare-primary">Open tool</Text>
          <Ionicons color="#CC5C89" name="chevron-forward" size={16} />
        </View>
      </View>
    </AnimatedPressable>
  );
};

const getServiceCategory = (title: string): string => {
  const value = title.toLowerCase();

  if (value.includes("cycle")) return "Cycle";
  if (value.includes("food") || value.includes("meal")) return "Nutrition";
  if (value.includes("reminder")) return "Habits";
  if (value.includes("bmi")) return "Body";

  return "Assessment";
};

const styles = StyleSheet.create({
  cardWrap: {
    borderRadius: 18,
    shadowColor: "#5A3A48",
    shadowOpacity: Platform.OS === "ios" ? 0.08 : 0,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
});
