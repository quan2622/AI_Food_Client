"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Drumstick, Flame, Leaf, Loader2, Soup, Wheat } from "lucide-react";
import type { IFood } from "@/types/food.type";

interface FoodPreview {
  id: number;
  name: string;
  cals: string;
  img: string;
}

interface FoodDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  food: IFood | null;
  loading?: boolean;
  foodPreview?: FoodPreview | null;
}

function formatUnit(unit?: string | null) {
  const map: Record<string, string> = {
    UNIT_G: "g",
    UNIT_MG: "mg",
    UNIT_KG: "kg",
    UNIT_ML: "ml",
    UNIT_L: "l",
    KCAL: "kcal",
    G: "g",
    MG: "mg",
    KG: "kg",
    ML: "ml",
    L: "l",
  };

  return unit ? (map[unit] ?? unit.toLowerCase()) : "";
}

export function FoodDetailDialog({
  open,
  onOpenChange,
  food,
  loading,
  foodPreview,
}: FoodDetailDialogProps) {
  const nutritionValues = food?.nutritionProfile?.values ?? [];
  const ingredients = food?.foodIngredients ?? [];

  const findNutrientValue = (keywords: string[]) => {
    const found = nutritionValues.find((item) => {
      const nutrientName = item.nutrient?.name?.toLowerCase() ?? "";
      return keywords.some((keyword) => nutrientName.includes(keyword));
    });

    return found?.value ?? null;
  };

  const calories = findNutrientValue(["calo", "calorie", "energy"]);
  const protein = findNutrientValue(["protein", "đạm"]);
  const carbs = findNutrientValue(["carb", "tinh bột"]);
  const fat = findNutrientValue(["fat", "béo"]);
  const fiber = findNutrientValue(["fiber", "fibre", "xơ"]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px] max-h-[90vh] rounded-3xl p-0 overflow-hidden border-[#E2E8F0]">
        <DialogHeader className="px-5 sm:px-6 py-4 border-b bg-white">
          <DialogTitle className="text-lg sm:text-xl font-black text-[#0F172A]">
            {food?.foodName || foodPreview?.name || "Chi tiết món ăn"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-76px)]">
          <div className="p-5 sm:p-6 space-y-6 bg-[#FCFDF8]">
            {loading && !food ? (
              <div className="h-56 flex flex-col items-center justify-center text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin text-[#86a800] mb-3" />
                <p className="text-sm font-medium">
                  Đang tải chi tiết món ăn...
                </p>
              </div>
            ) : !food ? (
              <div className="h-56 flex items-center justify-center text-slate-500 text-sm">
                Không thể tải thông tin món ăn.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5">
                  <div className="rounded-2xl overflow-hidden border bg-white h-[180px] sm:h-[220px]">
                    <img
                      src={
                        food.imageUrl ||
                        foodPreview?.img ||
                        "/images/placeholder-food.png"
                      }
                      alt={food.foodName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="text-2xl font-black text-[#0F172A] leading-tight">
                        {food.foodName}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {food.foodCategory?.name || "Chưa phân loại"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-orange-50 border border-orange-100 px-3 py-3">
                        <p className="text-[11px] font-bold uppercase text-orange-600 mb-1">
                          Calo
                        </p>
                        <p className="text-xl font-black text-[#0F172A]">
                          {calories ?? foodPreview?.cals ?? "—"}
                          <span className="text-xs ml-1 font-bold text-slate-500">
                            kcal
                          </span>
                        </p>
                      </div>
                      <div className="rounded-2xl bg-lime-50 border border-lime-100 px-3 py-3">
                        <p className="text-[11px] font-bold uppercase text-lime-700 mb-1">
                          Khẩu phần
                        </p>
                        <p className="text-xl font-black text-[#0F172A]">
                          {food.defaultServingGrams ?? "—"}
                          <span className="text-xs ml-1 font-bold text-slate-500">
                            g
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white border border-slate-200 p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                        Mô tả
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {food.description || "Chưa có mô tả cho món ăn này."}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-[#0F172A] mb-3">
                    Thông tin dinh dưỡng
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      {
                        label: "Chất đạm",
                        value: protein,
                        icon: Drumstick,
                        color: "bg-blue-50 border-blue-100 text-blue-600",
                      },
                      {
                        label: "Tinh bột",
                        value: carbs,
                        icon: Wheat,
                        color: "bg-sky-50 border-sky-100 text-sky-600",
                      },
                      {
                        label: "Chất béo",
                        value: fat,
                        icon: Flame,
                        color: "bg-amber-50 border-amber-100 text-amber-600",
                      },
                      {
                        label: "Chất xơ",
                        value: fiber,
                        icon: Leaf,
                        color:
                          "bg-emerald-50 border-emerald-100 text-emerald-600",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className={`rounded-2xl border p-3 ${item.color}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold uppercase leading-none">
                            {item.label}
                          </span>
                          <item.icon className="w-4 h-4" />
                        </div>
                        <p className="text-xl font-black text-[#0F172A]">
                          {item.value ?? "—"}
                          <span className="text-xs ml-1 font-bold text-slate-500">
                            g
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>

                  {nutritionValues.length > 0 && (
                    <div className="mt-4 rounded-2xl bg-white border border-slate-200 p-4 space-y-2">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                        Dữ liệu dinh dưỡng chi tiết
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {nutritionValues.map((item, idx) => (
                          <div
                            key={`${item.nutrientId ?? idx}-${idx}`}
                            className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm"
                          >
                            <span className="text-slate-700 font-medium">
                              {item.nutrient?.name || `Chỉ số ${idx + 1}`}
                            </span>
                            <span className="font-black text-[#0F172A]">
                              {item.value} {formatUnit(item.nutrient?.unit)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-[#0F172A] mb-3 flex items-center gap-2">
                    <Soup className="w-4 h-4 text-[#86a800]" />
                    Nguyên liệu món ăn
                  </h4>

                  {ingredients.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-sm text-slate-500 text-center">
                      Chưa có danh sách nguyên liệu cho món ăn này.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {ingredients.map((item, idx) => (
                        <div
                          key={`${item.id ?? idx}-${idx}`}
                          className="rounded-2xl bg-white border border-slate-200 px-4 py-3"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-semibold text-[#0F172A]">
                              {item.ingredient?.ingredientName ||
                                `Nguyên liệu ${idx + 1}`}
                            </span>
                            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
                              {item.quantityGrams ?? 0} g
                            </span>
                          </div>

                          {(item.ingredient?.ingredientAllergens?.length ?? 0) >
                            0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {item.ingredient?.ingredientAllergens?.map(
                                (allergenItem, allergenIdx) => (
                                  <span
                                    key={`${allergenItem.allergen?.name ?? allergenIdx}-${allergenIdx}`}
                                    className="px-2 py-1 rounded-full bg-rose-50 text-rose-600 text-[11px] font-bold border border-rose-100"
                                  >
                                    {allergenItem.allergen?.name}
                                  </span>
                                ),
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
