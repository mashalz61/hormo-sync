import { CycleLog, CyclePhase, CycleTrackerDraft } from "@/types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const utcDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export interface CycleSummaryInsight {
  averageCycleLength: number | null;
  latestCompletedCycleLength: number | null;
  periodLength: number | null;
  currentCycleDay: number | null;
  cycleVariation: number | null;
  estimatedPhase: CyclePhase | null;
  estimatedOvulationDay: number | null;
  estimatedFertileWindow: string | null;
  regularityLabel: string;
  summaryTone: "good" | "watch" | "limited";
  summaryHeadline: string;
  summaryBody: string;
  quickFacts: string[];
  clinicianFlags: string[];
  validationErrors: Partial<Record<keyof CycleTrackerDraft, string>>;
  completedCycleLengths: number[];
}

export const parseCycleDate = (value?: string) => {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day, 12);
};

export const toCycleDateInput = (value: Date) => {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const formatCycleDateLabel = (value?: string) => {
  const parsed = parseCycleDate(value);
  return parsed ? utcDateFormatter.format(parsed) : "Select a date";
};

export const getCycleLengthFromStarts = (previousStart?: string, currentStart?: string) => {
  const previous = parseCycleDate(previousStart);
  const current = parseCycleDate(currentStart);

  if (!previous || !current) {
    return null;
  }

  return Math.round(
    (Date.UTC(current.getFullYear(), current.getMonth(), current.getDate()) -
      Date.UTC(previous.getFullYear(), previous.getMonth(), previous.getDate())) /
      MS_PER_DAY,
  );
};

export const getPeriodLength = (startDate?: string, endDate?: string) => {
  const start = parseCycleDate(startDate);
  const end = parseCycleDate(endDate);

  if (!start || !end) {
    return null;
  }

  return (
    Math.round(
      (Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()) -
        Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())) /
        MS_PER_DAY,
    ) + 1
  );
};

const getCurrentCycleDay = (startDate?: string, today = new Date()) => {
  const start = parseCycleDate(startDate);

  if (!start) {
    return null;
  }

  return (
    Math.max(
      1,
      Math.round(
        (Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) -
          Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())) /
          MS_PER_DAY,
      ) + 1,
    )
  );
};

const getEstimatedPhase = ({
  currentCycleDay,
  periodLength,
  averageCycleLength,
}: {
  currentCycleDay: number | null;
  periodLength: number | null;
  averageCycleLength: number | null;
}): CyclePhase | null => {
  if (!currentCycleDay) {
    return null;
  }

  const bleedingDays = periodLength ?? 5;
  const cycleLength = averageCycleLength ?? 28;
  const ovulationDay = Math.min(Math.max(cycleLength - 14, 10), cycleLength - 10);

  if (currentCycleDay <= bleedingDays) {
    return "Menstrual";
  }
  if (currentCycleDay < ovulationDay - 1) {
    return "Follicular";
  }
  if (currentCycleDay <= ovulationDay + 1) {
    return "Ovulation";
  }
  return "Luteal";
};

const getFertileWindowText = (averageCycleLength: number | null) => {
  if (!averageCycleLength) {
    return null;
  }

  const ovulationDay = averageCycleLength - 14;
  const start = Math.max(1, ovulationDay - 5);
  const end = ovulationDay + 1;

  return `Days ${start}-${end} are the broadest date-based fertile window estimate.`;
};

const getCycleVariation = (cycleLengths: number[]) => {
  if (cycleLengths.length < 2) {
    return null;
  }

  return Math.max(...cycleLengths) - Math.min(...cycleLengths);
};

const validateDraft = (draft: CycleTrackerDraft) => {
  const errors: Partial<Record<keyof CycleTrackerDraft, string>> = {};
  const currentStart = parseCycleDate(draft.currentPeriodStart);
  const currentEnd = parseCycleDate(draft.currentPeriodEnd);
  const previousStart = parseCycleDate(draft.previousPeriodStart);

  if (!currentStart) {
    errors.currentPeriodStart = "Add the first day of your current period.";
  }
  if (!currentEnd) {
    errors.currentPeriodEnd = "Add the day your current bleeding ended.";
  }
  if (!previousStart) {
    errors.previousPeriodStart = "Add the first day of the previous period.";
  }

  if (currentStart && currentEnd && currentEnd < currentStart) {
    errors.currentPeriodEnd = "End date should be the same day or later than the start date.";
  }

  if (previousStart && currentStart && previousStart >= currentStart) {
    errors.previousPeriodStart = "Previous period start should be earlier than the current start date.";
  }

  return errors;
};

const getCompletedCycleLengths = (draft: CycleTrackerDraft, history: CycleLog[]) => {
  const allStarts = [
    draft.currentPeriodStart,
    draft.previousPeriodStart,
    ...history.map((item) => item.startDate),
  ]
    .filter(Boolean)
    .filter((value, index, array) => array.indexOf(value) === index)
    .sort((left, right) => right.localeCompare(left));

  const lengths: number[] = [];

  for (let index = 0; index < allStarts.length - 1; index += 1) {
    const currentStart = allStarts[index];
    const previousStart = allStarts[index + 1];
    const length = getCycleLengthFromStarts(previousStart, currentStart);

    if (length) {
      lengths.push(length);
    }
  }

  return lengths;
};

export const buildCycleSummaryInsight = (
  draft: CycleTrackerDraft,
  history: CycleLog[],
  today = new Date(),
): CycleSummaryInsight => {
  const validationErrors = validateDraft(draft);
  const completedCycleLengths = getCompletedCycleLengths(draft, history);
  const latestCompletedCycleLength = completedCycleLengths[0] ?? null;
  const averageCycleLength = completedCycleLengths.length
    ? Math.round(
        completedCycleLengths.reduce((total, value) => total + value, 0) /
          completedCycleLengths.length,
      )
    : null;
  const periodLength = getPeriodLength(draft.currentPeriodStart, draft.currentPeriodEnd);
  const currentCycleDay = getCurrentCycleDay(draft.currentPeriodStart, today);
  const cycleVariation = getCycleVariation(completedCycleLengths);
  const estimatedPhase = getEstimatedPhase({
    currentCycleDay,
    periodLength,
    averageCycleLength,
  });
  const estimatedOvulationDay = averageCycleLength ? averageCycleLength - 14 : null;
  const estimatedFertileWindow = getFertileWindowText(averageCycleLength);

  const quickFacts: string[] = [];
  const clinicianFlags: string[] = [];

  if (latestCompletedCycleLength) {
    if (latestCompletedCycleLength < 21 || latestCompletedCycleLength > 35) {
      quickFacts.push(
        `Your most recent completed cycle was ${latestCompletedCycleLength} days, outside the commonly expected 21-35 day adult range.`,
      );
      clinicianFlags.push("Repeated cycles under 21 days or over 35 days are worth medical review.");
    } else {
      quickFacts.push(
        `Your most recent completed cycle was ${latestCompletedCycleLength} days, which sits within the commonly expected 21-35 day adult range.`,
      );
    }
  }

  if (periodLength) {
    if (periodLength > 7) {
      quickFacts.push(
        `This period lasted ${periodLength} days, which is longer than the usual upper range of 7 days.`,
      );
      clinicianFlags.push("Bleeding that lasts longer than 7 days should be discussed with a clinician.");
    } else {
      quickFacts.push(`This period lasted ${periodLength} days, which fits the usual 3-7 day bleeding range.`);
    }
  }

  if (cycleVariation !== null) {
    if (cycleVariation > 9) {
      quickFacts.push(
        `Your recent cycle lengths vary by ${cycleVariation} days, suggesting a less predictable pattern.`,
      );
      clinicianFlags.push("Cycle lengths that vary by more than about 7-9 days can indicate irregularity.");
    } else {
      quickFacts.push(
        `Your recent cycle lengths vary by ${cycleVariation} days, which suggests a fairly steady pattern.`,
      );
    }
  } else {
    quickFacts.push("Track at least two completed cycles to judge whether your timing is consistent from month to month.");
  }

  if (currentCycleDay && estimatedPhase && estimatedOvulationDay) {
    quickFacts.push(
      `Based on dates alone, today looks closest to the ${estimatedPhase.toLowerCase()} phase and ovulation would usually be estimated near day ${estimatedOvulationDay}.`,
    );
  }

  if (currentCycleDay && currentCycleDay >= 90) {
    clinicianFlags.push("If you go 90 days or more without another period, seek medical advice.");
  }

  const hasMeaningfulWarnings = clinicianFlags.length > 0;
  const hasEnoughCycleData = completedCycleLengths.length >= 2;

  return {
    averageCycleLength,
    latestCompletedCycleLength,
    periodLength,
    currentCycleDay,
    cycleVariation,
    estimatedPhase,
    estimatedOvulationDay,
    estimatedFertileWindow,
    regularityLabel:
      hasMeaningfulWarnings ? "Needs follow-up" : hasEnoughCycleData ? "Within typical range" : "Early estimate",
    summaryTone: hasMeaningfulWarnings ? "watch" : hasEnoughCycleData ? "good" : "limited",
    summaryHeadline: hasMeaningfulWarnings
      ? "Your logs show a pattern worth watching"
      : hasEnoughCycleData
        ? "Your recent entries look broadly consistent"
        : "You have enough data for a first estimate",
    summaryBody: hasMeaningfulWarnings
      ? "These results are not a diagnosis, but the timing you logged includes at least one pattern that falls outside common adult ranges."
      : hasEnoughCycleData
        ? "Your cycle timing and bleeding length are mostly lining up with the ranges typically described in adult menstrual cycle guidance."
        : "This screen can already estimate cycle length and phase, but one more completed cycle will make regularity checks more trustworthy.",
    quickFacts,
    clinicianFlags,
    validationErrors,
    completedCycleLengths,
  };
};
