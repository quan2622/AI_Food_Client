"use client";

import React from "react";
import { Sparkles, Check, Utensils } from "lucide-react";

interface SuggestionFilterProps {
  selectedMeal: string;
  onMealChange: (meal: string) => void;
}

export function SuggestionFilter({ selectedMeal, onMealChange }: SuggestionFilterProps) {
  const meals = ["Bữa sáng", "Bữa trưa", "Bữa tối", "Bữa phụ"];

  return (
    <div className="col-span-3 bg-white rounded-3xl p-6 shadow-sm border border-[#F1F5F9] flex flex-col h-full overflow-y-auto">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#CAFD00]/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-[#86a800]" />
        </div>
        <h2 className="text-xl font-black text-[#0F172A] uppercase tracking-tight">
          Lọc Tiêu Chí
        </h2>
      </div>

      <div className="flex-1">
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
        
        {/* Nếu có thêm các trường form lọc khác (calo, thời gian,...) có thể thêm ở đây */}
      </div>
      
      <div className="pt-6 border-t border-[#F1F5F9]">
        <button className="w-full bg-[#0F172A] text-[#CAFD00] py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#1e293b] active:scale-95 transition-all shadow-xl">
          Áp Dụng Bộ Lọc
        </button>
      </div>
    </div>
  );
}
