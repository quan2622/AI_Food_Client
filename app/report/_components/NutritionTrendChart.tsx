"use client";

import React, { useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const weeklyData = [
  { day: "T2", protein: 72, carbs: 210, fat: 55, fiber: 22 },
  { day: "T3", protein: 85, carbs: 190, fat: 62, fiber: 28 },
  { day: "T4", protein: 68, carbs: 230, fat: 48, fiber: 18 },
  { day: "T5", protein: 90, carbs: 175, fat: 70, fiber: 32 },
  { day: "T6", protein: 78, carbs: 220, fat: 58, fiber: 25 },
  { day: "T7", protein: 95, carbs: 200, fat: 65, fiber: 30 },
  { day: "CN", protein: 60, carbs: 250, fat: 45, fiber: 15 },
];

const monthlyData = [
  { day: "T1", protein: 75, carbs: 200, fat: 58, fiber: 24 },
  { day: "T2", protein: 80, carbs: 215, fat: 55, fiber: 27 },
  { day: "T3", protein: 70, carbs: 195, fat: 62, fiber: 20 },
  { day: "T4", protein: 88, carbs: 180, fat: 68, fiber: 30 },
];

const chartConfig = {
  protein: { label: "Protein", color: "#9fd923" },
  carbs:   { label: "Carbs",   color: "#3b82f6" },
  fat:     { label: "Fat",     color: "#f59e0b" },
  fiber:   { label: "Fiber",   color: "#ec4899" },
} satisfies ChartConfig;

type Period = "week" | "month";

export default function NutritionTrendChart() {
  const [period, setPeriod] = useState<Period>("week");
  const data = period === "week" ? weeklyData : monthlyData;

  return (
    <Card className="h-full flex flex-col rounded-3xl border-0 shadow-none">
      <CardHeader className="shrink-0 flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-bold text-gray-800">
            Xu hướng dinh dưỡng
          </CardTitle>
          <CardDescription>
            Theo dõi lượng dinh dưỡng theo thời gian
          </CardDescription>
        </div>

        {/* Period toggle */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          {(["week", "month"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
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
          <LineChart
            accessibilityLayer
            data={data}
            margin={{ left: 0, right: 16, top: 8, bottom: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              unit="g"
              width={38}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {(["protein", "carbs", "fat", "fiber"] as const).map((key) => (
              <Line
                key={key}
                dataKey={key}
                type="natural"
                stroke={`var(--color-${key})`}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
