"use client";

import React from "react";
import { Zap, ChevronRight, ChevronLeft, Plus, Scale } from "lucide-react";
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
  ScrollArea
} from "@/components/ui/scroll-area";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
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
  calories: {
    label: "Calories",
  },
  remaining: {
    label: "Remaining",
    color: "#CAFD00",
  },
} satisfies ChartConfig;

export default function Home() {
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
    <ScrollArea className="h-[calc(100vh-120px)] w-full">
      <div className="px-10 pb-6">
        <div className="max-w-[1600px] mx-auto pt-2">
        <div className="grid grid-cols-12 gap-5">
          {/* Lifestyle Fuel: Target vs Intake - 7/12 width */}
          <div className="col-span-12 lg:col-span-7 bg-white rounded-[2rem] p-10 shadow-[0_4px_25px_rgb(0,0,0,0.04)] border border-[#F1F5F9] flex flex-col items-center justify-center relative overflow-hidden group min-h-[520px]">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Zap className="w-32 h-32 text-[#0F172A]" />
            </div>

            <div className="relative w-full max-w-[400px] aspect-square">
              <ChartContainer
                config={chartConfig}
                className="mx-auto h-full w-full"
              >
                <RadialBarChart
                  data={[{ intake: 700, fill: "var(--color-intake)" }]}
                  startAngle={0}
                  endAngle={(700 / 2000) * 360}
                  innerRadius={100}
                  outerRadius={130}
                >
                  <PolarGrid
                    gridType="circle"
                    radialLines={false}
                    stroke="none"
                    className="first:fill-[#F1F5F9] last:fill-white"
                    polarRadius={[130, 100]}
                  />
                  <RadialBar dataKey="intake" background cornerRadius={10} />
                  <PolarRadiusAxis
                    tick={false}
                    tickLine={false}
                    axisLine={false}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-[#0F172A] text-7xl font-black tracking-tighter"
                              >
                                700
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 40}
                                className="fill-[#64748B] text-xs font-black uppercase tracking-widest opacity-60"
                              >
                                calories consumed
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </PolarRadiusAxis>
                </RadialBarChart>
              </ChartContainer>
            </div>

            <div className="flex w-full gap-16 mt-4 border-t border-[#F1F5F9] pt-10 items-center justify-center">
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-widest text-[#64748B] font-black mb-1.5">
                  Target Goal
                </p>
                <p className="text-3xl font-black text-[#0F172A]">
                  2000{" "}
                  <span className="text-sm font-bold opacity-30">kcal</span>
                </p>
              </div>
              <div className="w-px h-12 bg-[#F1F5F9]" />
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-widest text-[#64748B] font-black mb-1.5">
                  Consumed
                </p>
                <p className="text-3xl font-black text-[#00BAFF]">
                  700 <span className="text-sm font-bold opacity-30">kcal</span>
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Info: Macros & Goal - 5/12 width */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-5">
            <div className="bg-white rounded-[2rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#F1F5F9] flex-1">
              <h3 className="text-base font-black text-[#0F172A] mb-6 flex items-center gap-2 uppercase tracking-tight">
                <span className="w-7 h-7 rounded-lg bg-[#2563eb]/10 flex items-center justify-center text-[#2563eb]">
                  <Zap className="h-3.5 w-3.5" />
                </span>
                Macro Breakdown
              </h3>
              <div className="space-y-6">
                {/* Protein */}
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase text-[#64748B] tracking-widest mb-2.5">
                    <span>Protein</span>
                    <span className="text-[#0F172A]">85g / 150g</span>
                  </div>
                  <div className="h-2 w-full bg-[#F8FAFC] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: "56%" }}
                    ></div>
                  </div>
                </div>
                {/* Carbs */}
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase text-[#64748B] tracking-widest mb-2.5">
                    <span>Carbohydrates</span>
                    <span className="text-[#0F172A]">120g / 200g</span>
                  </div>
                  <div className="h-2 w-full bg-[#F8FAFC] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#CAFD00] rounded-full"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                </div>
                {/* Fats */}
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase text-[#64748B] tracking-widest mb-2.5">
                    <span>Healthy Fats</span>
                    <span className="text-[#0F172A]">30g / 65g</span>
                  </div>
                  <div className="h-2 w-full bg-[#F8FAFC] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0F172A] rounded-full"
                      style={{ width: "46%" }}
                    ></div>
                  </div>
                </div>
                {/* Fiber */}
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase text-[#64748B] tracking-widest mb-2.5">
                    <span>Dietary Fiber</span>
                    <span className="text-[#0F172A]">18g / 30g</span>
                  </div>
                  <div className="h-2 w-full bg-[#F8FAFC] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-400 rounded-full"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Goal Status */}
            <div className="bg-[#CAFD00] rounded-[2rem] p-6 text-[#0F172A] relative overflow-hidden group shadow-[0_15px_30px_rgba(202,253,0,0.15)] flex flex-col justify-between">
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <Scale className="w-24 h-24" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-60">
                    Target: Weight Loss
                  </p>
                  <span className="bg-white/30 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black border border-white/20">
                    PROGRESSING
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-black tracking-tighter">
                    45 <span className="text-2xl opacity-40">/ 60</span>
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                    Days
                  </span>
                </div>
                <p className="text-[10px] font-bold opacity-70 italic">
                  Stay focused, Boss!
                </p>
              </div>

              <div className="relative z-10 mt-4">
                <div className="flex justify-between items-end mb-2">
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    Remaining: <span className="text-sm">1.6kg</span>
                  </p>
                  <p className="text-xs font-black">75%</p>
                </div>
                <div className="h-3 w-full bg-black/10 rounded-full overflow-hidden border border-black/5 p-0.5">
                  <div
                    className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    style={{ width: "75%" }}
                  ></div>
                </div>
                <p className="mt-2 text-[8px] font-black uppercase tracking-widest opacity-40 text-right">
                  Goal: -5.0kg | Current: -3.4kg
                </p>
              </div>
            </div>
          </div>

          {/* Row 2: Body Stats & Recent Fuel */}

          {/* Body Stats - 4/12 */}
          <div className="col-span-12 lg:col-span-4 bg-white rounded-[2rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#F1F5F9]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-[#0F172A] uppercase tracking-tight">
                Body Stats
              </h3>
              <button className="text-[#2563eb] text-[10px] font-black flex items-center gap-1 hover:underline transition-all">
                Update <ChevronRight className="h-3 w-3" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-[9px] uppercase font-black text-[#64748B] tracking-widest mb-0.5">
                  Weight
                </p>
                <p className="text-xl font-black text-[#0F172A]">65kg</p>
              </div>
              <div>
                <p className="text-[9px] uppercase font-black text-[#64748B] tracking-widest mb-0.5">
                  Height
                </p>
                <p className="text-xl font-black text-[#0F172A]">175cm</p>
              </div>
              <div>
                <p className="text-[9px] uppercase font-black text-[#64748B] tracking-widest mb-0.5">
                  BMI
                </p>
                <p className="text-xl font-black text-[#2563eb]">Normal</p>
              </div>
              <div>
                <p className="text-[9px] uppercase font-black text-[#64748B] tracking-widest mb-0.5">
                  Activity
                </p>
                <p className="text-xl font-black text-[#0F172A]">Moderate</p>
              </div>
              <div>
                <p className="text-[9px] uppercase font-black text-[#64748B] tracking-widest mb-0.5">
                  BMR
                </p>
                <p className="text-xl font-black text-[#0F172A]">
                  1600{" "}
                  <span className="text-[10px] font-bold opacity-30 tracking-normal">
                    kcal
                  </span>
                </p>
              </div>
              <div>
                <p className="text-[9px] uppercase font-black text-[#64748B] tracking-widest mb-0.5">
                  TDEE
                </p>
                <p className="text-xl font-black text-[#CAFD00] [text-shadow:0_0_15px_rgba(202,253,0,0.4)]">
                  2400{" "}
                  <span className="text-[10px] font-bold opacity-30 tracking-normal">
                    kcal
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Recent Fuel - 8/12 */}
          <div className="col-span-12 lg:col-span-8 bg-white rounded-[2rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#F1F5F9]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-[#0F172A] uppercase tracking-tight">
                Recent Fuel
              </h3>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full border border-[#F1F5F9] flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC] transition-all">
                  <ChevronLeft className="h-3 w-3" />
                </button>
                <button className="w-8 h-8 rounded-full border border-[#F1F5F9] flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC] transition-all">
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Oatmeal & Berries",
                  kcal: "320",
                  type: "Breakfast",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQKJqtMAUwR2SvqK8KNwthDHFw0DgiCgHP8fOvnKeNTrxdoO0Y6IA3jLCxC7BmQpNSlLymccXw2_nuaxsBrAeGHf65moOemKbmxZHe5p6xk1Hb9sY-qGhK8HkrKbAa0RG-M8a37ZYLjfNE9h2ke1dc_BkJTzH54trcM7te_bMSj-cxu1sxtOhd4MUsBlPeLQpbtvS7oTdw570lawQ6PvMahGtp84-G_DyFudwPDj0LKTBh7kpahwTG84yaG21Q4kgyLSydXYxknlos",
                },
                {
                  name: "Grilled Chicken",
                  kcal: "480",
                  type: "Lunch",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKwa8YIQ9-cprJ0JVlaJtXrL9Bliz4XnsRo6fpDUd3rIIhWXUtaillp_sBGYKpv5sZi2AsdHC7NOI0qhGeLDToOZKn-dTyX5sNap9TLxYbDFcTzGkEloMLsQiG8r64azXszoG5e7TiWGDCy5ehAQNmvBB22ZsVyJ1sFkd9pdFKf5dLe38A9BqR3CStmqEzTZpH1CnUteYsUEaSVm9cl667jzd8bI8L3Rz0hIx4-B6MzE0e-M60qs91WS0PaM6duHwcSRxgHFVosrgi",
                },
                {
                  name: "Greek Yogurt",
                  kcal: "190",
                  type: "Snack",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-70pNRbNoTIJ_CxS3trf5vPUm-AJK_22c8uFe9E2DAv0T2bPg0TIIxJi39EmJSxgmdqRKV7sfybMJBysOgSh6k-0-BakZs59XO_kMX3mkrw_foKgNiGIY8kZi6ucNS17IjDF4cgY3_NvNloYuwJHFDWWdsqHvCaA5pDXSbbogBoazd2XegE5mPuxcGac7XBR7SeBHm5QDQNQ_BX5p85his599TH0aqcfiJG9UdlL1Bb0Y7k9u6InXYyvPBtXjsz5Dgv_fD3FiR1Df",
                },
              ].map((meal, i) => (
                <div
                  key={i}
                  className="bg-[#F8FAFC] rounded-3xl overflow-hidden group cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-[#F1F5F9]"
                >
                  <div className="h-32 relative overflow-hidden">
                    <img
                      className="w-full h-full object-cover transition-transform duration-500"
                      src={meal.img}
                      alt={meal.name}
                    />
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-black text-white">
                      {meal.kcal} KCAL
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-[9px] uppercase tracking-widest text-[#64748B] font-black mb-1">
                      {meal.type}
                    </p>
                    <p className="text-sm font-black text-[#0F172A] tracking-tight">
                      {meal.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 3: Nutrition Trends Chart (Full Width) */}
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
        </div>

        {/* FAB - Fixed Action Button */}
        <button className="fixed bottom-10 right-10 w-20 h-20 bg-[#CAFD00] text-[#0F172A] rounded-full shadow-[0_20px_50px_rgba(202,253,0,0.4)] flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-50 group">
          <Plus className="h-10 w-10 transition-transform group-hover:rotate-180" />
        </button>
      </div>
    </div>
  </ScrollArea>
  );
}
