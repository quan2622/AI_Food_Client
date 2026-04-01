"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useAuthInit } from "@/hooks/useAuthInit";
import { Loader2 } from "lucide-react";

// Các đường dẫn không yêu cầu đăng nhập
const publicPaths = ["/sign-in", "/sign-up", "/forgot-password"];

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isInitializing } = useAuthInit();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Nếu app đã load xong (Zustand hydrate và hook đã chạy)
    if (!isInitializing) {
      const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
      // Nếu chưa đăng nhập và cố gắng vào route cần bảo vệ
      if (!isAuthenticated && !isPublicPath) {
        router.replace("/sign-in");
      }
    }
  }, [isInitializing, isAuthenticated, pathname, router]);

  // Hiển thị màn hình chờ trong lúc kiểm tra authentication ban đầu
  if (isInitializing) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  
  // Nếu chưa đăng nhập và vào trang cần bảo vệ -> không render children
  // Router replace trong useEffect sẽ xử lý việc chuyển trang
  if (!isAuthenticated && !isPublicPath) {
    return null; 
  }

  // Đã đăng nhập hoặc vào link public -> render bình thường
  return <>{children}</>;
};
