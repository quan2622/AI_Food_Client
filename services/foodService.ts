import privateAxios from "@/lib/privateAxios";
import { ApiResponse } from "@/types/backend.type";
import { IFood } from "@/types/food.type";

export const foodService = {
  getFoodById: async (id: number): Promise<ApiResponse<IFood>> => {
    const res = await privateAxios.get<ApiResponse<IFood>>(`/foods/${id}`);
    return res as unknown as ApiResponse<IFood>;
  },

  searchFood: async (q: string): Promise<ApiResponse<any>> => {
    // According to user prompt: GET /search?q=bun+bo+hue
    const res = await privateAxios.get<ApiResponse<any>>("/search", {
      params: { q },
    });
    return res as unknown as ApiResponse<any>;
  },
};
