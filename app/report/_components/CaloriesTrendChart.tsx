"use client";

import React, { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Period = "week" | "month";

// Full Week: Monday to Sunday (T7, CN = 0)
const weekData = [
  { label: "T2", calories: 1800 },
  { label: "T3", calories: 1950 },
  { label: "T4", calories: 2100 },
  { label: "T5", calories: 1850 },
  { label: "T6", calories: 2200 },
];

// Full Month: 1 to 31 (March). Days 28-31 = 0
const monthData = Array.from({ length: 28 }, (_, i) => ({
  label: (i + 1).toString().padStart(2, "0"),
  calories: 1700 + Math.floor(Math.random() * 600),
}));

const chartConfig = {
  calories: { label: "Calories", color: "#9fd923" },
} satisfies ChartConfig;

export default function CaloriesTrendChart() {
  const [period, setPeriod] = useState<Period>("week");

  const data = period === "week" ? weekData : monthData;

  return (
    <Card className="rounded-3xl border-0 shadow-sm bg-white overflow-hidden h-full flex flex-col">
      <CardHeader className="shrink-0 flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-lg font-bold text-gray-800">
            Xu hướng Calories
          </CardTitle>
          <CardDescription>
            {period === "week" ? "Từ thứ 2 đến nay" : "Từ đầu tháng đến nay"}
          </CardDescription>
        </div>

        {/* Period toggle — Only Week and Month */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit">
          {(["week", "month"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`min-w-[65px] px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-200 ${
                period === p
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {p === "week" ? "Tuần" : "Tháng"}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 pb-4">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <AreaChart
            key={period}
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9fd923" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#9fd923" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              interval={period === "month" ? 4 : 0}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              unit=" kcal"
              width={60}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="calories"
              stroke="#9fd923"
              fillOpacity={1}
              fill="url(#colorCalories)"
              strokeWidth={3}
              animationDuration={1500}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
