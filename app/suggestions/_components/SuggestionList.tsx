"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, Flame, SearchX } from "lucide-react";
import { FoodItem } from "../page";

interface SuggestionListProps {
  foods: FoodItem[];
  selectedMeal: string;
  isLoading?: boolean;
  onFoodClick?: (food: FoodItem) => void;
}

export function SuggestionList({
  foods,
  selectedMeal,
  isLoading,
  onFoodClick,
}: SuggestionListProps) {
  return (
    <div className="col-span-1 md:col-span-7 bg-white rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 shadow-sm border border-[#F1F5F9] flex flex-col h-full overflow-hidden">
      <div className="mb-4 md:mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-2 shrink-0">
        <h2 className="text-lg md:text-xl font-black text-[#0F172A] uppercase tracking-tight">
          Gợi Ý Món Ăn
        </h2>
        <span className="text-sm font-bold text-[#64748B] bg-[#F1F5F9] px-4 py-1.5 rounded-full">
          {isLoading
            ? "Đang tải..."
            : `${foods.length} lựa chọn cho ${selectedMeal.toLowerCase()}`}
        </span>
      </div>

      {/* Vùng scroll cho danh sách món ăn */}
      <ScrollArea className="flex-1 -mx-4 px-4 sm:-mx-5 sm:px-5 md:-mx-6 md:px-6">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 pb-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-slate-50 rounded-2xl overflow-hidden border border-[#F1F5F9] flex flex-col h-[200px] sm:h-[240px]"
              >
                <div className="h-28 sm:h-32 lg:h-36 bg-slate-200" />
                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                  </div>
                  <div className="h-6 bg-slate-200 rounded w-16 mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : foods.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center h-full">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <SearchX className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Chưa có gợi ý nào
            </h3>
            <p className="text-slate-500 text-sm max-w-[280px]">
              Không tìm thấy món ăn phù hợp với tiêu chí của bạn. Hãy thử thay
              đổi bộ lọc hoặc kiểm tra kết nối API.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 pb-6">
            {foods.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onFoodClick?.(item)}
                className="group/item bg-white rounded-2xl overflow-hidden border border-[#F1F5F9] hover:border-[#CAFD00]/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer relative text-left"
                aria-label={`Xem chi tiết món ${item.name}`}
              >
                <div className="relative h-28 sm:h-32 lg:h-36 overflow-hidden bg-gray-100 shrink-0">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110"
                  />
                </div>
                <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between bg-white relative z-10">
                  <h3 className="text-xs sm:text-sm font-black text-[#0F172A] mb-2 sm:mb-3 line-clamp-2 leading-tight group-hover/item:text-[#86a800] transition-colors">
                    {item.name}
                  </h3>

                  <div className="flex items-center justify-between gap-2 mt-auto">
                    <div className="bg-orange-50 text-orange-600 px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1.5 w-fit">
                      <Flame className="w-3.5 h-3.5" />
                      {item.cals} kcal
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
