"use client";

import React, { useState, useMemo } from "react";
import { SuggestionFilter } from "./_components/SuggestionFilter";
import { SuggestionList } from "./_components/SuggestionList";

export interface FoodItem {
  id: string;
  name: string;
  cals: string;
  meal: string;
  img: string;
}

// Dữ liệu mẫu (sẽ được lấy từ API sau)
const baseFoods = [
  { name: "Yến mạch & Trái cây mọng", cals: "320", meal: "Bữa sáng", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQKJqtMAUwR2SvqK8KNwthDHFw0DgiCgHP8fOvnKeNTrxdoO0Y6IA3jLCxC7BmQpNSlLymccXw2_nuaxsBrAeGHf65moOemKbmxZHe5p6xk1Hb9sY-qGhK8HkrKbAa0RG-M8a37ZYLjfNE9h2ke1dc_BkJTzH54trcM7te_bMSj-cxu1sxtOhd4MUsBlPeLQpbtvS7oTdw570lawQ6PvMahGtp84-G_DyFudwPDj0LKTBh7kpahwTG84yaG21Q4kgyLSydXYxknlos" },
  { name: "Sữa chua Hy Lạp mix hạt", cals: "190", meal: "Bữa sáng", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-70pNRbNoTIJ_CxS3trf5vPUm-AJK_22c8uFe9E2DAv0T2bPg0TIIxJi39EmJSxgmdqRKV7sfybMJBysOgSh6k-0-BakZs59XO_kMX3mkrw_foKgNiGIY8kZi6ucNS17IjDF4cgY3_NvNloYuwJHFDWWdsqHvCaA5pDXSbbogBoazd2XegE5mPuxcGac7XBR7SeBHm5QDQNQ_BX5p85his599TH0aqcfiJG9UdlL1Bb0Y7k9u6InXYyvPBtXjsz5Dgv_fD3FiR1Df" },
  { name: "Bánh mì đen bơ đậu phộng", cals: "250", meal: "Bữa sáng", img: "https://images.unsplash.com/photo-1525439404285-05d53531bfa2?q=80&w=2674&auto=format&fit=crop" },
  { name: "Trứng ốp la & Salad", cals: "280", meal: "Bữa sáng", img: "https://images.unsplash.com/photo-1521513919009-be90ad555598?q=80&w=2699&auto=format&fit=crop" },
  { name: "Sinh tố chuối protein", cals: "310", meal: "Bữa sáng", img: "https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=2574&auto=format&fit=crop" },
  { name: "Bún gạo lứt trộn", cals: "350", meal: "Bữa sáng", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2680&auto=format&fit=crop" },
  
  { name: "Ức gà áp chảo & Quinoa", cals: "480", meal: "Bữa trưa", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKwa8YIQ9-cprJ0JVlaJtXrL9Bliz4XnsRo6fpDUd3rIIhWXUtaillp_sBGYKpv5sZi2AsdHC7NOI0qhGeLDToOZKn-dTyX5sNap9TLxYbDFcTzGkEloMLsQiG8r64azXszoG5e7TiWGDCy5ehAQNmvBB22ZsVyJ1sFkd9pdFKf5dLe38A9BqR3CStmqEzTZpH1CnUteYsUEaSVm9cl667jzd8bI8L3Rz0hIx4-B6MzE0e-M60qs91WS0PaM6duHwcSRxgHFVosrgi" },
  { name: "Salad cá ngừ", cals: "320", meal: "Bữa trưa", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2670&auto=format&fit=crop" },
  { name: "Cơm gạo lứt thịt rim", cals: "450", meal: "Bữa trưa", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2680&auto=format&fit=crop" },
  
  { name: "Bò bít tết & Măng tây", cals: "520", meal: "Bữa tối", img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=2670&auto=format&fit=crop" },
  { name: "Cá hồi nướng tiêu chanh", cals: "390", meal: "Bữa tối", img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=2670&auto=format&fit=crop" },
  
  { name: "Thanh hạt năng lượng", cals: "210", meal: "Bữa phụ", img: "https://images.unsplash.com/photo-1622597467836-f38ec2f05161?q=80&w=2670&auto=format&fit=crop" },
  { name: "Trái cây cắt lát", cals: "120", meal: "Bữa phụ", img: "https://images.unsplash.com/photo-1610832958506-c563cb31e6e4?q=80&w=2670&auto=format&fit=crop" },
];

export default function SuggestionsPage() {
  const [selectedMeal, setSelectedMeal] = useState("Bữa sáng");



  // Nhân bản dữ liệu để danh sách dài ra, dễ thấy thanh cuộn ở bên phải
  const displayFoods: FoodItem[] = useMemo(() => {
    return Array.from({ length: 4 }).flatMap(() => 
      baseFoods.filter(f => f.meal === selectedMeal)
    ).map((item, id) => ({ ...item, id: `${item.name}-${id}` }));
  }, [selectedMeal]);

  return (
    <div className="h-screen w-full flex flex-col pt-28 px-10 pb-6 overflow-hidden">
      {/* Container chính chia 3:7 theo yêu cầu */}
      <div className="flex-1 grid grid-cols-10 gap-6 overflow-hidden max-w-[1600px] w-full mx-auto">
        
        {/* KHỐI BÊN TRÁI: FORM CHỌN TIÊU CHÍ (3/10) */}
        <SuggestionFilter selectedMeal={selectedMeal} onMealChange={setSelectedMeal} />

        {/* KHỐI BÊN PHẢI: DANH SÁCH MÓN ĂN (7/10) */}
        <SuggestionList foods={displayFoods} selectedMeal={selectedMeal} />
        
      </div>
    </div>
  );
}
