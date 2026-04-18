"use client";

import React, { useState, useEffect } from "react";
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
import {
  reportService,
  MetricPeriod,
  MetricTrendDataPoint,
  MetricTrendResponse,
} from "@/services/reportService";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const chartConfig = {
  value: { label: "Calo", color: "#9fd923" },
} satisfies ChartConfig;

const periodLabel: Record<MetricPeriod, string> = {
  day: "Từng bữa ăn hôm nay",
  week: "Từ thứ 2 đến nay",
  month: "Từ đầu tháng đến nay",
  year: "Từng tháng trong năm",
};

export default function CaloriesTrendChart() {
  const [period, setPeriod] = useState<MetricPeriod>("week");
  const [chartData, setChartData] = useState<MetricTrendDataPoint[]>([]);
  const [summary, setSummary] = useState<MetricTrendResponse["summary"] | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await reportService.getMetricTrend(period, "calories");
        if (isMounted && res.data) {
          setChartData(res.data.data);
          setSummary(res.data.summary);
        }
      } catch {
        if (isMounted) {
          setChartData([]);
          setSummary(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [period]);

  const TrendIcon =
    summary?.trendDirection === "up"
      ? TrendingUp
      : summary?.trendDirection === "down"
        ? TrendingDown
        : Minus;

  const trendColor =
    summary?.trendDirection === "up"
      ? "text-[#9fd923]"
      : summary?.trendDirection === "down"
        ? "text-red-500"
        : "text-gray-400";

  return (
    <Card className="rounded-3xl border-0 shadow-sm bg-white overflow-hidden h-full flex flex-col">
      <CardHeader className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3">
        <div>
          <CardTitle className="text-base sm:text-lg font-bold text-gray-800">
            Xu hướng calo
          </CardTitle>
          <CardDescription>{periodLabel[period]}</CardDescription>
        </div>

        {/* Period toggle */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit">
          {(["day", "week", "month", "year"] as MetricPeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`min-w-[65px] px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-200 ${
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
              Chưa có dữ liệu xu hướng calo
            </p>
            <p className="text-xs text-gray-400">
              Hãy ghi nhận bữa ăn để theo dõi lượng calo của bạn!
            </p>
          </div>
        )}

        {/* Summary bar */}
        {summary && !loading && (
          <div className="flex items-center justify-between px-1 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                TB
              </span>
              <span className="text-sm font-black text-gray-800 tabular-nums">
                {Math.round(summary.average).toLocaleString()} kcal
              </span>
            </div>
            <div className={`flex items-center gap-1 ${trendColor}`}>
              <TrendIcon className="w-4 h-4" />
              <span className="text-xs font-bold tabular-nums">
                {summary.trend > 0 ? "+" : ""}
                {Math.round(summary.trend).toLocaleString()} kcal
              </span>
            </div>
          </div>
        )}

        <ChartContainer
          config={chartConfig}
          className="h-[calc(100%-40px)] w-full"
        >
          <AreaChart
            key={period}
            data={chartData}
            margin={{ top: 20, right: 40, left: 0, bottom: 0 }}
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
              tickMargin={5}
              tick={{ fontSize: 10 }}
              unit=" kcal"
              width={45}
            />
            <ChartTooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="grid min-w-[8rem] gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                    <div className="font-medium">{label}</div>
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[#9fd923]" />
                      <span className="flex-1 text-muted-foreground">Calo</span>
                      <span className="font-mono font-medium tabular-nums">
                        {Number(payload[0].value).toFixed(1)} kcal
                      </span>
                    </div>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
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
