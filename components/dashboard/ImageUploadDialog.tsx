"use client";

import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ImageUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload?: (files: File[]) => void;
}

const ImageUploadDialog: React.FC<ImageUploadDialogProps> = ({
  isOpen,
  onClose,
  onUpload,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<{ file: File; preview: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    const droppedFiles = Array.from(e.dataTransfer.files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
        .filter((file) => file.type.startsWith("image/"))
        .map((file) => ({
          file,
          preview: URL.createObjectURL(file),
        }));

      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      return newFiles.filter((_, i) => i !== index);
    });
  };

  const handleUpload = () => {
    if (onUpload) {
      onUpload(files.map((f) => f.file));
    }
    // Simulation
    console.log("Uploading files:", files);

    // Clean up previews
    files.forEach((f) => URL.revokeObjectURL(f.preview));

    onClose();
    setFiles([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] w-[95vw] max-h-[94vh] flex flex-col overflow-hidden bg-[#0F172A] border-[#CAFD00]/20 text-white p-0 shadow-2xl rounded-3xl border">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-white">
            <div className="p-2 rounded-lg bg-[#CAFD00]/10">
              <ImageIcon className="h-5 w-5 text-[#CAFD00]" />
            </div>
            Tải lên hình ảnh bữa ăn
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Thêm ảnh bữa ăn của bạn để AI nhận diện món ăn tự động.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <motion.div 
            initial={false}
            className="p-6 pt-2 space-y-4"
          >
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
                  : "border-white/10 bg-white/5 hover:border-[#CAFD00]/40 hover:bg-white/10",
              )}
            >
              <input
                type="file"
                multiple
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
                    : "bg-white/5 text-slate-400",
                )}
              >
                <Upload
                  className={cn("h-8 w-8", isDragging && "animate-bounce")}
                />
              </div>

              <div className="text-center">
                <p className="font-semibold text-lg text-white">
                  Kéo và thả ảnh vào đây
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  hoặc nhấn để chọn từ thiết bị
                </p>
              </div>

              <div className="flex gap-4 mt-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold px-2 py-1 rounded bg-white/5">
                  JPEG, PNG, WEBP
                </span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold px-2 py-1 rounded bg-white/5">
                  Max 10MB
                </span>
              </div>
            </motion.div>

            <AnimatePresence>
              {files.length > 0 && (
                <motion.div
                className="space-y-2 max-h-[240px] overflow-y-auto overflow-x-hidden scrollbar-hide py-1"
              >
                  {files.map((fileObj, index) => (
                    <motion.div
                      key={`${fileObj.file.name}-${index}`}
                      layout
                      initial={{ x: -80, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{
                      x: 160,
                      opacity: 0,
                      height: 0,
                      marginTop: 0,
                      marginBottom: 0,
                      paddingTop: 0,
                      paddingBottom: 0,
                      borderTopWidth: 0,
                      borderBottomWidth: 0,
                      overflow: "hidden"
                    }}
                    transition={{
                      duration: 0.25,
                      ease: "easeInOut",
                      layout: { duration: 0.25 }
                    }}
                    className="flex items-center gap-3 px-2 py-2 bg-white/5 rounded-xl border border-white/10 group hover:border-[#CAFD00]/30 transition-all origin-top"
                    >
                      <div className="w-12 h-12 shrink-0 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden border border-white/10 relative">
                        <Image
                          src={fileObj.preview}
                          alt={fileObj.file.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate text-white">
                            {fileObj.file.name}
                          </p>
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#CAFD00]" />
                        </div>
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
        </div>

        <DialogFooter className="m-0 p-6 pt-4 bg-white/2 border-t border-white/5 gap-3 sm:justify-end rounded-b-3xl">
          <Button
            variant="ghost"
            onClick={() => {
              files.forEach((f) => URL.revokeObjectURL(f.preview));
              setFiles([]);
              onClose();
            }}
            className="h-11 px-6 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 border-transparent transition-all"
          >
            Hủy
          </Button>
          <Button
            disabled={files.length === 0}
            onClick={handleUpload}
            className="bg-[#CAFD00] text-[#0F172A] hover:bg-[#b0dc00] font-bold px-8 rounded-xl h-11 transition-all active:scale-95 disabled:grayscale"
          >
            Tải lên {files.length > 0 && `${files.length} ảnh`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadDialog;
