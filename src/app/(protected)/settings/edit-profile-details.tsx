import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { CustomButton } from "@/components/CustomButton";
import { ChildRouteHeader } from "@/components/ChildRouteHeader";
import { FormSection } from "@/components/FormSection";
import { InputField } from "@/components/InputField";
import { Screen } from "@/components/Screen";
import { SelectChips } from "@/components/SelectChips";
import { mockUser } from "@/data/mockData";
import { useAppStore } from "@/store/appStore";
import { theme } from "@/theme";

const cycleOptions = ["Menstrual", "Follicular", "Ovulation", "Luteal"];

export default function EditProfileDetailsScreen() {
  const userName = useAppStore((state) => state.userName);
  const setUserName = useAppStore((state) => state.setUserName);

  const [firstName, setFirstName] = useState(userName || mockUser.firstName);
  const [lastName, setLastName] = useState(mockUser.lastName);
  const [email, setEmail] = useState(mockUser.email);
  const [age, setAge] = useState(String(mockUser.age));
  const [cyclePhase, setCyclePhase] = useState<string>(mockUser.cyclePhase);

  const saveProfile = () => {
    const trimmedFirstName = firstName.trim();
    if (trimmedFirstName) {
      setUserName(trimmedFirstName);
    }
    router.back();
  };

  return (
    <Screen>
      <ChildRouteHeader
        backLabel="Back to settings"
        fallbackRoute="/settings"
        title="Edit profile details"
        subtitle="Keep your account information updated so your dashboard feels more personal."
      />

      <FormSection>
        <InputField
          label="First name"
          value={firstName}
          placeholder="Enter your first name"
          onChangeText={setFirstName}
        />
        <InputField
          label="Last name"
          value={lastName}
          placeholder="Enter your last name"
          onChangeText={setLastName}
        />
        <InputField
          autoCapitalize="none"
          keyboardType="email-address"
          label="Email"
          value={email}
          placeholder="name@example.com"
          onChangeText={setEmail}
        />
        <InputField
          keyboardType="number-pad"
          label="Age"
          value={age}
          placeholder="Enter your age"
          onChangeText={setAge}
        />
      </FormSection>

      <FormSection>
        <Text style={styles.groupLabel}>Current cycle phase</Text>
        <SelectChips options={cycleOptions} value={cyclePhase} onChange={setCyclePhase} />
      </FormSection>

      <View style={styles.actions}>
        <CustomButton label="Save changes" onPress={saveProfile} />
        <CustomButton label="Cancel" variant="ghost" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  groupLabel: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  actions: {
    gap: theme.spacing.md,
  },
});
