import privateAxios from "@/lib/privateAxios";
import { ApiResponse } from "@/types/backend.type";
import { IFood } from "@/types/food.type";

export interface FoodSearchResult {
  id: number;
  foodName: string;
  description: string;
  imageUrl: string;
  categoryId: number;
  categoryName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  score: number;
  highlight?: { foodName?: string[] };
}

export const foodService = {
  getFoodById: async (id: number): Promise<ApiResponse<IFood>> => {
    const res = await privateAxios.get<ApiResponse<IFood>>(
      `/foods/${id}/detail`,
    );
    return res as unknown as ApiResponse<IFood>;
  },

  getFoodCategories: async (): Promise<
    ApiResponse<{ id: number; name: string }[]>
  > => {
    const res = await privateAxios.get<
      ApiResponse<{ id: number; name: string }[]>
    >(`/food-categories/roots`);
    return res as unknown as ApiResponse<{ id: number; name: string }[]>;
  },

  searchFood: async (q: string, size = 20): Promise<FoodSearchResult[]> => {
    const res = await privateAxios.get<FoodSearchResult[]>("/search/foods", {
      params: { q, size },
    });
    return res.data;
  },
};
