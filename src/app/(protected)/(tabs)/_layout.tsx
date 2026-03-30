import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "@/theme";

const tabIcon =
  (
    activeName: keyof typeof Ionicons.glyphMap,
    inactiveName: keyof typeof Ionicons.glyphMap,
  ) =>
  ({ color, size, focused }: { color: string; size: number; focused: boolean }) =>
    (
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: focused ? "#FCEFF4" : "transparent",
        }}
      >
        <Ionicons color={color} name={focused ? activeName : inactiveName} size={size} />
      </View>
    );

const homeLogoIcon = ({ focused }: { focused: boolean }) => (
  <View
    style={{
      width: 34,
      height: 34,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: focused ? theme.colors.primary : "#F9EDF2",
    }}
  >
    <Ionicons
      color={focused ? theme.colors.white : theme.colors.primary}
      name={focused ? "home" : "home-outline"}
      size={20}
    />
  </View>
);

const tabLabel =
  (title: string) =>
  ({ focused, color }: { focused: boolean; color: string }) =>
    (
      <Text
        style={{
          ...theme.typography.small,
          fontSize: 11,
          marginTop: 2,
          color,
          fontWeight: focused ? "700" : "600",
        }}
      >
        {title}
      </Text>
    );

const tabOptions = (
  title: string,
  activeName: keyof typeof Ionicons.glyphMap,
  inactiveName: keyof typeof Ionicons.glyphMap,
) => ({
  title,
  tabBarIcon: tabIcon(activeName, inactiveName),
  tabBarLabel: tabLabel(title),
});

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      initialRouteName="home/index"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSoft,
        tabBarStyle: {
          position: "absolute",
          left: 16,
          right: 16,
          bottom: Math.max(insets.bottom, 8),
          height: 70,
          borderRadius: 22,
          backgroundColor: "rgba(255,255,255,0.96)",
          borderTopColor: "transparent",
          borderWidth: 1,
          borderColor: "rgba(232,205,219,0.95)",
          paddingTop: 6,
          paddingBottom: 8,
          shadowColor: "#5A3A48",
          shadowOpacity: 0.1,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 5,
        },
        tabBarItemStyle: {
          borderRadius: 14,
          marginHorizontal: 2,
        },
      }}
    >
      <Tabs.Screen
        name="assessments/index"
        options={tabOptions("Insights", "bar-chart", "bar-chart-outline")}
      />
      <Tabs.Screen
        name="tracker/index"
        options={tabOptions("Tracker", "calendar", "calendar-outline")}
      />
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Home",
          tabBarIcon: homeLogoIcon,
          tabBarLabel: tabLabel("Home"),
        }}
      />
      <Tabs.Screen
        name="reminders/index"
        options={tabOptions("Reminders", "notifications", "notifications-outline")}
      />
      <Tabs.Screen
        name="settings/index"
        options={tabOptions("Settings", "settings", "settings-outline")}
      />
    </Tabs>
  );
}
