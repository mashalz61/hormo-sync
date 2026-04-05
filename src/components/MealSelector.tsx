import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { theme } from "@/theme";

interface MealSelectorProps {
  label: string;
  options: string[];
  value?: string;
  placeholder?: string;
  onChange: (value?: string) => void;
  errorText?: string;
}

export const MealSelector = ({
  label,
  options,
  value,
  placeholder = "Search and select a meal",
  onChange,
  errorText,
}: MealSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return options;
    }

    return options.filter((option) => option.toLowerCase().includes(normalizedQuery));
  }, [options, query]);

  const openSelector = () => setIsOpen(true);
  const closeSelector = () => {
    setIsOpen(false);
    setQuery("");
  };

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    closeSelector();
  };

  const handleClear = () => {
    onChange(undefined);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Pressable
        accessibilityRole="button"
        onPress={openSelector}
        style={[styles.trigger, errorText && styles.triggerError]}
      >
        <View style={styles.triggerLeading}>
          <View style={styles.triggerIcon}>
            <Ionicons color={theme.colors.primaryDark} name="restaurant-outline" size={16} />
          </View>
          <View style={styles.triggerCopy}>
            <Text numberOfLines={1} style={[styles.triggerText, !value && styles.placeholder]}>
              {value ?? placeholder}
            </Text>
            <Text style={styles.triggerHint}>
              {value ? "Tap to change selection" : `${options.length} meal options available`}
            </Text>
          </View>
        </View>

        <View style={styles.triggerActions}>
          {value ? (
            <Pressable hitSlop={8} onPress={handleClear} style={styles.clearButton}>
              <Ionicons color={theme.colors.textMuted} name="close-circle" size={18} />
            </Pressable>
          ) : null}
          <View style={styles.chevronWrap}>
            <Ionicons color={theme.colors.textMuted} name="chevron-down" size={18} />
          </View>
        </View>
      </Pressable>

      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}

      <Modal animationType="slide" transparent visible={isOpen} onRequestClose={closeSelector}>
        <TouchableWithoutFeedback onPress={closeSelector}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.sheet}>
                <View style={styles.sheetHandle} />

                <View style={styles.sheetHeader}>
                  <View>
                    <Text style={styles.sheetTitle}>{label}</Text>
                    <Text style={styles.sheetSubtitle}>
                      Search quickly, choose once, and keep the flow simple.
                    </Text>
                  </View>
                  <Pressable hitSlop={8} onPress={closeSelector}>
                    <Ionicons color={theme.colors.textMuted} name="close" size={22} />
                  </Pressable>
                </View>

                {value ? (
                  <View style={styles.selectedBanner}>
                    <View style={styles.selectedIcon}>
                      <Ionicons color={theme.colors.primaryDark} name="checkmark-circle" size={16} />
                    </View>
                    <View style={styles.selectedCopy}>
                      <Text style={styles.selectedLabel}>Selected meal</Text>
                      <Text numberOfLines={1} style={styles.selectedValue}>
                        {value}
                      </Text>
                    </View>
                  </View>
                ) : null}

                <View style={styles.searchShell}>
                  <View style={styles.searchIcon}>
                    <Ionicons color={theme.colors.textMuted} name="search" size={16} />
                  </View>
                  <TextInput
                    autoFocus
                    onChangeText={setQuery}
                    placeholder="Search meals"
                    placeholderTextColor={theme.colors.textSoft}
                    style={styles.searchInput}
                    value={query}
                  />
                </View>

                <View style={styles.searchMetaRow}>
                  <Text style={styles.searchMetaText}>
                    {filteredOptions.length} result{filteredOptions.length === 1 ? "" : "s"}
                  </Text>
                  {query ? (
                    <Pressable hitSlop={8} onPress={() => setQuery("")}>
                      <Text style={styles.clearSearchText}>Clear search</Text>
                    </Pressable>
                  ) : null}
                </View>

                <FlatList
                  data={filteredOptions}
                  keyExtractor={(item) => item}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => handleSelect(item)}
                      style={[styles.optionRow, item === value && styles.optionRowSelected]}
                    >
                      <View style={[styles.optionLeadingIcon, item === value && styles.optionLeadingIconSelected]}>
                        <Ionicons
                          color={item === value ? theme.colors.primaryDark : theme.colors.textSoft}
                          name="restaurant-outline"
                          size={15}
                        />
                      </View>
                      <View style={styles.optionCopy}>
                        <Text style={styles.optionText}>{item}</Text>
                        <Text style={styles.optionHint}>
                          {item === value ? "Currently selected" : "Tap to choose this meal"}
                        </Text>
                      </View>
                      {item === value ? (
                        <Ionicons color={theme.colors.primaryDark} name="checkmark-circle" size={18} />
                      ) : (
                        <Ionicons color={theme.colors.textSoft} name="chevron-forward" size={16} />
                      )}
                    </Pressable>
                  )}
                  showsVerticalScrollIndicator={false}
                  style={styles.optionsList}
                  ListEmptyComponent={
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyTitle}>No meals found</Text>
                      <Text style={styles.emptyBody}>Try a shorter search term.</Text>
                    </View>
                  }
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  label: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  trigger: {
    minHeight: 68,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: "rgba(255,255,255,0.94)",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  triggerError: {
    borderColor: theme.colors.danger,
  },
  triggerLeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    flex: 1,
  },
  triggerIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FCECF3",
    borderWidth: 1,
    borderColor: "#EAD2DD",
  },
  triggerCopy: {
    flex: 1,
    gap: 3,
  },
  triggerText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  placeholder: {
    color: theme.colors.textSoft,
  },
  triggerHint: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
  triggerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  clearButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  chevronWrap: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAEDF3",
  },
  errorText: {
    ...theme.typography.small,
    color: theme.colors.danger,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(76, 49, 64, 0.28)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl,
    minHeight: "68%",
    gap: theme.spacing.lg,
  },
  sheetHandle: {
    alignSelf: "center",
    width: 48,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#E8D6DE",
    marginTop: -4,
    marginBottom: 2,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  sheetTitle: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  sheetSubtitle: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  selectedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: "#E8D4DE",
    backgroundColor: "#FFF5F9",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  selectedIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FCEAF1",
  },
  selectedCopy: {
    flex: 1,
    gap: 2,
  },
  selectedLabel: {
    ...theme.typography.small,
    color: theme.colors.primaryDark,
  },
  selectedValue: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  searchShell: {
    minHeight: 56,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: "rgba(255,255,255,0.96)",
    paddingHorizontal: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  searchIcon: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAEDF3",
  },
  searchInput: {
    flex: 1,
    minHeight: 54,
    color: theme.colors.text,
    ...theme.typography.body,
  },
  searchMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: -6,
  },
  searchMetaText: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
  clearSearchText: {
    ...theme.typography.small,
    color: theme.colors.primaryDark,
  },
  optionsList: {
    flexGrow: 0,
  },
  optionRow: {
    minHeight: 64,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: "rgba(255,255,255,0.96)",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  optionRowSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surfaceMuted,
  },
  optionLeadingIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAEDF3",
  },
  optionLeadingIconSelected: {
    backgroundColor: "#F7E2EC",
  },
  optionCopy: {
    flex: 1,
    gap: 3,
  },
  optionText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  optionHint: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
  emptyState: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    gap: theme.spacing.xs,
    alignItems: "center",
  },
  emptyTitle: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },
  emptyBody: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },
});
