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
import { ProfileDialog } from "@/components/common/ProfileDialog";
import { cn } from "@/lib/utils";
import {
  dailyLogService,
  DashboardDailyLogResponse,
} from "@/services/dailyLogService";
import {
  nutritionGoalService,
  NutritionGoal,
} from "@/services/nutritionGoalService";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { foodRecognitionService } from "@/services/foodRecognitionService";
import { foodService } from "@/services/foodService";

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
    badgeLabel: "GIẢM CÂN",
    badgeClass:
      "text-white bg-blue-500 shadow-[0_2px_10px_rgba(59,130,246,0.3)] ring-2 ring-blue-500/20",
    textColor: "text-blue-500",
    dotClass: "bg-white",
  },
  [GoalType.WEIGHT_GAIN]: {
    title: "Tăng cân",
    badgeLabel: "TĂNG CÂN",
    badgeClass:
      "text-white bg-amber-500 shadow-[0_2px_10px_rgba(245,158,11,0.3)] ring-2 ring-amber-500/20",
    textColor: "text-amber-500",
    dotClass: "bg-white",
  },
  [GoalType.MAINTENANCE]: {
    title: "Duy trì cân nặng",
    badgeLabel: "DUY TRÌ",
    badgeClass:
      "text-white bg-dash-primary shadow-[0_2px_10px_rgba(0,110,28,0.3)] ring-2 ring-dash-primary/20",
    textColor: "text-dash-primary",
    dotClass: "bg-white",
  },
  [GoalType.STRICT_DIET]: {
    title: "Ăn kiêng khắc nghiệt",
    badgeLabel: "ĂN KIÊNG NGHIÊM NGẶT",
    badgeClass:
      "text-white bg-rose-600 shadow-[0_2px_10px_rgba(225,29,72,0.3)] ring-2 ring-rose-600/20",
    textColor: "text-rose-600",
    dotClass: "bg-white",
  },
};

export default function Home() {
  const [dailyLog, setDailyLog] =
    React.useState<DashboardDailyLogResponse | null>(null);
  const [activeGoal, setActiveGoal] = React.useState<NutritionGoal | null>(
    null,
  );
  const [isScanDialogOpen, setIsScanDialogOpen] = React.useState(false);
  const [waterIntake, setWaterIntake] = React.useState(0);
  const [greetingInfo, setGreetingInfo] = React.useState({
    text: "Chào bạn",
    icon: "☀️",
  });
  const targetWater = 2500; // 2.5 Lít in ml
  const { user } = useAuthStore();

  const fetchLog = async () => {
    try {
      const res = await dailyLogService.getDailyLogToday();
      if (res.data) {
        setDailyLog(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch daily log:", err);
    }
  };

  React.useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await nutritionGoalService.getCurrentGoal();
        if (res.data) {
          setActiveGoal(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch nutrition goals:", err);
      }
    };

    const loadWaterIntake = () => {
      const storedDate = localStorage.getItem("waterDate");
      const today = new Date().toDateString();

      if (storedDate === today) {
        const storedWater = localStorage.getItem("waterIntake");
        if (storedWater) {
          setWaterIntake(parseInt(storedWater, 10));
        }
      } else {
        localStorage.setItem("waterDate", today);
        localStorage.setItem("waterIntake", "0");
        setWaterIntake(0);
      }
    };

    const loadGreeting = () => {
      const hour = new Date().getHours();
      setGreetingInfo({
        text:
          hour < 12
            ? "Chào buổi sáng"
            : hour < 18
              ? "Chào buổi chiều"
              : "Chào buổi tối",
        icon: hour < 12 ? "☀️" : hour < 18 ? "🌤️" : "🌙",
      });
    };

    fetchLog();
    fetchGoals();
    loadWaterIntake();
    loadGreeting();
  }, []);

  const handleAddWater = (amount: number) => {
    setWaterIntake((prev) => {
      const newValue = prev + amount;
      localStorage.setItem("waterIntake", newValue.toString());
      return newValue;
    });
  };

  const currentGoalType =
    (activeGoal?.goalTypeInfo?.value as GoalType) ||
    (dailyLog?.nutritionGoal?.goalType as GoalType) ||
    GoalType.MAINTENANCE;
  const goalUI =
    GOAL_CONFIG[currentGoalType] || GOAL_CONFIG[GoalType.MAINTENANCE];

  // Derived state from API
  const totals = dailyLog?.totals || {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
  };
  const target = activeGoal ||
    dailyLog?.nutritionGoal || {
      targetCalories: 2000,
      targetProtein: 120,
      targetCarbs: 220,
      targetFat: 65,
      targetFiber: 30,
    };

  const currentWeight = user?.userProfile?.weight ?? 65.2;
  const targetWeight = activeGoal?.targetWeight ?? 65.0;

  const firstName = user?.fullName ? user.fullName.split(" ").pop() : "Minh";

  // Logic for progress bar
  const isLoss = currentGoalType === GoalType.WEIGHT_LOSS;
  const isGain = currentGoalType === GoalType.WEIGHT_GAIN;
  const initialWeight = isLoss
    ? targetWeight + 3
    : isGain
      ? Math.max(0, targetWeight - 3)
      : targetWeight;
  const totalDiff = Math.abs(initialWeight - targetWeight) || 1;
  const currentDiff = Math.abs(currentWeight - targetWeight);
  const progressPercent = (() => {
    const start = activeGoal?.startDate
      ? new Date(activeGoal.startDate).getTime()
      : null;
    const end = activeGoal?.endDate
      ? new Date(activeGoal.endDate).getTime()
      : null;
    if (start && end && end > start) {
      const now = Date.now();
      return Math.max(
        0,
        Math.min(100, Math.round(((now - start) / (end - start)) * 100)),
      );
    }
    return Math.max(
      0,
      Math.min(100, Math.round(((totalDiff - currentDiff) / totalDiff) * 100)),
    );
  })();

  const calculateTotalDays = (start?: string, end?: string) => {
    if (!start || !end) return 60;
    return Math.max(
      0,
      Math.ceil(
        (new Date(end).getTime() - new Date(start).getTime()) /
          (1000 * 3600 * 24),
      ),
    );
  };
  const totalDays = calculateTotalDays(
    activeGoal?.startDate,
    activeGoal?.endDate,
  );

  const getMealInfo = (
    type: "MEAL_BREAKFAST" | "MEAL_LUNCH" | "MEAL_DINNER" | "MEAL_SNACK",
  ) => {
    const meal = dailyLog?.meals?.find((m) => m.mealType === type);
    if (!meal || !meal.mealItems || meal.mealItems.length === 0) {
      return { text: "Chưa ghi nhận", cals: 0, empty: true };
    }
    const text = meal.mealItems.map((i) => i.food.foodName).join(", ");
    return { text, cals: meal.totalCalories || 0, empty: false };
  };

  const breakfast = getMealInfo("MEAL_BREAKFAST");
  const lunch = getMealInfo("MEAL_LUNCH");
  const dinner = getMealInfo("MEAL_DINNER");
  const snack = getMealInfo("MEAL_SNACK");

  return (
    <ScrollArea className="h-screen w-full">
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 pt-20 md:pt-28 pb-16 md:pb-24">
        {/* Personalized Greeting Section */}
        <section className="mb-6 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-on-surface mb-1 md:mb-2 font-headline">
              {greetingInfo.text}, {firstName}! {greetingInfo.icon}
            </h1>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => setIsScanDialogOpen(true)}
              className="bg-linear-to-br from-dash-primary to-dash-primary-container text-on-primary px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold flex items-center gap-2 active:scale-95 transition-transform cursor-pointer shadow-sm text-sm sm:text-base"
            >
              <Scan className="w-4 h-4 sm:w-5 sm:h-5" />
              Quét món ăn
            </button>
            <button className="bg-dash-secondary-container text-on-secondary-container px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold flex items-center gap-2 active:scale-95 transition-transform cursor-pointer shadow-sm text-sm sm:text-base">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Thêm bằng tay
            </button>
          </div>
        </section>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {/* Left Column: Calorie & Macros */}
          <div className="md:col-span-4 flex flex-col gap-4 md:gap-6">
            {/* Daily Calorie Progress */}
            <div className="bg-dash-surface-container-lowest p-5 sm:p-6 md:p-8 rounded-xl shadow-[0_4px_24px_rgba(0,110,28,0.04)] flex flex-col items-center text-center">
              <h3 className="text-on-surface-variant font-bold uppercase tracking-widest text-xs mb-4 md:mb-8">
                Calories hằng ngày
              </h3>
              <div className="relative w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 flex items-center justify-center mb-4 md:mb-6">
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
                    strokeDashoffset={Math.max(
                      0,
                      552.92 -
                        552.92 * (totals.calories / target.targetCalories),
                    )}
                    strokeLinecap="round"
                    strokeWidth="12"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-headline leading-none">
                    {totals.calories.toLocaleString()}
                  </span>
                  <span className="text-on-surface-variant font-bold text-sm">
                    / {target.targetCalories.toLocaleString()} kcal
                  </span>
                </div>
              </div>
              <div className="bg-dash-primary/5 px-4 py-2 rounded-full border border-dash-primary/10">
                <span className="text-dash-primary font-bold text-sm">
                  {target.targetCalories >= totals.calories
                    ? `Còn lại ${(target.targetCalories - totals.calories).toLocaleString()} kcal`
                    : `Vượt quá ${(totals.calories - target.targetCalories).toLocaleString()} kcal`}
                </span>
              </div>
            </div>

            {/* Macros Breakdown */}
            <div className="bg-dash-surface-container-low p-4 sm:p-5 md:p-6 rounded-xl flex flex-col gap-4 md:gap-5 border border-dash-surface-container-highest/50">
              <h3 className="text-on-surface font-bold text-lg mb-2">
                Chỉ số dưỡng chất
              </h3>
              {/* Protein */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-sm">Chất đạm (Protein)</span>
                  <span className="text-on-surface-variant text-xs">
                    <span className="font-bold text-on-surface">
                      {totals.protein}g
                    </span>{" "}
                    /{target.targetProtein}g
                  </span>
                </div>
                <div className="h-2 w-full bg-dash-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className="h-full bg-protein rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (totals.protein / target.targetProtein) * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
              {/* Carbs */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-sm">Tinh bột (Carbs)</span>
                  <span className="text-on-surface-variant text-xs">
                    <span className="font-bold text-on-surface">
                      {totals.carbs}g
                    </span>{" "}
                    /{target.targetCarbs}g
                  </span>
                </div>
                <div className="h-2 w-full bg-dash-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className="h-full bg-carbs rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (totals.carbs / target.targetCarbs) * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
              {/* Fat */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-sm">Chất béo (Fat)</span>
                  <span className="text-on-surface-variant text-xs">
                    <span className="font-bold text-on-surface">
                      {totals.fat}g
                    </span>{" "}
                    / {target.targetFat}g
                  </span>
                </div>
                <div className="h-2 w-full bg-dash-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className="h-full bg-fat rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (totals.fat / target.targetFat) * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
              {/* Fiber */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-sm">Chất xơ (Fiber)</span>
                  <span className="text-on-surface-variant text-xs">
                    <span className="font-bold text-on-surface">
                      {totals.fiber}g
                    </span>{" "}
                    / {target.targetFiber || 30}g
                  </span>
                </div>
                <div className="h-2 w-full bg-dash-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className="h-full bg-fiber rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (totals.fiber / (target.targetFiber || 30)) * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column: Meal Log & Insights */}
          <div className="md:col-span-5 flex flex-col gap-4 md:gap-6">
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
            <div className="bg-dash-surface-container-lowest p-4 sm:p-5 md:p-6 rounded-xl shadow-[0_4px_24px_rgba(0,110,28,0.04)] grow border border-dash-surface-container-highest/20">
              <div className="flex justify-between items-center mb-4 md:mb-8">
                <h3 className="text-lg md:text-xl font-bold font-headline">
                  Nhật ký ăn uống
                </h3>
                <span className="text-xs font-bold text-on-surface-variant bg-dash-surface-container px-2 py-1 rounded">
                  HÔM NAY
                </span>
              </div>

              <div className="space-y-5 md:space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-dash-surface-container-high">
                {/* Breakfast */}
                <div
                  className={cn(
                    "relative pl-10",
                    breakfast.empty && "opacity-50",
                  )}
                >
                  <div
                    className={cn(
                      "absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center z-10 transition-colors",
                      breakfast.empty
                        ? "bg-dash-surface-container-highest border-2 border-dash-primary"
                        : "bg-dash-primary shadow-sm shadow-dash-primary/30",
                    )}
                  >
                    <Sun
                      className={cn(
                        "w-3.5 h-3.5",
                        breakfast.empty ? "text-dash-primary" : "text-white",
                      )}
                    />
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <h4 className="font-bold text-sm">Bữa sáng</h4>
                      <p
                        className={cn(
                          "text-xs line-clamp-1 mt-0.5",
                          breakfast.empty
                            ? "text-on-surface-variant italic"
                            : "text-on-surface-variant",
                        )}
                      >
                        {breakfast.text}
                      </p>
                    </div>
                    {breakfast.empty ? (
                      <button className="text-dash-primary hover:bg-dash-primary/10 p-1 rounded-full transition-colors cursor-pointer shrink-0 ml-2">
                        <PlusCircle className="w-5 h-5" />
                      </button>
                    ) : (
                      <span className="font-bold text-sm shrink-0 ml-2">
                        {breakfast.cals.toLocaleString()} kcal
                      </span>
                    )}
                  </div>
                </div>
                {/* Lunch */}
                <div
                  className={cn("relative pl-10", lunch.empty && "opacity-50")}
                >
                  <div
                    className={cn(
                      "absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center z-10 transition-colors",
                      lunch.empty
                        ? "bg-dash-surface-container-highest border-2 border-dash-primary"
                        : "bg-dash-primary shadow-sm shadow-dash-primary/30",
                    )}
                  >
                    <Utensils
                      className={cn(
                        "w-3.5 h-3.5",
                        lunch.empty ? "text-dash-primary" : "text-white",
                      )}
                    />
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <h4 className="font-bold text-sm">Bữa trưa</h4>
                      <p
                        className={cn(
                          "text-xs line-clamp-1 mt-0.5",
                          lunch.empty
                            ? "text-on-surface-variant italic"
                            : "text-on-surface-variant",
                        )}
                      >
                        {lunch.text}
                      </p>
                    </div>
                    {lunch.empty ? (
                      <button className="text-dash-primary hover:bg-dash-primary/10 p-1 rounded-full transition-colors cursor-pointer shrink-0 ml-2">
                        <PlusCircle className="w-5 h-5" />
                      </button>
                    ) : (
                      <span className="font-bold text-sm shrink-0 ml-2">
                        {lunch.cals.toLocaleString()} kcal
                      </span>
                    )}
                  </div>
                </div>
                {/* Dinner */}
                <div
                  className={cn("relative pl-10", dinner.empty && "opacity-50")}
                >
                  <div
                    className={cn(
                      "absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center z-10 transition-colors",
                      dinner.empty
                        ? "bg-dash-surface-container-highest border-2 border-dash-primary"
                        : "bg-dash-primary shadow-sm shadow-dash-primary/30",
                    )}
                  >
                    <UtensilsCrossed
                      className={cn(
                        "w-3.5 h-3.5",
                        dinner.empty ? "text-dash-primary" : "text-white",
                      )}
                    />
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <h4 className="font-bold text-sm">Bữa tối</h4>
                      <p
                        className={cn(
                          "text-xs line-clamp-1 mt-0.5",
                          dinner.empty
                            ? "text-on-surface-variant italic"
                            : "text-on-surface-variant",
                        )}
                      >
                        {dinner.text}
                      </p>
                    </div>
                    {dinner.empty ? (
                      <button className="text-dash-primary hover:bg-dash-primary/10 p-1 rounded-full transition-colors cursor-pointer shrink-0 ml-2">
                        <PlusCircle className="w-5 h-5" />
                      </button>
                    ) : (
                      <span className="font-bold text-sm shrink-0 ml-2">
                        {dinner.cals.toLocaleString()} kcal
                      </span>
                    )}
                  </div>
                </div>
                {/* Snacks */}
                <div
                  className={cn("relative pl-10", snack.empty && "opacity-50")}
                >
                  <div
                    className={cn(
                      "absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center z-10 transition-colors",
                      snack.empty
                        ? "bg-dash-surface-container-highest border-2 border-dash-primary"
                        : "bg-dash-primary shadow-sm shadow-dash-primary/30",
                    )}
                  >
                    <Cookie
                      className={cn(
                        "w-3.5 h-3.5",
                        snack.empty ? "text-dash-primary" : "text-white",
                      )}
                    />
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <h4 className="font-bold text-sm">Bữa phụ</h4>
                      <p
                        className={cn(
                          "text-xs line-clamp-1 mt-0.5",
                          snack.empty
                            ? "text-on-surface-variant italic"
                            : "text-on-surface-variant",
                        )}
                      >
                        {snack.text}
                      </p>
                    </div>
                    {snack.empty ? (
                      <button className="text-dash-primary hover:bg-dash-primary/10 p-1 rounded-full transition-colors cursor-pointer shrink-0 ml-2">
                        <PlusCircle className="w-5 h-5" />
                      </button>
                    ) : (
                      <span className="font-bold text-sm shrink-0 ml-2">
                        {snack.cals.toLocaleString()} kcal
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Micro-nutrients, Water, Weight */}
          <div className="md:col-span-3 flex flex-col gap-4 md:gap-6">
            {/* Water Intake Tracking */}
            <div className="bg-dash-surface-container-low p-4 sm:p-5 md:p-6 rounded-xl shadow-sm border border-dash-surface-container-highest/50 flex flex-col h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-carbs/10 flex items-center justify-center shadow-sm">
                  <Droplets className="w-6 h-6 text-carbs" />
                </div>
                <div>
                  <h3 className="text-on-surface font-bold text-base">
                    Lượng nước uống
                  </h3>
                  <p className="text-carbs font-bold text-lg leading-tight">
                    {waterIntake / 1000}{" "}
                    <span className="text-sm font-normal text-on-surface-variant">
                      / 2.5 Lít
                    </span>
                  </p>
                </div>
              </div>

              <div className="h-2 w-full bg-dash-surface-container-highest rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-carbs rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (waterIntake / targetWater) * 100)}%`,
                  }}
                ></div>
              </div>

              <div className="flex gap-2 items-center justify-between mb-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-4 h-4 rounded-full border-2 transition-all duration-300",
                      i <= Math.floor((waterIntake / targetWater) * 8)
                        ? "bg-carbs border-carbs"
                        : "border-dash-surface-container-highest",
                    )}
                  />
                ))}
              </div>

              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => handleAddWater(250)}
                  className="flex-1 bg-carbs/10 text-carbs py-2.5 rounded-xl text-xs font-bold hover:bg-carbs hover:text-white cursor-pointer transition-all active:scale-95"
                >
                  + 250ml
                </button>
                <button
                  onClick={() => handleAddWater(500)}
                  className="flex-1 bg-carbs/10 text-carbs py-2.5 rounded-xl text-xs font-bold hover:bg-carbs hover:text-white cursor-pointer transition-all active:scale-95"
                >
                  + 500ml
                </button>
              </div>
            </div>

            {/* Consolidated Nutrition & Weight Goal Box */}
            <div className="bg-dash-surface-container-low p-4 sm:p-5 md:p-6 rounded-xl border border-dash-surface-container-highest/50 flex flex-col gap-4 md:gap-6 shadow-sm">
              {/* Header section */}
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-1.5 mb-1.5">
                      <Target className={cn("w-3.5 h-3.5", goalUI.textColor)} />{" "}
                      Mục tiêu hiện tại
                    </p>
                    <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-on-surface flex items-center gap-2">
                      {goalUI.title}
                    </h3>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5 shrink-0 whitespace-nowrap",
                      goalUI.badgeClass,
                    )}
                  >
                    <div
                      className={cn(
                        "w-1.5 h-1.5 rounded-full animate-pulse shrink-0",
                        goalUI.dotClass,
                      )}
                    />
                    {goalUI.badgeLabel}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2.5">
                  <span className="text-[10px] font-bold text-on-surface-variant bg-dash-surface-container-highest/50 px-2 py-1 rounded whitespace-nowrap">
                    TRONG {totalDays} NGÀY
                  </span>
                  <span className="text-[10px] font-bold text-on-surface-variant bg-dash-surface-container-highest/50 px-2 py-1 rounded whitespace-nowrap">
                    {activeGoal?.goalTypeInfo?.description?.toUpperCase() ||
                      "GIỮ NGUYÊN MỨC CÂN"}
                  </span>
                </div>
              </div>
              {/* Current Weight Status Bar */}
              <div className="bg-dash-surface-container-lowest p-3 sm:p-4 rounded-xl border border-dash-surface-container-highest/30 flex flex-col gap-3">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                      Cân nặng hiện tại
                    </p>
                    <div className="text-xl md:text-2xl font-extrabold font-headline">
                      {currentWeight}{" "}
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
                      {targetWeight}{" "}
                      <span className="text-xs font-medium">kg</span>
                    </div>
                  </div>
                </div>

                <div className="relative mt-2">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Tiến độ
                    </span>
                    <span className="text-[11px] font-extrabold text-dash-primary">
                      {progressPercent}%
                    </span>
                  </div>
                  <div className="h-3 w-full bg-dash-surface-container-highest rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-dash-primary rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  {/* Current position marker */}
                  <div
                    className="absolute top-1/2 mt-1 w-5 h-5 bg-white border-2 border-dash-primary rounded-full shadow-md flex items-center justify-center -ml-2.5 transition-all duration-500"
                    style={{ left: `${progressPercent}%` }}
                  >
                    <div className="w-1.5 h-1.5 bg-dash-primary rounded-full animate-pulse"></div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-on-surface-variant/70 mt-3 pt-2 border-t border-dash-surface-container-highest/30">
                  <div className="flex flex-col gap-0.5">
                    <span>Bắt đầu</span>
                    <span className="text-on-surface-variant text-[11px]">
                      {activeGoal?.startDate
                        ? new Date(activeGoal.startDate).toLocaleDateString(
                            "vi-VN",
                          )
                        : "--/--/----"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 text-right">
                    <span>Kết thúc</span>
                    <span className="text-on-surface-variant text-[11px]">
                      {activeGoal?.endDate
                        ? new Date(activeGoal.endDate).toLocaleDateString(
                            "vi-VN",
                          )
                        : "--/--/----"}
                    </span>
                  </div>
                </div>
              </div>

              {/* View Details Button */}
              <ProfileDialog
                defaultTab="Goals"
                trigger={
                  <button className="group w-full py-3.5 rounded-xl border border-dash-primary/20 bg-dash-primary/5 text-sm font-bold text-dash-primary hover:bg-dash-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-[0_4px_20px_rgba(0,110,28,0.3)] active:scale-[0.98]">
                    Xem chi tiết
                    <ArrowRight className="w-4 h-4 text-dash-primary group-hover:text-white transition-all duration-300 group-hover:translate-x-1" />
                  </button>
                }
              />
            </div>
          </div>
        </div>
      </main>

      <ImageUploadDialog
        isOpen={isScanDialogOpen}
        onClose={() => setIsScanDialogOpen(false)}
        onSuccess={() => fetchLog()}
      />
    </ScrollArea>
  );
}
