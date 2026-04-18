import privateAxios from "@/lib/privateAxios";
import { ApiResponse } from "@/types/backend.type";

export type TrendOption = "day" | "week" | "month" | "year";

/** option: "day" — each meal of today */
export interface NutritionTrendDayMeal {
  mealId: number;
  mealType: string;
  mealTypeLabel: string;
  mealDateTime: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

/** option: "week" — each day Mon → today */
export interface NutritionTrendWeek {
  date: string;
  label: string; // T2 | T3 | T4 | T5 | T6 | T7 | CN
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

/** option: "month" — each day in current month (day 1 → today) */
export interface NutritionTrendMonth {
  date: string;
  label: string; // "01" | "02" | ... | "31"
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

/** option: "year" — average per month Jan → current month */
export interface NutritionTrendYear {
  month: string;
  label: string; // "Tháng 1" | ... | "Tháng 12"
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
  | NutritionTrendDayMeal
  | NutritionTrendWeek
  | NutritionTrendMonth
  | NutritionTrendYear;

export type MetricType = "calories" | "protein" | "carbs" | "fat" | "fiber";
export type MetricPeriod = "day" | "week" | "month" | "year";

export interface MetricTrendDataPoint {
  label: string;
  date: string;
  value: number;
}

export interface MetricTrendResponse {
  type: MetricPeriod;
  metric: MetricType;
  range: { start: string; end: string };
  data: MetricTrendDataPoint[];
  summary: {
    average: number;
    trend: number;
    trendDirection: "up" | "down" | "stable";
  };
}

export const reportService = {
  /**
   * Get nutrition trend (day / week / month)
   */
  getNutritionTrend: async (
    option: TrendOption,
  ): Promise<ApiResponse<NutritionTrendItem[]>> => {
    const res = await privateAxios.post<ApiResponse<NutritionTrendItem[]>>(
      "/user-reports/nutrition-trend",
      { option },
    );
    return res as unknown as ApiResponse<NutritionTrendItem[]>;
  },

  /**
   * Get metric trend (calories | protein | carbs | fat | fiber)
   * type: "day" | "week" | "month" | "year"
   */
  getMetricTrend: async (
    type: MetricPeriod,
    metric: MetricType,
  ): Promise<ApiResponse<MetricTrendResponse>> => {
    const res = await privateAxios.post<ApiResponse<MetricTrendResponse>>(
      "/user-reports/metric-trend",
      { type, metric },
    );
    return res as unknown as ApiResponse<MetricTrendResponse>;
  },
};
