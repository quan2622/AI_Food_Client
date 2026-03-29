"use client";

import React from "react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Scan,
  Plus,
  Sun,
  Utensils,
  UtensilsCrossed,
  PlusCircle,
  Cookie,
  Droplets,
  TestTube,
  Leaf,
  Candy,
  TrendingDown,
  ArrowRight,
  Lightbulb,
  Target,
} from "lucide-react";
import ImageUploadDialog from "@/components/dashboard/ImageUploadDialog";
import { cn } from "@/lib/utils";

export enum GoalType {
  WEIGHT_LOSS = "WEIGHT_LOSS",
  WEIGHT_GAIN = "WEIGHT_GAIN",
  MAINTENANCE = "MAINTENANCE",
  STRICT_DIET = "STRICT_DIET",
}

const GOAL_CONFIG: Record<
  GoalType,
  {
    title: string;
    badgeLabel: string;
    badgeClass: string;
    textColor: string;
    dotClass: string;
  }
> = {
  [GoalType.WEIGHT_LOSS]: {
    title: "Giảm cân",
    badgeLabel: "WEIGHT LOSS",
    badgeClass: "text-white bg-blue-500 shadow-[0_2px_10px_rgba(59,130,246,0.3)] ring-2 ring-blue-500/20",
    textColor: "text-blue-500",
    dotClass: "bg-white",
  },
  [GoalType.WEIGHT_GAIN]: {
    title: "Tăng cân",
    badgeLabel: "WEIGHT GAIN",
    badgeClass: "text-white bg-amber-500 shadow-[0_2px_10px_rgba(245,158,11,0.3)] ring-2 ring-amber-500/20",
    textColor: "text-amber-500",
    dotClass: "bg-white",
  },
  [GoalType.MAINTENANCE]: {
    title: "Duy trì cân nặng",
    badgeLabel: "MAINTAIN",
    badgeClass: "text-white bg-dash-primary shadow-[0_2px_10px_rgba(0,110,28,0.3)] ring-2 ring-dash-primary/20",
    textColor: "text-dash-primary",
    dotClass: "bg-white",
  },
  [GoalType.STRICT_DIET]: {
    title: "Ăn kiêng khắc nghiệt",
    badgeLabel: "STRICT DIET",
    badgeClass: "text-white bg-rose-600 shadow-[0_2px_10px_rgba(225,29,72,0.3)] ring-2 ring-rose-600/20",
    textColor: "text-rose-600",
    dotClass: "bg-white",
  },
};

export default function Home() {
  const currentGoalType = GoalType.MAINTENANCE; // Example: can be dynamic based on API
  const goalUI = GOAL_CONFIG[currentGoalType];
  const [isScanDialogOpen, setIsScanDialogOpen] = React.useState(false);

  return (
    <ScrollArea className="h-screen w-full">
      <main className="max-w-[1600px] mx-auto px-10 pt-28 pb-24">
        {/* Personalized Greeting Section */}
        <section className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">
              Chào buổi sáng, Minh! ☀️
            </h1>
            <p className="text-lg text-on-surface-variant font-medium">
              Bạn đã duy trì chuỗi{" "}
              <span className="text-dash-primary font-bold">12 ngày</span> sống
              khỏe. Cố gắng lên!
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsScanDialogOpen(true)}
              className="bg-linear-to-br from-dash-primary to-dash-primary-container text-on-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 active:scale-95 transition-transform cursor-pointer shadow-sm"
            >
              <Scan className="w-5 h-5" />
              Quét món ăn
            </button>
            <button className="bg-dash-secondary-container text-on-secondary-container px-6 py-3 rounded-xl font-bold flex items-center gap-2 active:scale-95 transition-transform cursor-pointer shadow-sm">
              <Plus className="w-5 h-5" />
              Thêm bằng tay
            </button>
          </div>
        </section>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Calorie & Macros */}
          <div className="md:col-span-4 flex flex-col gap-6">
            {/* Daily Calorie Progress */}
            <div className="bg-dash-surface-container-lowest p-8 rounded-xl shadow-[0_4px_24px_rgba(0,110,28,0.04)] flex flex-col items-center text-center">
              <h3 className="text-on-surface-variant font-bold uppercase tracking-widest text-xs mb-8">
                Calories hằng ngày
              </h3>
              <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                {/* Progress Ring (SVG) */}
                <svg className="w-full h-full -rotate-90">
                  <circle
                    className="text-dash-primary/10"
                    cx="96"
                    cy="96"
                    fill="transparent"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                  ></circle>
                  <circle
                    className="text-dash-primary"
                    cx="96"
                    cy="96"
                    fill="transparent"
                    r="88"
                    stroke="currentColor"
                    strokeDasharray="552.92"
                    strokeDashoffset="150"
                    strokeLinecap="round"
                    strokeWidth="12"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-extrabold font-headline leading-none">
                    1,450
                  </span>
                  <span className="text-on-surface-variant font-bold text-sm">
                    / 2,000 kcal
                  </span>
                </div>
              </div>
              <div className="bg-dash-primary/5 px-4 py-2 rounded-full border border-dash-primary/10">
                <span className="text-dash-primary font-bold text-sm">
                  Còn lại 550 kcal
                </span>
              </div>
            </div>

            {/* Macros Breakdown */}
            <div className="bg-dash-surface-container-low p-6 rounded-xl flex flex-col gap-5 border border-dash-surface-container-highest/50">
              <h3 className="text-on-surface font-bold text-lg mb-2">
                Chỉ số dưỡng chất
              </h3>
              {/* Protein */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-sm">Protein</span>
                  <span className="text-on-surface-variant text-xs">
                    <span className="font-bold text-on-surface">85g</span> /
                    120g
                  </span>
                </div>
                <div className="h-2 w-full bg-dash-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-protein w-[70%] rounded-full"></div>
                </div>
              </div>
              {/* Carbs */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-sm">Carbs</span>
                  <span className="text-on-surface-variant text-xs">
                    <span className="font-bold text-on-surface">160g</span> /
                    220g
                  </span>
                </div>
                <div className="h-2 w-full bg-dash-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-carbs w-[72%] rounded-full"></div>
                </div>
              </div>
              {/* Fat */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-sm">Fat</span>
                  <span className="text-on-surface-variant text-xs">
                    <span className="font-bold text-on-surface">42g</span> / 65g
                  </span>
                </div>
                <div className="h-2 w-full bg-dash-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-fat w-[64%] rounded-full"></div>
                </div>
              </div>
              {/* Fiber */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-sm">Fiber</span>
                  <span className="text-on-surface-variant text-xs">
                    <span className="font-bold text-on-surface">18g</span> / 30g
                  </span>
                </div>
                <div className="h-2 w-full bg-dash-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-fiber w-[60%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column: Meal Log & Insights */}
          <div className="md:col-span-5 flex flex-col gap-6">
            {/* Smart Insights */}
            <div className="bg-dash-tertiary-fixed text-on-tertiary-fixed-variant p-5 rounded-xl flex items-start gap-4 shadow-sm border border-dash-tertiary-fixed-dim/20">
              <Lightbulb className="w-5 h-5 text-dash-tertiary shrink-0 fill-dash-tertiary/20" />
              <div>
                <p className="font-bold text-sm leading-tight mb-1">
                  Bạn chưa đủ Protein hôm nay...
                </p>
                <p className="text-xs opacity-80">
                  Hãy thử thêm ức gà hoặc đậu phụ vào bữa tối để đạt mục tiêu
                  nhé!
                </p>
              </div>
            </div>

            {/* Meal Log Timeline */}
            <div className="bg-dash-surface-container-lowest p-6 rounded-xl shadow-[0_4px_24px_rgba(0,110,28,0.04)] grow border border-dash-surface-container-highest/20">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold font-headline">
                  Nhật ký ăn uống
                </h3>
                <span className="text-xs font-bold text-on-surface-variant bg-dash-surface-container px-2 py-1 rounded">
                  HÔM NAY
                </span>
              </div>

              <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-dash-surface-container-high">
                {/* Breakfast */}
                <div className="relative pl-10">
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-dash-primary flex items-center justify-center z-10 shadow-sm shadow-dash-primary/30">
                    <Sun className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm">Bữa sáng</h4>
                      <p className="text-xs text-on-surface-variant">
                        Phở bò, Nước cam
                      </p>
                    </div>
                    <span className="font-bold text-sm">450 kcal</span>
                  </div>
                </div>
                {/* Lunch */}
                <div className="relative pl-10">
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-dash-primary flex items-center justify-center z-10 shadow-sm shadow-dash-primary/30">
                    <Utensils className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm">Bữa trưa</h4>
                      <p className="text-xs text-on-surface-variant">
                        Cơm tấm, Salad ức gà
                      </p>
                    </div>
                    <span className="font-bold text-sm">720 kcal</span>
                  </div>
                </div>
                {/* Dinner */}
                <div className="relative pl-10 opacity-50">
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-dash-surface-container-highest border-2 border-dash-primary flex items-center justify-center z-10">
                    <UtensilsCrossed className="w-3.5 h-3.5 text-dash-primary" />
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <h4 className="font-bold text-sm">Bữa tối</h4>
                      <p className="text-xs text-on-surface-variant italic">
                        Chưa ghi nhận
                      </p>
                    </div>
                    <button className="text-dash-primary hover:bg-dash-primary/10 p-1 rounded-full transition-colors cursor-pointer">
                      <PlusCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {/* Snacks */}
                <div className="relative pl-10">
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-dash-primary flex items-center justify-center z-10 shadow-sm shadow-dash-primary/30">
                    <Cookie className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm">Bữa phụ</h4>
                      <p className="text-xs text-on-surface-variant">
                        Hạnh nhân, Táo
                      </p>
                    </div>
                    <span className="font-bold text-sm">280 kcal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Micro-nutrients, Water, Weight */}
          <div className="md:col-span-3 flex flex-col gap-6">
            {/* Water Intake Tracking */}
            <div className="bg-dash-surface-container-low p-6 rounded-xl shadow-sm border border-dash-surface-container-highest/50 flex flex-col h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-carbs/10 flex items-center justify-center shadow-sm">
                  <Droplets className="w-6 h-6 text-carbs" />
                </div>
                <div>
                  <h3 className="text-on-surface font-bold text-base">
                    Lượng nước uống
                  </h3>
                  <p className="text-carbs font-bold text-lg leading-tight">
                    1.8{" "}
                    <span className="text-sm font-normal text-on-surface-variant">
                      / 2.5 Lít
                    </span>
                  </p>
                </div>
              </div>

              <div className="h-2 w-full bg-dash-surface-container-highest rounded-full overflow-hidden mb-6">
                <div className="h-full bg-carbs w-[72%] rounded-full"></div>
              </div>

              <div className="flex gap-2 items-center justify-between mb-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-4 h-4 rounded-full border-2 transition-all duration-300",
                      i <= 6
                        ? "bg-carbs border-carbs"
                        : "border-dash-surface-container-highest",
                    )}
                  />
                ))}
              </div>

              <div className="flex gap-2 mt-auto">
                <button className="flex-1 bg-carbs/10 text-carbs py-2.5 rounded-xl text-xs font-bold hover:bg-carbs hover:text-white cursor-pointer transition-all active:scale-95">
                  + 250ml
                </button>
                <button className="flex-1 bg-carbs/10 text-carbs py-2.5 rounded-xl text-xs font-bold hover:bg-carbs hover:text-white cursor-pointer transition-all active:scale-95">
                  + 500ml
                </button>
              </div>
            </div>

            {/* Consolidated Nutrition & Weight Goal Box */}
            <div className="bg-dash-surface-container-low p-6 rounded-xl border border-dash-surface-container-highest/50 flex flex-col gap-6 shadow-sm">
              {/* Header section */}
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-1.5 mb-1.5">
                      <Target className={cn("w-3.5 h-3.5", goalUI.textColor)} /> Mục
                      tiêu hiện tại
                    </p>
                    <h3 className="text-2xl font-extrabold tracking-tight text-on-surface flex items-center gap-2">
                      {goalUI.title}
                    </h3>
                  </div>
                  <span className={cn("text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5 shrink-0 whitespace-nowrap", goalUI.badgeClass)}>
                    <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse shrink-0", goalUI.dotClass)} />
                    {goalUI.badgeLabel}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2.5">
                  <span className="text-[10px] font-bold text-on-surface-variant bg-dash-surface-container-highest/50 px-2 py-1 rounded whitespace-nowrap">
                    TRONG 60 NGÀY
                  </span>
                  <span className="text-[10px] font-bold text-on-surface-variant bg-dash-surface-container-highest/50 px-2 py-1 rounded whitespace-nowrap">
                    GIỮ NGUYÊN MỨC CÂN
                  </span>
                </div>
              </div>
              {/* Current Weight Status Bar */}
              <div className="bg-dash-surface-container-lowest p-5 rounded-xl border border-dash-surface-container-highest/30 flex flex-col gap-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                      Cân nặng hiện tại
                    </p>
                    <div className="text-2xl font-extrabold font-headline">
                      65.2{" "}
                      <span className="text-sm font-medium text-on-surface-variant">
                        kg
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                      Mục tiêu
                    </p>
                    <div className="text-lg font-bold text-dash-primary">
                      65.0 <span className="text-xs font-medium">kg</span>
                    </div>
                  </div>
                </div>

                <div className="relative mt-2">
                  <div className="h-3 w-full bg-dash-surface-container-highest rounded-full overflow-hidden flex">
                    <div className="h-full bg-dash-primary rounded-full transition-all duration-500 w-[85%]"></div>
                  </div>
                  {/* Current position marker */}
                  <div className="absolute top-1/2 -mt-2.5 left-[85%] w-5 h-5 bg-white border-2 border-dash-primary rounded-full shadow-md flex items-center justify-center -ml-2.5">
                    <div className="w-1.5 h-1.5 bg-dash-primary rounded-full animate-pulse"></div>
                  </div>
                </div>

                <div className="flex justify-between text-[11px] font-bold text-on-surface-variant mt-1 pl-1 pr-1">
                  <span>Ban đầu: 68.5 kg</span>
                  <span className="text-dash-primary flex items-center gap-1">
                    Chỉ còn 0.2 kg
                  </span>
                </div>
              </div>

              {/* View Details Button */}
              <button className="group w-full mt-1 py-3.5 rounded-xl border border-dash-primary/20 bg-dash-primary/5 text-sm font-bold text-dash-primary hover:bg-dash-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-[0_4px_20px_rgba(0,110,28,0.3)] active:scale-[0.98]">
                Xem chi tiết
                <ArrowRight className="w-4 h-4 text-dash-primary group-hover:text-white transition-all duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Featured Nutrition Insight Card */}
        <section className="mt-12 rounded-3xl overflow-hidden relative min-h-[320px] flex items-center bg-zinc-900 group shadow-lg">
          <div className="absolute inset-0 opacity-60 transition-transform duration-700 group-hover:scale-105">
            <Image
              fill
              alt="Healthy Nutrition"
              className="object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_KzrD5JfbvaV7mGV4e-MpmV7ZAnQbFV6LhmsJZqFkJvMRyeVFv2PsJuHak8kTIOGmOKNnYIMWw2w_T0FrX_yBFhlxs5h3YKpYx4fXq7EWTucqotGKTeiZRIJIOCV4CYGsGHHco9avvnhdR25e3bQOxF819ftOIOUj9vygKgpEHNrLoI11KGuDG-lufiKAoCR84GZycLXRNAGmPD-pnXoooOVoc-79mAZwe-7_Q7NXw0_037esIIHkrM30SLtkuczJJRP2FbWweV2e"
            />
          </div>
          <div className="absolute inset-0 bg-linear-to-r from-zinc-950/90 via-zinc-950/70 to-transparent"></div>
          <div className="relative z-10 px-6 md:px-12 max-w-2xl">
            <span className="bg-dash-primary px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-widest mb-4 inline-block shadow-sm">
              Mẹo dinh dưỡng
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white font-headline leading-tight mb-4">
              Lợi ích của việc bổ sung chất xơ hòa tan vào bữa sáng
            </h2>
            <p className="text-zinc-300 mb-8 text-base md:text-lg">
              Hạt chia, yến mạch và các loại quả mọng không chỉ ngon mà còn giúp
              bạn no lâu hơn và ổn định đường huyết suốt cả ngày.
            </p>
            <button className="cursor-pointer text-white border border-white/30 px-6 md:px-8 py-3 rounded-xl font-bold hover:bg-white hover:text-black transition-all flex items-center gap-3 backdrop-blur-sm">
              Đọc thêm bài viết
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      </main>

      <ImageUploadDialog
        isOpen={isScanDialogOpen}
        onClose={() => setIsScanDialogOpen(false)}
        onUpload={(files) => {
          console.log("Uploading files in dashboard:", files);
          // Handle upload logic here if needed
        }}
      />
    </ScrollArea>
  );
}
