"use client";

import { Flame, Droplets, Wheat, Beef } from "lucide-react";
import React from "react";

// Using placeholder image URLs since local assets are unavailable
const breakfastOatmeal = "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=400&q=80";
const breakfastEggs = "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=400&q=80";
const lunchChicken = "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=400&q=80";
const lunchSalad = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80";
const dinnerSteak = "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=400&q=80";
const dinnerPasta = "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=400&q=80";
const snackSmoothie = "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80";
const snackNuts = "https://images.unsplash.com/photo-1599599810069-8edcb59b63fa?auto=format&fit=crop&w=400&q=80";

interface MealItem {
  name: string;
  image: any;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealGroup {
  label: string;
  emoji: string;
  items: MealItem[];
}

const mealGroups: MealGroup[] = [
  {
    label: "Bữa sáng",
    emoji: "🌅",
    items: [
      { name: "Yến mạch trái cây", image: breakfastOatmeal, time: "07:00", calories: 320, protein: 12, carbs: 48, fat: 8 },
      { name: "Trứng bơ bánh mì", image: breakfastEggs, time: "07:30", calories: 410, protein: 22, carbs: 30, fat: 18 },
    ],
  },
  {
    label: "Bữa trưa",
    emoji: "☀️",
    items: [
      { name: "Gà nướng & cơm", image: lunchChicken, time: "11:30", calories: 520, protein: 38, carbs: 55, fat: 12 },
      { name: "Salad cá hồi", image: lunchSalad, time: "12:00", calories: 380, protein: 28, carbs: 18, fat: 20 },
    ],
  },
  {
    label: "Bữa tối",
    emoji: "🌙",
    items: [
      { name: "Bò bít tết", image: dinnerSteak, time: "18:00", calories: 580, protein: 42, carbs: 35, fat: 25 },
      { name: "Mì Ý sốt cà", image: dinnerPasta, time: "18:30", calories: 450, protein: 18, carbs: 62, fat: 14 },
    ],
  },
  {
    label: "Bữa phụ",
    emoji: "🥤",
    items: [
      { name: "Sinh tố protein", image: snackSmoothie, time: "15:00", calories: 220, protein: 18, carbs: 28, fat: 6 },
      { name: "Hạt hỗn hợp", image: snackNuts, time: "16:00", calories: 180, protein: 6, carbs: 12, fat: 14 },
    ],
  },
];

const NutritionBadge = ({ icon: Icon, value, unit, color }: { icon: React.ElementType; value: number; unit: string; color: string }) => (
  <div className="flex items-center gap-0.5 bg-[#F2F2F2]/50 px-1.5 py-0.5 rounded border border-[#0D0D0D]/5">
    <Icon className={`w-3 h-3 ${color}`} />
    <span className="text-[11px] font-bold text-foreground">{value}</span>
    <span className="text-[9px] text-muted-foreground uppercase font-semibold">{unit}</span>
  </div>
);

const MealTimeline = () => {
  return (
    <div className="px-6 pb-8 space-y-8">
      {mealGroups.map((group) => (
        <div key={group.label}>
          {/* Group header */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">{group.emoji}</span>
            <h3 className="text-lg font-bold text-foreground">{group.label}</h3>
            <div className="flex-1 h-px bg-border ml-2 opacity-50" />
          </div>

          {/* Timeline */}
          <div className="relative ml-[52px]">
            {/* Vertical line */}
            <div className="absolute left-0 top-4 bottom-4 w-px bg-border/60" />

            <div className="space-y-6">
              {group.items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-0">
                  {/* Time label - left of timeline */}
                  <span className="text-xs font-black text-[#9FD923] w-[52px] -ml-[52px] text-right pr-3 pt-4 flex-shrink-0">
                    {item.time}
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
                        src={item.image?.src || item.image}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 className="text-sm font-bold text-foreground mb-1.5 truncate">{item.name}</h4>

                      {/* Nutrition stats */}
                      <div className="flex items-center gap-1 flex-wrap">
                        <NutritionBadge icon={Flame} value={item.calories} unit="kcal" color="text-orange-500" />
                        <NutritionBadge icon={Beef} value={item.protein} unit="g" color="text-red-500" />
                        <NutritionBadge icon={Wheat} value={item.carbs} unit="g" color="text-amber-500" />
                        <NutritionBadge icon={Droplets} value={item.fat} unit="g" color="text-blue-500" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MealTimeline;
