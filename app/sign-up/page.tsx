"use client";

import { useState } from "react";
import { Mail, Lock, Utensils, Eye, EyeOff, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import heroImg from "@/assets/images/nutrition-hero2.png";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signing up with:", formData);
    // Add logic here
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 font-sans">
      <div className="flex h-[630px] w-full max-w-[1000px] overflow-hidden rounded-3xl bg-card shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-border/50">
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
        <div className="flex w-full flex-col items-center justify-start p-6 md:w-1/2 md:p-8 lg:p-10 pt-16">
          {/* Logo */}
          <div className="mb-6 flex items-center gap-2 group cursor-pointer">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
              <Utensils className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-black text-card-foreground tracking-tighter">
              Nutri<span className="text-primary">Life</span>
            </span>
          </div>

          <div className="w-full space-y-1 mb-6 text-center md:text-left">
            <h1 className="text-2xl font-bold text-card-foreground tracking-tight">
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
              className="mt-4 w-full rounded-xl bg-primary py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Đăng ký tài khoản
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
