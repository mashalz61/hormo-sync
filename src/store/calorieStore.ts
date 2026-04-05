import { create } from "zustand";

import { normalizeStoredCalories } from "@/utils/calorieResponse";
import { MealQuantityMode } from "@/types/foodAnalyzer";
import { MealCategory } from "@/utils/mealCsv";

export interface MealLogEntry {
  id: string;
  type: "meal";
  category: MealCategory;
  mealName: string;
  calories: number;
  grams?: number;
  portionCount?: number;
  quantityMode: MealQuantityMode;
  createdAt: string;
  updatedAt: string;
}

export type ExerciseLogInputMode = "sets_reps" | "duration";

export interface ExerciseLogEntry {
  id: string;
  type: "exercise";
  exerciseName: string;
  logMode: ExerciseLogInputMode;
  /** When logMode is "duration". */
  durationMinutes?: number;
  /** When logMode is "sets_reps". */
  sets?: number;
  reps?: number;
  calories: number;
  createdAt: string;
  updatedAt: string;
}

export type CalorieLogEntry = MealLogEntry | ExerciseLogEntry;

interface AddMealEntryInput {
  category: MealCategory;
  mealName: string;
  calories: number;
  grams?: number;
  portionCount?: number;
  quantityMode: MealQuantityMode;
}

interface AddExerciseEntryInput {
  exerciseName: string;
  calories: number;
  logMode: ExerciseLogInputMode;
  durationMinutes?: number;
  sets?: number;
  reps?: number;
}

interface CalorieState {
  consumedCalories: number;
  burnedCalories: number;
  mealEntries: MealLogEntry[];
  exerciseEntries: ExerciseLogEntry[];
  addConsumed: (calories: number) => void;
  addBurned: (calories: number) => void;
  addMealEntry: (entry: AddMealEntryInput) => void;
  updateMealEntry: (id: string, entry: AddMealEntryInput) => void;
  addExerciseEntry: (entry: AddExerciseEntryInput) => void;
  updateExerciseEntry: (id: string, entry: AddExerciseEntryInput) => void;
  reset: () => void;
}

const initialState = {
  consumedCalories: 0,
  burnedCalories: 0,
  mealEntries: [] as MealLogEntry[],
  exerciseEntries: [] as ExerciseLogEntry[],
};

export const useCalorieStore = create<CalorieState>((set) => ({
  ...initialState,
  addConsumed: (calories) =>
    set((state) => ({
      consumedCalories: normalizeStoredCalories(state.consumedCalories + normalizeStoredCalories(calories)),
    })),
  addBurned: (calories) =>
    set((state) => ({
      burnedCalories: normalizeStoredCalories(state.burnedCalories + normalizeStoredCalories(calories)),
    })),
  addMealEntry: (entry) =>
    set((state) => {
      const now = new Date().toISOString();
      const nextMealEntries = [
        {
          id: createEntryId("meal"),
          type: "meal" as const,
          category: entry.category,
          mealName: entry.mealName,
          calories: normalizeStoredCalories(entry.calories),
          grams: entry.grams,
          portionCount: entry.portionCount,
          quantityMode: entry.quantityMode,
          createdAt: now,
          updatedAt: now,
        },
        ...state.mealEntries,
      ];

      return buildTotals({
        ...state,
        mealEntries: nextMealEntries,
      });
    }),
  updateMealEntry: (id, entry) =>
    set((state) => {
      const nextMealEntries = state.mealEntries.map((item) =>
        item.id === id
          ? {
              ...item,
              category: entry.category,
              mealName: entry.mealName,
              calories: normalizeStoredCalories(entry.calories),
              grams: entry.grams,
              portionCount: entry.portionCount,
              quantityMode: entry.quantityMode,
              updatedAt: new Date().toISOString(),
            }
          : item,
      );

      return buildTotals({
        ...state,
        mealEntries: nextMealEntries,
      });
    }),
  addExerciseEntry: (entry) =>
    set((state) => {
      const now = new Date().toISOString();
      const nextExerciseEntries = [
        {
          id: createEntryId("exercise"),
          type: "exercise" as const,
          exerciseName: entry.exerciseName,
          logMode: entry.logMode,
          durationMinutes: entry.durationMinutes,
          sets: entry.sets,
          reps: entry.reps,
          calories: normalizeStoredCalories(entry.calories),
          createdAt: now,
          updatedAt: now,
        },
        ...state.exerciseEntries,
      ];

      return buildTotals({
        ...state,
        exerciseEntries: nextExerciseEntries,
      });
    }),
  updateExerciseEntry: (id, entry) =>
    set((state) => {
      const nextExerciseEntries = state.exerciseEntries.map((item) =>
        item.id === id
          ? {
              ...item,
              exerciseName: entry.exerciseName,
              logMode: entry.logMode,
              durationMinutes: entry.durationMinutes,
              sets: entry.sets,
              reps: entry.reps,
              calories: normalizeStoredCalories(entry.calories),
              updatedAt: new Date().toISOString(),
            }
          : item,
      );

      return buildTotals({
        ...state,
        exerciseEntries: nextExerciseEntries,
      });
    }),
  reset: () => set(initialState),
}));

export const selectNetCalories = (state: CalorieState) =>
  normalizeStoredCalories(Math.max(state.consumedCalories - state.burnedCalories, 0));

export const selectAllCalorieEntries = (state: CalorieState): CalorieLogEntry[] =>
  [...state.mealEntries, ...state.exerciseEntries].sort((left, right) =>
    right.updatedAt.localeCompare(left.updatedAt),
  );

function buildTotals(state: Pick<CalorieState, "mealEntries" | "exerciseEntries">) {
  return {
    mealEntries: state.mealEntries,
    exerciseEntries: state.exerciseEntries,
    consumedCalories: normalizeStoredCalories(
      state.mealEntries.reduce((sum, entry) => sum + entry.calories, 0),
    ),
    burnedCalories: normalizeStoredCalories(
      state.exerciseEntries.reduce((sum, entry) => sum + entry.calories, 0),
    ),
  };
}

function createEntryId(prefix: "meal" | "exercise") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

