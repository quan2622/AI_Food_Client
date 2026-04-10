"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileDialog } from "@/components/common/ProfileDialog";
import { Activity, Target, Weight, Zap, Flame, Ruler, Settings, Loader2 } from "lucide-react";
import {
  userProfileService,
  IUserProfileWithUser,
} from "@/services/userProfileService";

/** Map activityLevel code → human-readable Vietnamese label */
function activityLabel(level?: string | null): string {
  const map: Record<string, string> = {
    ACT_SEDENTARY: "Ít vận động",
    SEDENTARY: "Ít vận động",
    ACT_LIGHT: "Nhẹ nhàng",
    LIGHTLY_ACTIVE: "Nhẹ nhàng",
    ACT_MODERATE: "Trung bình",
    MODERATELY_ACTIVE: "Trung bình",
    ACT_ACTIVE: "Năng động",
    VERY_ACTIVE: "Năng động",
    ACT_VERY_ACTIVE: "Rất năng động",
    SUPER_ACTIVE: "Rất năng động",
  };
  return level ? map[level] ?? level : "—";
}

/** BMI classification in Vietnamese */
function bmiClassification(bmi: number): string {
  if (bmi < 18.5) return "Thiếu cân";
  if (bmi < 25) return "Bình thường";
  if (bmi < 30) return "Thừa cân";
  return "Béo phì";
}

interface MetricItem {
  label: string;
  value: string;
  sub: string;
  color: string;
  icon: React.ComponentType<{ size?: number }>;
}

function buildMetrics(profile: IUserProfileWithUser): MetricItem[] {
  return [
    {
      label: "BMI",
      value: profile.bmi?.toFixed(1) ?? "—",
      sub: bmiClassification(profile.bmi ?? 0),
      color: "bg-green-50 text-green-600",
      icon: Weight,
    },
    {
      label: "TDEE",
      value: profile.tdee?.toLocaleString() ?? "—",
      sub: "kcal/ngày",
      color: "bg-blue-50 text-blue-600",
      icon: Zap,
    },
    {
      label: "Chiều cao",
      value: profile.height?.toString() ?? "—",
      sub: "cm",
      color: "bg-orange-50 text-orange-600",
      icon: Ruler,
    },
    {
      label: "Cân nặng",
      value: profile.weight?.toString() ?? "—",
      sub: "kg",
      color: "bg-green-50 text-green-600",
      icon: Activity,
    },
    {
      label: "BMR",
      value: profile.bmr?.toLocaleString() ?? "—",
      sub: "kcal/ngày",
      color: "bg-red-50 text-red-600",
      icon: Flame,
    },
    {
      label: "Vận động",
      value: activityLabel(profile.activityLevel),
      sub: "",
      color: "bg-purple-50 text-purple-600",
      icon: Target,
    },
  ];
}

export default function BodyMetrics() {
  const [profile, setProfile] = useState<IUserProfileWithUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const res = await userProfileService.getUserProfile();
        if (isMounted && res.data) {
          setProfile(res.data);
        }
      } catch {
        // silently ignore – will show skeleton / dash values
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const metrics = profile ? buildMetrics(profile) : [];

  return (
    <Card className="rounded-3xl border-0 shadow-sm bg-white overflow-hidden h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3 px-6 pt-6 -mb-3">
        <CardTitle className="text-lg font-bold">Chỉ số cơ thể</CardTitle>
        <ProfileDialog trigger={
          <button className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-50 text-gray-400 hover:bg-[#9fd923] hover:text-[#0D0D0D] transition-all duration-300 font-bold text-sm shadow-xs border border-gray-100/50">
            <Settings size={16} />
            <span>Chỉnh sửa</span>
          </button>
        } />
      </CardHeader>
      <CardContent className="px-6 pb-6">
        {loading ? (
          <div className="flex items-center justify-center h-[260px]">
            <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 h-full">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="group p-4 rounded-2xl border border-gray-50 bg-gray-50/50 hover:bg-white hover:border-[#9fd923] hover:shadow-md transition-all duration-300 flex flex-col justify-center"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{m.label}</span>
                  <div className={`p-1.5 rounded-lg ${m.color}`}>
                    <m.icon size={16} />
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-gray-800 tracking-tight group-hover:text-[#9fd923] transition-colors">{m.value}</span>
                  <span className="text-[10px] text-gray-400 font-semibold">{m.sub}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
