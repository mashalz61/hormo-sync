import { create } from "zustand";

import { assessmentResults, meals, mockUser, reminders } from "@/data/mockData";
import { Reminder } from "@/types";

interface AppState {
  isAuthenticated: boolean;
  userName: string;
  reminders: Reminder[];
  reminderFeedback: string | null;
  login: (email: string) => void;
  logout: () => void;
  setUserName: (name: string) => void;
  addReminder: (reminder: Reminder) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  toggleReminder: (id: string) => void;
  setReminderFeedback: (message: string) => void;
  clearReminderFeedback: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  userName: mockUser.firstName,
  reminders,
  reminderFeedback: null,
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),
  setUserName: (name) => set({ userName: name }),
  addReminder: (reminder) =>
    set((state) => ({
      reminders: [reminder, ...state.reminders],
    })),
  updateReminder: (id, updates) =>
    set((state) => ({
      reminders: state.reminders.map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      ),
    })),
  toggleReminder: (id) =>
    set((state) => ({
      reminders: state.reminders.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item,
      ),
    })),
  setReminderFeedback: (message) => set({ reminderFeedback: message }),
  clearReminderFeedback: () => set({ reminderFeedback: null }),
}));

export const homeSnapshot = {
  activeCycleDay: 8,
  bmi: 24.8,
  completedHabits: 3,
  totalHabits: 5,
  riskSummary: assessmentResults[0],
  todayMeals: meals.length,
};
