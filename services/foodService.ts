import privateAxios from "@/lib/privateAxios";
import { ApiResponse } from "@/types/backend.type";

export const foodService = {
  searchFood: async (q: string): Promise<ApiResponse<any>> => {
    // According to user prompt: GET /search?q=bun+bo+hue
    const res = await privateAxios.get<ApiResponse<any>>("/search", {
      params: { q },
    });
    return res as unknown as ApiResponse<any>;
  },
};
