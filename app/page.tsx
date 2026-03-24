"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { 
  Scale, 
  MoveVertical, 
  Zap, 
  ChevronRight, 
  ChevronLeft, 
  Plus
} from "lucide-react";
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
  type ChartConfig 
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis
} from "recharts";

const chartConfig = {
  intake: {
    label: "Intake (kcal)",
    color: "#0ea5e9", // Cyan
  },
  activity: {
    label: "Activity (kcal)",
    color: "#2563eb", // Blue
  },
} satisfies ChartConfig;

export default function Home() {
  const [timeRange, setTimeRange] = React.useState("30d");
  const [isMounted, setIsMounted] = React.useState(false);
  const [data, setData] = React.useState<{date: string, intake: number, activity: number}[]>([]);

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
    <div className="max-w-[1600px] mx-auto px-8 pb-12 font-sans pt-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Daily Momentum (Main Chart) - 2/3 width */}
        <div className="col-span-12 lg:col-span-8">
          <Card className="border-[#F1F5F9] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] overflow-hidden">
            <CardHeader className="flex flex-col sm:flex-row items-center gap-4 space-y-0 border-b border-[#F1F5F9] py-6 px-8">
              <div className="grid flex-1 gap-1">
                <CardTitle className="text-xl font-bold text-[#0F172A]">Nutrition Trends</CardTitle>
                <CardDescription className="text-xs text-[#64748B] font-medium">
                  Intake and activity burn over time
                </CardDescription>
              </div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[160px] focus:ring-[#0ea5e9]" aria-label="Select period">
                  <SelectValue placeholder="Last 30 days" />
                </SelectTrigger>
                <SelectContent position="popper" className="w-[160px]">
                  <SelectItem value="90d">Last 3 months</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="p-8">
              <div className="h-[350px] w-full">
                {isMounted ? (
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <AreaChart data={filteredData}>
                      <defs>
                        <linearGradient id="fillIntake" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-intake)" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="var(--color-intake)" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="fillActivity" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-activity)" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="var(--color-activity)" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.03)" strokeDasharray="3 3" />
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
                        tick={{ fill: "#64748B", fontSize: 11, fontWeight: 700 }}
                      />
                      <YAxis hide domain={['dataMin', 'dataMax + 200']} />
                      <ChartTooltip
                        cursor={{ stroke: "rgba(0,0,0,0.1)", strokeWidth: 1 }}
                        content={
                          <ChartTooltipContent 
                            indicator="dot" 
                            labelFormatter={(value) => {
                              return new Date(value).toLocaleDateString("en-US", {
                                weekday: 'long',
                                month: 'short',
                                day: 'numeric'
                              });
                            }}
                          />
                        }
                      />
                      <Area
                        dataKey="activity"
                        type="natural"
                        fill="url(#fillActivity)"
                        stroke="var(--color-activity)"
                        strokeWidth={2}
                        stackId="a"
                      />
                      <Area
                        dataKey="intake"
                        type="natural"
                        fill="url(#fillIntake)"
                        stroke="var(--color-intake)"
                        strokeWidth={2}
                        stackId="a"
                      />
                      <ChartLegend content={<ChartLegendContent className="mt-4" />} />
                    </AreaChart>
                  </ChartContainer>
                ) : (
                  <div className="w-full h-full bg-slate-50 animate-pulse rounded-lg" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goal & Calorie Details - 1/3 width */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Remaining Fuel */}
          <div className="bg-white rounded-xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-[#F1F5F9]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#64748B]">Remaining Fuel</h3>
              <span className="text-[10px] bg-[#CAFD00]/10 text-[#0F172A] px-2.5 py-1 rounded-full font-black border border-[#CAFD00]/20 uppercase">
                Remaining
              </span>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-[#F8FAFC]" cx="48" cy="48" fill="transparent" r="42" stroke="currentColor" strokeWidth="8"></circle>
                  <circle 
                    className="text-[#CAFD00]" 
                    cx="48" cy="48" 
                    fill="transparent" 
                    r="42" 
                    stroke="currentColor" 
                    strokeWidth="8"
                    strokeDasharray="264"
                    strokeDashoffset="100"
                    strokeLinecap="round"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-black text-[#0F172A] leading-none">1500</span>
                  <span className="text-[9px] font-bold text-[#64748B] uppercase">Kcal</span>
                </div>
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-black text-[#64748B] tracking-wider">Goal</span>
                  <span className="text-sm font-bold text-[#0F172A]">2000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-black text-[#CAFD00] tracking-wider">Intake</span>
                  <span className="text-sm font-bold text-[#0F172A]">700</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-black text-[#64748B] tracking-wider">Burned</span>
                  <span className="text-sm font-bold text-[#0F172A]">200</span>
                </div>
              </div>
            </div>
          </div>

          {/* Goal Status */}
          <div className="bg-white rounded-xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-[#F1F5F9] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#CAFD00]/5 rounded-full blur-3xl -mr-8 -mt-8" />
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <p className="text-[10px] font-black uppercase text-[#64748B] tracking-widest mb-1">Goal: Weight Loss</p>
                <p className="text-3xl font-black text-[#0F172A] tracking-tighter">45 Days Left</p>
              </div>
              <span className="text-[10px] border border-[#F1F5F9] bg-white px-3 py-1 rounded-full font-black text-[#0F172A] uppercase shadow-xs tracking-wider">
                Active
              </span>
            </div>
            
            <div className="flex gap-1.5 relative z-10">
              <div className="h-1.5 flex-1 bg-[#CAFD00] rounded-full shadow-[0_0_8px_rgba(202,253,0,0.3)]"></div>
              <div className="h-1.5 flex-1 bg-[#CAFD00] rounded-full shadow-[0_0_8px_rgba(202,253,0,0.3)]"></div>
              <div className="h-1.5 flex-1 bg-slate-100 rounded-full"></div>
              <div className="h-1.5 flex-1 bg-slate-100 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* --- Row 2: Body Stats, Macro Breakdown, Recent Fuel --- */}
        
        {/* Body Stats */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-xl p-8 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-[#F1F5F9]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-[#0F172A]">Body Stats</h3>
            <button className="text-xs font-black text-blue-500 flex items-center gap-1 hover:underline">
              See all <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          
          <div className="space-y-4">
            {[
              { label: "Weight", sub: "Last updated today", val: "65kg", icon: Scale, color: "text-blue-500", bg: "bg-blue-50" },
              { label: "Height", sub: "Verified", val: "175cm", icon: MoveVertical, color: "text-indigo-500", bg: "bg-indigo-50" },
              { label: "BMI / BMR", sub: "Normal / Active", val: "1600 kcal", icon: Zap, color: "text-orange-500", bg: "bg-orange-50" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-[#F8FAFC] transition-all border border-transparent hover:border-[#F1F5F9] group">
                <div className="flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border border-[#F1F5F9] bg-white transition-all group-hover:scale-110", stat.color)}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0F172A]">{stat.label}</p>
                    <p className="text-[10px] text-[#64748B] font-medium">{stat.sub}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[15px] font-black text-[#0F172A]">{stat.val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Macro Breakdown */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-xl p-8 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-[#F1F5F9] flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-[#0F172A]">Macro Breakdown</h3>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-lg border border-[#F1F5F9] flex items-center justify-center hover:bg-[#F8FAFC] text-[#64748B]">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="w-8 h-8 rounded-lg border border-[#F1F5F9] flex items-center justify-center hover:bg-[#F8FAFC] text-[#64748B]">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            {/* Protein */}
            <div>
              <div className="flex justify-between text-[10px] font-black uppercase text-[#64748B] tracking-widest mb-2.5">
                <span>Protein</span>
                <span className="text-[#0F172A]">85g / 150g</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.2)]" style={{ width: "56%" }}></div>
              </div>
            </div>
            {/* Carbs */}
            <div>
              <div className="flex justify-between text-[10px] font-black uppercase text-[#64748B] tracking-widest mb-2.5">
                <span>Carbohydrates</span>
                <span className="text-[#0F172A]">120g / 200g</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#CAFD00] rounded-full shadow-[0_0_8px_rgba(202,253,0,0.2)]" style={{ width: "60%" }}></div>
              </div>
            </div>
            {/* Fats */}
            <div>
              <div className="flex justify-between text-[10px] font-black uppercase text-[#64748B] tracking-widest mb-2.5">
                <span>Healthy Fats</span>
                <span className="text-[#0F172A]">30g / 65g</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#0F172A] rounded-full shadow-[0_0_8px_rgba(15,23,42,0.1)]" style={{ width: "46%" }}></div>
              </div>
            </div>
          </div>
          
          <div className="mt-10 pt-8 border-t border-[#F1F5F9]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase text-[#64748B] tracking-widest mb-1">Daily Average</p>
                <p className="text-2xl font-black text-[#0F172A] tracking-tight">2,400 kcal</p>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full font-black border border-emerald-100 uppercase tracking-tighter">
                TDEE Target
              </span>
            </div>
          </div>
        </div>

        {/* Recent Fuel */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-xl p-8 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-[#F1F5F9]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-[#0F172A]">Recent Fuel</h3>
            <button className="text-xs font-black text-blue-500 hover:underline">See all</button>
          </div>
          
          <div className="space-y-6">
            {[
              { 
                name: "Oatmeal & Berries", 
                kcal: "320", 
                time: "8:30 AM", 
                type: "Breakfast", 
                tags: ["FIBER", "CARBS"],
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQKJqtMAUwR2SvqK8KNwthDHFw0DgiCgHP8fOvnKeNTrxdoO0Y6IA3jLCxC7BmQpNSlLymccXw2_nuaxsBrAeGHf65moOemKbmxZHe5p6xk1Hb9sY-qGhK8HkrKbAa0RG-M8a37ZYLjfNE9h2ke1dc_BkJTzH54trcM7te_bMSj-cxu1sxtOhd4MUsBlPeLQpbtvS7oTdw570lawQ6PvMahGtp84-G_DyFudwPDj0LKTBh7kpahwTG84yaG21Q4kgyLSydXYxknlos"
              },
              { 
                name: "Grilled Chicken Salad", 
                kcal: "480", 
                time: "1:15 PM", 
                type: "Lunch", 
                tags: ["PROTEIN", "KETO"],
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKwa8YIQ9-cprJ0JVlaJtXrL9Bliz4XnsRo6fpDUd3rIIhWXUtaillp_sBGYKpv5sZi2AsdHC7NOI0qhGeLDToOZKn-dTyX5sNap9TLxYbDFcTzGkEloMLsQiG8r64azXszoG5e7TiWGDCy5ehAQNmvBB22ZsVyJ1sFkd9pdFKf5dLe38A9BqR3CStmqEzTZpH1CnUteYsUEaSVm9cl667jzd8bI8L3Rz0hIx4-B6MzE0e-M60qs91WS0PaM6duHwcSRxgHFVosrgi"
              },
            ].map((meal, i) => (
              <div key={i} className="flex items-center gap-5 group cursor-pointer">
                <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#F1F5F9] shadow-inner shrink-0 relative">
                  <img 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    src={meal.img} 
                    alt={meal.name}
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-[13px] font-black text-[#0F172A] leading-tight truncate">{meal.name}</p>
                    <span className="text-[10px] font-black text-[#64748B] shrink-0 ml-2">{meal.kcal} KCAL</span>
                  </div>
                  <p className="text-[11px] text-[#64748B] font-medium tracking-tight mb-2.5">{meal.type} • {meal.time}</p>
                  <div className="flex gap-1.5 pt-0.5">
                    {meal.tags.map(tag => (
                      <span key={tag} className="text-[8px] bg-slate-50 text-[#64748B] border border-[#F1F5F9] px-2 py-0.5 rounded-md font-black tracking-widest">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8">
            <button className="w-full py-4 rounded-xl border-2 border-dashed border-[#F1F5F9] text-xs font-black text-[#64748B] hover:border-[#CAFD00] hover:text-[#0F172A] hover:bg-[#CAFD00]/5 transition-all flex items-center justify-center gap-2 group">
              <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" /> 
              Add New Entry
            </button>
          </div>
        </div>
      </div>

      {/* FAB - Fixed Action Button */}
      <button className="fixed bottom-10 right-10 w-16 h-16 bg-[#0F172A] text-[#CAFD00] rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-50 group">
        <Plus className="h-8 w-8 transition-transform group-hover:rotate-180" />
      </button>
    </div>
  );
}
