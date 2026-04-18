"use client";

import React from "react";
import { Pie, PieChart } from "recharts";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NutritionTrendItem, TrendOption } from "@/services/reportService";

const chartConfig = {
  amount: { label: "Khối lượng (g)" },
  protein: { label: "Chất đạm", color: "#9fd923" },
  carbs: { label: "Tinh bột", color: "#3b82f6" },
  fat: { label: "Chất béo", color: "#f59e0b" },
  fiber: { label: "Chất xơ", color: "#ec4899" },
} satisfies ChartConfig;

interface NutritionPieChartProps {
  data: NutritionTrendItem[];
  loading: boolean;
  period: TrendOption;
}

const periodLabel: Record<TrendOption, string> = {
  day: "các ngày trong tuần",
  week: "các tuần",
  month: "các tháng",
};

const formatWholeNumber = (value: number) => Math.round(value).toString();

export default function NutritionPieChart({
  data,
  loading,
  period,
}: NutritionPieChartProps) {
  // Sum up all nutrients across all data points
  const totals = data.reduce(
    (acc, item) => ({
      protein: acc.protein + (item.protein ?? 0),
      carbs: acc.carbs + (item.carbs ?? 0),
      fat: acc.fat + (item.fat ?? 0),
      fiber: acc.fiber + (item.fiber ?? 0),
    }),
    { protein: 0, carbs: 0, fat: 0, fiber: 0 },
  );

  const grandTotal = totals.protein + totals.carbs + totals.fat + totals.fiber;

  const chartData = [
    {
      nutrient: "protein",
      amount: totals.protein,
      fill: "var(--color-protein)",
    },
    { nutrient: "carbs", amount: totals.carbs, fill: "var(--color-carbs)" },
    { nutrient: "fat", amount: totals.fat, fill: "var(--color-fat)" },
    { nutrient: "fiber", amount: totals.fiber, fill: "var(--color-fiber)" },
  ];

  return (
    <Card className="h-full flex flex-col rounded-3xl border-0 shadow-none">
      <CardHeader className="items-center pb-0 shrink-0">
        <CardTitle className="text-base sm:text-lg font-bold text-gray-800">
          Tỉ lệ dinh dưỡng
        </CardTitle>
        <CardDescription>Tổng hợp từ {periodLabel[period]}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 pb-0 flex items-center justify-center relative">
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10 backdrop-blur-sm rounded-2xl">
            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-[#9FD923]" />
          </div>
        )}

        {grandTotal === 0 ? (
          <p className="text-sm text-gray-400 font-medium">Chưa có dữ liệu</p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[180px] sm:max-h-[240px] w-full pb-0 [&_.recharts-pie-label-text]:fill-foreground"
          >
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="nutrient" hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="nutrient"
                label={({ value }) => formatWholeNumber(Number(value ?? 0))}
                innerRadius={60}
                strokeWidth={4}
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter className="flex-col shrink-0 px-4 sm:px-6 md:px-8 pb-6 sm:pb-8 md:pb-12 pt-4 sm:pt-6 md:pt-8 border-t border-gray-100 bg-gray-50/20">
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-y-2 xs:gap-x-6 xs:gap-y-3 sm:gap-x-10 md:gap-x-16 sm:gap-y-4 md:gap-y-6 w-full">
          {chartData.map((item) => {
            const config =
              chartConfig[
                item.nutrient as Exclude<keyof typeof chartConfig, "amount">
              ];
            const pct =
              grandTotal > 0 ? Math.round((item.amount / grandTotal) * 100) : 0;
            return (
              <div
                key={item.nutrient}
                className="flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="font-bold text-gray-500 group-hover:text-gray-800 transition-colors">
                    {config.label}
                  </span>
                </div>
                <span className="font-black text-gray-900 tabular-nums">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </CardFooter>
    </Card>
  );
}
