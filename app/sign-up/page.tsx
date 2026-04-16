"use client";

import { useState } from "react";
import { Mail, Lock, Utensils, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import heroImg from "@/assets/images/nutrition-hero2.png";
import { authService } from "@/services/authService";
import { toast } from "sonner";

const SignUpPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    // 1. Kiểm tra khớp mật khẩu
    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu nhập lại không khớp!");
      return;
    }

    setIsLoading(true);
    try {
      // Vì form đã tối giản (bỏ fullName), chúng ta lấy phần đầu email làm fullName mặc định
      const fullName = formData.email.split("@")[0];

      const res = await authService.register({
        email: formData.email,
        password: formData.password,
        fullName: fullName,
      });

      if (res.metadata?.EC === 0) {
        toast.success("Đăng ký tài khoản thành công! Vui lòng đăng nhập.");
        router.push("/sign-in");
      } else {
        toast.error(res.metadata?.message || "Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (error: unknown) {
      console.error("Register failed:", error);
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
              Bắt đầu hành trình <br />
              <span className="text-[#CAFD00]">sống khỏe</span> của bạn
            </h2>
            <p className="mt-4 text-base text-white/80 max-w-[340px]">
              Tạo tài khoản để nhận lộ trình dinh dưỡng cá nhân hóa và theo dõi
              sức khỏe thông minh cùng NutriLife.
            </p>
          </div>

          <div className="relative z-10 flex items-end justify-center mt-6">
            <Image
              src={heroImg}
              alt="Nutrition illustration"
              width={450}
              height={450}
              className="w-full max-w-[380px] h-auto object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,0.15)] transform transition-transform duration-700 hover:scale-105 mix-blend-multiply"
            />
          </div>
        </div>

        {/* Right Panel - Sign Up Form */}
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
              Tạo tài khoản mới
            </h1>
            <p className="text-sm text-muted-foreground">
              Điền các thông tin dưới đây để đăng ký tham gia NutriLife.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-3.5"
          >
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground ml-1 uppercase tracking-wider">
                Email
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 focus-within:border-primary focus-within:bg-card transition-all duration-300">
                <Mail className="h-4.5 w-4.5 text-muted-foreground" />
                 <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="flex-1 bg-transparent text-sm text-card-foreground placeholder:text-muted-foreground/60 outline-none"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground ml-1 uppercase tracking-wider">
                Mật khẩu (Tối thiểu 6 ký tự)
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 focus-within:border-primary focus-within:bg-card transition-all duration-300">
                <Lock className="h-4.5 w-4.5 text-muted-foreground" />
                 <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="flex-1 bg-transparent text-sm text-card-foreground placeholder:text-muted-foreground/60 outline-none"
                  minLength={6}
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

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground ml-1 uppercase tracking-wider">
                Nhập lại mật khẩu
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 focus-within:border-primary focus-within:bg-card transition-all duration-300">
                <Lock className="h-4.5 w-4.5 text-muted-foreground" />
                 <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="flex-1 bg-transparent text-sm text-card-foreground placeholder:text-muted-foreground/60 outline-none"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-muted-foreground hover:text-card-foreground transition-colors p-1"
                >
                  {showConfirmPassword ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

             <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full rounded-xl bg-primary py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Đăng ký tài khoản"
              )}
            </button>
          </form>

          {/* Footer - Sign In */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Đã có tài khoản?{" "}
            <Link
              href="/sign-in"
              className="font-bold text-primary hover:underline"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
