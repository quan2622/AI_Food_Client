"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

const chartConfig = {
  intake: {
    label: "Intake (kcal)",
    color: "#00BAFF", // Vivid Sky Blue
  },
  activity: {
    label: "Activity (kcal)",
    color: "#2563EB", // Strong Royal Blue
  },
} satisfies ChartConfig;

export default function NutritionTrends() {
  const [timeRange, setTimeRange] = React.useState("30d");
  const [isMounted, setIsMounted] = React.useState(false);
  const [data, setData] = React.useState<
    { date: string; intake: number; activity: number }[]
  >([]);

  React.useEffect(() => {
    setIsMounted(true);
    // Move data generation here to prevent Hydration Mismatch
    const generatedData = Array.from({ length: 90 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (89 - i));
      return {
        date: date.toISOString().split("T")[0],
        intake: Math.floor(Math.random() * (1600 - 1000 + 1)) + 1000,
        activity: Math.floor(Math.random() * (800 - 400 + 1)) + 400,
      };
    });
    setData(generatedData);
  }, []);

  const filteredData = React.useMemo(() => {
    if (!data.length) return [];

    return data.filter((item) => {
      const date = new Date(item.date);
      const now = new Date();
      let daysToSubtract = 30;
      if (timeRange === "90d") daysToSubtract = 90;
      else if (timeRange === "7d") daysToSubtract = 7;

      const startDate = new Date();
      startDate.setDate(now.getDate() - daysToSubtract);
      return date >= startDate;
    });
  }, [data, timeRange]);

  return (
    <div className="col-span-12">
      <Card className="border-[#F1F5F9] shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-[2rem] overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row items-center gap-2 space-y-0 border-b border-[#F1F5F9] p-6">
          <div className="grid flex-1 gap-0.5">
            <CardTitle className="text-xl font-black text-[#0F172A] uppercase tracking-tight">
              Nutrition Trends
            </CardTitle>
            <CardDescription className="text-[10px] text-[#64748B] font-medium uppercase tracking-widest">
              Historical intake and performance burn-rates
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-[180px] h-9 rounded-lg focus:ring-[#0ea5e9] font-bold text-xs"
              aria-label="Select period"
            >
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              className="w-[180px] rounded-lg"
            >
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[350px] w-full">
            {isMounted ? (
              <ChartContainer
                config={chartConfig}
                className="h-full w-full"
              >
                <AreaChart data={filteredData}>
                  <defs>
                    <linearGradient
                      id="fillIntake"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-intake)"
                        stopOpacity={0.6}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-intake)"
                        stopOpacity={0.2}
                      />
                    </linearGradient>
                    <linearGradient
                      id="fillActivity"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-activity)"
                        stopOpacity={0.6}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-activity)"
                        stopOpacity={0.2}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    stroke="rgba(0,0,0,0.03)"
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={12}
                    minTickGap={32}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    tick={{
                      fill: "#64748B",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  />
                  <YAxis hide domain={["dataMin", "dataMax + 200"]} />
                  <ChartTooltip
                    cursor={{ stroke: "rgba(0,0,0,0.1)", strokeWidth: 1 }}
                    content={
                      <ChartTooltipContent
                        indicator="dot"
                        labelFormatter={(value) => {
                          return new Date(value).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              month: "short",
                              day: "numeric",
                            },
                          );
                        }}
                      />
                    }
                  />
                  <Area
                    dataKey="activity"
                    type="natural"
                    fill="url(#fillActivity)"
                    stroke="var(--color-activity)"
                    strokeWidth={4}
                    stackId="a"
                  />
                  <Area
                    dataKey="intake"
                    type="natural"
                    fill="url(#fillIntake)"
                    stroke="var(--color-intake)"
                    strokeWidth={4}
                    stackId="a"
                  />
                  <ChartLegend
                    content={<ChartLegendContent className="mt-6" />}
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <div className="w-full h-full bg-slate-50 animate-pulse rounded-[1.5rem]" />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
