import publicAxios from "@/lib/publicAxios";
import privateAxios from "@/lib/privateAxios";
import { ApiResponse } from "@/types/backend.type";
import { IAllergen, IUserAllergy, ICreateUserAllergyRequest, IUpdateUserAllergyRequest } from "@/types/allergen.type";

export const allergenService = {
  /**
   * Get all allergens
   * GET /allergens
   */
  getAllAllergens: async (): Promise<ApiResponse<IAllergen[]> | IAllergen[]> => {
    const res = await privateAxios.get<ApiResponse<IAllergen[]> | IAllergen[]>(
      "/allergens"
    );
    return res as any;
  },

  /**
   * Get user allergies
   * GET /user-allergies/user/:userId
   */
  getUserAllergies: async (userId: number): Promise<ApiResponse<IUserAllergy[]>> => {
    const res = await privateAxios.get<ApiResponse<IUserAllergy[]>>(`/user-allergies/user/${userId}`);
    return res as unknown as ApiResponse<IUserAllergy[]>;
  },

  /**
   * Add user allergy
   * POST /user-allergies
   */
  addUserAllergy: async (data: ICreateUserAllergyRequest & { userId: number }): Promise<ApiResponse<IUserAllergy>> => {
    const res = await privateAxios.post<ApiResponse<IUserAllergy>>("/user-allergies", data);
    return res as unknown as ApiResponse<IUserAllergy>;
  },

  /**
   * Delete user allergy
   * DELETE /user-allergies/:id
   */
  deleteUserAllergy: async (id: number): Promise<ApiResponse<null>> => {
    const res = await privateAxios.delete<ApiResponse<null>>(`/user-allergies/${id}`);
    return res as unknown as ApiResponse<null>;
  },

  /**
   * Update user allergy
   * PATCH /user-allergies/:id
   */
  updateUserAllergy: async (id: number, data: IUpdateUserAllergyRequest): Promise<ApiResponse<IUserAllergy>> => {
    const res = await privateAxios.patch<ApiResponse<IUserAllergy>>(`/user-allergies/${id}`, data);
    return res as unknown as ApiResponse<IUserAllergy>;
  }
};
