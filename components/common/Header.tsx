"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  User,
  ChevronDown,
  ShieldCheck,
  LogOut,
  Camera,
  Mail,
  Calendar,
  Target,
  Zap,
  Flame,
  Scale,
  Activity,
  AlertTriangle,
  Beaker,
  Dna,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

const NAV_ITEMS = [
  { label: "Trang chủ", href: "/" },
  { label: "Gợi ý", href: "/suggestions" },
  { label: "Nhật ký", href: "/diary" },
  { label: "Hiring", href: "#" },
  { label: "Devices", href: "#" },
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
  const [showNotifications, setShowNotifications] = useState(false);
  const [canScrollMore, setCanScrollMore] = useState(false);
  const [profileTab, setProfileTab] = useState("Profile");
  const [isEditing, setIsEditing] = useState(false);
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
          <div className="flex items-center gap-3 rounded-full border border-[#0D0D0D]/10 px-6 py-2.5 bg-white/80 backdrop-blur-xl transition-all duration-300 hover:bg-white hover:border-[#9FD923]/40 shadow-sm group cursor-pointer">
            <motion.div
              whileHover={{ scale: 1.25 }}
              className="h-2.5 w-2.5 rounded-full bg-[#9FD923]"
            />
            <span className="text-[20px] font-extrabold tracking-tight text-[#0D0D0D] leading-none">
              Crextio
            </span>
          </div>
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
          <div
            className="relative"
            onMouseEnter={() => setShowNotifications(true)}
            onMouseLeave={() => setShowNotifications(false)}
          >
            <button className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white/80 backdrop-blur-xl border border-[#0D0D0D]/10 transition-all duration-300 hover:bg-[#F2F2F2] hover:border-[#9FD923]/30 shadow-sm group">
              <Bell className="h-5.5 w-5.5 text-[#0D0D0D]/70 group-hover:shake" />
              <span className="absolute top-[10px] right-[12px] h-2.5 w-2.5 rounded-full bg-[#9FD923] shadow-[0_0_8px_rgba(159,217,35,0.6)]" />
            </button>

            {/* Notification Popover */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.4 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.4 }}
                  transition={{
                    type: "spring",
                    stiffness: 450,
                    damping: 30,
                    bounce: 0.4,
                  }}
                  style={{ originX: "85%", originY: "0%" }}
                  className="absolute top-full right-0 pt-3 w-[360px] z-100 transform-gpu"
                >
                  <div className="rounded-2xl bg-white border border-[#0D0D0D]/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden relative">
                    <div className="p-5 border-b border-[#0D0D0D]/5">
                      <h3 className="text-[16px] font-bold text-[#0D0D0D]">
                        Notifications
                      </h3>
                    </div>
                    <div
                      ref={scrollRef}
                      onScroll={handleScroll}
                      className="max-h-[330px] overflow-y-auto scrollbar-hide"
                    >
                      {NOTIFICATIONS.map((group) => (
                        <div key={group.day} className="py-2">
                          <div className="px-5 py-1 text-[12px] font-bold text-[#0D0D0D]/40 uppercase tracking-wider">
                            {group.day}
                          </div>
                          {group.items.map((notification) => (
                            <div
                              key={notification.id}
                              className="px-5 py-3 hover:bg-[#9FD923]/10 transition-colors cursor-pointer group/item"
                            >
                              <p className="text-[14px] text-[#0D0D0D] font-medium leading-snug">
                                {notification.message}
                              </p>
                              <span className="text-[11px] text-[#0D0D0D]/40 mt-1 block font-semibold">
                                {notification.time}
                              </span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>

                    {/* Bouncing Arrow Indicator */}
                    <AnimatePresence>
                      {canScrollMore && (
                        <motion.div
                          initial={{ opacity: 0, y: -2 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 2 }}
                          className="absolute bottom-15 left-1/2 -translate-x-1/2 pointer-events-none z-20"
                        >
                          <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{
                              repeat: Infinity,
                              duration: 1.5,
                              ease: "easeInOut",
                            }}
                            className="bg-white/30 backdrop-blur-xs rounded-full p-1.5 border border-[#9FD923]/50 shadow-xl"
                          >
                            <ChevronDown className="h-4 w-4 text-[#9FD923]" />
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="p-3 bg-[#F2F2F2]/50 text-center relative z-10 hover:bg-[#D9F2A2]/50 text-[#9FD923] cursor-pointer">
                      <button className="text-[13px] font-bold transition-colors">
                        View all activities
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Dialog
            onOpenChange={(isOpen) => {
              if (isOpen) setProfileTab("Profile");
            }}
          >
            <DialogTrigger asChild>
              <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 backdrop-blur-xl text-[#0D0D0D] border border-[#0D0D0D]/10 transition-all duration-300 hover:border-[#9FD923]/30 shadow-sm cursor-pointer overflow-hidden group">
                <User className="h-6 w-6 text-[#0D0D0D]/80 group-hover:text-[#9FD923] transition-colors" />
              </button>
            </DialogTrigger>
            <DialogContent className="min-w-7xl p-0 overflow-hidden border-none bg-white rounded-3xl shadow-2xl">
              <DialogTitle className="sr-only">User Settings</DialogTitle>
              <div className="flex h-[650px]">
                {/* Sidebar */}
                <div className="w-[240px] bg-[#F2F2F2]/50 border-r border-[#0D0D0D]/5 p-6 flex flex-col gap-2">
                  <div className="mb-8 px-2">
                    <h2 className="text-[20px] font-bold text-[#0D0D0D]">
                      Settings
                    </h2>
                    <p className="text-[12px] text-[#0D0D0D]/40 font-medium uppercase tracking-widest mt-1">
                      User Management
                    </p>
                  </div>

                  {[
                    { id: "Profile", icon: User, label: "Profile" },
                    { id: "Goals", icon: Target, label: "My Goals" },
                    {
                      id: "Allergies",
                      icon: AlertTriangle,
                      label: "Allergies",
                    },
                    { id: "Security", icon: ShieldCheck, label: "Security" },
                    {
                      id: "Logout",
                      icon: LogOut,
                      label: "Sign Out",
                      variant: "danger",
                    },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setProfileTab(tab.id)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-bold text-[14px]",
                        profileTab === tab.id
                          ? tab.variant === "danger"
                            ? "bg-red-50 text-red-500"
                            : "bg-[#9FD923] text-[#0D0D0D] shadow-lg shadow-[#9FD923]/20 scale-[1.02]"
                          : tab.variant === "danger"
                            ? "text-red-400 hover:bg-red-50"
                            : "text-[#0D0D0D]/60 hover:bg-white hover:text-[#0D0D0D]",
                      )}
                    >
                      <tab.icon className="h-5 w-5" />
                      {tab.label}
                    </button>
                  ))}

                  <div className="mt-auto p-4 bg-[#D9F2A2]/30 rounded-2xl border border-[#9FD923]/10">
                    <p className="text-[11px] text-[#0D0D0D]/60 font-medium leading-relaxed">
                      Need help with your account? Contact support.
                    </p>
                  </div>
                </div>

                {/* Content Area */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                  className="flex-1 p-10 overflow-y-auto custom-scrollbar relative"
                >
                  <AnimatePresence mode="wait">
                    {profileTab === "Profile" && (
                      <motion.div
                        key="profile"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="h-full flex flex-col justify-between"
                      >
                        <div className="space-y-5">
                          {/* Header Section Compact */}
                          <div className="flex items-center gap-5 p-2 bg-[#D9F2A2]/10 rounded-[2rem] border border-[#9FD923]/10">
                            <div className="relative shrink-0">
                              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center border-2 border-[#9FD923]/20 shadow-sm overflow-hidden">
                                <User className="w-8 h-8 text-[#9FD923]" />
                              </div>
                              <button className="absolute -bottom-1 -right-1 p-1.5 bg-[#0D0D0D] text-white rounded-lg shadow-lg border border-white/10">
                                <Camera className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-[20px] font-black text-[#0D0D0D]">
                                Boss Designer
                              </h3>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="px-1.5 py-0.5 rounded bg-[#9FD923] text-[#0D0D0D] text-[10px] font-black uppercase tracking-wider">
                                  Admin
                                </span>
                                <span className="text-[#0D0D0D]/30 font-bold text-[11px]">
                                  Premium Member
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Uniform Groups Section */}
                          <div className="flex gap-4">
                            {/* Box 1: Account Info */}
                            <div className="flex-1 p-4 bg-[#F2F2F2]/50 rounded-3xl border border-[#0D0D0D]/5 flex flex-col gap-3">
                              <h4 className="text-[10px] font-black text-[#0D0D0D]/20 uppercase tracking-widest pl-1">
                                Personal Record
                              </h4>
                              {[
                                {
                                  label: "Email",
                                  value: "boss@gemini.ai",
                                  icon: Mail,
                                  color: "text-[#9FD923]",
                                },
                                {
                                  label: "Birthday",
                                  value: "Mar 23, 1995 (29y)",
                                  icon: Calendar,
                                  color: "text-blue-500",
                                },
                              ].map((field, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-3 p-2 bg-white/50 rounded-2xl"
                                >
                                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-xs">
                                    <field.icon
                                      className={cn("w-4 h-4", field.color)}
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <span className="text-[9px] font-bold text-[#0D0D0D]/30 uppercase block leading-none mb-0.5">
                                      {field.label}
                                    </span>
                                    <div className="h-4 flex items-center">
                                      {isEditing ? (
                                        <input
                                          className="w-full bg-transparent text-[12px] font-bold text-[#0D0D0D] outline-none border-b border-[#9FD923]/30 focus:border-[#9FD923] p-0"
                                          defaultValue={field.value}
                                        />
                                      ) : (
                                        <p className="text-[12px] font-bold text-[#0D0D0D] leading-none">
                                          {field.value}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Box 2: Body Metrics List */}
                            <div className="flex-[1.2] p-4 bg-white rounded-3xl border border-[#0D0D0D]/5 flex flex-col gap-2 shadow-sm">
                              <h4 className="text-[10px] font-black text-[#0D0D0D]/20 uppercase tracking-widest pl-1 mb-1">
                                Body Metrics
                              </h4>
                              {[
                                {
                                  label: "Weight",
                                  value: "72.5",
                                  unit: "kg",
                                  icon: Scale,
                                },
                                {
                                  label: "Height",
                                  value: "178",
                                  unit: "cm",
                                  icon: Activity,
                                },
                                {
                                  label: "Gender",
                                  value: "Male",
                                  unit: "",
                                  icon: User,
                                  type: "gender",
                                },
                                {
                                  label: "Activity",
                                  value: "Moderate",
                                  unit: "",
                                  icon: Dna,
                                  type: "select",
                                },
                                {
                                  label: "Age",
                                  value: "29",
                                  unit: "y",
                                  icon: User,
                                },
                              ].map((field, i) => (
                                <div
                                  key={i}
                                  className="flex items-center justify-between px-3 py-1.5 border-b border-[#0D0D0D]/5 last:border-0"
                                >
                                  <div className="flex items-center gap-3">
                                    <field.icon className="w-3.5 h-3.5 text-[#0D0D0D]/20" />
                                    <span className="text-[11px] font-bold text-[#0D0D0D]/40 uppercase">
                                      {field.label}
                                    </span>
                                  </div>
                                  <div className="w-24 text-right">
                                    <div className="h-5 flex items-center justify-end">
                                      {isEditing ? (
                                        field.type === "select" ? (
                                          <select className="bg-transparent text-[12px] font-bold text-[#9FD923] outline-none text-right cursor-pointer p-0 m-0 h-full border-none appearance-none">
                                            <option>Sedentary</option>
                                            <option selected>Moderate</option>
                                            <option>High Active</option>
                                          </select>
                                        ) : field.type === "gender" ? (
                                          <select className="bg-transparent text-[12px] font-bold text-[#9FD923] outline-none text-right cursor-pointer p-0 m-0 h-full border-none appearance-none">
                                            <option selected>Male</option>
                                            <option>Female</option>
                                          </select>
                                        ) : (
                                          <div className="flex items-center justify-end h-full">
                                            <input
                                              className="w-10 text-right bg-transparent text-[12px] font-black text-[#0D0D0D] outline-none border-b border-[#9FD923]/30 p-0 h-full"
                                              defaultValue={field.value}
                                            />
                                            <span className="text-[10px] ml-1 text-black/20 uppercase font-black">
                                              {field.unit}
                                            </span>
                                          </div>
                                        )
                                      ) : (
                                        <p className="text-[12px] font-black text-[#0D0D0D] leading-none">
                                          {field.value}
                                          {field.unit && (
                                            <span className="text-[10px] ml-1 text-black/20 font-bold">
                                              {field.unit}
                                            </span>
                                          )}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Metabolic Panel Compact */}
                          <div className="p-4 bg-[#0D0D0D] rounded-3xl text-white overflow-hidden relative shadow-xl border border-white/5">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#9FD923]/10 rounded-full blur-3xl -mr-10 -mt-10" />
                            <div className="flex gap-4">
                              {[
                                {
                                  label: "BMI Ratio",
                                  value: "22.9",
                                  status: "Healthy",
                                  color: "text-[#9FD923]",
                                },
                                {
                                  label: "BMR Rate",
                                  value: "1,745",
                                  status: "kcal/d",
                                  color: "text-blue-400",
                                },
                                {
                                  label: "Daily TDEE",
                                  value: "2,400",
                                  status: "kcal/d",
                                  color: "text-orange-400",
                                },
                              ].map((field, i) => (
                                <div
                                  key={i}
                                  className="flex-1 text-center border-l first:border-l-0 border-white/10"
                                >
                                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block mb-1">
                                    {field.label}
                                  </span>
                                  <p className="text-[22px] font-black text-white">
                                    {field.value}
                                  </p>
                                  <p
                                    className={cn(
                                      "text-[9px] font-black uppercase mt-1",
                                      field.color,
                                    )}
                                  >
                                    {field.status}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Premium Bottom Bar Compact - Fixed Glow */}
                        <div className="flex justify-end gap-3 mt-6 h-12">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => setIsEditing(false)}
                                className="px-6 h-full bg-[#F2F2F2] text-[#0D0D0D]/40 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-white hover:text-red-500 border border-transparent hover:border-red-100 transition-all font-bold flex items-center justify-center"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => setIsEditing(false)}
                                className="px-8 h-full bg-[#0D0D0D] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#9FD923] hover:text-[#0D0D0D] transition-all group shadow-xl shadow-[#9FD923]/10 font-bold flex items-center gap-2 justify-center"
                              >
                                Save Stats
                                <Zap className="w-3 h-3 text-[#9FD923] group-hover:text-[#0D0D0D]" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => setIsEditing(true)}
                              className="group relative overflow-visible h-full"
                            >
                              <div className="absolute inset-0.5 bg-linear-to-r from-[#9FD923] to-[#D9F2A2] rounded-2xl opacity-0 group-hover:opacity-40 transition-all duration-300 blur-md" />
                              <div className="relative flex items-center gap-4 px-6 h-full bg-[#0D0D0D] rounded-2xl border border-white/10 shadow-xl transition-all duration-300 active:scale-95 justify-center">
                                <div className="p-1.5 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                                  <Zap className="w-4 h-4 text-[#9FD923]" />
                                </div>
                                <span className="text-[12px] font-black text-white uppercase tracking-[0.15em] font-bold">
                                  Edit Profile
                                </span>
                                <ChevronDown className="w-4 h-4 text-white/30 -rotate-90 ml-2 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {profileTab === "Goals" && (
                      <motion.div
                        key="goals"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="space-y-8 h-full flex flex-col"
                      >
                        <div className="p-6 bg-[#D9F2A2]/20 rounded-3xl border border-[#9FD923]/20 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-[#9FD923] rounded-2xl flex items-center justify-center text-[#0D0D0D] shadow-lg">
                              <Target className="w-7 h-7" />
                            </div>
                            <div>
                              <h3 className="text-[18px] font-bold text-[#0D0D0D]">
                                Weight Loss Journey
                              </h3>
                              <p className="text-[13px] text-[#0D0D0D]/40 font-medium">
                                Jan 1, 2024 - Dec 31, 2024
                              </p>
                            </div>
                          </div>
                          <button className="px-5 py-2.5 bg-[#0D0D0D] text-white rounded-xl text-[13px] font-bold">
                            Edit Goal
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div className="col-span-2 p-6 bg-[#F2F2F2]/30 rounded-3xl border border-[#0D0D0D]/5">
                            <div className="flex items-center gap-2 mb-6">
                              <Flame className="w-5 h-5 text-orange-500" />
                              <h4 className="font-bold text-[#0D0D0D]">
                                Daily Calorie Target
                              </h4>
                            </div>
                            <div className="flex items-end gap-3 px-2">
                              <span className="text-[48px] font-black text-[#0D0D0D] leading-none">
                                1,850
                              </span>
                              <span className="text-[16px] font-bold text-[#0D0D0D]/40 mb-2 uppercase">
                                kcal / day
                              </span>
                            </div>
                          </div>

                          {[
                            {
                              label: "Protein",
                              value: 150,
                              unit: "g",
                              color: "bg-blue-500",
                            },
                            {
                              label: "Carbs",
                              value: 210,
                              unit: "g",
                              color: "bg-[#9FD923]",
                            },
                            {
                              label: "Fats",
                              value: 65,
                              unit: "g",
                              color: "bg-orange-400",
                            },
                            {
                              label: "Fiber",
                              value: 30,
                              unit: "g",
                              color: "bg-teal-500",
                            },
                          ].map((macro, i) => (
                            <div
                              key={i}
                              className="p-5 bg-white rounded-2xl border border-[#0D0D0D]/5 shadow-sm"
                            >
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-[12px] font-bold text-[#0D0D0D]/40 uppercase tracking-wider">
                                  {macro.label}
                                </span>
                                <span className="text-[14px] font-black text-[#0D0D0D]">
                                  {macro.value}
                                  {macro.unit}
                                </span>
                              </div>
                              <div className="h-1.5 w-full bg-[#F2F2F2] rounded-full overflow-hidden">
                                <div
                                  className={cn(
                                    "h-full rounded-full",
                                    macro.color,
                                  )}
                                  style={{ width: "70%" }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {profileTab === "Allergies" && (
                      <motion.div
                        key="allergies"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="space-y-8 h-full flex flex-col"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-[22px] font-bold text-[#0D0D0D]">
                            Dietary Restrictions
                          </h3>
                          <button className="text-[13px] font-bold text-[#9FD923]">
                            + Add Allergen
                          </button>
                        </div>

                        <div className="space-y-4">
                          {[
                            {
                              name: "Peanuts",
                              severity: "High",
                              icon: Beaker,
                              note: "Strict avoidance required. Risk of anaphylaxis.",
                            },
                            {
                              name: "Shellfish",
                              severity: "Medium",
                              icon: Activity,
                              note: "Keep antihistamines nearby.",
                            },
                            {
                              name: "Lactose",
                              severity: "Low",
                              icon: Zap,
                              note: "Moderate digestive discomfort.",
                            },
                          ].map((allergy, i) => (
                            <div
                              key={i}
                              className="p-5 bg-[#F2F2F2]/30 rounded-2xl border border-[#0D0D0D]/5 flex gap-5 group hover:border-red-100 transition-colors"
                            >
                              <div
                                className={cn(
                                  "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                                  allergy.severity === "High"
                                    ? "bg-red-50 text-red-500"
                                    : allergy.severity === "Medium"
                                      ? "bg-orange-50 text-orange-500"
                                      : "bg-blue-50 text-blue-500",
                                )}
                              >
                                <allergy.icon className="w-7 h-7" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-bold text-[#0D0D0D] text-[17px]">
                                    {allergy.name}
                                  </h4>
                                  <span
                                    className={cn(
                                      "px-2 py-1 text-[10px] font-black uppercase rounded-md tracking-widest",
                                      allergy.severity === "High"
                                        ? "bg-red-500 text-white"
                                        : allergy.severity === "Medium"
                                          ? "bg-orange-500 text-white"
                                          : "bg-blue-500 text-white",
                                    )}
                                  >
                                    {allergy.severity} Risk
                                  </span>
                                </div>
                                <p className="text-[13px] text-[#0D0D0D]/40 font-medium mt-1 leading-relaxed">
                                  {allergy.note}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {profileTab === "Security" && (
                      <motion.div
                        key="security"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="space-y-6"
                      >
                        <h3 className="text-[22px] font-bold text-[#0D0D0D]">
                          Security Settings
                        </h3>
                        <div className="space-y-4">
                          {[
                            {
                              title: "Two-Factor Authentication",
                              desc: "Add an extra layer of security to your account.",
                              enabled: true,
                            },
                            {
                              title: "Personal Login History",
                              desc: "Monitor your account activity and login attempts.",
                              enabled: false,
                            },
                          ].map((item, i) => (
                            <div
                              key={i}
                              className="p-5 border border-[#0D0D0D]/5 rounded-2xl flex items-center justify-between hover:bg-[#F2F2F2]/30 transition-colors"
                            >
                              <div>
                                <h4 className="font-bold text-[#0D0D0D] text-[15px]">
                                  {item.title}
                                </h4>
                                <p className="text-[13px] text-[#0D0D0D]/40 font-medium">
                                  {item.desc}
                                </p>
                              </div>
                              <div
                                className={cn(
                                  "w-12 h-6 rounded-full p-1 cursor-pointer transition-colors",
                                  item.enabled
                                    ? "bg-[#9FD923]"
                                    : "bg-[#0D0D0D]/10",
                                )}
                              >
                                <div
                                  className={cn(
                                    "w-4 h-4 bg-white rounded-full transition-transform shadow-sm",
                                    item.enabled
                                      ? "translate-x-6"
                                      : "translate-x-0",
                                  )}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {profileTab === "Logout" && (
                      <motion.div
                        key="logout"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="h-full flex flex-col items-center justify-center text-center space-y-6"
                      >
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center shadow-lg">
                          <LogOut className="w-10 h-10" />
                        </div>
                        <div>
                          <h3 className="text-[22px] font-bold text-[#0D0D0D]">
                            Are you leaving?
                          </h3>
                          <p className="text-[#0D0D0D]/40 font-medium max-w-[280px] mx-auto mt-2">
                            We&apos;ll miss you. You&apos;ll need to log in
                            again to access your food dashboard.
                          </p>
                        </div>
                        <div className="flex gap-4 w-full max-w-[320px]">
                          <button
                            onClick={() => setProfileTab("Profile")}
                            className="flex-1 py-4 font-bold text-[#0D0D0D]/60 hover:text-[#0D0D0D]"
                          >
                            Cancel
                          </button>
                          <button className="flex-2 py-4 bg-red-500 text-white rounded-2xl font-bold shadow-xl shadow-red-500/20 hover:bg-red-600 transition-colors">
                            Yes, Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
};

export default Header;
