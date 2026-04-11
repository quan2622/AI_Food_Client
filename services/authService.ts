import publicAxios from "@/lib/publicAxios";
import privateAxios from "@/lib/privateAxios";
import { ILoginRequest, IUser, ICreateUserRequest, IChangePasswordRequest } from "@/types/authen.type";
import { ApiResponse } from "@/types/backend.type";

interface LoginResponse {
  user: IUser;
  access_token: string;
}

export const authService = {
  /**
   * Đăng nhập người dùng
   * @param data { email, password }
   * @returns ApiResponse<LoginResponse>
   */
  login: async (data: ILoginRequest): Promise<ApiResponse<LoginResponse>> => {
    // Gọi tới endpoint /api/v1/auth/login dựa trên chuẩn API chung (v1)
    const res = await publicAxios.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      data,
    );
    return res as unknown as ApiResponse<LoginResponse>;
  },

  /**
   * Đăng ký người dùng
   * @param data Thông tin đăng ký
   */
  register: async (data: ICreateUserRequest): Promise<ApiResponse<IUser>> => {
    const res = await publicAxios.post<ApiResponse<IUser>>(
      "/auth/register",
      data,
    );
    return res as unknown as ApiResponse<IUser>;
  },

  /**
   * Đăng xuất
   */
  logout: async (): Promise<ApiResponse<null>> => {
    const res = await privateAxios.post<ApiResponse<null>>("/auth/logout");
    return res as unknown as ApiResponse<null>;
  },

  /**
   * Lấy thông tin người dùng hiện tại
   * @returns ApiResponse<IUser>
   */
  getMe: async (): Promise<ApiResponse<IUser>> => {
    const res = await privateAxios.get<ApiResponse<IUser>>("/users/me");
    return res as unknown as ApiResponse<IUser>;
  },

  /**
   * Cập nhật mật khẩu người dùng
   * @param id ID người dùng
   * @param data { oldPassword, newPassword }
   */
  updatePassword: async (
    id: number,
    data: IChangePasswordRequest
  ): Promise<ApiResponse<null>> => {
    const res = await privateAxios.patch<ApiResponse<null>>(
      `/users/${id}/password`,
      data
    );
    return res as unknown as ApiResponse<null>;
  },
};
