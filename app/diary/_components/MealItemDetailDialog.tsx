"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Beef,
  Drumstick,
  Flame,
  Leaf,
  Loader2,
  Scale,
  Wheat,
} from "lucide-react";
import type { MealItemDetail } from "@/services/dailyLogService";

interface MealItemDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mealItem: MealItemDetail | null;
  loading?: boolean;
}

const getMealLabel = (mealType: string) => {
  switch (mealType) {
    case "MEAL_BREAKFAST":
      return "🌅 Bữa sáng";
    case "MEAL_LUNCH":
      return "☀️ Bữa trưa";
    case "MEAL_DINNER":
      return "🌙 Bữa tối";
    case "MEAL_SNACK":
      return "🥤 Bữa phụ";
    default:
      return "🍽️ Bữa ăn";
  }
};

const fallbackImage =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80";

export function MealItemDetailDialog({
  open,
  onOpenChange,
  mealItem,
  loading,
}: MealItemDetailDialogProps) {
  const food = mealItem?.food ?? null;
  const meal = mealItem?.meal ?? null;

  const mealDate = meal?.mealDateTime
    ? new Date(meal.mealDateTime).toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

  const mealTime = meal?.mealDateTime
    ? new Date(meal.mealDateTime).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const macros = mealItem
    ? [
        {
          label: "Calo",
          value: mealItem.calories,
          unit: "kcal",
          icon: Flame,
          color: "bg-orange-50 border-orange-100 text-orange-600",
        },
        {
          label: "Chất đạm",
          value: mealItem.protein,
          unit: "g",
          icon: Drumstick,
          color: "bg-blue-50 border-blue-100 text-blue-600",
        },
        {
          label: "Tinh bột",
          value: mealItem.carbs,
          unit: "g",
          icon: Wheat,
          color: "bg-sky-50 border-sky-100 text-sky-600",
        },
        {
          label: "Chất béo",
          value: mealItem.fat,
          unit: "g",
          icon: Beef,
          color: "bg-amber-50 border-amber-100 text-amber-600",
        },
        {
          label: "Chất xơ",
          value: mealItem.fiber,
          unit: "g",
          icon: Leaf,
          color: "bg-emerald-50 border-emerald-100 text-emerald-600",
        },
      ]
    : [];

  const per100g = food?.nutritionPer100g
    ? [
        { label: "Calo", value: food.nutritionPer100g.calories, unit: "kcal" },
        { label: "Đạm", value: food.nutritionPer100g.protein, unit: "g" },
        { label: "Tinh bột", value: food.nutritionPer100g.carbs, unit: "g" },
        { label: "Béo", value: food.nutritionPer100g.fat, unit: "g" },
        { label: "Chất xơ", value: food.nutritionPer100g.fiber, unit: "g" },
      ]
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-160 max-h-[90vh] rounded-3xl p-0 overflow-hidden border-[#E2E8F0]">
        <DialogHeader className="px-5 sm:px-6 py-4 border-b bg-white">
          <DialogTitle className="text-lg font-black text-[#0F172A]">
            Chi tiết ghi nhận món ăn
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-76px)]">
          <div className="p-5 sm:p-6 space-y-5 bg-[#FCFDF8]">
            {loading && !mealItem ? (
              <div className="h-52 flex flex-col items-center justify-center text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin text-[#86a800] mb-3" />
                <p className="text-sm font-medium">Đang tải thông tin...</p>
              </div>
            ) : !mealItem ? (
              <div className="h-52 flex items-center justify-center text-slate-500 text-sm">
                Không thể tải thông tin.
              </div>
            ) : (
              <>
                {/* Food card */}
                <div className="flex gap-4 bg-white rounded-2xl border border-slate-200 p-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                    <img
                      src={food?.imageUrl || fallbackImage}
                      alt={food?.foodName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
                    <h3 className="text-lg font-black text-[#0F172A] leading-tight">
                      {food?.foodName ?? "—"}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {food?.foodCategory?.name ?? "Chưa phân loại"}
                    </p>
                    {meal && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="px-2.5 py-1 rounded-full bg-[#f0f9e8] border border-[#c6e89a] text-[11px] font-bold text-[#5a8a00]">
                          {getMealLabel(meal.mealType)}
                        </span>
                        {mealDate && (
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-600">
                            {mealDate}
                          </span>
                        )}
                        {mealTime && (
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-600">
                            {mealTime}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quantity & grams */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-lime-50 border border-lime-100 px-4 py-3 flex items-center gap-3">
                    <Scale className="w-5 h-5 text-lime-600 shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold uppercase text-lime-700">
                        Trọng lượng
                      </p>
                      <p className="text-xl font-black text-[#0F172A]">
                        {Math.round(mealItem.grams)}
                        <span className="text-xs ml-1 font-bold text-slate-500">
                          g
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-purple-50 border border-purple-100 px-4 py-3 flex items-center gap-3">
                    <span className="text-xl shrink-0">🍽️</span>
                    <div>
                      <p className="text-[11px] font-bold uppercase text-purple-700">
                        Khẩu phần
                      </p>
                      <p className="text-xl font-black text-[#0F172A]">
                        {Math.round(mealItem.quantity)}
                        <span className="text-xs ml-1 font-bold text-slate-500">
                          phần ({food?.defaultServingGrams ?? "—"}{" "}
                          g/phần)
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Macros for this serving */}
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#0F172A] mb-3">
                    Dinh dưỡng đã tiêu thụ
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {macros.map((m) => (
                      <div
                        key={m.label}
                        className={`rounded-2xl border p-3 ${m.color}`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold uppercase leading-none">
                            {m.label}
                          </span>
                          <m.icon className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-lg font-black text-[#0F172A]">
                          {Math.round(m.value)}
                          <span className="text-[10px] ml-0.5 font-bold text-slate-500">
                            {m.unit}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Per 100g reference */}
                {per100g.length > 0 && (
                  <div className="rounded-2xl bg-white border border-slate-200 p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">
                      Dinh dưỡng trên 100g (tham khảo)
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {per100g.map((item) => (
                        <div
                          key={item.label}
                          className="flex flex-col items-center bg-slate-50 rounded-xl px-2 py-2.5 border border-slate-100"
                        >
                          <span className="text-[10px] font-bold uppercase text-slate-500 mb-1">
                            {item.label}
                          </span>
                          <span className="text-sm font-black text-[#0F172A]">
                            {Math.round(item.value)}
                            <span className="text-[9px] ml-0.5 font-bold text-slate-400">
                              {item.unit}
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
