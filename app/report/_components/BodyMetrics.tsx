"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileDialog } from "@/components/common/ProfileDialog";
import { Activity, Target, Weight, Zap, Flame, Clock, Settings } from "lucide-react";

const metrics = [
  { label: "BMI", value: "22.5", sub: "Bình thường", color: "bg-green-50 text-green-600", icon: Weight },
  { label: "TDEE", value: "2450", sub: "kcal/ngày", color: "bg-blue-50 text-blue-600", icon: Zap },
  { label: "Body Fat %", value: "18.2%", sub: "Lý tưởng", color: "bg-orange-50 text-orange-600", icon: Target },
  { label: "Ideal Weight", value: "65-72", sub: "kg", color: "bg-green-50 text-green-600", icon: Activity },
  { label: "BMR", value: "1680", sub: "kcal/ngày", color: "bg-red-50 text-red-600", icon: Flame },
  { label: "Metabolic Age", value: "24", sub: "tuổi", color: "bg-purple-50 text-purple-600", icon: Clock },
];

export default function BodyMetrics() {
  return (
    <Card className="rounded-3xl border-0 shadow-sm bg-white overflow-hidden h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3 px-6 pt-6 -mb-3">
        <CardTitle className="text-lg font-bold">Chỉ số cơ thể</CardTitle>
        <ProfileDialog trigger={
          <button className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-50 text-gray-400 hover:bg-[#9fd923] hover:text-[#0D0D0D] transition-all duration-300 font-bold text-sm shadow-xs border border-gray-100/50">
            <Settings size={16} />
            <span>Chỉnh sửa</span>
          </button>
        } />
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="grid grid-cols-2 gap-4 h-full">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="group p-4 rounded-2xl border border-gray-50 bg-gray-50/50 hover:bg-white hover:border-[#9fd923] hover:shadow-md transition-all duration-300 flex flex-col justify-center"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{m.label}</span>
                <div className={`p-1.5 rounded-lg ${m.color}`}>
                  <m.icon size={16} />
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-gray-800 tracking-tight group-hover:text-[#9fd923] transition-colors">{m.value}</span>
                <span className="text-[10px] text-gray-400 font-semibold">{m.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
