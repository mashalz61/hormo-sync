import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AssessmentHeroCard } from "@/components/AssessmentHeroCard";
import { AppHeader } from "@/components/AppHeader";
import { Screen } from "@/components/Screen";
import { services } from "@/data/mockData";

export default function AssessmentsTabScreen() {
  const assessmentServices = services.filter((service) =>
    ["pcos", "bmi", "symptoms", "hormonal"].includes(service.id),
  );

  return (
    <Screen contentStyle={{ paddingHorizontal: 16, gap: 18 }}>
      <AppHeader
        subtitle="Structured health screening tools with clear, practical outputs."
        title="Insights"
      />

      <AssessmentHeroCard
        description="Select a screening workflow to review risk indicators and generate guided next steps."
        eyebrow="Assessment Center"
        icon="analytics-outline"
        title="Clinical Insights"
      />

      <View className="flex-row flex-wrap justify-between gap-y-4">
        {assessmentServices.map((service) => (
          <Pressable
            key={service.id}
            accessibilityRole="button"
            className="w-[48.5%] rounded-[18px] border border-[#EFD7E3] bg-white p-4"
            onPress={() => router.push(service.route as never)}
          >
            <LinearGradient
              colors={service.gradientColors || ["#CC5C89", "#E7A1BE"]}
              end={{ x: 1, y: 1 }}
              start={{ x: 0, y: 0 }}
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                color="#FFFFFF"
                name={service.icon as keyof typeof Ionicons.glyphMap}
                size={18}
              />
            </LinearGradient>

            <Text className="mt-3 text-[15px] font-semibold leading-5 text-healthcare-text" numberOfLines={2}>
              {service.title}
            </Text>
            <Text className="mt-1 text-[12px] leading-4 text-healthcare-muted" numberOfLines={2}>
              {service.description}
            </Text>

            <View className="mt-3 flex-row items-center justify-between border-t border-[#F0DCE6] pt-2.5">
              <Text className="text-[12px] font-semibold text-healthcare-primary">Open tool</Text>
              <Ionicons color="#CC5C89" name="chevron-forward" size={15} />
            </View>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
