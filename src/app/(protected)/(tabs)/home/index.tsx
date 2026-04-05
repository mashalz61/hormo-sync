import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { DashboardCard } from "@/components/DashboardCard";
import { Screen } from "@/components/Screen";
import { mockUser, services } from "@/data/mockData";
import { useGreeting } from "@/hooks/useGreeting";
import { homeSnapshot, useAppStore } from "@/store/appStore";
import { selectNetCalories, useCalorieStore } from "@/store/calorieStore";
import { formatKcalForDisplay, formatKcalWithUnit } from "@/utils/calorieResponse";

const quickStatCards: Array<{
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
}> = [
  {
    label: "Cycle Day",
    value: `${homeSnapshot.activeCycleDay}`,
    icon: "calendar-clear-outline",
  },
  {
    label: "BMI",
    value: `${homeSnapshot.bmi}`,
    icon: "analytics-outline",
  },
  {
    label: "Risk",
    value: homeSnapshot.riskSummary.risk,
    icon: "shield-checkmark-outline",
  },
  {
    label: "Habits",
    value: `${homeSnapshot.completedHabits}/${homeSnapshot.totalHabits}`,
    icon: "checkmark-done-outline",
  },
];

const riskToneByLevel = {
  Low: { bgColor: "#E3F5ED", textColor: "#1E8B60" },
  Moderate: { bgColor: "#FFF2DE", textColor: "#A86E0A" },
  High: { bgColor: "#FCE6E9", textColor: "#B94A5D" },
};

export default function HomeScreen() {
  const greeting = useGreeting();
  const reminders = useAppStore((state) => state.reminders);
  const consumedCalories = useCalorieStore((state) => state.consumedCalories);
  const burnedCalories = useCalorieStore((state) => state.burnedCalories);
  const netCalories = useCalorieStore(selectNetCalories);
  const riskTone = riskToneByLevel[homeSnapshot.riskSummary.risk];
  const habitCompletion = Math.round(
    (homeSnapshot.completedHabits / homeSnapshot.totalHabits) * 100,
  );
  const todayLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(new Date());

  return (
    <Screen contentStyle={{ paddingHorizontal: 16, gap: 24 }}>
      <LinearGradient
        colors={["#F7DDE9", "#FBEAF2", "#FFF6FA"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 32, padding: 2 }}
      >
        <View className="overflow-hidden rounded-[30px] border border-[#EFD3DF] bg-[#FFF8FB] px-5 pb-6 pt-4">
          <View className="absolute -right-12 -top-10 h-44 w-44 rounded-full bg-[#F6D5E3]/85" />
          <View className="absolute -bottom-16 -left-8 h-40 w-40 rounded-full bg-[#F9E0EB]/80" />
          <View className="absolute right-10 top-16 h-16 w-16 rounded-full border border-white/40 bg-white/20" />

          <View className="mb-3 flex-row items-center justify-between">
            <View className="rounded-full border border-[#EED8E3] bg-white/95 px-3 py-1">
              <Text className="text-[11px] font-semibold text-healthcare-muted">{todayLabel}</Text>
            </View>
            <View className="rounded-full border border-[#EED8E3] bg-white/95 px-3 py-1">
              <Text className="text-[11px] font-semibold text-healthcare-primary">
                {mockUser.cyclePhase} phase
              </Text>
            </View>
          </View>

          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1">
              <View className="self-start rounded-full border border-white/70 bg-white/85 px-3 py-1">
                <Text className="text-[11px] font-semibold uppercase tracking-[0.6px] text-healthcare-muted">
                  {greeting}
                </Text>
              </View>
              <Text className="mt-2 text-[28px] font-bold leading-8 text-healthcare-text">
                {mockUser.firstName}
              </Text>
              <Text className="mt-2 text-[14px] leading-6 text-healthcare-muted">
                Your wellness summary is ready. Focus on steady meals, hydration, and movement.
              </Text>
            </View>

            <View className="rounded-[20px] border border-[#F0D7E3] bg-white px-3 py-2.5">
              <View className="flex-row items-center gap-1.5">
                <Ionicons color="#CC5C89" name="sparkles-outline" size={14} />
                <Text className="text-[11px] font-semibold text-healthcare-primary">Daily Focus</Text>
              </View>
              <Text className="mt-1 text-[13px] font-semibold text-healthcare-text">
                Day {homeSnapshot.activeCycleDay}
              </Text>
            </View>
          </View>

          <View className="mt-5 flex-row flex-wrap gap-3">
            {quickStatCards.map((item) => (
              <QuickStat key={item.label} icon={item.icon} label={item.label} value={item.value} />
            ))}
          </View>

          <View className="mt-5 rounded-[24px] border border-[#EED4E1] bg-white px-4 py-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-[13px] font-medium text-healthcare-muted">Today&apos;s rhythm</Text>
              <Text className="text-[12px] font-semibold text-healthcare-primary">
                {habitCompletion}% complete
              </Text>
            </View>
            <View className="mt-2 h-2 overflow-hidden rounded-full bg-[#F3DFE8]">
              <View
                className="h-full rounded-full bg-healthcare-primary"
                style={{ width: `${habitCompletion}%` }}
              />
            </View>
            <Text className="mt-2 text-[13px] leading-5 text-healthcare-muted">
              You&apos;ve completed {homeSnapshot.completedHabits} of {homeSnapshot.totalHabits} daily
              habits.
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View className="overflow-hidden rounded-[24px] border border-[#ECD1DE] bg-white p-5">
        <View className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#FAEDF3]" />
        <View className="flex-row items-center justify-between">
          <Text className="text-[16px] font-semibold text-healthcare-text">Continue Progress</Text>
          <View className="rounded-full px-3 py-1" style={{ backgroundColor: riskTone.bgColor }}>
            <Text className="text-[12px] font-semibold" style={{ color: riskTone.textColor }}>
              {homeSnapshot.riskSummary.risk} focus
            </Text>
          </View>
        </View>
        <Text className="mt-2 text-[14px] leading-6 text-healthcare-muted">
          {homeSnapshot.riskSummary.stage}
        </Text>

        <View className="mt-4 rounded-[20px] border border-[#EED5E1] bg-[#FFFAFC] px-3.5 py-3">
          <Text className="text-[11px] font-semibold uppercase tracking-[0.5px] text-healthcare-muted">
            Today&apos;s calories
          </Text>
          <View className="mt-2 flex-row justify-between gap-2">
            <HomeCalorieStat label="Consumed" value={formatKcalWithUnit(consumedCalories)} />
            <HomeCalorieStat label="Burned" value={formatKcalWithUnit(burnedCalories)} />
            <View className="min-w-0 flex-1">
              <Text className="text-[10px] font-medium uppercase tracking-[0.4px] text-healthcare-muted">
                Net
              </Text>
              <Text className="mt-0.5 text-[14px] font-semibold text-healthcare-text" numberOfLines={1}>
                {formatKcalForDisplay(netCalories)}
              </Text>
              <Text className="text-[10px] text-healthcare-muted">net kcal</Text>
            </View>
          </View>
        </View>

        <View className="mt-4 gap-2.5">
          <ActionChip
            icon="pulse-outline"
            label="Resume Assessment"
            description="Continue where you left off"
            onPress={() => router.push("/assessments/final-assessment")}
          />
          <ActionChip
            icon="restaurant-outline"
            label="Smart Food Analyzer"
            description="Track meals, workouts, and calorie balance"
            onPress={() => router.push("/tracker/smart-food-dashboard")}
          />
          <ActionChip
            icon="leaf-outline"
            label="Seed Tracker"
            description="Check phase-based recommendations"
            onPress={() => router.push("/seed/seed-cycle-tracker")}
          />
        </View>
      </View>

      <View className="rounded-[24px] border border-[#ECD1DE] bg-white p-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-[16px] font-semibold text-healthcare-text">Today&apos;s Reminders</Text>
          <Pressable
            accessibilityRole="button"
            className="rounded-full bg-[#FAEDF3] px-3 py-1"
            onPress={() => router.push("/reminders/reminder-list")}
          >
            <Text className="text-[12px] font-semibold text-healthcare-primary">See all</Text>
          </Pressable>
        </View>

        <View className="mt-4 gap-3">
          {reminders.slice(0, 3).map((item) => (
            <View
              key={item.id}
              className="overflow-hidden rounded-[20px] border border-[#EED5E1] bg-[#FFFAFC]"
            >
              <View className="flex-row items-center justify-between px-4 py-3.5">
                <View className="min-w-0 flex-1 flex-row items-center gap-3">
                  <View className="h-11 w-11 items-center justify-center rounded-[14px] bg-white">
                    <Ionicons color="#CC5C89" name={getReminderIcon(item.activity)} size={17} />
                  </View>
                  <View className="min-w-0 flex-1 pr-2">
                    <Text className="text-[14px] font-semibold text-healthcare-text">
                      {item.activity}
                    </Text>
                    <Text className="mt-0.5 text-[12px] leading-4 text-healthcare-muted" numberOfLines={2}>
                      {item.purpose}
                    </Text>
                  </View>
                </View>
                <View className="items-end gap-1">
                  <Text className="text-[12px] font-semibold text-healthcare-primary">{item.time}</Text>
                  <View className="rounded-full bg-[#FAEDF3] px-2 py-0.5">
                    <Text className="text-[10px] font-semibold text-[#8F6075]">{item.frequency}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className="rounded-[24px] border border-[#ECD1DE] bg-white p-4">
        <View className="mb-3">
          <Text className="text-[18px] font-semibold text-healthcare-text">Health Services</Text>
          <Text className="mt-1 text-[14px] leading-5 text-healthcare-muted">
            Choose a tool to continue your health journey.
          </Text>
        </View>

        <View className="mt-3 flex-row flex-wrap justify-between pb-1">
          {services.map((service, index) => (
            <Animated.View
              key={service.id}
              className="mb-4 w-[48.5%]"
              entering={FadeInDown.delay(110 + index * 45).springify()}
            >
              <DashboardCard service={service} onPress={() => router.push(service.route as never)} />
            </Animated.View>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const getReminderIcon = (activity: string): keyof typeof Ionicons.glyphMap => {
  const value = activity.toLowerCase();

  if (value.includes("hydration") || value.includes("water")) return "water-outline";
  if (value.includes("walk") || value.includes("exercise") || value.includes("movement")) {
    return "walk-outline";
  }
  if (value.includes("sleep")) return "moon-outline";
  if (value.includes("meal") || value.includes("food")) return "nutrition-outline";

  return "alarm-outline";
};

interface QuickStatProps {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
}

function HomeCalorieStat({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <View className="min-w-0 flex-1">
      <Text className="text-[10px] font-medium uppercase tracking-[0.4px] text-healthcare-muted">{label}</Text>
      <Text className="mt-0.5 text-[14px] font-semibold text-healthcare-text" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const QuickStat = ({ label, value, icon }: QuickStatProps) => (
  <View className="min-w-[46%] flex-1 rounded-[18px] border border-[#EED5E1] bg-white/95 p-3.5">
    <View className="flex-row items-center justify-between">
      <Text className="text-[11px] font-medium uppercase tracking-[1px] text-healthcare-muted">{label}</Text>
      <Ionicons color="#8F6075" name={icon} size={14} />
    </View>
    <Text className="mt-2 text-[17px] font-semibold text-healthcare-text">{value}</Text>
  </View>
);

interface ActionChipProps {
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

const ActionChip = ({ label, description, icon, onPress }: ActionChipProps) => (
  <Pressable
    accessibilityRole="button"
    className="flex-row items-center gap-3 rounded-[20px] border border-[#EED5E1] bg-[#FFFAFC] px-3.5 py-3.5"
    onPress={onPress}
  >
    <View className="h-10 w-10 items-center justify-center rounded-[14px] bg-white">
      <Ionicons color="#CC5C89" name={icon} size={16} />
    </View>
    <View className="flex-1">
      <Text className="text-[13px] font-semibold text-healthcare-text">{label}</Text>
      <Text className="mt-0.5 text-[11px] leading-4 text-healthcare-muted">{description}</Text>
    </View>
    <View className="h-8 w-8 items-center justify-center rounded-full bg-[#FAEDF3]">
      <Ionicons color="#9A7285" name="chevron-forward" size={16} />
    </View>
  </Pressable>
);
