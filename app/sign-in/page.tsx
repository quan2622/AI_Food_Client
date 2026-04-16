"use client";

import { useState } from "react";
import { Mail, Lock, EyeOff, Eye, Utensils, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import heroImg from "@/assets/images/nutrition-hero1.png";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

const SignInPage = () => {
  const router = useRouter();
  const loginAction = useAuthStore((state) => state.loginAction);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      const res = await authService.login({ email, password });

      if (res.metadata?.EC === 0 && res.data) {
        // Bước 1: Lưu token vào store trước (để privateAxios có thể dùng ngay)
        loginAction(res.data.access_token, res.data.user);

        // Bước 2: Gọi /users/me để lấy đầy đủ thông tin (bao gồm userProfile)
        try {
          const meRes = await authService.getMe();
          if (meRes?.metadata?.EC === 0 && meRes.data) {
            loginAction(
              meRes.data.accessToken ?? res.data.access_token,
              meRes.data
            );
          }
        } catch {
          // Nếu getMe thất bại, vẫn dùng data từ login response (đã set ở trên)
        }

        router.push("/");
        toast.success("Đăng nhập thành công!");
      } else {
        // Handle custom error message from backend
        toast.error(res.metadata?.message || "Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } catch (error: unknown) {
      console.error("Login failed:", error);
      let errorMsg = "Đã xảy ra lỗi kết nối. Vui lòng kiểm tra lại mạng.";
      if (error instanceof Error) {
        errorMsg = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        errorMsg = String((error as { message: unknown }).message);
      }
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 font-sans">
      <div className="flex flex-col md:flex-row h-auto md:h-[630px] w-full max-w-[1000px] overflow-hidden rounded-3xl bg-card shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-border/50">
        {/* Left Panel - Hero Section */}
        <div
          className="hidden md:flex md:w-1/2 flex-col justify-between p-10 relative overflow-hidden rounded-r-3xl"
          style={{ backgroundColor: "hsl(var(--hero-panel))" }}
        >
          {/* Decorative elements */}
          <div
            className="absolute -right-10 -top-10 h-64 w-64 rounded-full opacity-20 blur-3xl"
            style={{
              background: "radial-gradient(circle, #9fd923, transparent)",
            }}
          />
          <div
            className="absolute -left-10 -bottom-10 h-48 w-48 rounded-full opacity-10 blur-2xl"
            style={{
              background: "radial-gradient(circle, #9fd923, transparent)",
            }}
          />

          <div className="relative z-10">
            <h2 className="text-4xl font-extrabold leading-tight text-white tracking-tight">
              Quản lý dinh dưỡng <br />
              <span className="text-[#CAFD00]">thông minh</span> mỗi ngày
            </h2>
            <p className="mt-4 text-base text-white/80 max-w-[320px]">
              Theo dõi bữa ăn, cân bằng dinh dưỡng và xây dựng thói quen ăn uống
              lành mạnh cùng trí tuệ nhân tạo.
            </p>
          </div>

          <div className="relative z-10 flex items-end justify-center mt-6">
            <Image
              src={heroImg}
              alt="Nutrition illustration"
              width={450}
              height={450}
              className="w-full max-w-[360px] h-auto object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,0.15)] transform transition-transform duration-700 hover:scale-105 mix-blend-multiply"
            />
          </div>
        </div>

        {/* Right Panel - Sign In Form */}
        <div className="flex w-full flex-col items-center justify-start p-5 sm:p-6 md:w-1/2 md:p-8 lg:p-10 pt-10 sm:pt-12 md:pt-16">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mb-5 sm:mb-8 flex items-center gap-2 sm:gap-3 group cursor-pointer"
            >
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 transition-transform group-hover:rotate-12">
                <Utensils className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black text-card-foreground tracking-tighter leading-tight">
                  Nutri<span className="text-primary font-extrabold italic">Life</span>
                </span>
                <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] mt-0.5 ml-0.5">
                  Smart Nutrition
                </span>
              </div>
            </motion.div>
          </Link>

          <div className="w-full space-y-1 mb-4 sm:mb-6 text-center md:text-left">
            <h1 className="text-xl sm:text-2xl font-bold text-card-foreground tracking-tight">
              Chào mừng trở lại!
            </h1>
            <p className="text-sm text-muted-foreground">
              Vui lòng đăng nhập vào tài khoản của bạn để tiếp tục.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-3.5"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground ml-1 uppercase tracking-wider">
                Email
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 focus-within:border-primary focus-within:bg-card transition-all duration-300">
                <Mail className="h-4.5 w-4.5 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-card-foreground placeholder:text-muted-foreground/60 outline-none"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground ml-1 uppercase tracking-wider">
                Mật khẩu
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 focus-within:border-primary focus-within:bg-card transition-all duration-300">
                <Lock className="h-4.5 w-4.5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-card-foreground placeholder:text-muted-foreground/60 outline-none"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-card-foreground transition-colors p-1"
                >
                  {showPassword ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end mt-[-4px]">
              <Link
                href="/forgot-password"
                className="text-sm font-semibold text-primary/80 hover:text-primary transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-1 w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>



          {/* Footer - Sign Up */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Chưa có tài khoản?{" "}
            <Link
              href="/sign-up"
              className="font-bold text-primary hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
