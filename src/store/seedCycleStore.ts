import { create } from "zustand";

import { CyclePhase } from "@/types";
import { getTodaySeedKey } from "@/utils/seedCycle";

interface SeedCycleState {
  selectedPhase: CyclePhase;
  phaseMode: "manual" | "cycle";
  reminderTime: string;
  completedDates: string[];
  setSelectedPhase: (phase: CyclePhase) => void;
  setPhaseMode: (mode: "manual" | "cycle") => void;
  setReminderTime: (time: string) => void;
  toggleTodayCompletion: () => void;
}

export const useSeedCycleStore = create<SeedCycleState>((set) => ({
  selectedPhase: "Follicular",
  phaseMode: "cycle",
  reminderTime: "08:30 AM",
  completedDates: ["2026-04-03", "2026-04-04", "2026-04-05"],
  setSelectedPhase: (phase) => set({ selectedPhase: phase }),
  setPhaseMode: (mode) => set({ phaseMode: mode }),
  setReminderTime: (time) => set({ reminderTime: time }),
  toggleTodayCompletion: () =>
    set((state) => {
      const todayKey = getTodaySeedKey();
      const completedToday = state.completedDates.includes(todayKey);

      return {
        completedDates: completedToday
          ? state.completedDates.filter((item) => item !== todayKey)
          : [...state.completedDates, todayKey].sort(),
      };
    }),
}));
