import privateAxios from "@/lib/privateAxios";
import { ApiResponse } from "@/types/backend.type";

export interface NutritionNotification {
  mainMessage: string;
  subMessage: string;
  timeOfDay: "morning" | "midday" | "afternoon" | "evening";
  status: "no_meals" | "low" | "moderate" | "on_track" | "over";
  details?: {
    consumed?: {
      calories?: number;
      protein?: number;
      carbs?: number;
      fat?: number;
      fiber?: number;
    };
    target?: {
      calories?: number;
      protein?: number;
      carbs?: number;
      fat?: number;
      fiber?: number;
    };
    deficit?: {
      calories?: number;
      protein?: number;
      carbs?: number;
      fat?: number;
      fiber?: number;
    };
  };
}

interface NutritionNotificationWrapper {
  EC: number;
  EM: string;
  result: NutritionNotification;
}

export const nutritionNotificationService = {
  /**
   * Get today's nutrition notification/suggestion
   * GET /nutrition-notifications/today
   */
  getToday: async (): Promise<NutritionNotification | null> => {
    const res = await privateAxios.get<
      ApiResponse<NutritionNotificationWrapper>
    >("/nutrition-notifications/today");
    const data = res as unknown as ApiResponse<NutritionNotificationWrapper>;
    return data?.data?.result ?? null;
  },
};
