"use client";

import React from "react";
import CalendarBar from "./_components/CalendarBar";
import MealTimeline from "./_components/MealTimeline";

export default function DiaryPage() {
  return (
    <div className="h-screen pt-[100px] font-sans max-w-3xl mx-auto flex flex-col overflow-hidden">
      {/* Calendar Bar */}
        <div className="shrink-0">
          <CalendarBar />
        </div>

        {/* Timeline Scroll Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar mt-2 pb-10">
          <MealTimeline />
        </div>
    </div>
  );
}
