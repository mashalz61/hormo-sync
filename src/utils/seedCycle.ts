import { seedRecommendations } from "@/data/mockData";
import { CyclePhase } from "@/types";
import { CycleSummaryInsight } from "@/utils/cycleTracker";

export interface SeedPhaseGuide {
  phase: CyclePhase;
  phaseFocus: string;
  nutrientSupport: string;
  evidenceSummary: string;
  commonRationale: string;
  practicalNote: string;
  safetyNotes: string[];
}

const phaseGuides: Record<CyclePhase, SeedPhaseGuide> = {
  Menstrual: {
    phase: "Menstrual",
    phaseFocus: "Keep the routine gentle and easy to tolerate while bleeding.",
    nutrientSupport: "Flax and pumpkin seeds add fiber, unsaturated fats, and minerals, but they are not proven to shorten or lighten periods.",
    evidenceSummary: "Direct evidence for menstrual-phase seed cycling is limited, so use it as an optional food routine rather than a hormone treatment.",
    commonRationale: "Many seed-cycling plans keep flax and pumpkin in the first half of the cycle, including menstruation.",
    practicalNote: "If your appetite is low, use small portions in oats, yogurt, or soup toppings instead of forcing a full serving.",
    safetyNotes: [
      "Skip any seed that you are allergic to.",
      "Increase fiber gradually and drink water if seeds cause bloating or constipation.",
    ],
  },
  Follicular: {
    phase: "Follicular",
    phaseFocus: "Use this phase for easy consistency after your period begins to settle.",
    nutrientSupport: "Flax provides fiber and lignans, while pumpkin seeds add healthy fats and minerals such as magnesium and zinc.",
    evidenceSummary: "Nutrition benefits are real, but evidence that this pairing specifically improves estrogen balance or ovulation is still limited.",
    commonRationale: "This is the most common first-half pairing used in seed-cycling routines.",
    practicalNote: "Ground flax is often easier to mix into smoothies, oats, or yogurt than whole flaxseed.",
    safetyNotes: [
      "Talk with a clinician before using flax supplements if you are pregnant, breastfeeding, or managing medications.",
      "Food portions are usually easier to tolerate than concentrated oils or supplement powders.",
    ],
  },
  Ovulation: {
    phase: "Ovulation",
    phaseFocus: "Keep the routine simple because calendar-only phase estimates are least certain around ovulation.",
    nutrientSupport: "Sunflower and sesame seeds add vitamin E, healthy fats, and minerals, but they are not validated ovulation-support tools.",
    evidenceSummary: "Cycle apps can only estimate ovulation from dates, and seed cycling has not been proven to confirm or improve ovulation.",
    commonRationale: "Many routines switch to sunflower and sesame around the middle of the cycle.",
    practicalNote: "If your cycle timing varies a lot, focus more on steady eating than on switching seeds at an exact day.",
    safetyNotes: [
      "Do not rely on this screen to predict fertility or contraception timing.",
      "Choose unsalted seeds when possible if you are watching sodium intake.",
    ],
  },
  Luteal: {
    phase: "Luteal",
    phaseFocus: "Use this routine as a cue for steadier snacks and meals if cravings or low energy show up.",
    nutrientSupport: "Sunflower and sesame seeds can add texture, healthy fats, and micronutrients to balanced snacks.",
    evidenceSummary: "Some small studies suggest seed-based dietary interventions may help symptoms, but evidence is not strong enough to present this as proven PMS therapy.",
    commonRationale: "This is the common second-half seed-cycling pairing used in blogs and integrative nutrition plans.",
    practicalNote: "Pair seeds with protein and fiber-rich foods so the habit supports fullness instead of feeling like a separate chore.",
    safetyNotes: [
      "Heavy PMS symptoms, severe pain, or big mood changes still deserve clinical evaluation.",
      "A food routine can be supportive without replacing medical treatment.",
    ],
  },
};

export const getSeedGuide = (phase: CyclePhase) => phaseGuides[phase];

export const getSeedPlan = (phase: CyclePhase) =>
  seedRecommendations.find((item) => item.phase === phase) ?? seedRecommendations[0];

export const getDetectedSeedPhase = (summary: CycleSummaryInsight) => {
  if (!summary.estimatedPhase || !summary.currentCycleDay) {
    return {
      phase: null,
      sourceLabel: "No cycle estimate yet",
      detail:
        "Add your current period start date in the cycle tracker to let the app estimate a phase from calendar timing.",
      confidence: "Unavailable",
    };
  }

  return {
    phase: summary.estimatedPhase,
    sourceLabel: `Cycle day ${summary.currentCycleDay}`,
    detail:
      summary.cycleVariation !== null && summary.cycleVariation > 9
        ? "This is a date-based estimate and becomes less reliable when cycle lengths vary more from month to month."
        : "This is a date-based estimate using your logged period dates. It is useful for routines, but it does not confirm ovulation.",
    confidence:
      summary.cycleVariation !== null && summary.cycleVariation > 9
        ? "Lower confidence"
        : "Calendar estimate",
  };
};

export const getSeedEvidenceBullets = () => [
  "Seeds are nutritious foods, but seed cycling itself is not a proven hormone-balancing treatment.",
  "A small and still-developing research base suggests seed-based nutrition may be a reasonable adjunct for some PMS or PCOS routines.",
  "The strongest evidence-based foundations remain balanced meals, symptom tracking, and medical review when symptoms are disruptive.",
];

export const getTodaySeedKey = (today = new Date()) => {
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.padStart(2, "0");
  const day = `${today.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getCompletionStreak = (completedDates: string[], today = new Date()) => {
  const completedSet = new Set(completedDates);
  let streak = 0;
  const cursor = new Date(today);

  while (completedSet.has(getTodaySeedKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
};
