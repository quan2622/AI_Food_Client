import privateAxios from "@/lib/privateAxios";
import { ApiResponse } from "@/types/backend.type";
import {
  INutritionGoal,
  ICreateNutritionGoalRequest,
  IUpdateNutritionGoalRequest,
  IBulkDeleteNutritionGoalRequest,
  ISmartNutritionGoalRequest,
} from "@/types/nutrition-goal.type";

export const nutritionGoalService = {
  /**
   * Get all goals of the user
   * GET /nutrition-goals
   */
  getAllGoals: async (): Promise<ApiResponse<INutritionGoal[]>> => {
    const res =
      await privateAxios.get<ApiResponse<INutritionGoal[]>>("/nutrition-goals");
    return res as unknown as ApiResponse<INutritionGoal[]>;
  },

  /**
   * Get goals with history
   * GET /nutrition-goals/my-goals
   */
  getMyGoals: async (): Promise<ApiResponse<INutritionGoal[]>> => {
    const res = await privateAxios.get<ApiResponse<INutritionGoal[]>>(
      "/nutrition-goals/my-goals",
    );
    return res as unknown as ApiResponse<INutritionGoal[]>;
  },

  /**
   * Get current active goal
   * GET /nutrition-goals/current
   */
  getCurrentGoal: async (): Promise<ApiResponse<INutritionGoal>> => {
    const res = await privateAxios.get<ApiResponse<INutritionGoal>>(
      "/nutrition-goals/current",
    );
    return res as unknown as ApiResponse<INutritionGoal>;
  },

  /**
   * Get detail of a goal
   * GET /nutrition-goals/:id
   */
  getGoalById: async (id: number): Promise<ApiResponse<INutritionGoal>> => {
    const res = await privateAxios.get<ApiResponse<INutritionGoal>>(
      `/nutrition-goals/${id}`,
    );
    return res as unknown as ApiResponse<INutritionGoal>;
  },

  /**
   * Create a new goal
   * POST /nutrition-goals
   */
  createGoal: async (
    data: ICreateNutritionGoalRequest,
  ): Promise<ApiResponse<INutritionGoal>> => {
    const res = await privateAxios.post<ApiResponse<INutritionGoal>>(
      "/nutrition-goals",
      data,
    );
    return res as unknown as ApiResponse<INutritionGoal>;
  },

  /**
   * Create a smart goal (backend auto-calculates macros from UserProfile)
   * POST /nutrition-goals/smart
   */
  createSmartGoal: async (
    data: ISmartNutritionGoalRequest,
  ): Promise<ApiResponse<INutritionGoal>> => {
    const res = await privateAxios.post<ApiResponse<INutritionGoal>>(
      "/nutrition-goals/smart",
      data,
    );
    return res as unknown as ApiResponse<INutritionGoal>;
  },

  /**
   * Update a goal
   * PATCH /nutrition-goals/:id
   */
  updateGoal: async (
    id: number,
    data: IUpdateNutritionGoalRequest,
  ): Promise<ApiResponse<INutritionGoal>> => {
    const res = await privateAxios.patch<ApiResponse<INutritionGoal>>(
      `/nutrition-goals/${id}`,
      data,
    );
    return res as unknown as ApiResponse<INutritionGoal>;
  },

  /**
   * Delete a goal
   * DELETE /nutrition-goals/:id
   */
  deleteGoal: async (id: number): Promise<ApiResponse<null>> => {
    const res = await privateAxios.delete<ApiResponse<null>>(
      `/nutrition-goals/${id}`,
    );
    return res as unknown as ApiResponse<null>;
  },

  /**
   * Bulk delete goals
   * DELETE /nutrition-goals/bulk
   */
  bulkDeleteGoals: async (
    data: IBulkDeleteNutritionGoalRequest,
  ): Promise<ApiResponse<null>> => {
    const res = await privateAxios.delete<ApiResponse<null>>(
      "/nutrition-goals/bulk",
      { data },
    );
    return res as unknown as ApiResponse<null>;
  },
};
