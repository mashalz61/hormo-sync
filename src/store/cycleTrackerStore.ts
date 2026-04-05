import { create } from "zustand";

import { cycleLogs } from "@/data/mockData";
import { CycleLog, CycleTrackerDraft } from "@/types";
import { buildCycleSummaryInsight } from "@/utils/cycleTracker";

interface CycleTrackerState {
  logs: CycleLog[];
  draft: CycleTrackerDraft;
  updateDraft: (field: keyof CycleTrackerDraft, value: string) => void;
  saveDraft: () => void;
  resetDraft: () => void;
}

const buildDraftFromLogs = (logs: CycleLog[]): CycleTrackerDraft => ({
  currentPeriodStart: logs[0]?.startDate ?? "",
  currentPeriodEnd: logs[0]?.endDate ?? "",
  previousPeriodStart: logs[1]?.startDate ?? "",
});

export const useCycleTrackerStore = create<CycleTrackerState>((set) => ({
  logs: cycleLogs,
  draft: buildDraftFromLogs(cycleLogs),
  updateDraft: (field, value) =>
    set((state) => ({
      draft: {
        ...state.draft,
        [field]: value,
      },
    })),
  saveDraft: () =>
    set((state) => {
      const summary = buildCycleSummaryInsight(state.draft, state.logs);

      if (Object.keys(summary.validationErrors).length > 0) {
        return state;
      }

      const nextLog: CycleLog = {
        id: "cycle-current",
        startDate: state.draft.currentPeriodStart,
        endDate: state.draft.currentPeriodEnd,
        cycleLength: summary.latestCompletedCycleLength ?? 0,
        regularity: summary.regularityLabel === "Needs follow-up" ? "Irregular" : "Regular",
      };

      const previousLog =
        state.logs.find((item) => item.startDate === state.draft.previousPeriodStart) ??
        ({
          id: "cycle-previous",
          startDate: state.draft.previousPeriodStart,
          endDate: state.logs[1]?.endDate ?? state.draft.previousPeriodStart,
          cycleLength: 0,
          regularity: "Regular",
        } satisfies CycleLog);

      const remainingLogs = state.logs.filter(
        (item) =>
          item.startDate !== nextLog.startDate && item.startDate !== previousLog.startDate,
      );

      return {
        logs: [nextLog, previousLog, ...remainingLogs],
      };
    }),
  resetDraft: () =>
    set((state) => ({
      draft: buildDraftFromLogs(state.logs),
    })),
}));
