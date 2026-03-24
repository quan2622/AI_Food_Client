import React from "react";
import { Zap } from "lucide-react";

export default function MacroBreakdown() {
  return (
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
  );
}
