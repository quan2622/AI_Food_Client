import privateAxios from "@/lib/privateAxios";
import { ApiResponse } from "@/types/backend.type";

export interface RecommendationQuery {
  meal_type: string;
  nutrition_priority: string;
}

export interface RecommendationResponse {
  metadata: {
    statusCode: number;
    message: string;
    EC: number;
    timestamp: string;
    pagination: {
      total_items: number;
      current_page: number;
      total_pages: number;
    }
  };
  data: {
    recommendation_strategy: string;
    user: {
      id: number;
      name: string;
    };
    user_context: {
      calories_remaining: number;
      macronutrients_remaining: {
        protein: number;
        carbs: number;
        fat: number;
        fiber: number;
      };
      burned_calories_today: number;
      allergy_warnings: string[];
    };
    items: RecommendationItem[];
  };
}

export interface RecommendationItem {
  id: number;
  foodName: string;
  description: string | null;
  imageUrl: string | null;
  category: {
    id: number;
    name: string;
  };
  recommendation_context: {
    score: number;
    reason: string;
    tags: string[];
  };
  nutrition: {
    calories: number;
    macronutrients: {
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
    };
    suggested_portion_grams: number;
  };
  health_analysis: {
    is_safe: boolean;
    allergens_detected: string[];
    goal_alignment: {
      calories: string;
      protein: string;
      fat: string;
      fiber: string;
    }
  };
}

export const recommendationService = {
  getRecommendations: async (query: RecommendationQuery): Promise<ApiResponse<RecommendationResponse>> => {
    const res = await privateAxios.post<ApiResponse<RecommendationResponse>>("/recommend/recommendations/query", query);
    return res as unknown as ApiResponse<RecommendationResponse>;
  },
};
