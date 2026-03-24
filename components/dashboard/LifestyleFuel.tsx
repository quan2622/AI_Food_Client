"use client";

import React from "react";
import { Zap } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  intake: {
    label: "Intake (kcal)",
    color: "#00BAFF", // Vivid Sky Blue
  },
} satisfies ChartConfig;

export default function LifestyleFuel() {
  return (
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
  );
}
