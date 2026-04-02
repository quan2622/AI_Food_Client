import privateAxios from "@/lib/privateAxios";
import { ApiResponse } from "@/types/backend.type";

export type TrendOption = "day" | "week" | "month";

export interface NutritionTrendDay {
  date: string;
  label: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface NutritionTrendWeek {
  weekStart: string;
  weekEnd: string;
  label: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  trend: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  } | null;
}

export interface NutritionTrendMonth {
  month: string;
  label: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  trend: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  } | null;
}

export type NutritionTrendItem =
  | NutritionTrendDay
  | NutritionTrendWeek
  | NutritionTrendMonth;

export const reportService = {
  /**
   * Get nutrition trend (day / week / month)
   */
  getNutritionTrend: async (
    option: TrendOption
  ): Promise<ApiResponse<NutritionTrendItem[]>> => {
    const res = await privateAxios.post<ApiResponse<NutritionTrendItem[]>>(
      "/user-reports/nutrition-trend",
      { option }
    );
    return res as unknown as ApiResponse<NutritionTrendItem[]>;
  },
};
