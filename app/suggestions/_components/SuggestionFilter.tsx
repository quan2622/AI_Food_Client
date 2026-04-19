"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Check,
  Utensils,
  Target,
  Flame,
  Beef,
  Wheat,
  Droplet,
  Leaf,
  SlidersHorizontal,
  ChevronDown,
  CalendarDays,
} from "lucide-react";

interface SuggestionFilterProps {
  selectedMeal: string;
  onMealChange: (meal: string) => void;
  selectedPriority: string;
  onPriorityChange: (priority: string) => void;
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  target: {
    targetCalories: number;
    targetProtein: number;
    targetCarbs: number;
    targetFat: number;
    targetFiber: number;
  };
  goalStatus?: string;
  goalType?: string;
  endDate?: string;
  onApplyFilter: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const goalStatusMap: Record<string, { label: string; cls: string }> = {
  NUTR_GOAL_ONGOING: {
    label: "Đang diễn ra",
    cls: "bg-green-50 text-green-700 border-green-200",
  },
  NUTR_GOAL_COMPLETED: {
    label: "Hoàn thành",
    cls: "bg-blue-50 text-blue-700 border-blue-200",
  },
  NUTR_GOAL_PAUSED: {
    label: "Tạm dừng",
    cls: "bg-amber-50 text-amber-700 border-amber-200",
  },
  NUTR_GOAL_FAILED: {
    label: "Thất bại",
    cls: "bg-red-50 text-red-700 border-red-200",
  },
};

const goalTypeMap: Record<string, string> = {
  GOAL_LOSS: "Giảm cân",
  GOAL_GAIN: "Tăng cân",
  GOAL_MAINTAIN: "Duy trì",
  GOAL_STRICT: "Nghiêm ngặt",
};

export function SuggestionFilter({
  selectedMeal,
  onMealChange,
  selectedPriority,
  onPriorityChange,
  totals,
  target,
  goalStatus,
  goalType,
  endDate,
  onApplyFilter,
  isOpen,
  onToggle,
}: SuggestionFilterProps) {
  const meals = ["Bữa sáng", "Bữa trưa", "Bữa tối", "Bữa phụ"];
  const priorities = [
    "Cân bằng",
    "Nhiều chất đạm",
    "Nhiều tinh bột",
    "Nhiều chất béo",
    "Nhiều chất xơ",
  ];

  const nutritionStatus = [
    {
      label: "Calo",
      current: totals?.calories || 0,
      target: target?.targetCalories || 0,
      unit: "kcal",
      icon: Flame,
      color: "text-orange-500",
      bg: "bg-orange-50",
      bar: "bg-orange-400",
    },
    {
      label: "Đạm",
      current: totals?.protein || 0,
      target: target?.targetProtein || 0,
      unit: "g",
      icon: Beef,
      color: "text-red-500",
      bg: "bg-red-50",
      bar: "bg-red-400",
    },
    {
      label: "Tinh bột",
      current: totals?.carbs || 0,
      target: target?.targetCarbs || 0,
      unit: "g",
      icon: Wheat,
      color: "text-amber-500",
      bg: "bg-amber-50",
      bar: "bg-amber-400",
    },
    {
      label: "Béo",
      current: totals?.fat || 0,
      target: target?.targetFat || 0,
      unit: "g",
      icon: Droplet,
      color: "text-yellow-500",
      bg: "bg-yellow-50",
      bar: "bg-yellow-400",
    },
    {
      label: "Xơ",
      current: totals?.fiber || 0,
      target: target?.targetFiber || 30,
      unit: "g",
      icon: Leaf,
      color: "text-green-600",
      bg: "bg-green-50",
      bar: "bg-green-500",
    },
  ];

  const getStatus = (current: number, target: number) => {
    if (target === 0) return null;
    const pct = (current / target) * 100;
    if (pct >= 110)
      return { label: "Vượt", cls: "text-red-600 bg-red-50 border-red-200" };
    if (pct >= 90)
      return {
        label: "Đạt",
        cls: "text-green-700 bg-green-50 border-green-200",
      };
    if (pct >= 60)
      return {
        label: "Gần đạt",
        cls: "text-amber-600 bg-amber-50 border-amber-200",
      };
    return {
      label: "Thiếu",
      cls: "text-slate-500 bg-slate-50 border-slate-200",
    };
  };

  const getBarColor = (current: number, target: number, defaultBar: string) => {
    if (target === 0) return defaultBar;
    const pct = (current / target) * 100;
    if (pct >= 110) return "bg-red-500";
    if (pct >= 90) return "bg-green-500";
    return defaultBar;
  };

  /* ─── Nội dung bộ lọc (dùng chung cho cả mobile và desktop) ─── */
  const filterContent = (
    <>
      {/* TRẠNG THÁI MỤC TIÊU */}
      {(goalStatus || goalType || endDate) && (
        <div className="mb-4 md:mb-5 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {goalType && (
                <span className="text-xs font-black text-[#0F172A] bg-[#CAFD00]/20 px-2.5 py-1 rounded-lg border border-[#CAFD00]/40">
                  {goalTypeMap[goalType] ?? goalType}
                </span>
              )}
              {goalStatus &&
                (() => {
                  const s = goalStatusMap[goalStatus];
                  return (
                    <span
                      className={`text-xs font-black px-2.5 py-1 rounded-lg border ${s?.cls ?? "bg-slate-50 text-slate-600 border-slate-200"}`}
                    >
                      {s?.label ?? goalStatus}
                    </span>
                  );
                })()}
            </div>
            {endDate && (
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                <CalendarDays className="w-3.5 h-3.5" />
                Kết thúc: {new Date(endDate).toLocaleDateString("vi-VN")}
              </div>
            )}
          </div>
        </div>
      )}

      {/* KHỐI TRẠNG THÁI DINH DƯỠNG */}
      <div className="mb-4 md:mb-6">
        <label className="text-sm font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-2 mb-3">
          <Target className="w-4 h-4" />
          Tiến độ hôm nay
        </label>
        <div className="flex flex-col gap-2.5">
          {nutritionStatus.map((item, idx) => {
            const pct =
              item.target > 0
                ? Math.min((item.current / item.target) * 100, 100)
                : 0;
            const status = getStatus(item.current, item.target);
            const barColor = getBarColor(item.current, item.target, item.bar);
            return (
              <div
                key={idx}
                className={`px-3 py-2.5 rounded-xl border border-white shadow-sm ${item.bg}`}
              >
                {/* Hàng trên: icon + tên + số liệu + trạng thái */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <item.icon
                      className={`w-3.5 h-3.5 shrink-0 ${item.color}`}
                    />
                    <span
                      className={`text-[11px] font-black uppercase tracking-wider ${item.color}`}
                    >
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-[#0F172A] whitespace-nowrap">
                      {Intl.NumberFormat("en-US").format(
                        Math.round(item.current),
                      )}
                      <span className="text-[10px] font-bold text-slate-400">
                        /{Intl.NumberFormat("en-US").format(item.target)}{" "}
                        {item.unit}
                      </span>
                    </span>
                    {status && (
                      <span
                        className={`text-[10px] font-black px-1.5 py-0.5 rounded-md border ${status.cls} whitespace-nowrap`}
                      >
                        {status.label}
                      </span>
                    )}
                  </div>
                </div>
                {/* Thanh tiến trình */}
                <div className="h-1.5 w-full bg-white/70 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tiêu chí: Chọn bữa ăn */}
      <div className="mb-4 md:mb-6">
        <label className="text-sm font-bold text-[#64748B] uppercase tracking-wider mb-4 flex items-center gap-2">
          <Utensils className="w-4 h-4" />
          Định lượng theo bữa ăn
        </label>
        <div className="flex flex-row md:flex-col gap-2 md:gap-3 mt-3 overflow-x-auto md:overflow-x-visible scrollbar-hide pb-1 md:pb-0">
          {meals.map((meal) => (
            <button
              key={meal}
              onClick={() => onMealChange(meal)}
              className={`flex items-center justify-between px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 transition-all font-bold text-sm whitespace-nowrap shrink-0 cursor-pointer ${
                selectedMeal === meal
                  ? "border-[#CAFD00] bg-[#CAFD00]/5 text-[#0F172A]"
                  : "border-[#F1F5F9] text-[#64748B] hover:border-[#CAFD00]/40 hover:bg-gray-50"
              }`}
            >
              {meal}
              {selectedMeal === meal && (
                <div className="w-6 h-6 rounded-full bg-[#CAFD00] flex items-center justify-center ml-2">
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
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all font-bold text-xs cursor-pointer ${
                selectedPriority === pri
                  ? "border-[#CAFD00] bg-[#CAFD00]/10 text-[#0F172A] shadow-sm"
                  : "border-[#F1F5F9] bg-transparent text-[#64748B] hover:border-[#CAFD00]/30 hover:bg-gray-50"
              }`}
            >
              {pri}
              {selectedPriority === pri && (
                <Check className="w-3 h-3 text-[#0F172A]" />
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* ═══════════ MOBILE: Collapsible Filter ═══════════ */}
      <div className="md:hidden col-span-1 shrink-0">
        {/* Toggle button - luôn hiển thị */}
        <button
          onClick={onToggle}
          className="w-full bg-white rounded-2xl p-3.5 shadow-sm border border-[#F1F5F9] flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#CAFD00]/20 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4 text-[#86a800]" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-[#0F172A] leading-tight">
                  Bộ lọc
                </span>
                {!isOpen && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#0F172A] text-[10px] font-black text-[#CAFD00]">
                    2
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                  {selectedMeal}
                </span>
                <span className="text-[10px] bg-[#CAFD00]/20 text-[#6a8500] px-1.5 py-0.5 rounded font-bold">
                  {selectedPriority}
                </span>
              </div>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <ChevronDown className="w-5 h-5 text-[#64748B]" />
          </motion.div>
        </button>

        {/* Expandable content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-2xl mt-2 p-4 shadow-sm border border-[#F1F5F9]">
                {filterContent}

                {/* Apply button */}
                <div className="pt-3 border-t border-[#F1F5F9] mt-2">
                  <button
                    onClick={onApplyFilter}
                    className="w-full bg-[#0F172A] text-[#CAFD00] py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-[#1e293b] active:scale-95 transition-all shadow-xl cursor-pointer"
                  >
                    Áp Dụng Bộ Lọc
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══════════ DESKTOP: Fixed Sidebar (giữ nguyên) ═══════════ */}
      <div className="hidden md:flex md:col-span-3 bg-white rounded-3xl p-6 shadow-sm border border-[#F1F5F9] flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="shrink-0 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#CAFD00]/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#86a800]" />
          </div>
          <h2 className="text-xl font-black text-[#0F172A] uppercase tracking-tight">
            Lọc Tiêu Chí
          </h2>
        </div>

        {/* Scroll area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-2 -mr-2">
          {filterContent}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#F1F5F9] shrink-0 mt-2">
          <button
            onClick={onApplyFilter}
            className="w-full bg-[#0F172A] text-[#CAFD00] py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#1e293b] active:scale-95 transition-all shadow-xl cursor-pointer"
          >
            Áp Dụng Bộ Lọc
          </button>
        </div>
      </div>
    </>
  );
}
