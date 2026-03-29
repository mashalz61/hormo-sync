import { Stack } from "expo-router";

export default function ProtectedLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="assessments" />
      <Stack.Screen name="tracker" />
      <Stack.Screen name="reminders" />
      <Stack.Screen name="seed" />
    </Stack>
  );
}
