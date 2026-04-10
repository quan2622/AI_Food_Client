import privateAxios from "@/lib/privateAxios";
import { ApiResponse } from "@/types/backend.type";
import { IUserProfile } from "@/types/user-profile.type";

export interface IUserProfileWithUser extends IUserProfile {
  user: {
    id: number;
    fullName: string;
    email: string;
  };
}

export const userProfileService = {
  /**
   * Get current user's profile
   * GET /user-profiles
   */
  getUserProfile: async (): Promise<ApiResponse<IUserProfileWithUser>> => {
    const res = await privateAxios.get<ApiResponse<IUserProfileWithUser>>(
      "/user-profiles"
    );
    return res as unknown as ApiResponse<IUserProfileWithUser>;
  },
};
