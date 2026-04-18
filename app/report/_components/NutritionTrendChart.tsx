"use client";

import React from "react";
import Link from "next/link";
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
import {
  NutritionTrendDayMeal,
  NutritionTrendItem,
  TrendOption,
} from "@/services/reportService";

const chartConfig = {
  protein: { label: "Chất đạm", color: "#9fd923" },
  carbs: { label: "Tinh bột", color: "#3b82f6" },
  fat: { label: "Chất béo", color: "#f59e0b" },
  fiber: { label: "Chất xơ", color: "#ec4899" },
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
  const chartData = React.useMemo(() => {
    if (period === "day") {
      return (data as NutritionTrendDayMeal[]).map((item) => ({
        ...item,
        label: item.mealTypeLabel,
      }));
    }
    return data;
  }, [data, period]);

  return (
    <Card className="h-full flex flex-col rounded-3xl border-0 shadow-none">
      <CardHeader className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3">
        <div className="flex flex-col gap-0.5 sm:gap-1">
          <CardTitle className="text-base sm:text-lg font-bold text-gray-800">
            Xu hướng dinh dưỡng
          </CardTitle>
          <CardDescription>
            Theo dõi lượng dinh dưỡng theo thời gian
          </CardDescription>
        </div>

        {/* Period toggle */}
        <div className="flex items-center bg-gray-100 rounded-xl p-1 w-fit">
          {(["day", "week", "month", "year"] as TrendOption[]).map((p) => (
            <button
              key={p}
              onClick={() => onPeriodChange(p)}
              className={`min-w-[72px] px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                period === p
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {p === "day"
                ? "Ngày"
                : p === "week"
                  ? "Tuần"
                  : p === "month"
                    ? "Tháng"
                    : "Năm"}
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

        {/* Empty state */}
        {!loading && chartData.length === 0 && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 text-center px-6">
            <p className="text-sm font-semibold text-gray-500">
              Chưa có dữ liệu dinh dưỡng
            </p>
            <p className="text-xs text-gray-400">
              Hãy ghi nhận bữa ăn để theo dõi xu hướng dinh dưỡng của bạn!
            </p>
            <Link
              href="/"
              className="mt-1 inline-block rounded-lg bg-[#9FD923] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#8bc71e] transition-colors"
            >
              Ghi nhận bữa ăn ngay
            </Link>
          </div>
        )}

        <ChartContainer config={chartConfig} className="h-full w-full">
          <LineChart
            key={period}
            accessibilityLayer
            data={chartData}
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
            <ChartTooltip
              cursor={false}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="grid min-w-[8rem] gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                    <div className="font-medium">{label}</div>
                    <div className="grid gap-1.5">
                      {payload.map((item: any) => {
                        const cfg =
                          chartConfig[item.dataKey as keyof typeof chartConfig];
                        return (
                          <div
                            key={item.dataKey}
                            className="flex items-center gap-2"
                          >
                            <span
                              className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="flex-1 text-muted-foreground">
                              {cfg?.label ?? item.dataKey}
                            </span>
                            <span className="font-mono font-medium tabular-nums text-foreground">
                              {Number(item.value).toFixed(1)} g
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }}
            />
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
