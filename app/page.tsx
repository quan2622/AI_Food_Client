"use client";

import React from "react";
import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Import dashboard components
import LifestyleFuel from "@/components/dashboard/LifestyleFuel";
import MacroBreakdown from "@/components/dashboard/MacroBreakdown";
import GoalStatus from "@/components/dashboard/GoalStatus";
import BodyStats from "@/components/dashboard/BodyStats";
import RecentFuel from "@/components/dashboard/RecentFuel";
import NutritionTrends from "@/components/dashboard/NutritionTrends";

export default function Home() {
  return (
    <ScrollArea className="h-screen w-full">
      <div className="pt-28 px-10 pb-16">
        <div className="max-w-[1600px] mx-auto pt-2">
          <div className="grid grid-cols-12 gap-5">
            {/* Top Row: Lifestyle Fuel & Sidebar (Macros + Goal) */}
            <LifestyleFuel />
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-5">
              <MacroBreakdown />
              <GoalStatus />
            </div>

            {/* Row 2: Body Stats & Recent Fuel */}
            <BodyStats />
            <RecentFuel />

            {/* Row 3: Nutrition Trends Chart (Full Width) */}
            <NutritionTrends />
          </div>

          {/* FAB - Fixed Action Button */}
          <button className="fixed bottom-10 right-10 w-20 h-20 bg-[#0F172A]/80 backdrop-blur-xl border border-[#CAFD00]/40 text-[#CAFD00] rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.3)] flex items-center justify-center transition-all duration-300 hover:shadow-[0_20px_60px_rgba(202,253,0,0.4)] hover:border-[#CAFD00] hover:bg-[#0F172A] hover:scale-110 active:scale-95 z-50 group">
            <Plus className="h-10 w-10 transition-transform duration-500 group-hover:rotate-90" />
          </button>
        </div>
      </div>
    </ScrollArea>
  );
}
