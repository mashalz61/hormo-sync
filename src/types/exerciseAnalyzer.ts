/** POST /predict/exercise — sets + reps (duration omitted). */
export interface PredictExerciseSetsRepsPayload {
  exercise_name: string;
  sets: number;
  reps: number;
}

/** POST /predict/exercise — time-based only. */
export interface PredictExerciseDurationPayload {
  exercise_name: string;
  duration_minutes: number;
}

export type PredictExerciseRequest = PredictExerciseSetsRepsPayload | PredictExerciseDurationPayload;

export interface PredictExerciseResponse {
  /** Primary calorie field from POST /predict/exercise. */
  estimated_calories_burned?: number;
  [key: string]: unknown;
}
