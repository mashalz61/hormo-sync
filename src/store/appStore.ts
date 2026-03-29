import { create } from "zustand";

import { assessmentResults, meals, mockUser, reminders } from "@/data/mockData";
import { Reminder } from "@/types";

interface AppState {
  hasSeenOnboarding: boolean;
  isAuthenticated: boolean;
  userName: string;
  reminders: Reminder[];
  markOnboardingComplete: () => void;
  login: (email: string) => void;
  logout: () => void;
  addReminder: (reminder: Reminder) => void;
  toggleReminder: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  hasSeenOnboarding: false,
  isAuthenticated: false,
  userName: mockUser.firstName,
  reminders,
  markOnboardingComplete: () => set({ hasSeenOnboarding: true }),
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),
  addReminder: (reminder) =>
    set((state) => ({
      reminders: [reminder, ...state.reminders],
    })),
  toggleReminder: (id) =>
    set((state) => ({
      reminders: state.reminders.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item,
      ),
    })),
}));

export const homeSnapshot = {
  activeCycleDay: 8,
  bmi: 24.8,
  completedHabits: 3,
  totalHabits: 5,
  riskSummary: assessmentResults[0],
  todayMeals: meals.length,
};
