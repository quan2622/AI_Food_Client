"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileDialog } from "@/components/common/ProfileDialog";
import { useAuthStore } from "@/stores/authStore";

const NAV_ITEMS = [
  { label: "Trang chủ", href: "/" },
  { label: "Gợi ý", href: "/suggestions" },
  { label: "Nhật ký", href: "/diary" },
  { label: "Báo cáo", href: "/report" },
];

const NOTIFICATIONS = [
  {
    day: "Today",
    items: [
      { id: 1, message: "New food order received", time: "10:30 AM" },
      { id: 2, message: "System update completed", time: "09:15 AM" },
      { id: 3, message: "New user registered", time: "08:45 AM" },
    ],
  },
  {
    day: "Yesterday",
    items: [
      { id: 4, message: "Database backup successful", time: "11:45 PM" },
      { id: 5, message: "Weekly report is ready", time: "05:20 PM" },
      { id: 6, message: "Security scan passed", time: "02:10 PM" },
    ],
  },
];

const Header = () => {
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [canScrollMore, setCanScrollMore] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
    setCanScrollMore(!isAtBottom);
  };

  useEffect(() => {
    if (showNotifications) {
      setTimeout(() => {
        if (scrollRef.current) {
          const { scrollHeight, clientHeight } = scrollRef.current;
          setCanScrollMore(scrollHeight > clientHeight);
        }
      }, 300); // Wait for transition animation
    }
  }, [showNotifications]);

  if (pathname === "/sign-in" || pathname === "/sign-up") return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-10 py-5">
      <div className="mx-auto grid grid-cols-3 items-center max-w-[1600px] h-[80px]">
        {/* Left Section: Logo */}
        <div className="flex items-center justify-start">
          <Link href="/" className="outline-none">
            <motion.div
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 rounded-full border border-[#0D0D0D]/10 px-6 py-2 bg-white/80 backdrop-blur-xl transition-all duration-300 hover:bg-white hover:border-[#9FD923]/40 shadow-sm cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <motion.div
                    whileHover={{ rotate: 12 }}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30 transition-all duration-300 group-hover:shadow-primary/50 relative z-10"
                  >
                    <Utensils className="h-5 w-5 text-[#0D0D0D]" />
                  </motion.div>
                  <div className="absolute -inset-1 rounded-xl bg-primary/25 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black text-card-foreground tracking-tighter leading-none">
                    Nutri<span className="text-primary">Life</span>
                  </span>
                  <span className="text-[9px] font-bold text-[#0D0D0D]/30 uppercase tracking-[0.2em] mt-0.5 ml-0.5">
                    Smart Nutrition
                  </span>
                </div>
              </div>
            </motion.div>
          </Link>
        </div>

        {/* Center Section: Navigation */}
        <div className="flex items-center justify-center">
          <nav className="relative flex overflow-hidden rounded-full bg-white/80 backdrop-blur-md p-1.5 items-center border border-[#0D0D0D]/10 shadow-sm">
            {NAV_ITEMS.map((item) => {
              // Ensure perfect active state matching
              const isActive =
                pathname === item.href ||
                (pathname === "/" && item.label === "Trang chủ");
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "relative w-28 py-2.5 text-[14px] font-semibold transition-colors duration-300 text-center rounded-full outline-none cursor-pointer flex items-center justify-center",
                    isActive
                      ? "text-[#0D0D0D]"
                      : "text-[#0D0D0D]/60 hover:text-[#0D0D0D]",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-slider"
                      className="absolute inset-0 rounded-full bg-[#9FD923]/90 backdrop-blur-md border border-[#B3D929] shadow-sm"
                      transition={{
                        type: "tween",
                        ease: [0.6, -0.02, 0.1, 0.99],
                        duration: 0.5,
                      }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center justify-end gap-3">
          {isAuthenticated ? (
            <ProfileDialog />
          ) : (
            <Link href="/sign-in">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2.5 rounded-full bg-[#0D0D0D] text-white text-[14px] font-bold shadow-lg shadow-[#0D0D0D]/10 hover:bg-[#9FD923] hover:text-[#0D0D0D] transition-all duration-300"
              >
                Sign In
              </motion.button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
