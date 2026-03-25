import React from "react";
import { Scale } from "lucide-react";

export default function GoalStatus() {
  return (
    <div className="bg-[#CAFD00] rounded-[2rem] p-5 text-[#0F172A] relative overflow-hidden group shadow-[0_15px_30px_rgba(202,253,0,0.15)] flex flex-col justify-between">
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
  );
}
