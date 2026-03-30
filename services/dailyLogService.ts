import privateAxios from "@/lib/privateAxios";
import { ApiResponse } from "@/types/backend.type";

export interface DashboardDailyLogResponse {
  id: number;
  logDate: string;
  status: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  meals: Meal[];
  totals: DailyTotals;
  nutritionGoal: NutritionGoal;
}

export interface Meal {
  id: number;
  mealType: "MEAL_BREAKFAST" | "MEAL_LUNCH" | "MEAL_DINNER" | "MEAL_SNACK";
  mealDateTime: string;
  dailyLogId: number;
  createdAt: string;
  updatedAt: string;
  mealItems: MealItem[];
  totalCalories: number;
}

export interface MealItem {
  id: number;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  foodId: number;
  mealId: number;
  createdAt: string;
  updatedAt: string;
  food: Food;
}

export interface Food {
  foodName: string;
  imageUrl: string | null;
}

export interface DailyTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface NutritionGoal {
  id: number;
  goalType: string;
  status?: string;
  targetWeight?: number;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  targetFiber: number;
  startDate: string;
  endDate: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export const dailyLogService = {
  /**
   * Get daily log for today
   */
  getDailyLogToday: async (): Promise<ApiResponse<DashboardDailyLogResponse>> => {
    const res = await privateAxios.get<ApiResponse<DashboardDailyLogResponse>>("/daily-logs/today");
    return res as unknown as ApiResponse<DashboardDailyLogResponse>;
  },
};
