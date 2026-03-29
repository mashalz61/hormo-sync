import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { AppHeader } from "@/components/AppHeader";
import { CustomButton } from "@/components/CustomButton";
import { FormSection } from "@/components/FormSection";
import { Screen } from "@/components/Screen";
import { ToggleRow } from "@/components/ToggleRow";
import { mockUser } from "@/data/mockData";
import { useAppStore } from "@/store/appStore";
import { theme } from "@/theme";

export default function SettingsScreen() {
  const logout = useAppStore((state) => state.logout);

  return (
    <Screen>
      <AppHeader subtitle="Manage your profile, preferences, and app support." title="Settings" />
      <FormSection>
        <Text style={styles.sectionTitle}>Profile</Text>
        <Text style={styles.profileName}>
          {mockUser.firstName} {mockUser.lastName}
        </Text>
        <Text style={styles.profileMeta}>{mockUser.email}</Text>
        <Text style={styles.profileMeta}>Age {mockUser.age}</Text>
      </FormSection>
      <FormSection>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <ToggleRow title="Notifications" subtitle="Hydration, cycle, and wellness reminders" value />
        <ToggleRow title="Data privacy mode" subtitle="Hide sensitive preview content on cards" value={false} />
        <ToggleRow title="Supportive insights" subtitle="Show educational wellness guidance in dashboard cards" value />
      </FormSection>
      <FormSection>
        <Text style={styles.sectionTitle}>Support & About</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Privacy and data settings</Text>
          <Text style={styles.listItem}>• Customization and accessibility</Text>
          <Text style={styles.listItem}>• Contact support</Text>
          <Text style={styles.listItem}>• App version 1.0.0</Text>
        </View>
      </FormSection>
      <CustomButton
        label="Log Out"
        variant="secondary"
        onPress={() => {
          logout();
          router.replace("/welcome");
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  profileName: {
    ...theme.typography.title2,
    color: theme.colors.text,
  },
  profileMeta: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  list: {
    gap: theme.spacing.sm,
  },
  listItem: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
});
