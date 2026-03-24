import React from "react";
import { ChevronRight } from "lucide-react";

export default function BodyStats() {
  return (
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
  );
}
