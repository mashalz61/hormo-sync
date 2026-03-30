import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";

import { theme } from "@/theme";

interface StackBackButtonProps {
  onPress: () => void;
}

export const StackBackButton = ({ onPress }: StackBackButtonProps) => (
  <Pressable accessibilityRole="button" onPress={onPress} style={styles.button}>
    <Ionicons color={theme.colors.primary} name="arrow-back" size={18} />
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9EDF2",
  },
});

