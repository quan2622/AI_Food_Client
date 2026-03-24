"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, ArrowRight, Flame } from "lucide-react";

export default function SuggestionsPage() {
  return (
    <ScrollArea className="h-screen w-full">
      <div className="pt-28 px-10 pb-32">
        <div className="max-w-[1600px] mx-auto pt-2">
          
          <div className="mb-8 p-10 bg-[#0F172A] rounded-[2rem] text-white flex justify-between items-center overflow-hidden relative shadow-2xl">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#CAFD00]/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
             <div className="relative z-10">
               <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
                 <Sparkles className="w-10 h-10 text-[#CAFD00]" />
                 Gợi ý thông minh cho Boss
               </h1>
               <p className="text-[#CAFD00]/80 font-bold uppercase tracking-widest text-sm">
                 Tối ưu dựa trên chỉ số sinh học và mục tiêu giảm cân của bạn
               </p>
             </div>
             <button className="relative z-10 bg-[#CAFD00] text-[#0F172A] px-6 py-3 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(202,253,0,0.3)] hover:shadow-[0_15px_40px_rgba(202,253,0,0.5)]">
               Khởi tạo Menu
             </button>
          </div>
          
          <div className="mb-6">
             <h2 className="text-xl font-black text-[#0F172A] uppercase tracking-tight flex items-center gap-2">
               Kế hoạch bữa ăn hôm nay
             </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                meal: "Bữa sáng",
                name: "Yến mạch & Trái cây mọng",
                cals: "320",
                protein: "12g",
                desc: "Giàu chất xơ, giúp no lâu và ổn định đường huyết.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQKJqtMAUwR2SvqK8KNwthDHFw0DgiCgHP8fOvnKeNTrxdoO0Y6IA3jLCxC7BmQpNSlLymccXw2_nuaxsBrAeGHf65moOemKbmxZHe5p6xk1Hb9sY-qGhK8HkrKbAa0RG-M8a37ZYLjfNE9h2ke1dc_BkJTzH54trcM7te_bMSj-cxu1sxtOhd4MUsBlPeLQpbtvS7oTdw570lawQ6PvMahGtp84-G_DyFudwPDj0LKTBh7kpahwTG84yaG21Q4kgyLSydXYxknlos"
              },
              {
                meal: "Bữa trưa",
                name: "Ức gà áp chảo & Quinoa",
                cals: "480",
                protein: "45g",
                desc: "Protein nạc kết hợp carb phức tạp giúp duy trì năng lượng.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKwa8YIQ9-cprJ0JVlaJtXrL9Bliz4XnsRo6fpDUd3rIIhWXUtaillp_sBGYKpv5sZi2AsdHC7NOI0qhGeLDToOZKn-dTyX5sNap9TLxYbDFcTzGkEloMLsQiG8r64azXszoG5e7TiWGDCy5ehAQNmvBB22ZsVyJ1sFkd9pdFKf5dLe38A9BqR3CStmqEzTZpH1CnUteYsUEaSVm9cl667jzd8bI8L3Rz0hIx4-B6MzE0e-M60qs91WS0PaM6duHwcSRxgHFVosrgi"
              },
              {
                meal: "Bữa phụ",
                name: "Sữa chua Hy Lạp",
                cals: "190",
                protein: "20g",
                desc: "Nguồn protein nhanh chóng và Probiotics tốt cho tiêu hóa.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-70pNRbNoTIJ_CxS3trf5vPUm-AJK_22c8uFe9E2DAv0T2bPg0TIIxJi39EmJSxgmdqRKV7sfybMJBysOgSh6k-0-BakZs59XO_kMX3mkrw_foKgNiGIY8kZi6ucNS17IjDF4cgY3_NvNloYuwJHFDWWdsqHvCaA5pDXSbbogBoazd2XegE5mPuxcGac7XBR7SeBHm5QDQNQ_BX5p85his599TH0aqcfiJG9UdlL1Bb0Y7k9u6InXYyvPBtXjsz5Dgv_fD3FiR1Df"
              }
            ].map((item, i) => (
              <div key={i} className="group bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#F1F5F9] hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="relative h-48 rounded-2xl overflow-hidden mb-5 border border-[#F1F5F9]">
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black uppercase text-[#0F172A] z-10 shadow-sm border border-black/5">
                    {item.meal}
                  </div>
                  <div className="absolute top-3 right-3 bg-[#CAFD00] px-3 py-1.5 rounded-xl text-[10px] font-black uppercase text-[#0F172A] z-10 shadow-sm flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    {item.cals} KCAL
                  </div>
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <h3 className="text-lg font-black text-[#0F172A] mb-1.5">{item.name}</h3>
                <p className="text-xs font-semibold text-[#64748B] mb-5 line-clamp-2 leading-relaxed">{item.desc}</p>
                
                <div className="flex justify-between items-center pt-5 border-t border-[#F1F5F9]/80">
                  <span className="text-xs font-bold text-[#0F172A] bg-[#F8FAFC] px-3 py-2 rounded-xl flex items-center gap-1.5">
                    Protein <span className="text-[#2563eb] font-black">{item.protein}</span>
                  </span>
                  <button className="w-10 h-10 rounded-full bg-[#0F172A] text-[#CAFD00] flex items-center justify-center hover:bg-[#CAFD00] hover:text-[#0F172A] transition-colors shadow-sm">
                    <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </ScrollArea>
  );
}
