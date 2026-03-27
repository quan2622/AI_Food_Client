"use client";

import React from "react";
import NutritionTrendChart from "./_components/NutritionTrendChart";
import NutritionPieChart from "./_components/NutritionPieChart";
import CaloriesTrendChart from "./_components/CaloriesTrendChart";
import BodyMetrics from "./_components/BodyMetrics";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ReportPage() {
  return (
    <div className="h-screen pt-[80px] bg-linear-to-b from-white to-[#9fd923]/5">
      <ScrollArea className="h-full w-full">
        <div className="px-6 pb-12 flex flex-col pt-6 font-sans">
          {/* SECTION 1: Nutrition Charts — 7 : 3 */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="grid grid-cols-1 md:grid-cols-[7fr_3fr] gap-6 mb-6"
          >
            {/* Left: line chart */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[450px]">
              <NutritionTrendChart />
            </div>

            {/* Right: pie chart */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[450px]">
              <NutritionPieChart />
            </div>
          </motion.div>

          {/* SECTION 2: Calories & Metrics — 1 : 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6"
          >
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[380px]">
              <CaloriesTrendChart />
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[380px]">
              <BodyMetrics />
            </div>
          </motion.div>
        </div>
      </ScrollArea>
    </div>
  );
}
