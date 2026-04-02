"use client";

import React from "react";
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
import { NutritionTrendItem, TrendOption } from "@/services/reportService";

const chartConfig = {
  protein: { label: "Protein", color: "#9fd923" },
  carbs: { label: "Carbs", color: "#3b82f6" },
  fat: { label: "Fat", color: "#f59e0b" },
  fiber: { label: "Fiber", color: "#ec4899" },
} satisfies ChartConfig;

interface NutritionTrendChartProps {
  data: NutritionTrendItem[];
  loading: boolean;
  period: TrendOption;
  onPeriodChange: (p: TrendOption) => void;
}

export default function NutritionTrendChart({
  data,
  loading,
  period,
  onPeriodChange,
}: NutritionTrendChartProps) {
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

        {/* Period toggle */}
        <div className="flex items-center bg-gray-100 rounded-xl p-1 w-fit">
          {(["day", "week", "month"] as TrendOption[]).map((p) => (
            <button
              key={p}
              onClick={() => onPeriodChange(p)}
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

      <CardContent className="flex-1 min-h-0 pb-4 relative">
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10 backdrop-blur-sm rounded-2xl">
            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-[#9FD923]" />
          </div>
        )}

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
