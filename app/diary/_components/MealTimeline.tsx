"use client";

import { Flame, Droplets, Wheat, Beef } from "lucide-react";
import React from "react";
import { Meal } from "@/services/dailyLogService";
import emptyFood from "@/assets/daily-logs/no_data_dailylog_v1.png";

// Using placeholder image URLs since local assets are unavailable
const fallbackImage =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80";

const getMealDetails = (mealType: string) => {
  switch (mealType) {
    case "MEAL_BREAKFAST":
      return { label: "Bữa sáng", emoji: "🌅" };
    case "MEAL_LUNCH":
      return { label: "Bữa trưa", emoji: "☀️" };
    case "MEAL_DINNER":
      return { label: "Bữa tối", emoji: "🌙" };
    case "MEAL_SNACK":
      return { label: "Bữa phụ", emoji: "🥤" };
    default:
      return { label: "Khác", emoji: "🍽️" };
  }
};

const NutritionBadge = ({
  icon: Icon,
  value,
  unit,
  color,
}: {
  icon: React.ElementType;
  value: number;
  unit: string;
  color: string;
}) => (
  <div className="flex items-center gap-0.5 bg-[#F2F2F2]/50 px-1.5 py-0.5 rounded border border-[#0D0D0D]/5">
    <Icon className={`w-3 h-3 ${color}`} />
    <span className="text-[11px] font-bold text-foreground">{value}</span>
    <span className="text-[9px] text-muted-foreground uppercase font-semibold">
      {unit}
    </span>
  </div>
);

interface MealTimelineProps {
  meals?: Meal[];
}

const MealTimeline = ({ meals = [] }: MealTimelineProps) => {
  const hasAnyMealItems = meals && meals.some(meal => meal.mealItems && meal.mealItems.length > 0);

  if (!hasAnyMealItems) {
    return (
      <div className="relative w-full min-h-[300px] flex flex-col items-center justify-center px-4 mt-8 rounded-3xl overflow-hidden isolation-auto">
        {/* Hình ảnh nằm chìm phía dưới (background) */}
        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
          <img
            src={emptyFood.src}
            alt="Món ăn"
            className="w-full h-[100%] object-cover scale-100"
          />
        </div>

        {/* Khối content nằm đè lên trên ảnh */}
        <div className="relative z-10 flex flex-col items-center text-center p-6 bg-white/80 rounded-[2rem] border border-white/60 shadow-md shadow-[#0D0D0D]/20 max-w-[300px] mt-12">
          <h3 className="text-[20px] font-black text-[#0D0D0D] mb-2 tracking-tight">
            Trống Rỗng!
          </h3>
          <p className="text-[12px] font-bold text-[#0D0D0D]/60 leading-relaxed mb-6">
            Chưa có ghi nhận nào cho ngày này. Hãy quay lại trang chủ để bắt đầu
            thêm vào nhật ký nhé!
          </p>

          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-3.5 bg-[#0D0D0D] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-[#9FD923] hover:text-[#0D0D0D] transition-all shadow-xl shadow-[#0D0D0D]/10 active:scale-95 duration-300 w-full"
          >
            Về Trang Chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pb-8 space-y-8">
      {meals.map((meal) => {
        const details = getMealDetails(meal.mealType);

        return (
          <div key={meal.id}>
            {/* Group header */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">{details.emoji}</span>
              <h3 className="text-lg font-bold text-foreground">
                {details.label}
              </h3>
              <div className="flex-1 h-px bg-border ml-2 opacity-50" />
            </div>

            {/* Timeline */}
            <div className="relative ml-[52px]">
              {/* Vertical line */}
              <div className="absolute left-0 top-4 bottom-4 w-px bg-border/60" />

              <div className="space-y-6">
                {(meal.mealItems || []).map((item, idx) => {
                  const dt = new Date(item.createdAt || meal.mealDateTime);
                  const time = `${dt.getHours().toString().padStart(2, "0")}:${dt.getMinutes().toString().padStart(2, "0")}`;

                  return (
                    <div
                      key={item.id || idx}
                      className="flex items-start gap-0"
                    >
                      {/* Time label - left of timeline */}
                      <span className="text-xs font-black text-[#9FD923] w-[52px] -ml-[52px] text-right pr-3 pt-4 flex-shrink-0">
                        {time}
                      </span>

                      {/* Dot on timeline */}
                      <div className="relative z-10 flex-shrink-0 mt-4.5 -ml-[5px]">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#9FD923] ring-4 ring-background shadow-xs" />
                      </div>

                      {/* Meal card */}
                      <div className="flex-1 ml-5 bg-white border border-border/60 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 hover:border-[#9FD923]/30 cursor-pointer group hover:-translate-y-0.5 flex items-stretch gap-3 p-2">
                        {/* Image */}
                        <div className="w-20 h-20 shrink-0 overflow-hidden relative rounded-lg">
                          <img
                            src={item.food?.imageUrl || fallbackImage}
                            alt={item.food?.foodName || "Food Image"}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h4 className="text-sm font-bold text-foreground mb-1.5 truncate">
                            {item.food?.foodName || "Unknown Meal"}
                            {item.grams ? (
                              <span className="text-xs text-muted-foreground ml-1">
                                ({item.grams}g)
                              </span>
                            ) : null}
                          </h4>

                          {/* Nutrition stats */}
                          <div className="flex items-center gap-1 flex-wrap">
                            <NutritionBadge
                              icon={Flame}
                              value={item.calories}
                              unit="kcal"
                              color="text-orange-500"
                            />
                            <NutritionBadge
                              icon={Beef}
                              value={item.protein}
                              unit="g"
                              color="text-red-500"
                            />
                            <NutritionBadge
                              icon={Wheat}
                              value={item.carbs}
                              unit="g"
                              color="text-amber-500"
                            />
                            <NutritionBadge
                              icon={Droplets}
                              value={item.fat}
                              unit="g"
                              color="text-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MealTimeline;
