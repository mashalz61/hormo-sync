import { router } from "expo-router";
import { View } from "react-native";

import { AppHeader } from "@/components/AppHeader";
import { Screen } from "@/components/Screen";
import { SectionTitle } from "@/components/SectionTitle";
import { ServiceCard } from "@/components/ServiceCard";
import { services } from "@/data/mockData";

export default function AssessmentsTabScreen() {
  const assessmentServices = services.filter((service) =>
    ["pcos", "bmi", "symptoms", "hormonal"].includes(service.id),
  );

  return (
    <Screen>
      <AppHeader
        subtitle="Explore PCOS, BMI, symptom, and hormonal assessment tools."
        title="Assessments"
      />
      <SectionTitle
        title="Assessment suite"
        subtitle="Each flow is designed to be supportive, modular, and easy to expand with real clinical logic later."
      />
      <View style={{ gap: 12 }}>
        {assessmentServices.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onPress={() => router.push(service.route as never)}
          />
        ))}
      </View>
    </Screen>
  );
}
