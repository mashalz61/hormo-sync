export type RiskLevel = "Low" | "Moderate" | "High";
export type CyclePhase = "Menstrual" | "Follicular" | "Ovulation" | "Luteal";
export type ReminderFrequency = "Daily" | "Weekdays" | "Custom";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  cyclePhase: CyclePhase;
  initials: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  accent: string;
  gradientColors?: [string, string];
  route: string;
}

export interface SymptomOption {
  id: string;
  label: string;
  helperText?: string;
}

export interface Reminder {
  id: string;
  activity: string;
  time: string;
  frequency: ReminderFrequency;
  enabled: boolean;
  purpose: string;
}

export interface CycleLog {
  id: string;
  startDate: string;
  endDate: string;
  cycleLength: number;
  regularity: "Regular" | "Irregular";
}

export interface MealEntry {
  id: string;
  mealType: "Breakfast" | "Lunch" | "Dinner" | "Snacks";
  title: string;
  notes: string;
  balance: "Balanced" | "Needs Fiber" | "High Sugar";
}

export interface SeedRecommendation {
  phase: CyclePhase;
  seeds: string[];
  amount: string;
  ideas: string[];
}

export interface AssessmentResult {
  risk: RiskLevel;
  stage: string;
  summary: string;
  recommendations: string[];
}

export interface HormonalSummary {
  title: string;
  description: string;
  tests: string[];
}
