import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

import { AppHeader } from "@/components/AppHeader";
import { CustomButton } from "@/components/CustomButton";
import { FormSection } from "@/components/FormSection";
import { Screen } from "@/components/Screen";
import { mockUser } from "@/data/mockData";
import { useAppStore } from "@/store/appStore";
import { theme } from "@/theme";

interface ToggleSettingRowProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: boolean;
  onChange: (value: boolean) => void;
  showDivider?: boolean;
}

const ToggleSettingRow = ({
  title,
  subtitle,
  icon,
  value,
  onChange,
  showDivider = false,
}: ToggleSettingRowProps) => (
  <View style={[styles.row, showDivider && styles.rowDivider]}>
    <View style={styles.rowIconWrap}>
      <Ionicons color={theme.colors.primaryDark} name={icon} size={18} />
    </View>
    <View style={styles.rowTextWrap}>
      <Text style={styles.rowTitle}>{title}</Text>
      <Text style={styles.rowSubtitle}>{subtitle}</Text>
    </View>
    <Switch
      trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
      thumbColor={theme.colors.white}
      value={value}
      onValueChange={onChange}
    />
  </View>
);

interface ActionSettingRowProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  showDivider?: boolean;
}

const ActionSettingRow = ({ title, subtitle, icon, onPress, showDivider = false }: ActionSettingRowProps) => (
  <Pressable onPress={onPress} style={[styles.row, showDivider && styles.rowDivider]}>
    <View style={styles.rowIconWrap}>
      <Ionicons color={theme.colors.primaryDark} name={icon} size={18} />
    </View>
    <View style={styles.rowTextWrap}>
      <Text style={styles.rowTitle}>{title}</Text>
      <Text style={styles.rowSubtitle}>{subtitle}</Text>
    </View>
    <Ionicons color={theme.colors.textSoft} name="chevron-forward" size={18} />
  </Pressable>
);

export default function SettingsScreen() {
  const logout = useAppStore((state) => state.logout);
  const userName = useAppStore((state) => state.userName);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privacyModeEnabled, setPrivacyModeEnabled] = useState(false);
  const [insightsEnabled, setInsightsEnabled] = useState(true);
  const initials = useMemo(
    () => `${(userName || mockUser.firstName)[0] || ""}${mockUser.lastName[0] || ""}`.toUpperCase(),
    [userName],
  );

  return (
    <Screen>
      <AppHeader subtitle="Manage your profile, preferences, and app support." title="Settings" />

      <FormSection>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLabel}>{initials}</Text>
          </View>
          <View style={styles.profileIdentity}>
            <Text style={styles.profileName}>
              {userName || mockUser.firstName} {mockUser.lastName}
            </Text>
            <Text style={styles.profileMeta}>{mockUser.email}</Text>
            <Text style={styles.profileMeta}>Age {mockUser.age}</Text>
          </View>
        </View>
        <Pressable style={styles.editButton} onPress={() => router.push("/settings/edit-profile-details")}>
          <Ionicons color={theme.colors.primaryDark} name="create-outline" size={16} />
          <Text style={styles.editButtonLabel}>Edit profile details</Text>
        </Pressable>
      </FormSection>

      <FormSection>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.rowsWrap}>
          <ToggleSettingRow
            title="Notifications"
            subtitle="Hydration, cycle, and wellness reminders"
            icon="notifications-outline"
            value={notificationsEnabled}
            onChange={setNotificationsEnabled}
            showDivider
          />
          <ToggleSettingRow
            title="Data privacy mode"
            subtitle="Hide sensitive preview content on cards"
            icon="shield-checkmark-outline"
            value={privacyModeEnabled}
            onChange={setPrivacyModeEnabled}
            showDivider
          />
          <ToggleSettingRow
            title="Supportive insights"
            subtitle="Show educational wellness guidance in dashboard cards"
            icon="sparkles-outline"
            value={insightsEnabled}
            onChange={setInsightsEnabled}
          />
        </View>
      </FormSection>

      <FormSection>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.rowsWrap}>
          <ActionSettingRow
            title="Privacy and data settings"
            subtitle="Control data sharing and profile visibility"
            icon="lock-closed-outline"
            showDivider
          />
          <ActionSettingRow
            title="Customization and accessibility"
            subtitle="Adjust display preferences and readability"
            icon="color-palette-outline"
          />
        </View>
      </FormSection>

      <FormSection>
        <Text style={styles.sectionTitle}>Support & About</Text>
        <View style={styles.rowsWrap}>
          <ActionSettingRow
            title="Contact support"
            subtitle="Get help from the Luna Health team"
            icon="chatbubble-ellipses-outline"
            showDivider
          />
          <ActionSettingRow
            title="App version"
            subtitle="Version 1.0.0"
            icon="information-circle-outline"
          />
        </View>
      </FormSection>

      <View style={styles.logoutCard}>
        <View style={styles.logoutHeader}>
          <View style={styles.logoutIconWrap}>
            <Ionicons color={theme.colors.danger} name="log-out-outline" size={18} />
          </View>
          <View style={styles.logoutCopy}>
            <Text style={styles.logoutTitle}>Log out of your account?</Text>
            <Text style={styles.logoutDescription}>
              You can sign in anytime to keep tracking your cycle and wellness progress.
            </Text>
          </View>
        </View>
        <CustomButton
          label="Log Out"
          variant="secondary"
          onPress={() => {
            logout();
            router.replace("/welcome");
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: theme.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceAccent,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
  },
  avatarLabel: {
    ...theme.typography.title3,
    color: theme.colors.primaryDark,
  },
  profileIdentity: {
    flex: 1,
    gap: 2,
  },
  sectionTitle: {
    ...theme.typography.caption,
    color: theme.colors.textSoft,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  profileName: {
    ...theme.typography.title2,
    color: theme.colors.text,
  },
  profileMeta: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  editButton: {
    minHeight: 42,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    backgroundColor: theme.colors.surfaceMuted,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  editButtonLabel: {
    ...theme.typography.bodyStrong,
    color: theme.colors.primaryDark,
  },
  rowsWrap: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceMuted,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  rowIconWrap: {
    width: 34,
    height: 34,
    borderRadius: theme.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  rowTextWrap: {
    flex: 1,
    gap: 1,
  },
  rowTitle: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  rowSubtitle: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
  logoutCard: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: "#EBCFD8",
    backgroundColor: "#FFF8FA",
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  logoutHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.md,
  },
  logoutIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FDECEE",
    borderWidth: 1,
    borderColor: "#F5D2D8",
  },
  logoutCopy: {
    flex: 1,
    gap: 2,
  },
  logoutTitle: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  logoutDescription: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
});
