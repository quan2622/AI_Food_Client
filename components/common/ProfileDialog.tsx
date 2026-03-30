"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  ChevronDown,
  ShieldCheck,
  LogOut,
  Camera,
  Mail,
  Calendar,
  Target,
  Zap,
  Scale,
  Activity,
  AlertTriangle,
  Dna,
  History,
  CheckCircle,
} from "lucide-react";
import { cn, formatDate, formatNumber } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProfileDialogProps {
  trigger?: React.ReactNode;
}

export const ProfileDialog = ({ trigger }: ProfileDialogProps) => {
  const { user, logoutAction } = useAuthStore();
  const router = useRouter();
  const [profileTab, setProfileTab] = useState("Profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      logoutAction();
      router.push("/sign-in");
    }
  };

  const name = user?.fullName || "Guest User";
  const role = user?.isAdmin ? "Admin" : "Member";
  const email = user?.email || "N/A";
  const birthday = formatDate(user?.dateOfBirth);

  const profile = user?.userProfile;
  const weight = profile?.weight || 0;
  const height = profile?.height || 0;
  const age = profile?.age || 0;
  const gender = profile?.gender || "N/A";
  const activity = profile?.activityLevel || "N/A";
  const bmi = profile?.bmi || 0;
  const bmr = profile?.bmr || 0;
  const tdee = profile?.tdee || 0;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) setProfileTab("Profile");
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <button
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 backdrop-blur-xl text-[#0D0D0D] border border-[#0D0D0D]/10 transition-all duration-300 hover:border-[#9FD923]/30 shadow-sm cursor-pointer overflow-hidden group"
          >
            <User className="h-6 w-6 text-[#0D0D0D]/80 group-hover:text-[#9FD923] transition-colors" />
          </button>
        )}
      </DialogTrigger>

      {/* DialogContent stripped of all CSS animation — Framer Motion handles it */}
      <DialogContent
        showCloseButton={false}
        className="p-0 border-none bg-transparent shadow-none overflow-visible"
      >
        <DialogTitle className="sr-only">User Settings</DialogTitle>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="profile-dialog-outer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 32,
                mass: 0.75,
              }}
              className="flex h-[650px] w-[900px] overflow-hidden rounded-3xl bg-white shadow-2xl transform-gpu relative"
            >
              {/* ──────────── Sidebar ──────────── */}
              <div className="w-[240px] bg-[#F2F2F2]/50 border-r border-[#0D0D0D]/5 p-6 flex flex-col gap-2">
                <div className="mb-8 px-2">
                  <h2 className="text-[20px] font-bold text-[#0D0D0D]">Settings</h2>
                  <p className="text-[12px] text-[#0D0D0D]/40 font-medium uppercase tracking-widest mt-1">
                    User Management
                  </p>
                </div>

                {[
                  { id: "Profile", icon: User, label: "Profile" },
                  { id: "Goals", icon: Target, label: "My Goals" },
                  { id: "Allergies", icon: AlertTriangle, label: "Allergies" },
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
                    onClick={() => {
                      if (tab.id === "Logout") {
                        setShowLogoutConfirm(true);
                      } else {
                        setProfileTab(tab.id);
                      }
                    }}
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

              {/* ──────────── Content Area ──────────── */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: "easeOut", delay: 0.08 }}
                className="flex-1 p-10 overflow-y-auto custom-scrollbar relative"
              >
                <AnimatePresence mode="wait">
                  {/* ── Profile Tab ── */}
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
                              {name}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="px-1.5 py-0.5 rounded bg-[#9FD923] text-[#0D0D0D] text-[10px] font-black uppercase tracking-wider">
                                {role}
                              </span>
                              <span className="text-[#0D0D0D]/30 font-bold text-[11px]">
                                {user?.status ? "Active Member" : "Inactive Member"}
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
                                value: email,
                                icon: Mail,
                                color: "text-[#9FD923]",
                              },
                              {
                                label: "Birthday",
                                value: birthday,
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
                              { label: "Weight", value: weight.toString(), unit: "kg", icon: Scale },
                              { label: "Height", value: height.toString(), unit: "cm", icon: Activity },
                              { label: "Gender", value: gender, unit: "", icon: User, type: "gender" },
                              { label: "Activity", value: activity, unit: "", icon: Dna, type: "select" },
                              { label: "Age", value: age.toString(), unit: "y", icon: User },
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
                                        <select
                                          className="bg-transparent text-[12px] font-bold text-[#9FD923] outline-none text-right cursor-pointer p-0 m-0 h-full border-none appearance-none"
                                          defaultValue={field.value}
                                        >
                                          <option value="SEDENTARY">SEDENTARY</option>
                                          <option value="LIGHTLY_ACTIVE">LIGHTLY_ACTIVE</option>
                                          <option value="MODERATELY_ACTIVE">MODERATELY_ACTIVE</option>
                                          <option value="VERY_ACTIVE">VERY_ACTIVE</option>
                                          <option value="EXTRA_ACTIVE">EXTRA_ACTIVE</option>
                                        </select>
                                      ) : field.type === "gender" ? (
                                        <select
                                          className="bg-transparent text-[12px] font-bold text-[#9FD923] outline-none text-right cursor-pointer p-0 m-0 h-full border-none appearance-none"
                                          defaultValue={field.value}
                                        >
                                          <option value="male">Male</option>
                                          <option value="female">Female</option>
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
                                value: bmi.toFixed(1),
                                status: bmi < 18.5 ? "Underweight" : bmi < 25 ? "Healthy" : "Overweight",
                                color: bmi < 18.5 ? "text-yellow-400" : bmi < 25 ? "text-[#9FD923]" : "text-red-400",
                              },
                              {
                                label: "BMR Rate",
                                value: formatNumber(bmr),
                                status: "kcal/d",
                                color: "text-blue-400",
                              },
                              {
                                label: "Daily TDEE",
                                value: formatNumber(tdee),
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
                                <p className={cn("text-[9px] font-black uppercase mt-1", field.color)}>
                                  {field.status}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Action Bar */}
                      <div className="flex justify-end gap-3 mt-6 h-12">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => setIsEditing(false)}
                              className="px-6 h-full bg-[#F2F2F2] text-[#0D0D0D]/40 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-white hover:text-red-500 border border-transparent hover:border-red-100 transition-all flex items-center justify-center"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => setIsEditing(false)}
                              className="px-8 h-full bg-[#0D0D0D] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#9FD923] hover:text-[#0D0D0D] transition-all group shadow-xl shadow-[#9FD923]/10 flex items-center gap-2 justify-center"
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
                              <span className="text-[12px] font-black text-white uppercase tracking-[0.15em]">
                                Edit Profile
                              </span>
                              <ChevronDown className="w-4 h-4 text-white/30 -rotate-90 ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* ── Goals Tab ── */}
                  {profileTab === "Goals" && (
                    <motion.div
                      key="goals"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="space-y-8 h-full flex flex-col pt-2"
                    >
                      {/* Current Goal */}
                      <div>
                        <h4 className="text-[11px] font-black text-[#0D0D0D]/30 uppercase tracking-[0.2em] mb-3 ml-2">
                          Active Goal
                        </h4>
                        <div className="p-5 bg-[#D9F2A2]/20 rounded-3xl border border-[#9FD923]/20 flex items-center justify-between hover:bg-[#D9F2A2]/30 transition-colors shadow-sm">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-[#9FD923] rounded-2xl flex items-center justify-center text-[#0D0D0D] shadow-lg shadow-[#9FD923]/20">
                              <Target className="w-7 h-7" />
                            </div>
                            <div>
                              <h3 className="text-[18px] font-black text-[#0D0D0D]">
                                Weight Loss Journey
                              </h3>
                              <p className="text-[12px] text-[#0D0D0D]/50 font-bold flex items-center gap-1.5 mt-0.5">
                                <Calendar className="w-3.5 h-3.5 opacity-70" />
                                Jan 1, 2024 - Dec 31, 2024
                              </p>
                            </div>
                          </div>
                          <button className="px-5 py-2.5 bg-[#0D0D0D] text-white rounded-[14px] text-[11px] font-black uppercase tracking-[0.1em] hover:bg-[#9FD923] hover:text-[#0D0D0D] transition-all group border border-transparent shadow hover:shadow-[#9FD923]/20">
                            Edit Goal
                          </button>
                        </div>
                      </div>

                      {/* Goal History */}
                      <div className="flex-1 flex flex-col min-h-0">
                        <div className="flex items-center gap-2 mb-3 ml-2">
                          <History className="w-4 h-4 text-[#0D0D0D]/30" />
                          <h4 className="text-[11px] font-black text-[#0D0D0D]/30 uppercase tracking-[0.2em]">
                            Goal History
                          </h4>
                        </div>
                        
                        <div className="flex flex-col gap-3 overflow-y-auto pr-3 -mr-3 custom-scrollbar pb-6 max-h-[340px]">
                          {[
                            {
                              id: 1,
                              title: "Muscle Build Phase",
                              duration: "Aug 1, 2023 - Dec 31, 2023",
                              status: "Completed",
                              result: "+4kg Muscle",
                            },
                            {
                              id: 2,
                              title: "Summer Cut",
                              duration: "Mar 1, 2023 - Jul 31, 2023",
                              status: "Completed",
                              result: "-5kg Fat",
                            },
                            {
                              id: 3,
                              title: "Healthy Maintenance",
                              duration: "Jan 1, 2022 - Feb 28, 2023",
                              status: "Completed",
                              result: "Maintained 70kg",
                            },
                            {
                              id: 4,
                              title: "Initial Weight Loss",
                              duration: "Jul 1, 2021 - Dec 31, 2021",
                              status: "Completed",
                              result: "-8kg Fat",
                            },
                            {
                              id: 5,
                              title: "Get Started Journey",
                              duration: "Jan 1, 2021 - Jun 30, 2021",
                              status: "Completed",
                              result: "Formed Habit",
                            }
                          ].map((history) => (
                            <div 
                              key={history.id}
                              className="p-4 bg-[#F2F2F2]/50 rounded-[1.25rem] border border-[#0D0D0D]/5 flex items-center justify-between group hover:bg-white hover:border-[#0D0D0D]/10 transition-all duration-300 hover:shadow-xs"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-[#0D0D0D]/5 group-hover:bg-[#D9F2A2]/20 group-hover:border-[#9FD923]/20 transition-colors shadow-xs">
                                  <CheckCircle className="w-5 h-5 text-[#0D0D0D]/20 group-hover:text-[#9FD923] transition-colors" />
                                </div>
                                <div className="flex flex-col justify-center">
                                  <h4 className="text-[14px] font-bold text-[#0D0D0D] group-hover:text-[#0D0D0D] transition-colors line-clamp-1">
                                    {history.title}
                                  </h4>
                                  <p className="text-[11px] text-[#0D0D0D]/40 font-bold flex items-center gap-1.5 mt-0.5">
                                    <Calendar className="w-3 h-3 opacity-60" />
                                    {history.duration}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right shrink-0 ml-4 flex flex-col items-end justify-center">
                                <div className="inline-block px-2 py-0.5 bg-[#D9F2A2]/40 text-[#5c8111] rounded-md text-[9px] font-black uppercase tracking-widest mb-1.5 border border-[#9FD923]/20">
                                  {history.status}
                                </div>
                                <p className="text-[12px] font-black text-[#0D0D0D]/70 bg-white/50 px-2 py-0.5 rounded-lg border border-[#0D0D0D]/5">
                                  {history.result}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ── Security Tab ── */}
                  {profileTab === "Security" && (
                    <motion.div
                      key="security"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="h-full flex flex-col justify-between"
                    >
                      <div className="space-y-6">
                        <div className="p-6 bg-[#F2F2F2]/50 rounded-3xl border border-[#0D0D0D]/5">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-[#0D0D0D]/5">
                              <ShieldCheck className="w-6 h-6 text-[#0D0D0D]" />
                            </div>
                            <div>
                              <h3 className="text-[18px] font-bold text-[#0D0D0D]">Password & Security</h3>
                              <p className="text-[12px] text-[#0D0D0D]/40 font-medium mt-0.5">Manage your credentials</p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="text-[10px] font-black text-[#0D0D0D]/30 uppercase tracking-widest pl-1 block mb-2">
                                Current Password
                              </label>
                              <div className="relative">
                                <input 
                                  type="password"
                                  placeholder="••••••••"
                                  className="w-full bg-white border border-[#0D0D0D]/5 rounded-2xl px-4 py-3.5 text-[14px] font-bold text-[#0D0D0D] outline-none focus:border-[#9FD923] shadow-sm transition-all"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-[10px] font-black text-[#0D0D0D]/30 uppercase tracking-widest pl-1 block mb-2">
                                New Password
                              </label>
                              <div className="relative">
                                <input 
                                  type="password"
                                  placeholder="••••••••"
                                  className="w-full bg-white border border-[#0D0D0D]/5 rounded-2xl px-4 py-3.5 text-[14px] font-bold text-[#0D0D0D] outline-none focus:border-[#9FD923] shadow-sm transition-all"
                                />
                              </div>
                            </div>
                            
                            <div className="flex justify-end pt-4">
                              <button className="px-8 py-3.5 bg-[#0D0D0D] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#9FD923] hover:text-[#0D0D0D] transition-all group shadow-xl shadow-[#9FD923]/10 flex items-center gap-2">
                                Save Password
                                <ShieldCheck className="w-3.5 h-3.5 text-[#9FD923] group-hover:text-[#0D0D0D]" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              {/* ── End Content Area ── */}

              {/* ── Logout Confirmation Overlay ── */}
              <AnimatePresence>
                {showLogoutConfirm && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 flex items-center justify-center bg-[#0D0D0D]/40 backdrop-blur-sm"
                  >
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0, y: 10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.95, opacity: 0, y: 10 }}
                      className="w-full max-w-sm p-8 bg-white rounded-[2.5rem] border border-[#0D0D0D]/10 flex flex-col items-center text-center shadow-2xl"
                    >
                      <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center border-2 border-red-100 shadow-sm text-red-500 mb-6 relative">
                        <LogOut className="w-10 h-10 ml-1" />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                          <span className="text-[13px] text-white font-black block leading-none select-none">!</span>
                        </div>
                      </div>
                      <h3 className="text-[22px] font-black text-[#0D0D0D] mb-2">
                        Sign Out
                      </h3>
                      <p className="text-[14px] text-[#0D0D0D]/60 font-medium mb-8">
                        Are you sure you want to log out of your account? You will need to sign back in to access your data.
                      </p>
                      
                      <div className="flex w-full gap-3">
                        <button 
                          onClick={() => setShowLogoutConfirm(false)}
                          className="flex-1 py-4 bg-[#F2F2F2] text-[#0D0D0D] rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-[#E5E5E5] transition-colors border border-[#0D0D0D]/5"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleLogout}
                          className="flex-1 py-4 bg-red-500 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                        >
                          Yes, Sign Out
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
