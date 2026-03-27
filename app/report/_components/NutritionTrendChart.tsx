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

const dailyData = [
  { label: "T2", protein: 72, carbs: 210, fat: 55, fiber: 22 },
  { label: "T3", protein: 85, carbs: 190, fat: 62, fiber: 28 },
  { label: "T4", protein: 68, carbs: 230, fat: 48, fiber: 18 },
  { label: "T5", protein: 90, carbs: 175, fat: 70, fiber: 32 },
  { label: "T6", protein: 78, carbs: 220, fat: 58, fiber: 25 },
  { label: "T7", protein: 95, carbs: 200, fat: 65, fiber: 30 },
  { label: "CN", protein: 60, carbs: 250, fat: 45, fiber: 15 },
];

const weeklyData = [
  { label: "Tuần 1", protein: 500, carbs: 1400, fat: 400, fiber: 150 },
  { label: "Tuần 2", protein: 520, carbs: 1350, fat: 420, fiber: 160 },
  { label: "Tuần 3", protein: 480, carbs: 1450, fat: 380, fiber: 140 },
  { label: "Tuần 4", protein: 550, carbs: 1300, fat: 450, fiber: 180 },
  { label: "Tuần 5", protein: 510, carbs: 1380, fat: 410, fiber: 155 },
  { label: "Tuần 6", protein: 530, carbs: 1420, fat: 430, fiber: 170 },
];

const monthlyData = [
  { label: "Tháng 1", protein: 2200, carbs: 6000, fat: 1800, fiber: 700 },
  { label: "Tháng 2", protein: 2100, carbs: 6200, fat: 1700, fiber: 650 },
  { label: "Tháng 3", protein: 2350, carbs: 5800, fat: 1950, fiber: 750 },
];

const chartConfig = {
  protein: { label: "Protein", color: "#9fd923" },
  carbs: { label: "Carbs", color: "#3b82f6" },
  fat: { label: "Fat", color: "#f59e0b" },
  fiber: { label: "Fiber", color: "#ec4899" },
} satisfies ChartConfig;

type Period = "day" | "week" | "month";

export default function NutritionTrendChart() {
  const [period, setPeriod] = useState<Period>("day");

  const data =
    period === "day" ? dailyData : period === "week" ? weeklyData : monthlyData;

  return (
    <Card className="h-full flex flex-col rounded-3xl border-0 shadow-none">
      <CardHeader className="shrink-0 flex flex-row items-center justify-between pb-4">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-lg font-bold text-gray-800">
            Xu hướng dinh dưỡng
          </CardTitle>
          <CardDescription>
            Theo dõi lượng dinh dưỡng theo thời gian
          </CardDescription>
        </div>

        {/* Period toggle — Fixed alignment and width */}
        <div className="flex items-center bg-gray-100 rounded-xl p-1 w-fit">
          {(["day", "week", "month"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`min-w-[72px] px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                period === p
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {p === "day" ? "Ngày" : p === "week" ? "Tuần" : "Tháng"}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 pb-4">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <LineChart
            key={period}
            accessibilityLayer
            data={data}
            margin={{ left: 0, right: 16, top: 8, bottom: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
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
                animationDuration={800}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
