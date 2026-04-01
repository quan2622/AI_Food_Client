"use client";

import React from "react";
import { Sparkles, Check, Utensils, Target, Flame, Beef, Wheat, Droplet, Leaf } from "lucide-react";

interface SuggestionFilterProps {
  selectedMeal: string;
  onMealChange: (meal: string) => void;
  selectedPriority: string;
  onPriorityChange: (priority: string) => void;
  totals: { calories: number; protein: number; carbs: number; fat: number; fiber: number; };
  target: { targetCalories: number; targetProtein: number; targetCarbs: number; targetFat: number; targetFiber: number; };
  onApplyFilter: () => void;
}

export function SuggestionFilter({ selectedMeal, onMealChange, selectedPriority, onPriorityChange, totals, target, onApplyFilter }: SuggestionFilterProps) {
  const meals = ["Bữa sáng", "Bữa trưa", "Bữa tối", "Bữa phụ"];
  const priorities = ["Cân bằng", "Nhiều Protein", "Nhiều Carbs", "Nhiều Fat", "Nhiều Fiber"];

  const nutritionStatus = [
    { label: "Calo", current: totals?.calories || 0, target: target?.targetCalories || 0, unit: "kcal", icon: Flame, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Pro", current: totals?.protein || 0, target: target?.targetProtein || 0, unit: "g", icon: Beef, color: "text-red-500", bg: "bg-red-50" },
    { label: "Carb", current: totals?.carbs || 0, target: target?.targetCarbs || 0, unit: "g", icon: Wheat, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Fat", current: totals?.fat || 0, target: target?.targetFat || 0, unit: "g", icon: Droplet, color: "text-yellow-500", bg: "bg-yellow-50" },
    { label: "Fib", current: totals?.fiber || 0, target: target?.targetFiber || 30, unit: "g", icon: Leaf, color: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <div className="col-span-3 bg-white rounded-3xl p-6 shadow-sm border border-[#F1F5F9] flex flex-col h-full overflow-hidden">
      {/* Header Sticky */}
      <div className="shrink-0 mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#CAFD00]/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-[#86a800]" />
        </div>
        <h2 className="text-xl font-black text-[#0F172A] uppercase tracking-tight">
          Lọc Tiêu Chí
        </h2>
      </div>

      {/* Scroll Area inside Panel */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-2 -mr-2">
        {/* KHỐI TRẠNG THÁI DINH DƯỠNG (Dạng Badge/Tags) */}
        <div className="mb-6">
          <label className="text-sm font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-2 mb-3">
            <Target className="w-4 h-4" />
            Tiến độ hôm nay
          </label>
          <div className="flex flex-wrap gap-2">
            {nutritionStatus.map((item, idx) => (
              <div key={idx} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white shadow-sm ${item.bg}`}>
                <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                <div className="flex items-baseline gap-0.5 whitespace-nowrap">
                  <span className="text-xs font-black text-[#0F172A]">{item.current}</span>
                  <span className="text-[10px] font-bold text-slate-400">/{item.target}{item.unit === "kcal" ? "k" : "g"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tiêu chí: Chọn bữa ăn */}
        <div className="mb-6">
          <label className="text-sm font-bold text-[#64748B] uppercase tracking-wider mb-4 flex items-center gap-2">
            <Utensils className="w-4 h-4" />
            Định lượng theo bữa ăn
          </label>
          <div className="flex flex-col gap-3 mt-3">
            {meals.map((meal) => (
              <button
                key={meal}
                onClick={() => onMealChange(meal)}
                className={`flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all font-bold text-sm ${
                  selectedMeal === meal
                    ? "border-[#CAFD00] bg-[#CAFD00]/5 text-[#0F172A]"
                    : "border-[#F1F5F9] text-[#64748B] hover:border-[#CAFD00]/40 hover:bg-gray-50"
                }`}
              >
                {meal}
                {selectedMeal === meal && (
                  <div className="w-6 h-6 rounded-full bg-[#CAFD00] flex items-center justify-center">
                    <Check className="w-4 h-4 text-[#0F172A]" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Tiêu chí: Ưu tiên dinh dưỡng */}
        <div className="mb-4">
          <label className="text-sm font-bold text-[#64748B] uppercase tracking-wider mb-4 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Ưu tiên dinh dưỡng
          </label>
          <div className="flex flex-wrap gap-2 mt-3">
            {priorities.map((pri) => (
              <button
                key={pri}
                onClick={() => onPriorityChange(pri)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all font-bold text-xs ${
                  selectedPriority === pri
                    ? "border-[#CAFD00] bg-[#CAFD00]/10 text-[#0F172A] shadow-sm"
                    : "border-[#F1F5F9] bg-transparent text-[#64748B] hover:border-[#CAFD00]/30 hover:bg-gray-50"
                }`}
              >
                {pri}
                {selectedPriority === pri && <Check className="w-3 h-3 text-[#0F172A]" />}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer sticky bottom */}
      <div className="pt-4 border-t border-[#F1F5F9] shrink-0 mt-2">
        <button 
          onClick={onApplyFilter}
          className="w-full bg-[#0F172A] text-[#CAFD00] py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#1e293b] active:scale-95 transition-all shadow-xl"
        >
          Áp Dụng Bộ Lọc
        </button>
      </div>
    </div>
  );
}
