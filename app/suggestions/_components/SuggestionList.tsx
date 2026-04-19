"use client";

import React, { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, Flame, Loader2, Search, SearchX, X } from "lucide-react";
import { FoodItem } from "../page";
import { foodService } from "@/services/foodService";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const q = searchQuery.trim();
    if (!q) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    // Xóa kết quả cũ ngay lập tức, hiển thị skeleton
    setSearchResults([]);
    setIsSearching(true);

    let cancelled = false;

    debounceRef.current = setTimeout(async () => {
      try {
        const results = await foodService.searchFood(q, 20);
        if (cancelled) return; // Bỏ qua nếu query đã đổi
        const mapped: FoodItem[] = results.map((r) => ({
          id: r.id,
          name: r.foodName,
          cals: String(r.calories ?? 0),
          meal: selectedMeal,
          img:
            r.imageUrl ||
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2680&auto=format&fit=crop",
        }));
        setSearchResults(mapped);
      } catch {
        if (!cancelled) setSearchResults([]);
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    }, 400);

    return () => {
      cancelled = true;
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, selectedMeal]);

  const isQueryActive = searchQuery.trim().length > 0;
  const displayFoods = isQueryActive ? searchResults : foods;
  const showLoading = isQueryActive ? isSearching : isLoading;
  return (
    <div className="col-span-1 md:col-span-7 bg-white rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 shadow-sm border border-[#F1F5F9] flex flex-col h-full overflow-hidden">
      <div className="mb-4 md:mb-6 flex flex-col gap-3 shrink-0">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <h2 className="text-lg md:text-xl font-black text-[#0F172A] uppercase tracking-tight">
            Gợi Ý Món Ăn
          </h2>
          <span className="text-sm font-bold text-[#64748B] bg-[#F1F5F9] px-4 py-1.5 rounded-full">
            {showLoading
              ? "Đang tải..."
              : `${displayFoods.length} lựa chọn${isQueryActive ? ` cho "${searchQuery.trim()}"` : ` cho ${selectedMeal.toLowerCase()}`}`}
          </span>
        </div>
        {/* Ô tìm kiếm */}
        <div className="relative">
          {isSearching ? (
            <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] animate-spin" />
          ) : (
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          )}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm món ăn..."
            className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm font-medium text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#CAFD00]/60 focus:border-[#CAFD00] transition-all"
          />
          {isQueryActive && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] transition-colors"
              aria-label="Xóa tìm kiếm"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Vùng scroll cho danh sách món ăn */}
      <ScrollArea className="flex-1 -mx-4 px-4 sm:-mx-5 sm:px-5 md:-mx-6 md:px-6">
        {showLoading ? (
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
        ) : displayFoods.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center h-full">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <SearchX className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              {searchQuery.trim()
                ? "Không tìm thấy kết quả"
                : "Chưa có gợi ý nào"}
            </h3>
            <p className="text-slate-500 text-sm max-w-[280px]">
              {searchQuery.trim()
                ? `Không có món ăn nào khớp với "${searchQuery}". Hãy thử từ khóa khác.`
                : "Không tìm thấy món ăn phù hợp với tiêu chí của bạn. Hãy thử thay đổi bộ lọc hoặc kiểm tra kết nối API."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 pb-6">
            {displayFoods.map((item) => (
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
