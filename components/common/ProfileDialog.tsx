"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
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
  Search,
  ArrowLeft,
  Trash2,
  Plus,
  Pencil,
  Eye,
} from "lucide-react";
import { cn, formatDate, formatNumber } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { authService } from "@/services/authService";
import { userProfileService } from "@/services/userProfileService";
import { allergenService } from "@/services/allergenService";
import { nutritionGoalService } from "@/services/nutritionGoalService";
import { SeverityType, GoalType, NutritionGoalStatus } from "@/types/enum.type";
import { IAllergen, IUserAllergy } from "@/types/allergen.type";
import {
  INutritionGoal,
  ICreateNutritionGoalRequest,
} from "@/types/nutrition-goal.type";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ProfileDialogProps {
  trigger?: React.ReactNode;
  defaultTab?: string;
}

const normalizeActivityLevel = (val: string | undefined): string => {
  if (!val) return "SEDENTARY";
  if (val === "ACT_SEDENTARY" || val === "SEDENTARY") return "SEDENTARY";
  if (val === "ACT_LIGHT" || val === "LIGHTLY_ACTIVE") return "LIGHTLY_ACTIVE";
  if (val === "ACT_MODERATE" || val === "MODERATELY_ACTIVE")
    return "MODERATELY_ACTIVE";
  if (val === "ACT_VERY" || val === "ACT_ACTIVE" || val === "VERY_ACTIVE")
    return "VERY_ACTIVE";
  if (
    val === "ACT_SUPER" ||
    val === "ACT_VERY_ACTIVE" ||
    val === "SUPER_ACTIVE"
  )
    return "SUPER_ACTIVE";
  return val.replace("ACT_", ""); // Fallback
};

const denormalizeActivityLevel = (val: string | undefined): string => {
  if (!val) return "ACT_SEDENTARY";
  if (val === "SEDENTARY") return "ACT_SEDENTARY";
  if (val === "LIGHTLY_ACTIVE") return "ACT_LIGHT";
  if (val === "MODERATELY_ACTIVE") return "ACT_MODERATE";
  if (val === "VERY_ACTIVE") return "ACT_VERY";
  if (val === "SUPER_ACTIVE") return "ACT_SUPER";
  return val;
};

export const ProfileDialog = ({
  trigger,
  defaultTab = "Profile",
}: ProfileDialogProps) => {
  const { user, logoutAction, setUser } = useAuthStore();
  const router = useRouter();
  const [profileTab, setProfileTab] = useState(defaultTab);
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || "",
    dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
    weight: user?.userProfile?.weight || 0,
    height: user?.userProfile?.height || 0,
    gender: user?.userProfile?.gender || "MALE",
    activityLevel: normalizeActivityLevel(user?.userProfile?.activityLevel),
  });

  const handleStartEditing = () => {
    setProfileForm({
      fullName: user?.fullName || "",
      dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
      weight: user?.userProfile?.weight || 0,
      height: user?.userProfile?.height || 0,
      gender: user?.userProfile?.gender || "MALE",
      activityLevel: normalizeActivityLevel(user?.userProfile?.activityLevel),
    });
    setIsEditing(true);
  };

  const handleProfileFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: name === "weight" || name === "height" ? Number(value) : value,
    }));
  };

  const currentAge = useMemo(() => {
    const dob = isEditing
      ? profileForm.dateOfBirth
      : user?.dateOfBirth?.split("T")[0] || "";
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }, [profileForm.dateOfBirth, user?.dateOfBirth, isEditing]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Chỉ chấp nhận ảnh jpg, png hoặc webp.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ảnh không được vượt quá 5MB.");
      return;
    }
    setAvatarFile(file);
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  };

  // Security Form State
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Allergies State
  const [userAllergies, setUserAllergies] = useState<IUserAllergy[]>([]);
  const [allAllergens, setAllAllergens] = useState<IAllergen[]>([]);
  const [isAddingAllergy, setIsAddingAllergy] = useState(false);
  const [editingAllergyId, setEditingAllergyId] = useState<number | null>(null);
  const [allergenSearch, setAllergenSearch] = useState("");
  const [selectedAllergenId, setSelectedAllergenId] = useState<number | null>(
    null,
  );
  const [allergenSeverity, setAllergenSeverity] = useState<SeverityType>(
    SeverityType.SEV_MEDIUM,
  );
  const [allergenNote, setAllergenNote] = useState("");
  const [isLoadingAllergies, setIsLoadingAllergies] = useState(false);

  // Nutrition Goals State
  const [currentGoal, setCurrentGoal] = useState<INutritionGoal | null>(null);
  const [goalHistory, setGoalHistory] = useState<INutritionGoal[]>([]);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<number | null>(null);
  const [isLoadingGoals, setIsLoadingGoals] = useState(false);

  // Nutrition Goal Form State
  const [goalForm, setGoalForm] = useState<ICreateNutritionGoalRequest>({
    goalType: GoalType.GOAL_LOSS,
    targetWeight: user?.weight || 0,
    targetCalories: 2000,
    targetProtein: 150,
    targetCarbs: 250,
    targetFat: 70,
    targetFiber: 30,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    status: NutritionGoalStatus.NUTR_GOAL_ONGOING,
  });

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

  const handleUpdatePassword = async () => {
    if (!user?.id) return;
    if (!oldPassword || !newPassword) {
      toast.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    if (newPassword.length < 6 || newPassword.length > 100) {
      toast.error("Mật khẩu mới phải từ 6 đến 100 ký tự.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await authService.updatePassword(user.id, {
        oldPassword,
        newPassword,
      });

      if (res.metadata?.EC === 0) {
        toast.success("Cập nhật mật khẩu thành công!");
        setOldPassword("");
        setNewPassword("");
      } else {
        toast.error(res.metadata?.message || "Cập nhật mật khẩu thất bại.");
      }
    } catch (error: any) {
      console.error("Update password failed:", error);
      toast.error(error?.response?.data?.metadata?.message || "Đã xảy ra lỗi.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // ── Allergies Logic ────────────────────────────────────────────────────────
  const fetchUserAllergies = async () => {
    if (!user?.id) return;
    try {
      const res = await allergenService.getUserAllergies(user.id);
      if (res.data) setUserAllergies(res.data);
    } catch (error) {
      console.error("Failed to fetch user allergies", error);
    }
  };

  const fetchAllAllergens = async () => {
    try {
      const res = await allergenService.getAllAllergens();
      // Xử lý cả 2 trường hợp: mảng trực tiếp hoặc bọc trong object ApiResponse
      if (Array.isArray(res)) {
        setAllAllergens(res);
      } else if (res && (res as ApiResponse<IAllergen[]>).data) {
        setAllAllergens((res as ApiResponse<IAllergen[]>).data);
      }
    } catch (error: any) {
      console.error("Failed to fetch all allergens:", error);
      // In chi tiết lỗi nếu có phản hồi từ server
      if (error.response) {
        console.error(
          "Server response:",
          error.response.status,
          error.response.data,
        );
      }
    }
  };

  // Use combined useEffect in Nutrition Goals Logic section

  const filteredAllergens = useMemo(() => {
    return allAllergens.filter((a) =>
      a.name.toLowerCase().includes(allergenSearch.toLowerCase()),
    );
  }, [allAllergens, allergenSearch]);

  const handleAddAllergy = async () => {
    if (!user?.id || !selectedAllergenId) return;
    setIsLoadingAllergies(true);
    try {
      const res = await allergenService.addUserAllergy({
        userId: user.id,
        allergenId: selectedAllergenId,
        severity: allergenSeverity,
        note: allergenNote,
      });
      if (res.metadata?.EC === 0) {
        toast.success("Đã thêm dị ứng mới thành công!");
        setIsAddingAllergy(false);
        setSelectedAllergenId(null);
        setAllergenNote("");
        fetchUserAllergies();
      } else {
        toast.error(res.metadata?.message || "Thêm dị ứng thất bại.");
      }
    } catch (error: any) {
      console.error("Add allergy failed:", error);
      toast.error(error?.response?.data?.metadata?.message || "Đã xảy ra lỗi.");
    } finally {
      setIsLoadingAllergies(false);
    }
  };

  const handleEditAllergy = (allergy: IUserAllergy) => {
    setEditingAllergyId(allergy.id);
    setSelectedAllergenId(allergy.allergenId);
    setAllergenSeverity(allergy.severity);
    setAllergenNote(allergy.note || "");
    setIsAddingAllergy(true);
  };

  const handleUpdateAllergy = async () => {
    if (!editingAllergyId) return;
    setIsLoadingAllergies(true);
    try {
      const res = await allergenService.updateUserAllergy(editingAllergyId, {
        severity: allergenSeverity,
        note: allergenNote,
      });
      if (res.metadata?.EC === 0) {
        toast.success("Cập nhật dị ứng thành công!");
        setIsAddingAllergy(false);
        setEditingAllergyId(null);
        setSelectedAllergenId(null);
        setAllergenNote("");
        fetchUserAllergies();
      } else {
        toast.error(res.metadata?.message || "Cập nhật thất bại.");
      }
    } catch (error: any) {
      console.error("Update allergy failed:", error);
      toast.error(error?.response?.data?.metadata?.message || "Đã xảy ra lỗi.");
    } finally {
      setIsLoadingAllergies(false);
    }
  };

  const handleDeleteAllergy = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa dị ứng này không?")) return;
    try {
      const res = await allergenService.deleteUserAllergy(id);
      if (res.metadata?.EC === 0) {
        toast.success("Đã xóa dị ứng.");
        fetchUserAllergies();
      }
    } catch (error) {
      toast.error("Xóa dị ứng thất bại.");
    }
  };

  const getSeverityColor = (severity: SeverityType) => {
    switch (severity) {
      case SeverityType.SEV_LOW:
        return "text-blue-500 bg-blue-50 border-blue-100";
      case SeverityType.SEV_MEDIUM:
        return "text-yellow-600 bg-yellow-50 border-yellow-100";
      case SeverityType.SEV_HIGH:
        return "text-orange-600 bg-orange-50 border-orange-100";
      case SeverityType.SEV_LIFE_THREATENING:
        return "text-red-600 bg-red-50 border-red-100";
      default:
        return "text-gray-500 bg-gray-50 border-gray-100";
    }
  };

  // ── Nutrition Goals Logic ──────────────────────────────────────────────────
  const fetchGoals = async () => {
    try {
      const [currentRes, historyRes] = await Promise.all([
        nutritionGoalService.getCurrentGoal(),
        nutritionGoalService.getMyGoals(),
      ]);

      const currentData = currentRes.data
        ? currentRes.data
        : currentRes && "id" in currentRes
          ? currentRes
          : null;
      setCurrentGoal(currentData as INutritionGoal | null);

      const historyData = Array.isArray(historyRes)
        ? historyRes
        : historyRes && Array.isArray(historyRes.data)
          ? historyRes.data
          : [];
      setGoalHistory(historyData);
    } catch (error) {
      console.error("Failed to fetch goals", error);
      setGoalHistory([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (profileTab === "Allergies") {
        fetchUserAllergies();
        fetchAllAllergens();
      } else if (profileTab === "Goals") {
        fetchGoals();
      }
    }
  }, [isOpen, profileTab]);

  const handleGoalFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setGoalForm((prev) => ({
      ...prev,
      [name]: name.startsWith("target") ? Number(value) : value,
    }));
  };

  const handleAddGoal = async () => {
    setIsLoadingGoals(true);
    try {
      const res = await nutritionGoalService.createGoal(goalForm);
      if (res.metadata?.EC === 0) {
        toast.success("Đã tạo mục tiêu mới!");
        setIsAddingGoal(false);
        fetchGoals();
      } else {
        toast.error(res.metadata?.message || "Tạo mục tiêu thất bại.");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.metadata?.message || "Đã xảy ra lỗi.");
    } finally {
      setIsLoadingGoals(false);
    }
  };

  const handleEditGoal = (goal: INutritionGoal) => {
    setEditingGoalId(goal.id);
    setGoalForm({
      goalType: goal.goalType,
      targetWeight: goal.targetWeight,
      targetCalories: goal.targetCalories,
      targetProtein: goal.targetProtein,
      targetCarbs: goal.targetCarbs,
      targetFat: goal.targetFat,
      targetFiber: goal.targetFiber,
      startDate: goal.startDate.split("T")[0],
      endDate: goal.endDate.split("T")[0],
      status: goal.status,
    });
    setIsAddingGoal(true);
  };

  const handleUpdateGoal = async () => {
    if (!editingGoalId) return;
    setIsLoadingGoals(true);
    try {
      const res = await nutritionGoalService.updateGoal(
        editingGoalId,
        goalForm,
      );
      if (res.metadata?.EC === 0) {
        toast.success("Cập nhật mục tiêu thành công!");
        setIsAddingGoal(false);
        setEditingGoalId(null);
        fetchGoals();
      } else {
        toast.error(res.metadata?.message || "Cập nhật mục tiêu thất bại.");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.metadata?.message || "Đã xảy ra lỗi.");
    } finally {
      setIsLoadingGoals(false);
    }
  };

  const handleDeleteGoal = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa mục tiêu này?")) return;
    try {
      const res = await nutritionGoalService.deleteGoal(id);
      if (res.metadata?.EC === 0) {
        toast.success("Đã xóa mục tiêu.");
        fetchGoals();
      }
    } catch (error) {
      toast.error("Xóa mục tiêu thất bại.");
    }
  };

  const getGoalTypeLabel = (type: GoalType) => {
    switch (type) {
      case GoalType.GOAL_LOSS:
        return "Giảm cân";
      case GoalType.GOAL_GAIN:
        return "Tăng cân / cơ";
      case GoalType.GOAL_MAINTAIN:
        return "Duy trì cân nặng";
      case GoalType.GOAL_STRICT:
        return "Ăn kiêng nghiêm ngặt";
      default:
        return type;
    }
  };

  const getGoalStatusLabel = (status: NutritionGoalStatus) => {
    switch (status) {
      case NutritionGoalStatus.NUTR_GOAL_ONGOING:
        return "Đang thực hiện";
      case NutritionGoalStatus.NUTR_GOAL_COMPLETED:
        return "Đã hoàn thành";
      case NutritionGoalStatus.NUTR_GOAL_PAUSED:
        return "Tạm dừng";
      case NutritionGoalStatus.NUTR_GOAL_FAILED:
        return "Thất bại";
      default:
        return status.replace("NUTR_GOAL_", "");
    }
  };

  const getStatusBadge = (status: NutritionGoalStatus) => {
    switch (status) {
      case NutritionGoalStatus.NUTR_GOAL_ONGOING:
        return "bg-blue-100 text-blue-600 border-blue-200";
      case NutritionGoalStatus.NUTR_GOAL_COMPLETED:
        return "bg-green-100 text-green-600 border-green-200";
      case NutritionGoalStatus.NUTR_GOAL_PAUSED:
        return "bg-yellow-100 text-yellow-600 border-yellow-200";
      case NutritionGoalStatus.NUTR_GOAL_FAILED:
        return "bg-red-100 text-red-600 border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const name = user?.fullName || "Người dùng khách";
  const role = user?.isAdmin ? "Admin" : "Member";
  const email = user?.email || "N/A";
  const birthday = user?.dateOfBirth
    ? format(new Date(user.dateOfBirth), "dd/MM/yyyy")
    : "N/A";

  const profile = user?.userProfile;
  const weight = profile?.weight || 0;
  const height = profile?.height || 0;
  const age = profile?.age || 0;

  const genderMap: Record<string, string> = {
    MALE: "Nam",
    FEMALE: "Nữ",
    UNDEFINED: "Khác",
    "N/A": "Chưa cập nhật",
  };
  const gender =
    genderMap[profile?.gender || "N/A"] || profile?.gender || "Chưa cập nhật";

  const activityMap: Record<string, string> = {
    SEDENTARY: "Ít vận động",
    LIGHTLY_ACTIVE: "Vận động nhẹ",
    MODERATELY_ACTIVE: "Vận động vừa",
    VERY_ACTIVE: "Năng động",
    SUPER_ACTIVE: "Cường độ cao",
    ACT_SEDENTARY: "Ít vận động",
    ACT_LIGHT: "Vận động nhẹ",
    ACT_MODERATE: "Vận động vừa",
    ACT_ACTIVE: "Năng động",
    ACT_VERY_ACTIVE: "Cường độ cao",
    "N/A": "Chưa cập nhật",
  };
  const activity =
    activityMap[profile?.activityLevel || "N/A"] ||
    profile?.activityLevel ||
    "Chưa cập nhật";

  const bmi = profile?.bmi || 0;
  const bmr = profile?.bmr || 0;
  const tdee = profile?.tdee || 0;

  const handleSaveProfile = async () => {
    setIsUpdatingProfile(true);
    try {
      // 1. PATCH /users/me — user-level fields (multipart/form-data)
      const formData = new FormData();
      if (profileForm.fullName)
        formData.append("fullName", profileForm.fullName);
      if (profileForm.dateOfBirth)
        formData.append("birthOfDate", profileForm.dateOfBirth);
      if (avatarFile) formData.append("avatar", avatarFile);

      const meRes = await authService.updateMe(formData);
      if (meRes.metadata?.EC !== 0 && meRes.metadata) {
        toast.error(meRes.metadata.message || "Cập nhật thông tin thất bại.");
        return;
      }

      // 2. PATCH /user-profiles — physical stats
      const profileData = {
        weight: profileForm.weight,
        height: profileForm.height,
        gender: profileForm.gender,
        activityLevel: denormalizeActivityLevel(profileForm.activityLevel),
      };
      await userProfileService.updateUserProfile(profileData);

      // 3. Refetch to sync latest data (bmi, bmr, tdee, new avatarUrl…)
      const refreshedRes = await authService.getMe();
      if (refreshedRes.metadata?.EC === 0 && refreshedRes.data) {
        setUser(refreshedRes.data);
      }

      setAvatarFile(null);
      setAvatarPreview(null);
      toast.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.metadata?.message || "Cập nhật thất bại.",
      );
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const roleLabel =
    user?.role === "MEMBER" ? "THÀNH VIÊN" : user?.role || "NGƯỜI DÙNG";

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) setProfileTab(defaultTab);
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <button className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-xl bg-white/80 backdrop-blur-xl text-[#0D0D0D] border border-[#0D0D0D]/10 transition-all duration-300 hover:border-[#9FD923]/30 shadow-sm cursor-pointer overflow-hidden group">
            <User className="h-5 w-5 text-[#0D0D0D]/80 group-hover:text-[#9FD923] transition-colors" />
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
              className="flex flex-col md:flex-row h-[100dvh] md:h-[650px] w-screen md:w-[900px] overflow-hidden rounded-none md:rounded-3xl bg-white shadow-2xl transform-gpu relative"
            >
              {/* ──────────── Sidebar (Desktop: vertical, Mobile: horizontal tab bar) ──────────── */}
              <div className="md:w-[240px] bg-[#F2F2F2]/50 border-b md:border-b-0 md:border-r border-[#0D0D0D]/5 px-2 py-2 md:p-6 flex md:flex-col gap-1 md:gap-2 shrink-0 overflow-x-auto md:overflow-x-visible scrollbar-hide relative">
                {/* Scroll Hint Gradient (Mobile only) */}
                <div className="md:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#F2F2F2]/80 to-transparent pointer-events-none z-10" />

                <div className="hidden md:block mb-8 px-2">
                  <h2 className="text-[20px] font-bold text-[#0D0D0D]">
                    Cài đặt
                  </h2>
                  <p className="text-[12px] text-[#0D0D0D]/60 font-medium uppercase tracking-widest mt-1">
                    Quản lý tài khoản
                  </p>
                </div>

                <div className="flex md:flex-col gap-1 md:gap-2 flex-nowrap w-full md:w-auto">
                  {[
                    { id: "Profile", icon: User, label: "Hồ sơ" },
                    { id: "Goals", icon: Target, label: "Mục tiêu" },
                    { id: "Allergies", icon: AlertTriangle, label: "Dị ứng" },
                    { id: "Security", icon: ShieldCheck, label: "Bảo mật" },
                    {
                      id: "Logout",
                      icon: LogOut,
                      label: "Đăng xuất",
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
                        "flex items-center justify-center md:justify-start gap-1.5 md:gap-3 px-2.5 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl transition-all duration-300 font-bold text-[11px] md:text-[14px] whitespace-nowrap flex-1 md:flex-initial min-w-0",
                        profileTab === tab.id
                          ? tab.variant === "danger"
                            ? "bg-red-50 text-red-500"
                            : "bg-[#9FD923] text-[#0D0D0D] shadow-lg shadow-[#9FD923]/20 scale-[1.02]"
                          : tab.variant === "danger"
                            ? "text-red-500 hover:bg-red-50"
                            : "text-[#0D0D0D]/70 hover:bg-white hover:text-[#0D0D0D]",
                      )}
                    >
                      <tab.icon className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
                      <span className="hidden md:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>

                <div className="hidden md:block mt-auto p-4 bg-[#D9F2A2]/40 rounded-2xl border border-[#9FD923]/20">
                  <p className="text-[11px] text-[#0D0D0D]/70 font-medium leading-relaxed">
                    Bạn cần hỗ trợ? Liên hệ bộ phận CSKH.
                  </p>
                </div>
              </div>

              {/* ──────────── Content Area ──────────── */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: "easeOut", delay: 0.08 }}
                className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto custom-scrollbar relative"
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
                              {avatarPreview ? (
                                <img
                                  src={avatarPreview}
                                  alt="Avatar"
                                  className="w-full h-full object-cover"
                                />
                              ) : user?.avatarUrl ? (
                                <img
                                  src={user.avatarUrl}
                                  alt="Avatar"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User className="w-8 h-8 text-[#9FD923]" />
                              )}
                            </div>
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="absolute -bottom-1 -right-1 p-1.5 bg-[#0D0D0D] text-white rounded-lg shadow-lg border border-white/10 hover:bg-[#9FD923] hover:text-[#0D0D0D] transition-all"
                            >
                              <Camera className="w-3 h-3" />
                            </button>
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleAvatarChange}
                              className="hidden"
                              accept="image/*"
                            />
                          </div>
                          <div className="flex-1">
                            {isEditing ? (
                              <input
                                name="fullName"
                                value={profileForm.fullName}
                                onChange={handleProfileFormChange}
                                className="text-[20px] font-black text-[#0D0D0D] bg-transparent border-b-2 border-[#9FD923] outline-none w-full"
                                placeholder="Nhập tên của bạn..."
                              />
                            ) : (
                              <h3 className="text-[20px] font-black text-[#0D0D0D]">
                                {user?.fullName || "Người dùng khách"}
                              </h3>
                            )}
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="px-1.5 py-0.5 rounded bg-[#9FD923] text-[#0D0D0D] text-[10px] font-black uppercase tracking-wider">
                                {roleLabel}
                              </span>
                              <span className="text-[#0D0D0D]/30 font-bold text-[11px]">
                                {user?.status
                                  ? "Thành viên hoạt động"
                                  : "Thành viên chưa kích hoạt"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Uniform Groups Section */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                          {/* Box 1: Account Info */}
                          <div className="flex-1 p-4 bg-[#F2F2F2]/50 rounded-3xl border border-[#0D0D0D]/5 flex flex-col gap-3">
                            <h4 className="text-[10px] font-black text-[#0D0D0D]/20 uppercase tracking-widest pl-1">
                              Thông tin cá nhân
                            </h4>
                            {[
                              {
                                label: "Email",
                                value: email,
                                icon: Mail,
                                color: "text-[#9FD923]",
                              },
                              {
                                label: "Ngày sinh",
                                value: isEditing
                                  ? profileForm.dateOfBirth
                                  : birthday,
                                icon: Calendar,
                                color: "text-blue-500",
                                type: "date",
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
                                      field.type === "date" ? (
                                        <Popover>
                                          <PopoverTrigger asChild>
                                            <button
                                              className={cn(
                                                "w-full flex items-center justify-between bg-transparent text-[12px] font-bold text-[#0D0D0D] outline-none border-b border-[#9FD923]/30 focus:border-[#9FD923] pb-0.5",
                                                !profileForm.dateOfBirth &&
                                                  "text-[#0D0D0D]/40",
                                              )}
                                            >
                                              {profileForm.dateOfBirth ? (
                                                format(
                                                  new Date(
                                                    profileForm.dateOfBirth,
                                                  ),
                                                  "dd/MM/yyyy",
                                                )
                                              ) : (
                                                <span>Chọn ngày sinh</span>
                                              )}
                                            </button>
                                          </PopoverTrigger>
                                          <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                          >
                                            <CalendarComponent
                                              mode="single"
                                              selected={
                                                profileForm.dateOfBirth
                                                  ? new Date(
                                                      profileForm.dateOfBirth,
                                                    )
                                                  : undefined
                                              }
                                              onSelect={(date) => {
                                                if (date) {
                                                  // Format as YYYY-MM-DD
                                                  const d = new Date(
                                                    date.getTime() -
                                                      date.getTimezoneOffset() *
                                                        60000,
                                                  );
                                                  const formattedDate = d
                                                    .toISOString()
                                                    .split("T")[0];
                                                  setProfileForm((prev) => ({
                                                    ...prev,
                                                    dateOfBirth: formattedDate,
                                                  }));
                                                }
                                              }}
                                              initialFocus
                                              captionLayout="dropdown"
                                              startMonth={new Date(1900, 0)}
                                              endMonth={new Date()}
                                            />
                                          </PopoverContent>
                                        </Popover>
                                      ) : (
                                        <input
                                          className="w-full bg-transparent text-[12px] font-bold text-[#0D0D0D] outline-none border-b border-[#9FD923]/30 focus:border-[#9FD923] p-0"
                                          defaultValue={field.value}
                                        />
                                      )
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
                              Chỉ số cơ thể
                            </h4>
                            {[
                              {
                                label: "Cân nặng",
                                value: profileForm.weight.toString(),
                                unit: "kg",
                                icon: Scale,
                              },
                              {
                                label: "Chiều cao",
                                value: profileForm.height.toString(),
                                unit: "cm",
                                icon: Activity,
                              },
                              {
                                label: "Giới tính",
                                value: gender,
                                rawValue: profileForm.gender,
                                unit: "",
                                icon: User,
                                type: "gender",
                              },
                              {
                                label: "Vận động",
                                value: activity,
                                rawValue: isEditing
                                  ? profileForm.activityLevel
                                  : normalizeActivityLevel(
                                      profile?.activityLevel,
                                    ),
                                unit: "",
                                icon: Dna,
                                type: "select",
                              },
                              {
                                label: "Tuổi",
                                value: currentAge.toString(),
                                unit: "y",
                                icon: User,
                                type: "readonly",
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
                                      field.type === "readonly" ? (
                                        <p className="text-[12px] font-black text-[#0D0D0D]/40 leading-none">
                                          {field.value}
                                          <span className="text-[10px] ml-1 uppercase font-black">
                                            {field.unit}
                                          </span>
                                        </p>
                                      ) : field.type === "select" ? (
                                        <Select
                                          value={profileForm.activityLevel}
                                          onValueChange={(val) =>
                                            setProfileForm((prev) => ({
                                              ...prev,
                                              activityLevel: val,
                                            }))
                                          }
                                        >
                                          <SelectTrigger className="h-full border-none bg-transparent p-0 text-[12px] font-bold text-[#9FD923] focus:ring-0 focus:ring-offset-0 justify-end gap-1">
                                            <SelectValue placeholder="Chọn" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="SEDENTARY">
                                              Ít vận động
                                            </SelectItem>
                                            <SelectItem value="LIGHTLY_ACTIVE">
                                              Vận động nhẹ
                                            </SelectItem>
                                            <SelectItem value="MODERATELY_ACTIVE">
                                              Vận động vừa
                                            </SelectItem>
                                            <SelectItem value="VERY_ACTIVE">
                                              Năng động
                                            </SelectItem>
                                            <SelectItem value="SUPER_ACTIVE">
                                              Cường độ cao
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      ) : field.type === "gender" ? (
                                        <Select
                                          value={profileForm.gender}
                                          onValueChange={(val) =>
                                            setProfileForm((prev) => ({
                                              ...prev,
                                              gender: val,
                                            }))
                                          }
                                        >
                                          <SelectTrigger className="h-full border-none bg-transparent p-0 text-[12px] font-bold text-[#9FD923] focus:ring-0 focus:ring-offset-0 justify-end gap-1">
                                            <SelectValue placeholder="Chọn" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="MALE">
                                              Nam
                                            </SelectItem>
                                            <SelectItem value="FEMALE">
                                              Nữ
                                            </SelectItem>
                                            <SelectItem value="UNDEFINED">
                                              Khác
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      ) : (
                                        <div className="flex items-center justify-end h-full">
                                          <input
                                            name={
                                              field.label === "Cân nặng"
                                                ? "weight"
                                                : "height"
                                            }
                                            type="number"
                                            className="w-10 text-right bg-transparent text-[12px] font-black text-[#0D0D0D] outline-none border-b border-[#9FD923]/30 p-0 h-full"
                                            value={
                                              field.label === "Cân nặng"
                                                ? profileForm.weight
                                                : profileForm.height
                                            }
                                            onChange={handleProfileFormChange}
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
                          <div className="flex flex-col sm:flex-row gap-4">
                            {[
                              {
                                label: "Chỉ số BMI",
                                value: bmi.toFixed(1),
                                status:
                                  bmi < 18.5
                                    ? "Thiếu cân"
                                    : bmi < 25
                                      ? "Khỏe mạnh"
                                      : "Thừa cân",
                                color:
                                  bmi < 18.5
                                    ? "text-yellow-400"
                                    : bmi < 25
                                      ? "text-[#9FD923]"
                                      : "text-red-400",
                              },
                              {
                                label: "Chỉ số BMR",
                                value: formatNumber(bmr),
                                status: "kcal/d",
                                color: "text-blue-400",
                              },
                              {
                                label: "TDEE hằng ngày",
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

                      {/* Bottom Action Bar */}
                      <div className="flex justify-end gap-3 mt-6 h-12">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => setIsEditing(false)}
                              className="px-6 h-full bg-[#F2F2F2] text-[#0D0D0D]/40 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-white hover:text-red-500 border border-transparent hover:border-red-100 transition-all flex items-center justify-center"
                            >
                              Hủy
                            </button>
                            <button
                              onClick={handleSaveProfile}
                              disabled={isUpdatingProfile}
                              className="px-8 h-full bg-[#0D0D0D] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#9FD923] hover:text-[#0D0D0D] transition-all group shadow-xl shadow-[#9FD923]/10 flex items-center gap-2 justify-center disabled:opacity-50"
                            >
                              {isUpdatingProfile
                                ? "Đang lưu..."
                                : "Lưu thông tin"}
                              {!isUpdatingProfile && (
                                <Zap className="w-3 h-3 text-[#9FD923] group-hover:text-[#0D0D0D]" />
                              )}
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={handleStartEditing}
                            className="group relative overflow-visible h-full"
                          >
                            <div className="absolute inset-0.5 bg-linear-to-r from-[#9FD923] to-[#D9F2A2] rounded-2xl opacity-0 group-hover:opacity-40 transition-all duration-300 blur-md" />
                            <div className="relative flex items-center gap-4 px-6 h-full bg-[#0D0D0D] rounded-2xl border border-white/10 shadow-xl transition-all duration-300 active:scale-95 justify-center">
                              <div className="p-1.5 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                                <Zap className="w-4 h-4 text-[#9FD923]" />
                              </div>
                              <span className="text-[12px] font-black text-white uppercase tracking-[0.15em]">
                                CHỈNH SỬA HỒ SƠ
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
                      className="h-full flex flex-col pt-2"
                    >
                      <AnimatePresence mode="wait">
                        {!isAddingGoal ? (
                          <motion.div
                            key="goal-list"
                            initial={{ opacity: 0, x: 15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -15 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="flex-1 flex flex-col min-h-0 space-y-6"
                          >
                            {/* Current Goal */}
                            <div>
                              <div className="flex items-center justify-between mb-3 ml-2">
                                <h4 className="text-[11px] font-black text-[#0D0D0D]/30 uppercase tracking-[0.2em]">
                                  Mục tiêu hiện tại
                                </h4>
                                {!currentGoal && (
                                  <button
                                    onClick={() => setIsAddingGoal(true)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-[#9FD923] text-[#0D0D0D] rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-md shadow-[#9FD923]/20"
                                  >
                                    <Plus className="w-3 h-3" />
                                    Mục tiêu mới
                                  </button>
                                )}
                              </div>

                              {currentGoal ? (
                                <div className="p-5 bg-[#D9F2A2]/20 rounded-3xl border border-[#9FD923]/20 flex items-center justify-between hover:bg-[#D9F2A2]/30 transition-colors shadow-sm group">
                                  <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-[#9FD923] rounded-2xl flex items-center justify-center text-[#0D0D0D] shadow-lg shadow-[#9FD923]/20">
                                      <Target className="w-7 h-7" />
                                    </div>
                                    <div>
                                      <h3 className="text-[18px] font-black text-[#0D0D0D]">
                                        {getGoalTypeLabel(currentGoal.goalType)}
                                      </h3>
                                      <div className="flex items-center gap-3 mt-1">
                                        <p className="text-[12px] text-[#0D0D0D]/50 font-bold flex items-center gap-1.5">
                                          <Calendar className="w-3.5 h-3.5 opacity-70" />
                                          {formatDate(currentGoal.startDate)} -{" "}
                                          {formatDate(currentGoal.endDate)}
                                        </p>
                                        <span
                                          className={cn(
                                            "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border",
                                            getStatusBadge(currentGoal.status),
                                          )}
                                        >
                                          {getGoalStatusLabel(
                                            currentGoal.status,
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() =>
                                        handleEditGoal(currentGoal)
                                      }
                                      className="p-2.5 bg-white text-[#0D0D0D] rounded-xl border border-[#0D0D0D]/5 hover:border-[#9FD923] transition-all shadow-sm group/eye"
                                      title="Xem chi tiết"
                                    >
                                      <Eye className="w-4 h-4 group-hover/eye:text-[#9FD923]" />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="p-8 bg-[#F2F2F2]/50 rounded-3xl border border-dashed border-[#0D0D0D]/10 flex flex-col items-center justify-center text-center">
                                  <Target className="w-8 h-8 text-[#0D0D0D]/10 mb-2" />
                                  <p className="text-[13px] text-[#0D0D0D]/40 font-bold">
                                    Chưa có mục tiêu dinh dưỡng.
                                  </p>
                                  <button
                                    onClick={() => setIsAddingGoal(true)}
                                    className="mt-4 text-[#9FD923] text-[11px] font-black uppercase tracking-widest hover:underline"
                                  >
                                    Thiết lập mục tiêu ngay
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Goal History */}
                            <div className="flex-1 flex flex-col min-h-0">
                              <div className="flex items-center justify-between mb-3 ml-2">
                                <div className="flex items-center gap-2">
                                  <History className="w-4 h-4 text-[#0D0D0D]/30" />
                                  <h4 className="text-[11px] font-black text-[#0D0D0D]/30 uppercase tracking-[0.2em]">
                                    Lịch sử mục tiêu
                                  </h4>
                                </div>
                                {currentGoal && (
                                  <button
                                    onClick={() => setIsAddingGoal(true)}
                                    className="text-[10px] font-black text-[#9FD923] uppercase tracking-widest hover:underline"
                                  >
                                    + Thêm mới
                                  </button>
                                )}
                              </div>

                              <div className="flex flex-col gap-3 overflow-y-auto pr-3 -mr-3 custom-scrollbar pb-6 flex-1">
                                {!goalHistory || goalHistory.length === 0 ? (
                                  <div className="py-12 text-center">
                                    <p className="text-[12px] text-[#0D0D0D]/20 font-bold italic">
                                      Chưa có lịch sử mục tiêu.
                                    </p>
                                  </div>
                                ) : (
                                  (Array.isArray(goalHistory)
                                    ? goalHistory
                                    : []
                                  )
                                    .filter((g) => g.id !== currentGoal?.id)
                                    .map((goal) => (
                                      <div
                                        key={goal.id}
                                        className="p-4 bg-[#F2F2F2]/50 rounded-[1.25rem] border border-[#0D0D0D]/5 flex items-center justify-between group hover:bg-white hover:border-[#0D0D0D]/10 transition-all duration-300 hover:shadow-xs"
                                      >
                                        <div className="flex items-center gap-4">
                                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-[#0D0D0D]/5 group-hover:bg-[#D9F2A2]/20 group-hover:border-[#9FD923]/20 transition-colors shadow-xs">
                                            <CheckCircle className="w-5 h-5 text-[#0D0D0D]/20 group-hover:text-[#9FD923] transition-colors" />
                                          </div>
                                          <div className="flex flex-col justify-center">
                                            <h4 className="text-[14px] font-bold text-[#0D0D0D] group-hover:text-[#0D0D0D] transition-colors line-clamp-1">
                                              {getGoalTypeLabel(goal.goalType)}
                                            </h4>
                                            <p className="text-[11px] text-[#0D0D0D]/40 font-bold flex items-center gap-1.5 mt-0.5">
                                              <Calendar className="w-3 h-3 opacity-60" />
                                              {formatDate(goal.startDate)} -{" "}
                                              {formatDate(goal.endDate)}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                          <div className="text-right shrink-0 flex flex-col items-end justify-center">
                                            <div
                                              className={cn(
                                                "inline-block px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest mb-1 border",
                                                getStatusBadge(goal.status),
                                              )}
                                            >
                                              {getGoalStatusLabel(goal.status)}
                                            </div>
                                            <p className="text-[11px] font-black text-[#0D0D0D]/40">
                                              Mục tiêu: {goal.targetWeight}kg
                                            </p>
                                          </div>
                                          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                              onClick={() =>
                                                handleEditGoal(goal)
                                              }
                                              className="p-1.5 hover:bg-[#F2F2F2] rounded-lg text-[#0D0D0D]/30 hover:text-[#9FD923] transition-all"
                                              title="Xem chi tiết"
                                            >
                                              <Eye className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                              onClick={() =>
                                                handleDeleteGoal(goal.id)
                                              }
                                              className="p-1.5 hover:bg-red-50 rounded-lg text-red-100 hover:text-red-500 transition-all"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    ))
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="goal-form"
                            initial={{ opacity: 0, x: 15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -15 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="flex-1 flex flex-col min-h-0"
                          >
                            <div className="flex items-center gap-4 mb-6">
                              <button
                                onClick={() => {
                                  setIsAddingGoal(false);
                                  setEditingGoalId(null);
                                }}
                                className="p-2 bg-[#F2F2F2] hover:bg-white rounded-xl border border-transparent hover:border-[#0D0D0D]/5 transition-all"
                              >
                                <ArrowLeft className="w-5 h-5 text-[#0D0D0D]" />
                              </button>
                              <div>
                                <h3 className="text-[18px] font-black text-[#0D0D0D]">
                                  {editingGoalId
                                    ? "Xem / Sửa chi tiết mục tiêu"
                                    : "Mục tiêu dinh dưỡng mới"}
                                </h3>
                                <p className="text-[12px] text-[#0D0D0D]/40 font-bold">
                                  {editingGoalId
                                    ? "Xem và cập nhật chi tiết mục tiêu của bạn"
                                    : "Xác định cột mốc tiếp theo"}
                                </p>
                              </div>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-3 -mr-3 custom-scrollbar space-y-6 pb-6">
                              {/* Goal Type & Target Weight */}
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-[11px] font-black text-[#0D0D0D]/30 uppercase tracking-[0.2em] ml-1">
                                    Type
                                  </label>
                                  <Select
                                    value={goalForm.goalType}
                                    onValueChange={(val) =>
                                      setGoalForm((prev) => ({
                                        ...prev,
                                        goalType: val as GoalType,
                                      }))
                                    }
                                  >
                                    <SelectTrigger className="w-full bg-[#F2F2F2]/50 border border-[#0D0D0D]/5 rounded-2xl px-4 py-3.5 h-[52px] text-[14px] font-bold outline-none focus:bg-white focus:border-[#9FD923] transition-all">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value={GoalType.GOAL_LOSS}>
                                        Giảm cân
                                      </SelectItem>
                                      <SelectItem value={GoalType.GOAL_GAIN}>
                                        Tăng cân
                                      </SelectItem>
                                      <SelectItem
                                        value={GoalType.GOAL_MAINTAIN}
                                      >
                                        Duy trì
                                      </SelectItem>
                                      <SelectItem value={GoalType.GOAL_STRICT}>
                                        Ăn kiêng nghiêm ngặt
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[11px] font-black text-[#0D0D0D]/30 uppercase tracking-[0.2em] ml-1">
                                    Target Weight (kg)
                                  </label>
                                  <input
                                    type="number"
                                    name="targetWeight"
                                    value={goalForm.targetWeight}
                                    onChange={handleGoalFormChange}
                                    className="w-full bg-[#F2F2F2]/50 border border-[#0D0D0D]/5 rounded-2xl px-4 py-3.5 text-[14px] font-bold outline-none focus:bg-white focus:border-[#9FD923] transition-all"
                                  />
                                </div>
                              </div>

                              {/* Calories & Status */}
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-[11px] font-black text-[#0D0D0D]/30 uppercase tracking-[0.2em] ml-1">
                                    Daily Calories (kcal)
                                  </label>
                                  <input
                                    type="number"
                                    name="targetCalories"
                                    value={goalForm.targetCalories}
                                    onChange={handleGoalFormChange}
                                    className="w-full bg-[#F2F2F2]/50 border border-[#0D0D0D]/5 rounded-2xl px-4 py-3.5 text-[14px] font-bold outline-none focus:bg-white focus:border-[#9FD923] transition-all"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[11px] font-black text-[#0D0D0D]/30 uppercase tracking-[0.2em] ml-1">
                                    Status
                                  </label>
                                  <Select
                                    value={goalForm.status}
                                    onValueChange={(val) =>
                                      setGoalForm((prev) => ({
                                        ...prev,
                                        status: val as NutritionGoalStatus,
                                      }))
                                    }
                                  >
                                    <SelectTrigger className="w-full bg-[#F2F2F2]/50 border border-[#0D0D0D]/5 rounded-2xl px-4 py-3.5 h-[52px] text-[14px] font-bold outline-none focus:bg-white focus:border-[#9FD923] transition-all">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem
                                        value={
                                          NutritionGoalStatus.NUTR_GOAL_ONGOING
                                        }
                                      >
                                        Đang thực hiện
                                      </SelectItem>
                                      <SelectItem
                                        value={
                                          NutritionGoalStatus.NUTR_GOAL_COMPLETED
                                        }
                                      >
                                        Đã hoàn thành
                                      </SelectItem>
                                      <SelectItem
                                        value={
                                          NutritionGoalStatus.NUTR_GOAL_PAUSED
                                        }
                                      >
                                        Tạm dừng
                                      </SelectItem>
                                      <SelectItem
                                        value={
                                          NutritionGoalStatus.NUTR_GOAL_FAILED
                                        }
                                      >
                                        Thất bại
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              {/* Macros Grid */}
                              <div className="space-y-3">
                                <label className="text-[11px] font-black text-[#0D0D0D]/30 uppercase tracking-[0.2em] ml-1">
                                  Macros Targets (grams)
                                </label>
                                <div className="grid grid-cols-4 gap-3">
                                  {[
                                    {
                                      name: "targetProtein",
                                      label: "Đạm",
                                      color: "border-blue-100",
                                    },
                                    {
                                      name: "targetCarbs",
                                      label: "Tinh bột",
                                      color: "border-green-100",
                                    },
                                    {
                                      name: "targetFat",
                                      label: "Chất béo",
                                      color: "border-yellow-100",
                                    },
                                    {
                                      name: "targetFiber",
                                      label: "Chất xơ",
                                      color: "border-orange-100",
                                    },
                                  ].map((macro) => (
                                    <div
                                      key={macro.name}
                                      className="space-y-1.5"
                                    >
                                      <span className="text-[9px] font-black text-[#0D0D0D]/40 uppercase tracking-tighter block ml-1">
                                        {macro.label}
                                      </span>
                                      <input
                                        type="number"
                                        name={macro.name}
                                        value={(goalForm as any)[macro.name]}
                                        onChange={handleGoalFormChange}
                                        className={cn(
                                          "w-full bg-[#F2F2F2]/50 border rounded-xl px-2 py-2.5 text-[13px] font-black text-center outline-none focus:bg-white focus:border-[#9FD923] transition-all",
                                          macro.color,
                                        )}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Dates */}
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-[11px] font-black text-[#0D0D0D]/30 uppercase tracking-[0.2em] ml-1">
                                    Start Date
                                  </label>
                                  <input
                                    type="date"
                                    name="startDate"
                                    value={goalForm.startDate}
                                    onChange={handleGoalFormChange}
                                    className="w-full bg-[#F2F2F2]/50 border border-[#0D0D0D]/5 rounded-2xl px-4 py-3.5 text-[14px] font-bold outline-none focus:bg-white focus:border-[#9FD923] transition-all"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[11px] font-black text-[#0D0D0D]/30 uppercase tracking-[0.2em] ml-1">
                                    End Date
                                  </label>
                                  <input
                                    type="date"
                                    name="endDate"
                                    value={goalForm.endDate}
                                    onChange={handleGoalFormChange}
                                    className="w-full bg-[#F2F2F2]/50 border border-[#0D0D0D]/5 rounded-2xl px-4 py-3.5 text-[14px] font-bold outline-none focus:bg-white focus:border-[#9FD923] transition-all"
                                  />
                                </div>
                              </div>

                              <button
                                onClick={
                                  editingGoalId
                                    ? handleUpdateGoal
                                    : handleAddGoal
                                }
                                disabled={isLoadingGoals}
                                className="w-full py-4 bg-[#0D0D0D] text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] hover:bg-[#9FD923] hover:text-[#0D0D0D] transition-all shadow-xl shadow-[#9FD923]/10 flex items-center justify-center gap-3 disabled:opacity-50"
                              >
                                {isLoadingGoals
                                  ? "Đang xử lý..."
                                  : editingGoalId
                                    ? "Lưu thay đổi"
                                    : "Tạo mục tiêu"}
                                <Zap className="w-4 h-4 text-[#9FD923] group-hover:text-[#0D0D0D]" />
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}

                  {/* ── Allergies Tab ── */}
                  {profileTab === "Allergies" && (
                    <motion.div
                      key="allergies"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="h-full flex flex-col pt-2"
                    >
                      <AnimatePresence mode="wait">
                        {!isAddingAllergy ? (
                          <motion.div
                            key="allergy-list"
                            initial={{ opacity: 0, x: 15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -15 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="flex-1 flex flex-col min-h-0"
                          >
                            <div className="flex items-center justify-between mb-6 ml-2">
                              <div>
                                <h4 className="text-[11px] font-black text-[#0D0D0D]/30 uppercase tracking-[0.2em] mb-1">
                                  Your Profile
                                </h4>
                                <h3 className="text-[18px] font-black text-[#0D0D0D]">
                                  Known Allergies
                                </h3>
                              </div>
                              <button
                                onClick={() => setIsAddingAllergy(true)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-[#0D0D0D] text-white rounded-xl text-[11px] font-black uppercase tracking-[0.1em] hover:bg-[#9FD923] hover:text-[#0D0D0D] transition-all shadow-lg shadow-[#9FD923]/10"
                              >
                                <Plus className="w-4 h-4" />
                                Add Allergy
                              </button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-3 -mr-3 custom-scrollbar pb-6">
                              {userAllergies.length === 0 ? (
                                <div className="h-40 flex flex-col items-center justify-center bg-[#F2F2F2]/50 rounded-3xl border border-dashed border-[#0D0D0D]/10">
                                  <AlertTriangle className="w-8 h-8 text-[#0D0D0D]/20 mb-2" />
                                  <p className="text-[13px] text-[#0D0D0D]/40 font-bold">
                                    Chưa có dữ liệu dị ứng.
                                  </p>
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 gap-3">
                                  {userAllergies.map((item) => (
                                    <div
                                      key={item.id}
                                      className="p-4 bg-white rounded-2xl border border-[#0D0D0D]/5 flex items-center justify-between group hover:border-[#9FD923]/30 transition-all shadow-sm"
                                    >
                                      <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-[#F2F2F2] rounded-xl flex items-center justify-center text-[#0D0D0D]/40">
                                          <AlertTriangle className="w-6 h-6" />
                                        </div>
                                        <div>
                                          <h4 className="text-[15px] font-black text-[#0D0D0D]">
                                            {item.allergen?.name}
                                          </h4>
                                          <div className="flex items-center gap-2 mt-1">
                                            <span
                                              className={cn(
                                                "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border",
                                                getSeverityColor(item.severity),
                                              )}
                                            >
                                              {item.severity.replace(
                                                "SEV_",
                                                "",
                                              )}
                                            </span>
                                            {item.note && (
                                              <p className="text-[11px] text-[#0D0D0D]/40 font-bold italic line-clamp-1 max-w-[200px]">
                                                "{item.note}"
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={() =>
                                            handleEditAllergy(item)
                                          }
                                          className="p-2.5 text-[#0D0D0D]/30 hover:text-[#9FD923] hover:bg-[#9FD923]/10 rounded-xl transition-all"
                                        >
                                          <Pencil className="w-5 h-5" />
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleDeleteAllergy(item.id)
                                          }
                                          className="p-2.5 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                          <Trash2 className="w-5 h-5" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="allergy-form"
                            initial={{ opacity: 0, x: 15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -15 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="flex-1 flex flex-col min-h-0"
                          >
                            <div className="flex items-center gap-4 mb-8">
                              <button
                                onClick={() => {
                                  setIsAddingAllergy(false);
                                  setEditingAllergyId(null);
                                }}
                                className="p-2 bg-[#F2F2F2] hover:bg-white rounded-xl border border-transparent hover:border-[#0D0D0D]/5 transition-all"
                              >
                                <ArrowLeft className="w-5 h-5 text-[#0D0D0D]" />
                              </button>
                              <div>
                                <h3 className="text-[18px] font-black text-[#0D0D0D]">
                                  {editingAllergyId
                                    ? "Cập nhật dị ứng"
                                    : "Thêm dị ứng mới"}
                                </h3>
                                <p className="text-[12px] text-[#0D0D0D]/40 font-bold">
                                  {editingAllergyId
                                    ? "Thay đổi tình trạng dị ứng của bạn"
                                    : "Chọn chất gây dị ứng và mức độ"}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-6">
                              {/* Search & Select - Hidden when editing */}
                              {!editingAllergyId && (
                                <div className="space-y-3">
                                  <label className="text-[11px] font-black text-[#0D0D0D]/30 uppercase tracking-[0.2em] ml-1">
                                    Step 1: Find Allergen
                                  </label>
                                  <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#0D0D0D]/30" />
                                    <input
                                      type="text"
                                      placeholder="Tìm kiếm (VD: Đậu phộng, Sữa...)"
                                      value={allergenSearch}
                                      onChange={(e) =>
                                        setAllergenSearch(e.target.value)
                                      }
                                      className="w-full bg-[#F2F2F2]/50 border border-[#0D0D0D]/5 rounded-2xl pl-12 pr-4 py-3.5 text-[14px] font-bold outline-none focus:bg-white focus:border-[#9FD923] transition-all"
                                    />
                                  </div>

                                  <div className="max-h-[160px] overflow-y-auto pr-2 custom-scrollbar grid grid-cols-2 gap-2 mt-2">
                                    {filteredAllergens.length > 0 ? (
                                      filteredAllergens.map((alg) => (
                                        <button
                                          key={alg.id}
                                          onClick={() =>
                                            setSelectedAllergenId(alg.id)
                                          }
                                          className={cn(
                                            "p-3 rounded-xl border text-left transition-all",
                                            selectedAllergenId === alg.id
                                              ? "bg-[#9FD923] border-[#9FD923] text-[#0D0D0D] shadow-md shadow-[#9FD923]/20"
                                              : "bg-white border-[#0D0D0D]/5 text-[#0D0D0D]/60 hover:border-[#9FD923]/30",
                                          )}
                                        >
                                          <p className="text-[13px] font-black line-clamp-1">
                                            {alg.name}
                                          </p>
                                          <p className="text-[10px] font-bold opacity-60 line-clamp-1">
                                            {alg.description ||
                                              "Không có mô tả"}
                                          </p>
                                        </button>
                                      ))
                                    ) : (
                                      <p className="col-span-2 text-center text-[12px] text-[#0D0D0D]/30 py-4 font-bold">
                                        Không tìm thấy chất dị ứng
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}

                              {editingAllergyId && (
                                <div className="p-4 bg-[#D9F2A2]/20 rounded-2xl border border-[#9FD923]/20 flex items-center gap-4">
                                  <AlertTriangle className="w-6 h-6 text-[#9FD923]" />
                                  <div>
                                    <h4 className="text-[14px] font-black text-[#0D0D0D]">
                                      Đang sửa:{" "}
                                      {
                                        allAllergens.find(
                                          (a) => a.id === selectedAllergenId,
                                        )?.name
                                      }
                                    </h4>
                                    <p className="text-[11px] text-[#0D0D0D]/40 font-bold">
                                      Bạn đang cập nhật mức độ hoặc ghi chú cho
                                      dị ứng này.
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Severity & Note */}
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-[11px] font-black text-[#0D0D0D]/30 uppercase tracking-[0.2em] ml-1">
                                    Step 2: Severity
                                  </label>
                                  <Select
                                    value={allergenSeverity}
                                    onValueChange={(val) =>
                                      setAllergenSeverity(val as SeverityType)
                                    }
                                  >
                                    <SelectTrigger className="w-full bg-[#F2F2F2]/50 border border-[#0D0D0D]/5 rounded-2xl px-4 py-3.5 h-[52px] text-[14px] font-bold outline-none focus:bg-white focus:border-[#9FD923] transition-all">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value={SeverityType.SEV_LOW}>
                                        Nhẹ
                                      </SelectItem>
                                      <SelectItem
                                        value={SeverityType.SEV_MEDIUM}
                                      >
                                        Trung bình
                                      </SelectItem>
                                      <SelectItem value={SeverityType.SEV_HIGH}>
                                        Nặng
                                      </SelectItem>
                                      <SelectItem
                                        value={
                                          SeverityType.SEV_LIFE_THREATENING
                                        }
                                      >
                                        Nguy hiểm tính mạng
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[11px] font-black text-[#0D0D0D]/30 uppercase tracking-[0.2em] ml-1">
                                    Step 3: Notes
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Chi tiết bổ sung (không bắt buộc)..."
                                    value={allergenNote}
                                    onChange={(e) =>
                                      setAllergenNote(e.target.value)
                                    }
                                    className="w-full bg-[#F2F2F2]/50 border border-[#0D0D0D]/5 rounded-2xl px-4 py-3.5 text-[14px] font-bold outline-none focus:bg-white focus:border-[#9FD923] transition-all"
                                  />
                                </div>
                              </div>

                              <button
                                onClick={
                                  editingAllergyId
                                    ? handleUpdateAllergy
                                    : handleAddAllergy
                                }
                                disabled={
                                  !selectedAllergenId || isLoadingAllergies
                                }
                                className="w-full py-4 bg-[#0D0D0D] text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] hover:bg-[#9FD923] hover:text-[#0D0D0D] transition-all shadow-xl shadow-[#9FD923]/10 flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale transition-all"
                              >
                                {isLoadingAllergies
                                  ? "Đang xử lý..."
                                  : editingAllergyId
                                    ? "Cập nhật dị ứng"
                                    : "Xác nhận & Lưu"}
                                <Zap className="w-4 h-4 text-[#9FD923] group-hover:text-[#0D0D0D]" />
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
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
                              <h3 className="text-[18px] font-bold text-[#0D0D0D]">
                                Password & Security
                              </h3>
                              <p className="text-[12px] text-[#0D0D0D]/40 font-medium mt-0.5">
                                Manage your credentials
                              </p>
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
                                  value={oldPassword}
                                  onChange={(e) =>
                                    setOldPassword(e.target.value)
                                  }
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
                                  value={newPassword}
                                  onChange={(e) =>
                                    setNewPassword(e.target.value)
                                  }
                                  className="w-full bg-white border border-[#0D0D0D]/5 rounded-2xl px-4 py-3.5 text-[14px] font-bold text-[#0D0D0D] outline-none focus:border-[#9FD923] shadow-sm transition-all"
                                />
                              </div>
                            </div>

                            <div className="flex justify-end pt-4">
                              <button
                                onClick={handleUpdatePassword}
                                disabled={isUpdatingPassword}
                                className="px-8 py-3.5 bg-[#0D0D0D] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#9FD923] hover:text-[#0D0D0D] transition-all group shadow-xl shadow-[#9FD923]/10 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isUpdatingPassword
                                  ? "Đang lưu..."
                                  : "Lưu mật khẩu"}
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
                          <span className="text-[13px] text-white font-black block leading-none select-none">
                            !
                          </span>
                        </div>
                      </div>
                      <h3 className="text-[22px] font-black text-[#0D0D0D] mb-2">
                        Đăng xuất
                      </h3>
                      <p className="text-[14px] text-[#0D0D0D]/60 font-medium mb-8">
                        Bạn có chắc chắn muốn đăng xuất không? Bạn sẽ cần đăng
                        nhập lại để tiếp tục sử dụng dịch vụ.
                      </p>

                      <div className="flex w-full gap-3">
                        <button
                          onClick={() => setShowLogoutConfirm(false)}
                          className="flex-1 py-4 bg-[#F2F2F2] text-[#0D0D0D] rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-[#E5E5E5] transition-colors border border-[#0D0D0D]/5"
                        >
                          Hủy
                        </button>
                        <button
                          onClick={handleLogout}
                          className="flex-1 py-4 bg-red-500 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                        >
                          Đăng xuất ngay
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
