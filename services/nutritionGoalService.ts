import privateAxios from "@/lib/privateAxios";
import { ApiResponse } from "@/types/backend.type";

export interface NutritionGoalInfo {
  keyMap: string;
  value: string;
  description: string;
}

export interface NutritionGoal {
  id: number;
  goalType: string;
  status?: string;
  targetWeight: number;
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
  goalTypeInfo?: NutritionGoalInfo;
  statusInfo?: Record<string, unknown> ;
}

export const nutritionGoalService = {
  /**
   * Lấy danh sách mục tiêu dinh dưỡng
   */
  getNutritionGoals: async (): Promise<ApiResponse<NutritionGoal[]>> => {
    const res = await privateAxios.get<ApiResponse<NutritionGoal[]>>("/nutrition-goals");
    return res as unknown as ApiResponse<NutritionGoal[]>;
  },
  
  /**
   * Lấy mục tiêu dinh dưỡng hiện tại
   */
  getCurrentGoal: async (): Promise<ApiResponse<NutritionGoal>> => {
    const res = await privateAxios.get<ApiResponse<NutritionGoal>>("/nutrition-goals/current");
    return res as unknown as ApiResponse<NutritionGoal>;
  },
};
