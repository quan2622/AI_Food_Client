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

export type MetricType = "calories" | "protein" | "carbs" | "fat" | "fiber";
export type MetricPeriod = "week" | "month";

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
    option: TrendOption
  ): Promise<ApiResponse<NutritionTrendItem[]>> => {
    const res = await privateAxios.post<ApiResponse<NutritionTrendItem[]>>(
      "/user-reports/nutrition-trend",
      { option }
    );
    return res as unknown as ApiResponse<NutritionTrendItem[]>;
  },

  /**
   * Get metric trend (calories | protein | carbs | fat | fiber)
   * type: "week" | "month"
   */
  getMetricTrend: async (
    type: "week" | "month",
    metric: MetricType
  ): Promise<ApiResponse<MetricTrendResponse>> => {
    const res = await privateAxios.post<ApiResponse<MetricTrendResponse>>(
      "/user-reports/metric-trend",
      { type, metric }
    );
    return res as unknown as ApiResponse<MetricTrendResponse>;
  },
};
