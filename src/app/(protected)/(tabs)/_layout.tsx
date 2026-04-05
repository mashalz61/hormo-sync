import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppLogo } from "@/components/AppLogo";
import { theme } from "@/theme";

function createTabIcon(
  activeName: keyof typeof Ionicons.glyphMap,
  inactiveName: keyof typeof Ionicons.glyphMap,
) {
  const TabBarIcon = ({
    color,
    size,
    focused,
  }: {
    color: string;
    size: number;
    focused: boolean;
  }) => (
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
  TabBarIcon.displayName = `TabBarIcon(${String(activeName)})`;
  return TabBarIcon;
}

function HomeTabBarIcon({ focused }: { focused: boolean }) {
  return (
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
      <AppLogo size={focused ? 30 : 26} />
    </View>
  );
}

function createTabLabel(title: string) {
  const TabBarLabel = ({ focused, color }: { focused: boolean; color: string }) => (
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
  TabBarLabel.displayName = `TabBarLabel(${title})`;
  return TabBarLabel;
}

const tabOptions = (
  title: string,
  activeName: keyof typeof Ionicons.glyphMap,
  inactiveName: keyof typeof Ionicons.glyphMap,
) => ({
  title,
  tabBarIcon: createTabIcon(activeName, inactiveName),
  tabBarLabel: createTabLabel(title),
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
          height: 74,
          borderRadius: 24,
          backgroundColor: "rgba(255,255,255,0.98)",
          borderTopColor: "transparent",
          borderWidth: 1,
          borderColor: "rgba(232,205,219,0.95)",
          paddingTop: 8,
          paddingBottom: 10,
          shadowColor: "#5A3A48",
          shadowOpacity: 0.12,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          elevation: 8,
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
          tabBarIcon: HomeTabBarIcon,
          tabBarLabel: createTabLabel("Home"),
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
