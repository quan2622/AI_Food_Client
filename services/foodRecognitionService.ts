import privateAxios from "@/lib/privateAxios";
import { ApiResponse } from "@/types/backend.type";

export interface FoodRecognitionResponse {
  top1: {
    class_name: string;
    confidence: number;
    index: number;
  };
  predictions: Array<{
    rank: number;
    class_name: string;
    name: string;
    confidence: number;
    index: number;
  }>;
  savedImage: {
    id: number;
    imageUrl: string;
    [key: string]: any;
  };
  matchedFood: {
    id: number;
    foodName: string;
    defaultServingGrams: number;
    imageUrl?: string;
    foodCategory?: { id: number; name: string };
    nutritionProfile?: {
      values: Array<{
        value: number;
        nutrient: { name: string; unit: string };
      }>;
    };
    foodIngredients?: Array<{
      quantityGrams: number;
      ingredient: {
        ingredientName: string;
        ingredientAllergens?: Array<{
          allergen: { name: string; imageUrl?: string };
        }>;
      };
    }>;
  };
}

export const foodRecognitionService = {
  predict: async (
    image: File,
    queryParams?: { model_name?: string; meal_id?: number },
  ): Promise<ApiResponse<FoodRecognitionResponse>> => {
    const formData = new FormData();
    formData.append("image", image);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: queryParams,
    };

    const res = await privateAxios.post<ApiResponse<FoodRecognitionResponse>>(
      "/food-recognition/predict",
      formData,
      config,
    );
    return res as unknown as ApiResponse<FoodRecognitionResponse>;
  },
};
