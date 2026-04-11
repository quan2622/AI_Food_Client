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
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon, CheckCircle2, ArrowRight, Loader2, Utensils } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { foodRecognitionService } from "@/services/foodRecognitionService";
import { foodService } from "@/services/foodService";
import { dailyLogService } from "@/services/dailyLogService";

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
  
  // Form State
  const [mealType, setMealType] = useState<string>("MEAL_SNACK");
  const [quantity, setQuantity] = useState<number>(1);
  const [grams, setGrams] = useState<number>(450);

  useEffect(() => {
    if (isOpen) {
      setStep("UPLOAD");
      setDetectedFood(null);
      setFiles([]);
      setQuantity(1);
      setGrams(450);

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
  };

  const removeFile = (index: number) => {
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
        confidence: predictRes.data.top1.confidence
      });
      if (matchedFood.defaultServingGrams) {
        setGrams(matchedFood.defaultServingGrams);
      }
      setStep("FORM");

    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Có lỗi xảy ra khi xử lý món ăn.");
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
      let mealId = resToday.data?.meals?.find((m) => m.mealType === mealType)?.id;
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
      toast.error(err?.response?.data?.message || "Lỗi khi lưu dữ liệu.", { id: loadingId });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("w-[95vw] max-h-[94vh] flex flex-col overflow-hidden bg-[#0F172A] border-[#CAFD00]/20 text-white p-0 shadow-2xl rounded-3xl border transition-all duration-300", step === "FORM" ? "sm:max-w-[900px]" : "sm:max-w-[500px]")}>
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-white">
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 pt-2 space-y-4">
              <motion.div
                layout="position"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "relative border-2 border-dashed rounded-2xl p-6 transition-all duration-300 flex flex-col items-center justify-center gap-2 cursor-pointer outline-none",
                  isDragging
                    ? "border-[#CAFD00] bg-[#CAFD00]/10 scale-[0.98]"
                    : "border-white/10 bg-white/5 hover:border-[#CAFD00]/40 hover:bg-white/10"
                )}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                />
                <div
                  className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
                    isDragging
                      ? "bg-[#CAFD00] text-[#0F172A] shadow-[0_0_30px_rgba(202,253,0,0.3)]"
                      : "bg-white/5 text-slate-400"
                  )}
                >
                  <Upload className={cn("h-8 w-8", isDragging && "animate-bounce")} />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-lg text-white">
                    Kéo và thả ảnh vào đây
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    hoặc nhấn để chọn từ thiết bị (tối đa 1 ảnh)
                  </p>
                </div>
              </motion.div>

              <AnimatePresence>
                {files.length > 0 && (
                  <motion.div className="space-y-2 max-h-[240px] overflow-y-auto scrollbar-hide py-1">
                    {files.map((fileObj, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-3 px-2 py-2 bg-white/5 rounded-xl border border-white/10 group hover:border-[#CAFD00]/30 transition-all"
                      >
                        <div className="w-12 h-12 shrink-0 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden relative">
                          <Image src={fileObj.preview} alt={fileObj.file.name} fill className="object-cover" unoptimized />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate text-white">
                            {fileObj.file.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(index);
                          }}
                          className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-red-400 transition-all"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {step === "LOADING" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-12 flex flex-col items-center justify-center space-y-6">
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
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 pt-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-6">
                <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-20 h-20 shrink-0 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden relative">
                    {files[0] ? (
                      <Image src={files[0].preview} alt="food" fill className="object-cover" unoptimized />
                    ) : (
                      <Utensils className="w-8 h-8 text-slate-400" />
                    )}
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-xs font-bold text-[#CAFD00] uppercase tracking-wider mb-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Độ chính xác: {(detectedFood.confidence * 100).toFixed(1)}%
                    </p>
                    <p className="text-xl font-bold text-white capitalize leading-tight">{detectedFood.foodName || detectedFood.name || detectedFood.recognizedName}</p>
                    {detectedFood.foodCategory?.name && (
                      <p className="text-xs text-slate-400 mt-1">{detectedFood.foodCategory.name}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-300">Bữa ăn</label>
                    <div className="grid grid-cols-2 gap-2">
                      {MealTypes.map(mt => (
                        <button
                          key={mt.value}
                          onClick={() => setMealType(mt.value)}
                          className={cn(
                            "py-2.5 px-3 rounded-xl text-xs font-bold border transition-all duration-300",
                            mealType === mt.value 
                              ? "bg-[#CAFD00]/10 border-[#CAFD00] text-[#CAFD00]"
                              : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                          )}
                        >
                          {mt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-300">Số lượng</label>
                      <input 
                        type="number" 
                        min="1"
                        step="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.valueAsNumber || 1)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-bold outline-none focus:border-[#CAFD00] transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-300">Trọng lượng (g)</label>
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

              <div className="space-y-4 bg-slate-900/50 p-5 rounded-2xl border border-white/5">
                {detectedFood.nutritionProfile?.values && detectedFood.nutritionProfile.values.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span> Dinh dưỡng / {grams}g
                    </h4>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {detectedFood.nutritionProfile.values.map((nv: any, idx: number) => (
                        <div key={idx} className="bg-white/5 rounded-lg px-3 py-2 flex items-center justify-between border border-white/5 gap-2">
                          <span className="text-xs text-slate-400 truncate" title={nv.nutrient.name}>
                            {nv.nutrient.name === "Carbohydrates" ? "Carbs" : nv.nutrient.name}
                          </span>
                          <span className="text-sm font-bold text-white shrink-0">
                            {((nv.value / 100) * grams).toFixed(1)} {mapUnit(nv.nutrient.unit)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {detectedFood.foodIngredients && detectedFood.foodIngredients.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span> Thành phần nguyên liệu
                    </h4>
                    <div className="space-y-2 mt-2 max-h-[220px] overflow-y-auto scrollbar-hide pr-1">
                      {detectedFood.foodIngredients.map((fi: any, idx: number) => (
                        <div key={idx} className="bg-white/5 rounded-lg px-3 py-2 flex flex-col border border-white/5">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-white">{fi.ingredient.ingredientName}</span>
                            <span className="text-xs text-slate-400 font-bold whitespace-nowrap">
                              {((fi.quantityGrams / (detectedFood.defaultServingGrams || 100)) * grams).toFixed(0)}g
                            </span>
                          </div>
                          {fi.ingredient.ingredientAllergens && fi.ingredient.ingredientAllergens.length > 0 && (
                            <div className="flex gap-1 mt-1 flex-wrap">
                              {fi.ingredient.ingredientAllergens.map((alg: any, algIdx: number) => (
                                <span key={algIdx} className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-bold uppercase">
                                  {alg.allergen.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
            </motion.div>
          )}

        </div>

        <DialogFooter className="m-0 p-6 pt-4 bg-white/2 border-t border-white/5 gap-3 sm:justify-end rounded-b-3xl">
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
              className="bg-[#CAFD00] text-[#0F172A] hover:bg-[#b0dc00] font-bold px-8 rounded-xl h-11 transition-all active:scale-95 disabled:grayscale"
            >
              Tải lên và Nhận diện
            </Button>
          )}

          {step === "FORM" && (
            <Button
              onClick={handleConfirmForm}
              className="bg-[#CAFD00] text-[#0F172A] hover:bg-[#b0dc00] font-bold px-8 rounded-xl h-11 transition-all active:scale-95"
            >
              Lưu vào nhật ký
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadDialog;
