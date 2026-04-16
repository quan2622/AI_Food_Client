"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Flame } from "lucide-react";
import { FoodItem } from "../page";

interface SuggestionListProps {
  foods: FoodItem[];
  selectedMeal: string;
  isLoading?: boolean;
}

export function SuggestionList({ foods, selectedMeal, isLoading }: SuggestionListProps) {
  return (
    <div className="col-span-1 md:col-span-7 bg-white rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 shadow-sm border border-[#F1F5F9] flex flex-col h-full overflow-hidden">
      <div className="mb-4 md:mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-2 shrink-0">
        <h2 className="text-lg md:text-xl font-black text-[#0F172A] uppercase tracking-tight">
          Gợi Ý Món Ăn
        </h2>
        <span className="text-sm font-bold text-[#64748B] bg-[#F1F5F9] px-4 py-1.5 rounded-full">
          {isLoading ? "Đang tải..." : `${foods.length} lựa chọn cho ${selectedMeal.toLowerCase()}`}
        </span>
      </div>

      {/* Vùng scroll cho danh sách món ăn */}
      <ScrollArea className="flex-1 -mx-4 px-4 sm:-mx-5 sm:px-5 md:-mx-6 md:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 pb-6">
          {foods.map((item) => (
            <div 
              key={item.id} 
              className="group/item bg-white rounded-2xl overflow-hidden border border-[#F1F5F9] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
            >
              <div className="relative h-28 sm:h-32 lg:h-36 overflow-hidden bg-gray-100 shrink-0">
                <img 
                  src={item.img} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110" 
                />
              </div>
              <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
                <h3 className="text-xs sm:text-sm font-black text-[#0F172A] mb-2 sm:mb-3 line-clamp-2 leading-tight">
                  {item.name}
                </h3>
                
                <div className="flex items-center gap-2 mt-auto">
                  <div className="bg-[#CAFD00]/20 text-[#6a8500] px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1.5 w-fit">
                    <Flame className="w-3.5 h-3.5" />
                    {item.cals} KCAL
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {foods.length === 0 && (
            <div className="col-span-2 sm:col-span-3 lg:col-span-4 py-20 text-center font-bold text-[#64748B]">
              Không có món ăn nào phù hợp với tiêu chí.
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
