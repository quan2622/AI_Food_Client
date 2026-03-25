"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const CalendarBar = () => {
  const today = new Date();
  
  const [activeYear, setActiveYear] = useState(today.getFullYear());
  const [activeMonth, setActiveMonth] = useState(today.getMonth());
  const [activeDay, setActiveDay] = useState(today.getDate());
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeDayRef = useRef<HTMLButtonElement>(null);

  // Calculate total days in the current selected month
  const daysInMonth = new Date(activeYear, activeMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Auto-scroll the active day into view
  useEffect(() => {
    if (activeDayRef.current) {
      activeDayRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeMonth, activeYear]); // Scroll when month changes or on initial load

  const handlePrevYear = () => setActiveYear((prev) => prev - 1);
  const handleNextYear = () => setActiveYear((prev) => prev + 1);

  return (
    <div className="px-6 py-4 space-y-4">
      {/* Year & months */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground w-10 text-center">{activeYear}</span>
          <button onClick={handlePrevYear} className="text-muted-foreground hover:text-foreground cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
          <button onClick={handleNextYear} className="text-muted-foreground hover:text-foreground cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
        </div>
        <div className="flex items-center gap-1 ml-2 overflow-x-auto scrollbar-hide">
          {months.map((m, i) => (
            <button
              key={m}
              onClick={() => {
                setActiveMonth(i);
                // Optionally reset active day if the new month has fewer days
                const maxDaysInNewMonth = new Date(activeYear, i + 1, 0).getDate();
                if (activeDay > maxDaysInNewMonth) setActiveDay(maxDaysInNewMonth);
              }}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-full transition-colors cursor-pointer shrink-0",
                activeMonth === i
                  ? "bg-[#9FD923] text-black shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Days */}
      <div ref={scrollRef} className="flex items-center gap-0.5 overflow-x-auto pb-2 custom-scrollbar scroll-smooth">
        {days.map((d) => (
          <button
            key={d}
            ref={activeDay === d ? activeDayRef : null}
            onClick={() => setActiveDay(d)}
            className={cn(
              "w-7 h-7 flex items-center justify-center text-xs font-medium rounded-full transition-colors shrink-0 cursor-pointer",
              activeDay === d
                ? "bg-[#9FD923] text-black shadow-sm"
                : "text-muted-foreground hover:bg-[#F2F2F2]"
            )}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CalendarBar;
