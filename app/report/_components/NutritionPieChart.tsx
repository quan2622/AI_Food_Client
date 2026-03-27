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

const chartData = [
  { nutrient: "protein", amount: 82, fill: "var(--color-protein)" },
  { nutrient: "carbs", amount: 210, fill: "var(--color-carbs)" },
  { nutrient: "fat", amount: 60, fill: "var(--color-fat)" },
  { nutrient: "fiber", amount: 25, fill: "var(--color-fiber)" },
];

const chartConfig = {
  amount: { label: "Amount (g)" },
  protein: { label: "Protein", color: "#9fd923" },
  carbs: { label: "Carbs", color: "#3b82f6" },
  fat: { label: "Fat", color: "#f59e0b" },
  fiber: { label: "Fiber", color: "#ec4899" },
} satisfies ChartConfig;

const total = chartData.reduce((sum, item) => sum + item.amount, 0);

export default function NutritionPieChart() {
  return (
    <Card className="h-full flex flex-col rounded-3xl border-0 shadow-none">
      <CardHeader className="items-center pb-0 shrink-0">
        <CardTitle className="text-lg font-bold text-gray-800">
          Tỉ lệ dinh dưỡng
        </CardTitle>
        <CardDescription>
          Phân bổ theo % tổng lượng calories hôm nay
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 pb-0 flex items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[240px] w-full pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="nutrient" hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="nutrient"
              label
              innerRadius={60}
              strokeWidth={4}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col shrink-0 px-8 pb-12 pt-8 border-t border-gray-100 bg-gray-50/20">
        <div className="grid grid-cols-2 gap-x-16 gap-y-6 w-full">
          {chartData.map((data) => {
            const config =
              chartConfig[
                data.nutrient as Exclude<keyof typeof chartConfig, "amount">
              ];
            return (
              <div
                key={data.nutrient}
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
                  {Math.round((data.amount / total) * 100)}%
                </span>
              </div>
            );
          })}
        </div>
      </CardFooter>
    </Card>
  );
}
