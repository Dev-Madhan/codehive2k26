"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UploadCloudIcon, ImagePlusIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

interface FileDropScannerProps {
  onScanImage: (file: File) => Promise<string>;
  disabled?: boolean;
}

export function FileDropScanner({ onScanImage, disabled }: FileDropScannerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WEBP)");
      return;
    }

    setIsProcessing(true);
    try {
      await onScanImage(file);
      toast.success("Pass QR code successfully extracted from image!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to decode QR from image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && !isProcessing && fileInputRef.current?.click()}
      className={`rounded-none border-2 border-dashed font-mono cursor-pointer transition-colors p-0 overflow-hidden ${
        isDragging
          ? "border-white bg-[#141414]"
          : "border-[#262626] bg-[#080808] hover:border-[#404040] hover:bg-[#0E0E0E]"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled || isProcessing}
      />

      <CardContent className="p-6 sm:p-10 text-center space-y-3 sm:space-y-4">
        <div className="size-14 mx-auto border border-[#262626] bg-[#141414] flex items-center justify-center text-white">
          {isProcessing ? (
            <Loader2Icon className="size-6 animate-spin text-white" />
          ) : (
            <UploadCloudIcon className="size-6 text-white" />
          )}
        </div>

        <div className="space-y-1">
          <Badge
            variant="outline"
            className="rounded-none border-[#262626] bg-[#141414] text-[10px] uppercase font-mono text-white mb-2"
          >
            [ PASS SCREENSHOT DECODER ]
          </Badge>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            {isProcessing ? "DECODING QR CODE..." : "DROP PASS SCREENSHOT HERE"}
          </h4>
          <p className="text-xs text-[#A3A3A3] max-w-sm mx-auto">
            Drag and drop student pass screenshots or photo prints (PNG, JPG, WEBP).
          </p>
        </div>

        <Button
          type="button"
          disabled={disabled || isProcessing}
          className="rounded-none border border-white/40 bg-[#161616] hover:bg-[#262626] hover:border-white text-white font-mono font-bold text-xs uppercase tracking-wider h-10 px-5 cursor-pointer transition-colors shadow-sm"
        >
          <ImagePlusIcon className="size-4 mr-2 text-white" />
          <span className="text-white font-bold">[ BROWSE IMAGE FILE ]</span>
        </Button>
      </CardContent>
    </Card>
  );
}
