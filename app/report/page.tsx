"use client";

import React from "react";
import NutritionTrendChart from "./_components/NutritionTrendChart";
import NutritionPieChart from "./_components/NutritionPieChart";
import { motion } from "framer-motion";

export default function ReportPage() {
  return (
    /* h-screen + pt header => chart grid fills exact remaining space with light green theme */
    <div className="h-screen pt-[88px] px-6 pb-6 font-sans flex flex-col overflow-hidden">
      {/* Main charts — 7 : 3, fills all remaining height */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15 }}
        className="flex-1 min-h-0 grid gap-4 pt-6"
        style={{ gridTemplateColumns: "7fr 3fr" }}
      >
        {/* Left: line chart */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <NutritionTrendChart />
        </div>

        {/* Right: pie chart */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <NutritionPieChart />
        </div>
      </motion.div>
    </div>
  );
}
