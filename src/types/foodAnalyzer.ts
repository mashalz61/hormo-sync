import { MealCategory, MealsByCategory } from "@/utils/mealCsv";

export type MealQuantityMode = "grams" | "portion";

export interface MealSelectionValue {
  meal?: string;
  grams?: number;
  portionCount?: number;
  quantityMode?: MealQuantityMode;
}

export type FoodAnalyzerFormValues = Record<MealCategory, MealSelectionValue>;

export interface AnalyzeFoodRequest {
  meal_name: string;
  grams?: number;
  portion_count?: number;
}

export interface AnalyzeFoodResponse {
  /** Primary calorie field from POST /predict/calories. */
  estimated_calories?: number;
  [key: string]: unknown;
}

export interface CategoryAnalysisResult {
  category: MealCategory;
  meal: string;
  grams?: number;
  portionCount?: number;
  quantityMode: MealQuantityMode;
  data: AnalyzeFoodResponse;
}

export interface FoodAnalysisCompletePayload {
  results: CategoryAnalysisResult[];
  totalCalories: number;
}

export type FoodAnalyzerMeals = MealsByCategory;
