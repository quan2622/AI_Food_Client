"use client";

import React, { useState, useEffect } from "react";
import CalendarBar from "./_components/CalendarBar";
import MealTimeline from "./_components/MealTimeline";
import { dailyLogService, Meal } from "@/services/dailyLogService";

export default function DiaryPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    // 2-second debounce
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const year = selectedDate.getFullYear();
        const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
        const day = selectedDate.getDate().toString().padStart(2, "0");
        const dateString = `${year}-${month}-${day}`;

        const res = await dailyLogService.getDailyLogByDate(dateString);
        
        if (isMounted) {
          if (res.data?.meals) {
            setMeals(res.data.meals);
          } else {
            setMeals([]);
          }
        }
      } catch {
        // If API returns 404 or empty because no log exists, it's normal.
        if (isMounted) setMeals([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }, 1000);

    return () => {
      isMounted = false;
      clearTimeout(t);
    };
  }, [selectedDate]);

  return (
    <div className="h-screen pt-[100px] font-sans max-w-3xl mx-auto flex flex-col overflow-hidden">
      {/* Calendar Bar */}
        <div className="shrink-0">
          <CalendarBar onDateChange={setSelectedDate} />
        </div>

        {/* Timeline Scroll Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar mt-2 pb-10 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10 backdrop-blur-sm">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9FD923]"></div>
            </div>
          )}
          <MealTimeline meals={meals} />
        </div>
    </div>
  );
}
