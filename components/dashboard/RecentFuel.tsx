import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function RecentFuel() {
  return (
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
  );
}
