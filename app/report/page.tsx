"use client";

import React, { useState, useEffect } from "react";
import NutritionTrendChart from "./_components/NutritionTrendChart";
import NutritionPieChart from "./_components/NutritionPieChart";
import CaloriesTrendChart from "./_components/CaloriesTrendChart";
import BodyMetrics from "./_components/BodyMetrics";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  reportService,
  NutritionTrendItem,
  TrendOption,
} from "@/services/reportService";

export default function ReportPage() {
  const [period, setPeriod] = useState<TrendOption>("day");
  const [trendData, setTrendData] = useState<NutritionTrendItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await reportService.getNutritionTrend(period);
        if (isMounted && res.data) {
          setTrendData(res.data);
        }
      } catch {
        if (isMounted) setTrendData([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [period]);

  return (
    <div className="h-screen">
      <ScrollArea className="h-full w-full">
        <div className="px-4 sm:px-6 pb-12 flex flex-col pt-22 sm:pt-26 md:pt-30 font-sans">
          {/* SECTION 1: Nutrition Charts — 7 : 3 */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="grid grid-cols-1 md:grid-cols-[7fr_3fr] gap-4 md:gap-6 mb-4 md:mb-6"
          >
            {/* Left: line chart */}
            <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[300px] md:min-h-[450px]">
              <NutritionTrendChart
                data={trendData}
                loading={loading}
                period={period}
                onPeriodChange={setPeriod}
              />
            </div>

            {/* Right: pie chart — synced to same data & period */}
            <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[350px] md:min-h-[450px]">
              <NutritionPieChart
                data={trendData}
                loading={loading}
                period={period}
              />
            </div>
          </motion.div>

          {/* SECTION 2: Calories & Metrics — 1 : 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-6"
          >
            <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[300px] md:min-h-[380px]">
              <CaloriesTrendChart />
            </div>
            <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[300px] md:min-h-[380px]">
              <BodyMetrics />
            </div>
          </motion.div>
        </div>
      </ScrollArea>
    </div>
  );
}
