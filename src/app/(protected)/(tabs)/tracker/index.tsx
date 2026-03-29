import { router } from "expo-router";
import { View } from "react-native";

import { AppHeader } from "@/components/AppHeader";
import { Screen } from "@/components/Screen";
import { SectionTitle } from "@/components/SectionTitle";
import { ServiceCard } from "@/components/ServiceCard";
import { services } from "@/data/mockData";

export default function TrackerTabScreen() {
  const trackerServices = services.filter((service) =>
    ["cycle", "food", "seed"].includes(service.id),
  );

  return (
    <Screen>
      <AppHeader
        subtitle="Stay close to your cycle, meals, and seed routine in one place."
        title="Tracker"
      />
      <SectionTitle
        title="Tracking tools"
        subtitle="Use low-friction logging with supportive feedback across food, cycle, and lifestyle."
      />
      <View style={{ gap: 12 }}>
        {trackerServices.map((service) => (
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
