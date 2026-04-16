"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, Utensils, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileDialog } from "@/components/common/ProfileDialog";
import { useAuthStore } from "@/stores/authStore";

const NAV_ITEMS = [
  { label: "Trang chủ", href: "/" },
  { label: "Gợi ý", href: "/suggestions" },
  { label: "Nhật ký", href: "/diary" },
  { label: "Thống kê", href: "/report" },
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (pathname === "/sign-in" || pathname === "/sign-up") return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-10 py-3 md:py-5">
      <div className="mx-auto flex items-center justify-between md:grid md:grid-cols-3 md:items-center max-w-[1600px] h-[60px] md:h-[80px]">
        {/* Left Section: Logo */}
        <div className="flex items-center justify-start">
          <Link href="/" className="outline-none">
            <motion.div
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 md:gap-3 rounded-full border border-[#0D0D0D]/10 px-3 sm:px-4 md:px-6 py-1.5 md:py-2 bg-white/80 backdrop-blur-xl transition-all duration-300 hover:bg-white hover:border-[#9FD923]/40 shadow-sm cursor-pointer group"
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div className="relative">
                  <motion.div
                    whileHover={{ rotate: 12 }}
                    className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30 transition-all duration-300 group-hover:shadow-primary/50 relative z-10"
                  >
                    <Utensils className="h-5 w-5 text-[#0D0D0D]" />
                  </motion.div>
                  <div className="absolute -inset-1 rounded-xl bg-primary/25 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg md:text-xl font-black text-card-foreground tracking-tighter leading-none">
                    Nutri<span className="text-primary">Life</span>
                  </span>
                  <span className="text-[8px] md:text-[9px] font-bold text-[#0D0D0D]/30 uppercase tracking-[0.2em] mt-0.5 ml-0.5 hidden sm:block">
                    Smart Nutrition
                  </span>
                </div>
              </div>
            </motion.div>
          </Link>
        </div>

        {/* Center Section: Navigation (Desktop) */}
        <div className="hidden md:flex items-center justify-center">
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
                    "relative w-24 lg:w-28 py-2.5 text-[13px] lg:text-[14px] font-semibold transition-colors duration-300 text-center rounded-full outline-none cursor-pointer flex items-center justify-center",
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
        <div className="flex items-center justify-end gap-2 md:gap-3">
          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
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

          {/* Mobile: profile or sign-in + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated ? (
              <ProfileDialog />
            ) : (
              <Link href="/sign-in">
                <button className="px-4 py-2 rounded-full bg-[#0D0D0D] text-white text-xs font-bold shadow-sm">
                  Sign In
                </button>
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-xl bg-white/80 backdrop-blur-md border border-[#0D0D0D]/10 shadow-sm cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-[#0D0D0D]" />
              ) : (
                <Menu className="h-5 w-5 text-[#0D0D0D]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Backdrop Overlay + Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop: làm mờ nền phía sau menu */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[-1]"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden mt-2 mx-auto max-w-[1600px] overflow-hidden relative z-10"
            >
              <nav className="bg-white/95 backdrop-blur-xl rounded-2xl border border-[#0D0D0D]/10 shadow-lg p-2 flex flex-col gap-1">
                {NAV_ITEMS.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (pathname === "/" && item.label === "Trang chủ");
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "px-4 py-3 rounded-xl text-[14px] font-semibold transition-all duration-200",
                        isActive
                          ? "bg-[#9FD923]/90 text-[#0D0D0D] shadow-sm"
                          : "text-[#0D0D0D]/60 hover:bg-[#9FD923]/10 hover:text-[#0D0D0D]"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
