import {
  AssessmentResult,
  CycleLog,
  HormonalSummary,
  MealEntry,
  Reminder,
  SeedRecommendation,
  Service,
  SymptomOption,
  UserProfile,
} from "@/types";

export const mockUser: UserProfile = {
  id: "user-1",
  firstName: "Ayla",
  lastName: "Khan",
  age: 28,
  email: "ayla@example.com",
  cyclePhase: "Follicular",
  initials: "AK",
};

export const services: Service[] = [
  {
    id: "pcos",
    title: "PCOS & Insulin Resistance Detection",
    description: "Multi-step assessment with supportive risk insights.",
    icon: "pulse-outline",
    accent: "#FCE7E9",
    gradientColors: ["#C95B88", "#E3A5BE"],
    route: "/assessments/basic-health",
  },
  {
    id: "bmi",
    title: "BMI Calculator",
    description: "Calculate BMI and understand the weight category.",
    icon: "resize-outline",
    accent: "#FBECDD",
    gradientColors: ["#BF567F", "#DD98B4"],
    route: "/assessments/bmi-calculation",
  },
  {
    id: "cycle",
    title: "Menstrual Cycle Tracker",
    description: "Log your cycle and view summaries over time.",
    icon: "calendar-outline",
    accent: "#F8E7EF",
    gradientColors: ["#B95B88", "#D9A2BB"],
    route: "/tracker/menstrual-cycle-tracker",
  },
  {
    id: "symptoms",
    title: "Symptom Checker",
    description: "Review symptoms and spot recurring wellness signals.",
    icon: "medkit-outline",
    accent: "#EDF1FA",
    gradientColors: ["#C86791", "#E6A9C3"],
    route: "/assessments/symptom-checker",
  },
  {
    id: "hormonal",
    title: "Hormonal Analysis",
    description: "See which signs may justify follow-up lab testing.",
    icon: "flask-outline",
    accent: "#F9EBDC",
    gradientColors: ["#B35680", "#D59AB4"],
    route: "/assessments/hormonal-analysis",
  },
  {
    id: "food",
    title: "Smart Food Analyzer",
    description: "Track meals and receive simple nutrition guidance.",
    icon: "nutrition-outline",
    accent: "#E9F2E8",
    gradientColors: ["#C25E88", "#E0A0BB"],
    route: "/tracker/smart-food-dashboard",
  },
  {
    id: "reminder",
    title: "Lifestyle Reminder",
    description: "Set habits for hydration, sleep, movement, and calm.",
    icon: "notifications-outline",
    accent: "#EEE8F5",
    gradientColors: ["#BC5B84", "#DA9AB6"],
    route: "/reminders/reminder-list",
  },
  {
    id: "seed",
    title: "Seed Cycle Tracker",
    description: "Match seed cycling routines to your current phase.",
    icon: "leaf-outline",
    accent: "#EDF0DA",
    gradientColors: ["#B15A7F", "#CF98B1"],
    route: "/seed/seed-cycle-tracker",
  },
];

export const symptomOptions: SymptomOption[] = [
  { id: "acne", label: "Acne", helperText: "Recurring breakouts or oily skin." },
  { id: "hair_growth", label: "Excess hair growth", helperText: "Face, chest, or abdomen." },
  { id: "weight_gain", label: "Weight gain", helperText: "Recent or difficult to manage." },
  { id: "hair_thinning", label: "Hair thinning", helperText: "Shedding or reduced density." },
  { id: "dark_patches", label: "Dark skin patches", helperText: "Often around neck or underarms." },
  { id: "fatigue", label: "Fatigue", helperText: "Low energy throughout the day." },
  { id: "cravings", label: "Sugar cravings", helperText: "Frequent cravings or energy dips." },
];

export const cycleLogs: CycleLog[] = [
  {
    id: "cycle-1",
    startDate: "2026-03-02",
    endDate: "2026-03-06",
    cycleLength: 29,
    regularity: "Regular",
  },
  {
    id: "cycle-2",
    startDate: "2026-02-01",
    endDate: "2026-02-05",
    cycleLength: 27,
    regularity: "Regular",
  },
  {
    id: "cycle-3",
    startDate: "2026-01-05",
    endDate: "2026-01-09",
    cycleLength: 31,
    regularity: "Regular",
  },
];

export const reminders: Reminder[] = [
  {
    id: "rem-1",
    activity: "Hydration",
    time: "09:00 AM",
    frequency: "Daily",
    enabled: true,
    purpose: "Support hydration and energy levels.",
  },
  {
    id: "rem-2",
    activity: "Evening Walk",
    time: "06:30 PM",
    frequency: "Weekdays",
    enabled: true,
    purpose: "Maintain movement and insulin sensitivity.",
  },
];

export const meals: MealEntry[] = [
  {
    id: "meal-1",
    mealType: "Breakfast",
    title: "Greek yogurt bowl",
    notes: "Berries, chia, pumpkin seeds",
    balance: "Balanced",
  },
  {
    id: "meal-2",
    mealType: "Lunch",
    title: "Grilled chicken quinoa salad",
    notes: "Leafy greens and olive oil dressing",
    balance: "Balanced",
  },
  {
    id: "meal-3",
    mealType: "Snacks",
    title: "Iced coffee and cookie",
    notes: "Consider pairing with protein",
    balance: "High Sugar",
  },
];

export const seedRecommendations: SeedRecommendation[] = [
  {
    phase: "Menstrual",
    seeds: ["Flaxseeds", "Pumpkin seeds"],
    amount: "Common routine: 1 tablespoon each daily",
    ideas: ["Blend into smoothies", "Stir into oatmeal", "Sprinkle over yogurt"],
  },
  {
    phase: "Follicular",
    seeds: ["Flaxseeds", "Pumpkin seeds"],
    amount: "Common routine: 1 tablespoon each daily",
    ideas: ["Add to salad toppings", "Mix into overnight oats", "Blend with berries"],
  },
  {
    phase: "Ovulation",
    seeds: ["Sunflower seeds", "Sesame seeds"],
    amount: "Common routine: 1 tablespoon each daily",
    ideas: ["Top avocado toast", "Mix into seed mix", "Add to grain bowls"],
  },
  {
    phase: "Luteal",
    seeds: ["Sunflower seeds", "Sesame seeds"],
    amount: "Common routine: 1 tablespoon each daily",
    ideas: ["Stir into yogurt", "Blend into tahini dressing", "Sprinkle onto salads"],
  },
];

export const hormonalSummaries: HormonalSummary[] = [
  {
    title: "Cycle pattern suggests follow-up",
    description: "Irregular cycles alongside acne and weight changes may justify deeper testing.",
    tests: ["LH", "FSH", "Blood glucose", "Fasting insulin"],
  },
  {
    title: "Metabolic markers to review",
    description: "Dark skin patches, cravings, and fatigue can be useful context in insulin-resistance discussions.",
    tests: ["HbA1c", "Fasting blood sugar", "Lipid profile"],
  },
];

export const assessmentResults: AssessmentResult[] = [
  {
    risk: "Moderate",
    stage: "Pattern suggests early metabolic stress",
    summary: "Your current inputs suggest a moderate pattern of cycle irregularity and metabolic symptoms.",
    recommendations: [
      "Prioritize fiber-rich meals with protein at breakfast.",
      "Aim for consistent sleep and low-impact exercise.",
      "Discuss symptoms and labs with a qualified clinician.",
    ],
  },
  {
    risk: "Low",
    stage: "Low current concern",
    summary: "Current inputs show only a few signals, though continued tracking is still helpful.",
    recommendations: [
      "Keep logging your cycle and symptoms for pattern awareness.",
      "Maintain balanced meals and hydration habits.",
    ],
  },
];
