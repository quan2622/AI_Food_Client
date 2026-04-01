"use client";

import React, { useState, useEffect } from "react";
import { SuggestionFilter } from "./_components/SuggestionFilter";
import { SuggestionList } from "./_components/SuggestionList";
import { dailyLogService, DashboardDailyLogResponse } from "@/services/dailyLogService";
import { nutritionGoalService, NutritionGoal } from "@/services/nutritionGoalService";

export interface FoodItem {
  id: string;
  name: string;
  cals: string;
  meal: string;
  img: string;
}

import { recommendationService } from "@/services/recommendationService";

const mealMap: Record<string, string> = {
  "Bữa sáng": "MEAL_BREAKFAST",
  "Bữa trưa": "MEAL_LUNCH",
  "Bữa tối": "MEAL_DINNER",
  "Bữa phụ": "MEAL_SNACK",
};

const priorityMap: Record<string, string> = {
  "Cân bằng": "BALANCED",
  "Nhiều Protein": "HIGH_PROTEIN",
  "Nhiều Carbs": "HIGH_CARBS",
  "Nhiều Fat": "HIGH_FAT",
  "Nhiều Fiber": "HIGH_FIBER",
};

export default function SuggestionsPage() {
  const [selectedMeal, setSelectedMeal] = useState("Bữa sáng");
  const [selectedPriority, setSelectedPriority] = useState("Cân bằng");
  
  const [dailyLog, setDailyLog] = useState<DashboardDailyLogResponse | null>(null);
  const [activeGoal, setActiveGoal] = useState<NutritionGoal | null>(null);

  const [displayFoods, setDisplayFoods] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dailyLogService.getDailyLogToday().then(res => {
      if (res.data) setDailyLog(res.data);
    }).catch(console.error);

    nutritionGoalService.getCurrentGoal().then(res => {
      if (res.data) setActiveGoal(res.data);
    }).catch(console.error);
  }, []);

  const fetchRecommendations = async (meal: string, priority: string) => {
    setIsLoading(true);
    try {
      const res = await recommendationService.getRecommendations({
        meal_type: mealMap[meal] || "MEAL_BREAKFAST",
        nutrition_priority: priorityMap[priority] || "BALANCED"
      });
      
      if (res.data?.data?.items) {
        const formattedFoods: FoodItem[] = res.data.data.items.map(item => ({
          id: String(item.id),
          name: item.foodName,
          cals: String(item.nutrition?.calories || 0),
          meal: meal,
          img: item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2680&auto=format&fit=crop"
        }));
        setDisplayFoods(formattedFoods);
      } else {
        setDisplayFoods([]);
      }
    } catch (error) {
      console.error(error);
      setDisplayFoods([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const currentHour = new Date().getHours();
    let defaultMeal = "Bữa phụ";
    if (currentHour >= 5 && currentHour < 10) defaultMeal = "Bữa sáng";
    else if (currentHour >= 10 && currentHour < 14) defaultMeal = "Bữa trưa";
    else if (currentHour >= 14 && currentHour < 17) defaultMeal = "Bữa phụ";
    else if (currentHour >= 17 && currentHour < 22) defaultMeal = "Bữa tối";
    
    setSelectedMeal(defaultMeal);
    setSelectedPriority("Cân bằng");
    
    // Call API with these defaults
    fetchRecommendations(defaultMeal, "Cân bằng");
  }, []);

  const handleApplyFilter = () => {
    fetchRecommendations(selectedMeal, selectedPriority);
  };

  const target = activeGoal || dailyLog?.nutritionGoal || { targetCalories: 2000, targetProtein: 120, targetCarbs: 220, targetFat: 65, targetFiber: 30 };
  const totals = dailyLog?.totals || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }; 

  return (
    <div className="h-screen w-full flex flex-col pt-28 px-10 pb-6 overflow-hidden">
      {/* Container chính chia 3:7 theo yêu cầu */}
      <div className="flex-1 grid grid-cols-10 gap-6 overflow-hidden max-w-[1600px] w-full mx-auto">
        
        {/* KHỐI BÊN TRÁI: FORM CHỌN TIÊU CHÍ (3/10) */}
        <SuggestionFilter 
          selectedMeal={selectedMeal} 
          onMealChange={setSelectedMeal} 
          selectedPriority={selectedPriority}
          onPriorityChange={setSelectedPriority}
          totals={totals}
          target={target}
          onApplyFilter={handleApplyFilter}
        />

        {/* KHỐI BÊN PHẢI: DANH SÁCH MÓN ĂN (7/10) */}
        <SuggestionList foods={displayFoods} selectedMeal={selectedMeal} isLoading={isLoading} />
        
      </div>
    </div>
  );
}
