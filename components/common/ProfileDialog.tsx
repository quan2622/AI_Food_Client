"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

interface ProfileDialogProps {
  trigger?: React.ReactNode;
}

export const ProfileDialog = ({ trigger }: ProfileDialogProps) => {
  const [profileTab, setProfileTab] = useState("Profile");
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (isOpen) setProfileTab("Profile");
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 backdrop-blur-xl text-[#0D0D0D] border border-[#0D0D0D]/10 transition-all duration-300 hover:border-[#9FD923]/30 shadow-sm cursor-pointer overflow-hidden group">
            <User className="h-6 w-6 text-[#0D0D0D]/80 group-hover:text-[#9FD923] transition-colors" />
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="min-w-7xl p-0 overflow-hidden border-none bg-white rounded-3xl shadow-2xl">
        <DialogTitle className="sr-only">User Settings</DialogTitle>
        <div className="flex h-[650px]">
          {/* Sidebar */}
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
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
