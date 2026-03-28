"use client";

import { useEffect, useState } from "react";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/stores/authStore";

export const useAuthInit = () => {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const runInit = async () => {
      // Đọc token bằng getState() - đảm bảo đọc sau khi persist đã hydrate
      const { access_token, setUser, setAccessToken, logoutAction } =
        useAuthStore.getState();

      // Nếu không có token → chưa đăng nhập, không cần gọi API
      if (!access_token) {
        setIsInitializing(false);
        return;
      }

      // Có token → gọi /users/me để refresh data mới nhất (bao gồm userProfile)
      try {
        const res = await authService.getMe();
        if (res?.metadata?.EC === 0 && res.data) {
          setUser(res.data);
          // Nếu backend rotate token → cập nhật token mới
          if (res.data.accessToken) {
            setAccessToken(res.data.accessToken);
          }
        } else {
          logoutAction();
        }
      } catch {
        // 401: privateAxios tự refresh token hoặc logoutAction đã được gọi trong interceptor
        // Các lỗi khác (network...) → giữ nguyên data từ cache, không logout
      } finally {
        setIsInitializing(false);
      }
    };

    // Chờ Zustand persist hydrate xong rồi mới chạy
    if (useAuthStore.persist.hasHydrated()) {
      runInit();
    } else {
      const unsub = useAuthStore.persist.onFinishHydration(() => {
        runInit();
        unsub();
      });
      return unsub;
    }
  }, []);

  return { isInitializing };
};
