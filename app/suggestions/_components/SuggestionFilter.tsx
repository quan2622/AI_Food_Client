"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, Utensils, Target, Flame, Beef, Wheat, Droplet, Leaf, SlidersHorizontal, ChevronDown } from "lucide-react";

interface SuggestionFilterProps {
  selectedMeal: string;
  onMealChange: (meal: string) => void;
  selectedPriority: string;
  onPriorityChange: (priority: string) => void;
  totals: { calories: number; protein: number; carbs: number; fat: number; fiber: number; };
  target: { targetCalories: number; targetProtein: number; targetCarbs: number; targetFat: number; targetFiber: number; };
  onApplyFilter: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function SuggestionFilter({ selectedMeal, onMealChange, selectedPriority, onPriorityChange, totals, target, onApplyFilter, isOpen, onToggle }: SuggestionFilterProps) {
  const meals = ["Bữa sáng", "Bữa trưa", "Bữa tối", "Bữa phụ"];
  const priorities = ["Cân bằng", "Nhiều chất đạm", "Nhiều tinh bột", "Nhiều chất béo", "Nhiều chất xơ"];

  const nutritionStatus = [
    { label: "Calo", current: totals?.calories || 0, target: target?.targetCalories || 0, unit: "kcal", icon: Flame, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Đạm", current: totals?.protein || 0, target: target?.targetProtein || 0, unit: "g", icon: Beef, color: "text-red-500", bg: "bg-red-50" },
    { label: "Tinh bột", current: totals?.carbs || 0, target: target?.targetCarbs || 0, unit: "g", icon: Wheat, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Béo", current: totals?.fat || 0, target: target?.targetFat || 0, unit: "g", icon: Droplet, color: "text-yellow-500", bg: "bg-yellow-50" },
    { label: "Xơ", current: totals?.fiber || 0, target: target?.targetFiber || 30, unit: "g", icon: Leaf, color: "text-green-600", bg: "bg-green-50" },
  ];

  /* ─── Nội dung bộ lọc (dùng chung cho cả mobile và desktop) ─── */
  const filterContent = (
    <>
      {/* KHỐI TRẠNG THÁI DINH DƯỠNG */}
      <div className="mb-4 md:mb-6">
        <label className="text-sm font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-2 mb-3">
          <Target className="w-4 h-4" />
          Tiến độ hôm nay
        </label>
        <div className="flex flex-wrap gap-2">
          {nutritionStatus.map((item, idx) => (
            <div key={idx} className={`flex items-center gap-2 px-3 py-2 rounded-xl border border-white shadow-sm ${item.bg}`}>
              <div className="flex items-center gap-1.5 border-r border-[#0F172A]/10 pr-2">
                <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                <span className={`text-[11px] font-black uppercase tracking-wider ${item.color}`}>{item.label}</span>
              </div>
              <div className="flex items-baseline gap-0.5 whitespace-nowrap pl-0.5">
                <span className="text-xs font-black text-[#0F172A]">{Intl.NumberFormat('en-US').format(item.current)}</span>
                <span className="text-[10px] font-bold text-slate-500">/{Intl.NumberFormat('en-US').format(item.target)} {item.unit}</span>
              </div>
            </div>
          ))}
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
              {selectedPriority === pri && <Check className="w-3 h-3 text-[#0F172A]" />}
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
                <span className="text-sm font-black text-[#0F172A] leading-tight">Bộ lọc</span>
                {!isOpen && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#0F172A] text-[10px] font-black text-[#CAFD00]">
                    2
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">{selectedMeal}</span>
                <span className="text-[10px] bg-[#CAFD00]/20 text-[#6a8500] px-1.5 py-0.5 rounded font-bold">{selectedPriority}</span>
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
