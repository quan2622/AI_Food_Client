"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Upload,
  X,
  Image as ImageIcon,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Utensils,
  AlertTriangle,
  Plus,
  BarChart3,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { foodRecognitionService } from "@/services/foodRecognitionService";
import { foodService } from "@/services/foodService";
import { dailyLogService } from "@/services/dailyLogService";
import { userSubmissionService } from "@/services/userSubmissionService";
import {
  SubmissionType,
  SubmissionCategory,
  ICreateSubmissionRequest,
} from "@/types/user-submission.type";

interface ImageUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const MealTypes = [
  { value: "MEAL_BREAKFAST", label: "Bữa sáng" },
  { value: "MEAL_LUNCH", label: "Bữa trưa" },
  { value: "MEAL_DINNER", label: "Bữa tối" },
  { value: "MEAL_SNACK", label: "Bữa phụ" },
];

const mapUnit = (unit: string) => {
  const normalized = unit.toUpperCase();
  if (normalized === "UNIT_KCAL" || normalized === "UNIT_KG") return "kcal";
  if (normalized === "UNIT_G") return "g";
  if (normalized === "UNIT_MG") return "mg";
  if (normalized === "UNIT_ML") return "ml";
  return unit.replace("UNIT_", "").toLowerCase();
};

const ImageUploadDialog: React.FC<ImageUploadDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<{ file: File; preview: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Flow State
  const [step, setStep] = useState<"UPLOAD" | "LOADING" | "FORM">("UPLOAD");
  const [detectedFood, setDetectedFood] = useState<any>(null);
  const [predictions, setPredictions] = useState<
    Array<{
      rank: number;
      class_name: string;
      name: string;
      confidence: number;
    }>
  >([]);
  const [showPredictions, setShowPredictions] = useState(false);

  // Form State
  const [mealType, setMealType] = useState<string>("MEAL_SNACK");
  const [quantity, setQuantity] = useState<number>(1);
  const [grams, setGrams] = useState<number>(450);

  // Report State
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportForm, setReportForm] = useState<ICreateSubmissionRequest>({
    type: SubmissionType.REPORT,
    category: SubmissionCategory.WRONG_INFO,
    description: "",
  });
  const [showNewFoodForm, setShowNewFoodForm] = useState(false);
  const [newFoodPayload, setNewFoodPayload] = useState({
    foodName: "",
    categoryName: "",
    defaultServingGrams: 0,
    description: "",
    imageUrl: "",
    sourceUrl: "",
    nutrition: {
      per100g: true,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    },
    ingredients: "" as string, // comma-separated, split on submit
  });

  useEffect(() => {
    if (isOpen) {
      setStep("UPLOAD");
      setDetectedFood(null);
      setFiles([]);
      setQuantity(1);
      setGrams(450);
      // Reset file input so the same file can be re-selected after dialog re-open
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Guess meal type
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 10) setMealType("MEAL_BREAKFAST");
      else if (hour >= 10 && hour < 14) setMealType("MEAL_LUNCH");
      else if (hour >= 17 && hour < 22) setMealType("MEAL_DINNER");
      else setMealType("MEAL_SNACK");
    }
  }, [isOpen]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (step !== "UPLOAD") return;

    const droppedFiles = Array.from(e.dataTransfer.files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

    if (files.length === 0 && droppedFiles.length > 0) {
      setFiles([droppedFiles[0]]); // Restrict to 1 file for simplicity
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
        .filter((file) => file.type.startsWith("image/"))
        .map((file) => ({
          file,
          preview: URL.createObjectURL(file),
        }));

      if (files.length === 0 && selectedFiles.length > 0) {
        setFiles([selectedFiles[0]]);
      }
    }
    // Reset value so the same file can be picked again later
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    // Reset input so the removed file can be re-selected
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      return newFiles.filter((_, i) => i !== index);
    });
  };

  const handleUploadAndRecognize = async () => {
    if (files.length === 0) return;

    setStep("LOADING");
    const imageFile = files[0].file;

    try {
      // Predict
      const predictRes = await foodRecognitionService.predict(imageFile);
      const recognizedClassName = predictRes.data.top1?.class_name;
      const matchedFood = predictRes.data.matchedFood;

      if (!recognizedClassName || !matchedFood) {
        toast.error("Không nhận diện được món ăn hoặc chưa có trong CSDL.");
        setStep("UPLOAD");
        return;
      }

      setDetectedFood({
        ...matchedFood,
        recognizedName: recognizedClassName,
        confidence: predictRes.data.top1.confidence,
      });
      setPredictions(predictRes.data.predictions || []);
      setShowPredictions(false);
      if (matchedFood.defaultServingGrams) {
        setGrams(matchedFood.defaultServingGrams);
      }
      setStep("FORM");
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Có lỗi xảy ra khi xử lý món ăn.",
      );
      setStep("UPLOAD");
    }
  };

  const handleConfirmForm = async () => {
    if (!detectedFood) return;

    const loadingId = toast.loading("Đang lưu bữa ăn...");

    try {
      // 1. Get/Create DailyLog
      const resToday = await dailyLogService.getDailyLogToday();
      let logId = resToday.data?.id;

      if (!logId) {
        const today = new Date().toISOString().split("T")[0];
        const resLog = await dailyLogService.createDailyLog({ logDate: today });
        logId = resLog.data.id;
      }

      // 2. Get/Create Meal
      let mealId = resToday.data?.meals?.find(
        (m) => m.mealType === mealType,
      )?.id;
      if (!mealId && logId) {
        const resMeal = await dailyLogService.createMeal({
          dailyLogId: logId,
          mealType: mealType,
        });
        mealId = resMeal.data.id;
      }

      // 3. Create Meal Item
      if (mealId && logId) {
        await dailyLogService.createMealItem({
          mealId: mealId,
          foodId: detectedFood.id,
          quantity: quantity,
          grams: grams,
        });

        toast.success("Đã ghi nhận bữa ăn thành công!", { id: loadingId });
        if (onSuccess) onSuccess();
        onClose();
      } else {
        throw new Error("Không thể tạo dữ liệu bữa ăn.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Lỗi khi lưu dữ liệu.", {
        id: loadingId,
      });
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reportForm.description.trim() === "") {
      toast.error("Vui lòng nhập chi tiết báo cáo");
      return;
    }

    // Build submission request
    const submissionData: ICreateSubmissionRequest = {
      ...reportForm,
      targetFoodId: detectedFood?.id,
    };

    // If user opted in for new food info, attach payload and set type to CONTRIBUTION
    if (showNewFoodForm) {
      if (
        !newFoodPayload.foodName.trim() ||
        !newFoodPayload.categoryName.trim() ||
        !newFoodPayload.defaultServingGrams
      ) {
        toast.error(
          "Vui lòng nhập đầy đủ: Tên món, Danh mục và Khối lượng phần ăn",
        );
        return;
      }
      submissionData.type = SubmissionType.CONTRIBUTION;
      submissionData.category = SubmissionCategory.NEW_FOOD;
      const ingredientsArr = newFoodPayload.ingredients
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      submissionData.payload = {
        foodName: newFoodPayload.foodName,
        categoryName: newFoodPayload.categoryName,
        defaultServingGrams: newFoodPayload.defaultServingGrams,
        ...(newFoodPayload.description && {
          description: newFoodPayload.description,
        }),
        ...(newFoodPayload.imageUrl && { imageUrl: newFoodPayload.imageUrl }),
        ...(newFoodPayload.sourceUrl && {
          sourceUrl: newFoodPayload.sourceUrl,
        }),
        nutrition: {
          per100g: newFoodPayload.nutrition.per100g,
          ...(newFoodPayload.nutrition.calories && {
            calories: newFoodPayload.nutrition.calories,
          }),
          ...(newFoodPayload.nutrition.protein && {
            protein: newFoodPayload.nutrition.protein,
          }),
          ...(newFoodPayload.nutrition.carbs && {
            carbs: newFoodPayload.nutrition.carbs,
          }),
          ...(newFoodPayload.nutrition.fat && {
            fat: newFoodPayload.nutrition.fat,
          }),
          ...(newFoodPayload.nutrition.fiber && {
            fiber: newFoodPayload.nutrition.fiber,
          }),
        },
        ...(ingredientsArr.length > 0 && { ingredients: ingredientsArr }),
      };
    }

    setIsSubmittingReport(true);
    try {
      const res = await userSubmissionService.createSubmission(submissionData);
      if (res.metadata?.EC === 0 || !res.metadata) {
        toast.success("Báo cáo của bạn đã được gửi thành công!");
        setIsReportOpen(false);
        setShowNewFoodForm(false);
        setReportForm({ ...reportForm, description: "" });
        setNewFoodPayload({
          foodName: "",
          categoryName: "",
          defaultServingGrams: 0,
          description: "",
          imageUrl: "",
          sourceUrl: "",
          nutrition: {
            per100g: true,
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            fiber: 0,
          },
          ingredients: "",
        });
      } else {
        toast.error("Gửi báo cáo thất bại");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.metadata?.message || "Đã xảy ra lỗi");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "w-[95vw] max-h-[94vh] flex flex-col overflow-hidden bg-[#0F172A] border-[#CAFD00]/20 text-white p-0 shadow-2xl rounded-3xl border transition-all duration-300",
          step === "FORM"
            ? "sm:max-w-[900px]"
            : step === "LOADING"
              ? "sm:max-w-[360px]"
              : "sm:max-w-[380px]",
        )}
      >
        <DialogHeader className="p-4 sm:p-6 pb-2">
          <DialogTitle className="text-lg sm:text-xl font-bold flex items-center gap-2 text-white">
            <div className="p-2 rounded-lg bg-[#CAFD00]/10">
              <ImageIcon className="h-5 w-5 text-[#CAFD00]" />
            </div>
            {step === "FORM" ? "Xác nhận món ăn" : "Tải lên hình ảnh bữa ăn"}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {step === "FORM"
              ? "Kiểm tra thông tin và điều chỉnh định lượng nếu cần thiết."
              : "Thêm ảnh bữa ăn của bạn để AI nhận diện món ăn tự động."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {step === "UPLOAD" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 flex flex-col gap-4"
            >
              {/* Hidden real file input */}
              <input
                id="scan-file-input"
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileSelect}
              />

              {files.length === 0 ? (
                /* Pick-file area — uses <label> for 100% reliable open */
                <label
                  htmlFor="scan-file-input"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={cn(
                    "flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all duration-200",
                    isDragging
                      ? "border-[#CAFD00] bg-[#CAFD00]/10"
                      : "border-white/15 bg-white/5 hover:border-[#CAFD00]/50 hover:bg-white/8",
                  )}
                >
                  <div
                    className={cn(
                      "w-14 h-14 rounded-full flex items-center justify-center transition-all",
                      isDragging
                        ? "bg-[#CAFD00] text-[#0F172A]"
                        : "bg-white/10 text-slate-300",
                    )}
                  >
                    <Upload className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-white text-sm">
                      Chọn ảnh từ thiết bị
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      hoặc kéo & thả vào đây
                    </p>
                  </div>
                </label>
              ) : (
                /* Preview */
                <div className="flex items-center gap-3 bg-white/5 rounded-2xl border border-white/10 p-3">
                  <div className="w-16 h-16 shrink-0 rounded-xl bg-slate-800 overflow-hidden relative">
                    <Image
                      src={files[0].preview}
                      alt={files[0].file.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {files[0].file.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {(files[0].file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <label
                      htmlFor="scan-file-input"
                      className="text-[11px] text-[#CAFD00] font-bold cursor-pointer hover:underline mt-1 inline-block"
                    >
                      Đổi ảnh khác
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(0)}
                    className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-red-400 transition-all shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {step === "LOADING" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-12 flex flex-col items-center justify-center space-y-6"
            >
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-white/10 border-t-[#CAFD00] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Utensils className="w-8 h-8 text-[#CAFD00] animate-pulse" />
                </div>
              </div>
              <p className="text-lg font-bold text-white animate-pulse">
                Đang nhận diện món ăn...
              </p>
            </motion.div>
          )}

          {step === "FORM" && detectedFood && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 sm:p-6 pt-2 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
            >
              <div className="space-y-6">
                <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                  <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden relative">
                      {files[0] ? (
                        <Image
                          src={files[0].preview}
                          alt="food"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <Utensils className="w-8 h-8 text-slate-400" />
                      )}
                    </div>
                    <div className="flex flex-col justify-center flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#CAFD00] uppercase tracking-wider mb-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Độ chính xác:{" "}
                        {(detectedFood.confidence * 100).toFixed(1)}%
                      </p>
                      <p className="text-base sm:text-xl font-bold text-white capitalize leading-tight">
                        {detectedFood.foodName ||
                          detectedFood.name ||
                          detectedFood.recognizedName}
                      </p>
                      {detectedFood.foodCategory?.name && (
                        <p className="text-xs text-slate-400 mt-1">
                          {detectedFood.foodCategory.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Toggle predictions button */}
                  {predictions.length > 0 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setShowPredictions(!showPredictions)}
                        className="w-full flex items-center justify-center gap-1.5 py-2 border-t border-white/10 text-xs font-bold text-slate-400 hover:text-[#CAFD00] hover:bg-white/5 transition-all"
                      >
                        <BarChart3 className="w-3.5 h-3.5" />
                        {showPredictions
                          ? "Ẩn dự đoán"
                          : "Xem chi tiết dự đoán"}
                        <ChevronDown
                          className={cn(
                            "w-3.5 h-3.5 transition-transform",
                            showPredictions && "rotate-180",
                          )}
                        />
                      </button>

                      <AnimatePresence>
                        {showPredictions && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-3 sm:px-4 pb-3 space-y-2">
                              {predictions.map((pred, idx) => (
                                <div key={idx} className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span
                                      className={cn(
                                        "text-xs font-medium capitalize truncate",
                                        idx === 0
                                          ? "text-[#CAFD00]"
                                          : "text-slate-400",
                                      )}
                                    >
                                      {idx === 0 && "🥇 "}
                                      {idx === 1 && "🥈 "}
                                      {idx === 2 && "🥉 "}
                                      {idx > 2 && `#${idx + 1} `}
                                      {pred.name || pred.class_name}
                                    </span>
                                    <span
                                      className={cn(
                                        "text-xs font-bold shrink-0 ml-2",
                                        idx === 0
                                          ? "text-[#CAFD00]"
                                          : "text-slate-500",
                                      )}
                                    >
                                      {(pred.confidence * 100).toFixed(1)}%
                                    </span>
                                  </div>
                                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                      className={cn(
                                        "h-full rounded-full transition-all",
                                        idx === 0
                                          ? "bg-[#CAFD00]"
                                          : idx === 1
                                            ? "bg-[#CAFD00]/50"
                                            : "bg-white/20",
                                      )}
                                      style={{
                                        width: `${(pred.confidence * 100).toFixed(1)}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-300">
                      Bữa ăn
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {MealTypes.map((mt) => (
                        <button
                          key={mt.value}
                          onClick={() => setMealType(mt.value)}
                          className={cn(
                            "py-2.5 px-3 rounded-xl text-xs font-bold border transition-all duration-300",
                            mealType === mt.value
                              ? "bg-[#CAFD00]/10 border-[#CAFD00] text-[#CAFD00]"
                              : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10",
                          )}
                        >
                          {mt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-300">
                        Số lượng
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(e.target.valueAsNumber || 1)
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-bold outline-none focus:border-[#CAFD00] transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-300">
                        Trọng lượng (g)
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={grams}
                        onChange={(e) => setGrams(e.target.valueAsNumber || 1)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-bold outline-none focus:border-[#CAFD00] transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 bg-slate-900/50 p-4 sm:p-5 rounded-2xl border border-white/5">
                {detectedFood.nutritionProfile?.values &&
                  detectedFood.nutritionProfile.values.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>{" "}
                        Dinh dưỡng / {grams}g
                      </h4>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {detectedFood.nutritionProfile.values.map(
                          (nv: any, idx: number) => (
                            <div
                              key={idx}
                              className="bg-white/5 rounded-lg px-3 py-2 flex items-center justify-between border border-white/5 gap-2"
                            >
                              <span
                                className="text-xs text-slate-400 truncate"
                                title={nv.nutrient.name}
                              >
                                {nv.nutrient.name === "Carbohydrates"
                                  ? "Carbs"
                                  : nv.nutrient.name}
                              </span>
                              <span className="text-sm font-bold text-white shrink-0">
                                {((nv.value / 100) * grams).toFixed(1)}{" "}
                                {mapUnit(nv.nutrient.unit)}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                {detectedFood.foodIngredients &&
                  detectedFood.foodIngredients.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500"></span>{" "}
                        Thành phần nguyên liệu
                      </h4>
                      <div className="space-y-2 mt-2 max-h-[220px] overflow-y-auto scrollbar-hide pr-1">
                        {detectedFood.foodIngredients.map(
                          (fi: any, idx: number) => (
                            <div
                              key={idx}
                              className="bg-white/5 rounded-lg px-3 py-2 flex flex-col border border-white/5"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-white">
                                  {fi.ingredient.ingredientName}
                                </span>
                                <span className="text-xs text-slate-400 font-bold whitespace-nowrap">
                                  {(
                                    (fi.quantityGrams /
                                      (detectedFood.defaultServingGrams ||
                                        100)) *
                                    grams
                                  ).toFixed(0)}
                                  g
                                </span>
                              </div>
                              {fi.ingredient.ingredientAllergens &&
                                fi.ingredient.ingredientAllergens.length >
                                  0 && (
                                  <div className="flex gap-1 mt-1 flex-wrap">
                                    {fi.ingredient.ingredientAllergens.map(
                                      (alg: any, algIdx: number) => (
                                        <span
                                          key={algIdx}
                                          className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-bold uppercase"
                                        >
                                          {alg.allergen.name}
                                        </span>
                                      ),
                                    )}
                                  </div>
                                )}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </motion.div>
          )}
        </div>

        <DialogFooter className="m-0 p-4 sm:p-6 pt-4 bg-white/2 border-t border-white/5 gap-2 sm:gap-3 sm:justify-end rounded-b-3xl flex-col sm:flex-row">
          {step !== "LOADING" && (
            <Button
              variant="ghost"
              onClick={() => {
                if (step === "FORM") {
                  setStep("UPLOAD");
                  setDetectedFood(null);
                } else {
                  onClose();
                }
              }}
              className="h-11 px-6 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 border-transparent transition-all"
            >
              {step === "FORM" ? "Chọn ảnh khác" : "Hủy"}
            </Button>
          )}

          {step === "UPLOAD" && (
            <Button
              disabled={files.length === 0}
              onClick={handleUploadAndRecognize}
              className="bg-[#CAFD00] text-[#0F172A] hover:bg-[#b0dc00] font-bold px-8 rounded-xl h-11 transition-all active:scale-95 disabled:grayscale disabled:opacity-50"
            >
              Tiến hành phân tích
            </Button>
          )}

          {step === "FORM" && (
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => setIsReportOpen(true)}
                className="bg-transparent border border-[#CAFD00]/30 text-[#CAFD00] hover:bg-[#CAFD00]/10 font-bold px-4 rounded-xl h-11 transition-all text-xs sm:text-sm"
              >
                Báo cáo
              </Button>
              <Button
                onClick={handleConfirmForm}
                className="bg-[#CAFD00] text-[#0F172A] hover:bg-[#b0dc00] font-bold px-8 rounded-xl h-11 transition-all active:scale-95"
              >
                Lưu vào nhật ký
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>

      <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
        <DialogContent className="sm:max-w-[520px] max-h-[90vh] bg-[#0F172A] text-white border-[#CAFD00]/20 rounded-3xl p-6 shadow-2xl overflow-y-auto scrollbar-hide">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-white">
              <span className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                <AlertTriangle className="h-5 w-5" />
              </span>
              Báo cáo
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Giúp chúng tôi cải thiện hệ thống — báo lỗi hoặc đề xuất thêm món
              ăn mới.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleReportSubmit} className="space-y-5 mt-4">
            {/* --- Phân loại lỗi --- */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300">
                Phân loại
              </label>
              <Select
                value={reportForm.category}
                onValueChange={(val) =>
                  setReportForm({
                    ...reportForm,
                    category: val as SubmissionCategory,
                  })
                }
              >
                <SelectTrigger className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 h-[46px] text-sm text-white font-bold outline-none focus:border-[#CAFD00] transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0F172A] border-[#CAFD00]/20 text-white">
                  <SelectItem value={SubmissionCategory.WRONG_INFO}>
                    Nhận diện sai
                  </SelectItem>
                  <SelectItem value={SubmissionCategory.NEW_FOOD}>
                    Thêm thông tin món ăn mới
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* --- Chi tiết lỗi sai --- */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300">
                Chi tiết
              </label>
              <textarea
                required
                placeholder="VD: Món này là Bún Bò chứ không phải Phở..."
                maxLength={2000}
                rows={3}
                value={reportForm.description}
                onChange={(e) =>
                  setReportForm({ ...reportForm, description: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-medium outline-none focus:border-[#CAFD00] transition-colors resize-none scrollbar-hide"
              />
            </div>

            {/* --- Toggle: Thêm thông tin món ăn mới --- */}
            <div className="flex items-center gap-3 pt-1">
              <Checkbox
                id="new-food-toggle"
                checked={showNewFoodForm}
                onCheckedChange={(v) => setShowNewFoodForm(v === true)}
                className="border-white/20 data-[state=checked]:bg-[#CAFD00] data-[state=checked]:border-[#CAFD00] data-[state=checked]:text-[#0F172A]"
              />
              <label
                htmlFor="new-food-toggle"
                className="text-sm font-bold text-slate-300 cursor-pointer select-none flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-[#CAFD00]" />
                Thêm thông tin món ăn mới (nếu cần)
              </label>
            </div>

            {/* --- New Food Payload Accordion --- */}
            {showNewFoodForm && (
              <Accordion
                type="multiple"
                defaultValue={["basic", "nutrition", "extra"]}
                className="space-y-2"
              >
                {/* Basic info */}
                <AccordionItem
                  value="basic"
                  className="border border-white/10 rounded-xl overflow-hidden"
                >
                  <AccordionTrigger className="px-4 py-3 text-sm font-bold text-[#CAFD00] hover:no-underline">
                    Thông tin cơ bản
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400">
                          Tên món ăn *
                        </label>
                        <input
                          type="text"
                          required={showNewFoodForm}
                          placeholder="VD: Bún đậu mắm tôm"
                          value={newFoodPayload.foodName}
                          onChange={(e) =>
                            setNewFoodPayload({
                              ...newFoodPayload,
                              foodName: e.target.value,
                            })
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-medium outline-none focus:border-[#CAFD00] transition-colors"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400">
                            Danh mục *
                          </label>
                          <input
                            type="text"
                            required={showNewFoodForm}
                            placeholder="VD: Món bún"
                            value={newFoodPayload.categoryName}
                            onChange={(e) =>
                              setNewFoodPayload({
                                ...newFoodPayload,
                                categoryName: e.target.value,
                              })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-medium outline-none focus:border-[#CAFD00] transition-colors"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400">
                            Phần ăn (g) *
                          </label>
                          <input
                            type="number"
                            min="1"
                            required={showNewFoodForm}
                            placeholder="400"
                            value={newFoodPayload.defaultServingGrams || ""}
                            onChange={(e) =>
                              setNewFoodPayload({
                                ...newFoodPayload,
                                defaultServingGrams:
                                  e.target.valueAsNumber || 0,
                              })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-medium outline-none focus:border-[#CAFD00] transition-colors"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400">
                          Mô tả món ăn
                        </label>
                        <textarea
                          placeholder="Mô tả ngắn về món ăn..."
                          rows={2}
                          maxLength={500}
                          value={newFoodPayload.description}
                          onChange={(e) =>
                            setNewFoodPayload({
                              ...newFoodPayload,
                              description: e.target.value,
                            })
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-medium outline-none focus:border-[#CAFD00] transition-colors resize-none"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Nutrition */}
                <AccordionItem
                  value="nutrition"
                  className="border border-white/10 rounded-xl overflow-hidden"
                >
                  <AccordionTrigger className="px-4 py-3 text-sm font-bold text-[#CAFD00] hover:no-underline">
                    Thông tin dinh dưỡng
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id="per100g"
                          checked={newFoodPayload.nutrition.per100g}
                          onCheckedChange={(v) =>
                            setNewFoodPayload({
                              ...newFoodPayload,
                              nutrition: {
                                ...newFoodPayload.nutrition,
                                per100g: v === true,
                              },
                            })
                          }
                          className="border-white/20 data-[state=checked]:bg-[#CAFD00] data-[state=checked]:border-[#CAFD00] data-[state=checked]:text-[#0F172A]"
                        />
                        <label
                          htmlFor="per100g"
                          className="text-xs font-medium text-slate-400 cursor-pointer"
                        >
                          Giá trị tính trên 100g (bỏ tích = tính trên 1 phần ăn)
                        </label>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {(
                          [
                            { key: "calories", label: "Calories (kcal)" },
                            { key: "protein", label: "Protein (g)" },
                            { key: "carbs", label: "Carbs (g)" },
                            { key: "fat", label: "Fat (g)" },
                            { key: "fiber", label: "Fiber (g)" },
                          ] as const
                        ).map((item) => (
                          <div key={item.key} className="space-y-1">
                            <label className="text-xs font-bold text-slate-400">
                              {item.label}
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.1"
                              placeholder="0"
                              value={newFoodPayload.nutrition[item.key] || ""}
                              onChange={(e) =>
                                setNewFoodPayload({
                                  ...newFoodPayload,
                                  nutrition: {
                                    ...newFoodPayload.nutrition,
                                    [item.key]: e.target.valueAsNumber || 0,
                                  },
                                })
                              }
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white font-medium outline-none focus:border-[#CAFD00] transition-colors"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Extra */}
                <AccordionItem
                  value="extra"
                  className="border border-white/10 rounded-xl overflow-hidden"
                >
                  <AccordionTrigger className="px-4 py-3 text-sm font-bold text-[#CAFD00] hover:no-underline">
                    Nguyên liệu & Liên kết
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400">
                          Nguyên liệu (phân cách bằng dấu phẩy)
                        </label>
                        <textarea
                          rows={2}
                          placeholder="VD: bún tươi, đậu phụ, chả cốm, mắm tôm"
                          value={newFoodPayload.ingredients}
                          onChange={(e) =>
                            setNewFoodPayload({
                              ...newFoodPayload,
                              ingredients: e.target.value,
                            })
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-medium outline-none focus:border-[#CAFD00] transition-colors resize-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400">
                          URL ảnh (Cloudinary)
                        </label>
                        <input
                          type="url"
                          placeholder="https://res.cloudinary.com/..."
                          value={newFoodPayload.imageUrl}
                          onChange={(e) =>
                            setNewFoodPayload({
                              ...newFoodPayload,
                              imageUrl: e.target.value,
                            })
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-medium outline-none focus:border-[#CAFD00] transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400">
                          Nguồn tham khảo
                        </label>
                        <input
                          type="url"
                          placeholder="https://example.com/recipe"
                          value={newFoodPayload.sourceUrl}
                          onChange={(e) =>
                            setNewFoodPayload({
                              ...newFoodPayload,
                              sourceUrl: e.target.value,
                            })
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-medium outline-none focus:border-[#CAFD00] transition-colors"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}

            <Button
              type="submit"
              disabled={isSubmittingReport}
              className="w-full bg-[#CAFD00] text-[#0F172A] hover:bg-[#b0dc00] font-bold h-11 rounded-xl transition-all"
            >
              {isSubmittingReport ? "Đang gửi..." : "Gửi Báo Cáo"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default ImageUploadDialog;
