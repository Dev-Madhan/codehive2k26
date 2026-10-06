"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useMediaDrop } from "react-mediadrop";
import {
  UploadCloudIcon,
  FileTextIcon,
  XIcon,
  EyeIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  ExternalLinkIcon,
  Trash2Icon,
  ShieldCheckIcon,
  DownloadIcon,
} from "lucide-react";

// ─────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────
export interface TeamIdUploaderProps {
  id?: string;
  teamSize?: number;
  maxFiles?: number;
  onFileChange?: (file: File | null) => void;
  onUploadsChange?: (urls: string[]) => void; // backwards-compatible prop
  disabled?: boolean;
}

// ─────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────
function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

// ─────────────────────────────────────────────────
// PREVIEW MODAL COMPONENT (Local Blob PDF Viewer)
// ─────────────────────────────────────────────────
interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: File | null;
}

function PdfPreviewModal({ isOpen, onClose, file }: PdfPreviewModalProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !file) {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
        setBlobUrl(null);
      }
      return;
    }

    const url = URL.createObjectURL(file);
    setBlobUrl(url);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      URL.revokeObjectURL(url);
    };
  }, [isOpen, file]);

  if (!isOpen || !file || !blobUrl || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-preview-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity cursor-pointer"
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-5xl h-[94dvh] sm:h-[88vh] flex flex-col rounded-none border border-[#262626] bg-[#0F0F0F] shadow-2xl overflow-hidden">
        {/* Top Glowing Accent Line */}
        <div className="h-[2px] w-full bg-white shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-3 sm:px-5 py-3 border-b border-[#262626] bg-[#080808] shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="size-8 rounded-none border border-[#404040] bg-[#161616] flex items-center justify-center text-white shrink-0 shadow-sm">
              <FileTextIcon className="size-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3
                  id="pdf-preview-title"
                  className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider truncate max-w-[140px] xs:max-w-[200px] sm:max-w-md"
                  title={file.name}
                >
                  {file.name}
                </h3>
                <span className="hidden xs:inline-flex px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-white bg-[#161616] border border-[#262626]">
                  PDF
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-mono text-[#737373] flex items-center gap-1.5">
                <span>{formatBytes(file.size)}</span>
                <span className="text-[#404040]">&bull;</span>
                <span className="text-[#E5E5E5] font-semibold">Local Document Preview</span>
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <a
              href={blobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white bg-[#161616] border border-[#262626] hover:bg-[#1F1F1F] hover:border-white transition-colors"
              title="Open PDF in a new browser tab for full zooming controls"
            >
              <ExternalLinkIcon className="size-3 text-white" />
              <span className="hidden xs:inline">Open in Tab</span>
              <span className="xs:hidden">Open</span>
            </a>
            <a
              href={blobUrl}
              download={file.name}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-neutral-300 bg-[#161616] border border-[#262626] hover:text-white hover:border-[#404040] transition-colors"
              title="Download local copy"
            >
              <DownloadIcon className="size-3 text-neutral-400" />
              <span>Download</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1 px-2 py-1.5 text-neutral-400 hover:text-white border border-transparent hover:border-[#262626] bg-transparent hover:bg-[#161616] transition-colors cursor-pointer"
              aria-label="Close Preview"
            >
              <span className="hidden sm:inline text-[10px] font-mono text-[#737373]">ESC</span>
              <XIcon className="size-4" />
            </button>
          </div>
        </div>

        {/* Main Document Preview Area */}
        <div className="relative flex-1 min-h-0 w-full bg-[#080808] overflow-hidden">
          {/* Subtle cyber grid backdrop */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(circle, #FFFFFF 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Iframe with #view=FitH to automatically scale the document to fit container width */}
          <iframe
            src={`${blobUrl}#view=FitH&toolbar=1`}
            title={`PDF Preview: ${file.name}`}
            className="absolute inset-0 w-full h-full border-0 bg-[#080808]"
          />
        </div>

        {/* Mobile Quick Action Strip */}
        <div className="flex sm:hidden items-center justify-between px-3.5 py-2 bg-[#080808] border-t border-[#262626] text-[11px] font-mono text-neutral-400 shrink-0">
          <span className="text-[10px] text-neutral-400">Pinch or zoom limited?</span>
          <a
            href={blobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-white hover:underline text-[11px]"
          >
            <span>Open in Fullscreen Tab</span>
            <ExternalLinkIcon className="size-3" />
          </a>
        </div>

        {/* Desktop / Global Footer */}
        <div className="flex items-center justify-between px-3.5 sm:px-5 py-2.5 sm:py-3 border-t border-[#262626] bg-[#080808] text-[11px] font-mono text-neutral-400 shrink-0">
          <div className="flex items-center gap-2 text-neutral-400 text-[10px] sm:text-[11px]">
            <ShieldCheckIcon className="size-3.5 text-white shrink-0 hidden xs:block" />
            <span className="truncate max-w-[200px] sm:max-w-md">
              Single PDF document verified for team ID cards
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={blobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1 font-mono text-xs text-neutral-400 hover:text-white border border-[#262626] bg-[#161616] transition-colors"
            >
              <span>Full Tab</span>
              <ExternalLinkIcon className="size-3" />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 border border-white transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────
export function TeamIdUploader({
  id = "team-ids-pdf",
  teamSize = 1,
  onFileChange,
  onUploadsChange,
  disabled = false,
}: TeamIdUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState<string | null>(null);

  // useMediaDrop configured in pure intake mode (no upload transport!)
  const {
    getRootProps,
    getInputProps,
    acceptedFiles,
    rejectedFiles,
    clearFiles,
    isDragActive,
    isDragReject,
  } = useMediaDrop({
    restrictions: {
      accept: ["application/pdf"],
      maxFiles: 1,
      maxSize: 10 * 1024 * 1024, // 10 MB
    },
  });

  // Track accepted files from hook
  useEffect(() => {
    if (acceptedFiles.length > 0) {
      const latest = acceptedFiles[acceptedFiles.length - 1].file;
      setSelectedFile(latest);
      setRejectionMessage(null);
      if (onFileChange) onFileChange(latest);
      if (onUploadsChange) onUploadsChange(["pending_local_upload"]);
    }
  }, [acceptedFiles, onFileChange, onUploadsChange]);

  // Track rejected files from hook
  useEffect(() => {
    if (rejectedFiles.length > 0) {
      const err = rejectedFiles[0]?.errors[0];
      if (err?.code === "file-invalid-type") {
        setRejectionMessage(
          "Invalid file type. Please upload a single PDF document (.pdf only)."
        );
      } else if (err?.code === "file-too-large") {
        setRejectionMessage(
          "File exceeds 10 MB limit. Please compress the PDF document before uploading."
        );
      } else {
        setRejectionMessage(err?.message || "Invalid file. Please select a valid PDF.");
      }
    }
  }, [rejectedFiles]);

  // Handle local delete/removal before form submit
  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewOpen(false);
    setRejectionMessage(null);
    clearFiles();
    if (onFileChange) onFileChange(null);
    if (onUploadsChange) onUploadsChange([]);
  };

  return (
    <div className="space-y-3 font-sans">
      {/* Case 1: A PDF is currently selected */}
      {selectedFile ? (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-none border border-white/60 bg-[#080808] shadow-sm">
            {/* File info */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-10 sm:size-11 rounded-none border border-[#404040] bg-[#161616] flex items-center justify-center text-white shrink-0">
                <FileTextIcon className="size-5 sm:size-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider truncate max-w-[180px] xs:max-w-[220px] sm:max-w-xs">
                    {selectedFile.name}
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-none border border-[#404040] bg-[#161616] text-[9px] font-mono font-bold text-white shrink-0">
                    PDF
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-mono text-[#737373]">
                    {formatBytes(selectedFile.size)}
                  </span>
                  <span className="text-[#404040]">•</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#E5E5E5] font-semibold">
                    <CheckCircle2Icon className="size-3 text-white" />
                    Ready for submission
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 h-10 px-3 font-mono text-xs font-bold uppercase tracking-wider text-white bg-[#161616] border border-[#262626] hover:bg-[#1F1F1F] hover:border-white transition-colors cursor-pointer"
                title="Preview PDF"
              >
                <EyeIcon className="size-3.5" />
                <span>Preview</span>
              </button>

              <button
                type="button"
                onClick={handleRemove}
                disabled={disabled}
                className="inline-flex items-center justify-center gap-1.5 h-10 px-3 font-mono text-xs font-bold uppercase tracking-wider text-neutral-300 bg-[#080808] border border-[#262626] hover:bg-neutral-900 hover:text-white hover:border-neutral-500 transition-colors cursor-pointer disabled:opacity-50"
                title="Remove PDF"
              >
                <Trash2Icon className="size-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Case 2: No file selected - Dropzone */
        <div className="space-y-2">
          <div
            {...getRootProps()}
            className={`relative flex flex-col items-center justify-center p-4 sm:p-8 text-center border-2 border-dashed transition-all cursor-pointer select-none rounded-none ${
              isDragReject
                ? "border-red-500 bg-red-950/20 text-red-300"
                : isDragActive
                ? "border-white bg-[#161616] text-white shadow-[0_0_20px_rgba(255,255,255,0.06)]"
                : "border-[#262626] bg-[#080808] text-neutral-400 hover:border-white hover:bg-[#0F0F0F]"
            } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
          >
            <input {...getInputProps()} id={id} disabled={disabled} />

            <div className="size-11 sm:size-12 rounded-none border border-[#262626] bg-[#0F0F0F] flex items-center justify-center text-white mb-2.5 sm:mb-3 group-hover:scale-105 transition-transform">
              <UploadCloudIcon className="size-5 sm:size-6" />
            </div>

            <p className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-1 px-2">
              <span className="sm:hidden">Tap to Upload Single PDF (or Browse)</span>
              <span className="hidden sm:inline">Drag & Drop Single PDF Here, or{" "}
                <span className="text-white underline underline-offset-4 font-bold">Browse</span>
              </span>
            </p>

            <p className="text-[11px] font-mono text-neutral-400 max-w-md mt-0.5 px-2">
              Upload a single PDF containing the ID cards of all 3 team members
            </p>

            <div className="sm:hidden mt-3 inline-flex items-center gap-1.5 h-9 px-4 font-mono text-xs font-bold uppercase tracking-wider bg-white text-black border border-white">
              <UploadCloudIcon className="size-3.5" />
              <span>Choose PDF File</span>
            </div>

            <div className="inline-flex items-center gap-2 mt-2.5 sm:mt-3 px-2 py-1 rounded-none border border-[#262626] bg-[#0F0F0F] text-[10px] font-mono text-[#A3A3A3]">
              <span className="font-semibold text-white">PDF FORMAT ONLY</span>
              <span className="text-[#404040]">•</span>
              <span>MAX 10 MB</span>
            </div>
          </div>

          {/* Validation/Rejection Error */}
          {rejectionMessage && (
            <div className="flex items-center gap-2 p-2.5 rounded-none border border-red-500/50 bg-red-950/30 text-red-300 text-xs font-mono">
              <AlertTriangleIcon className="size-4 shrink-0 text-red-400" />
              <span>{rejectionMessage}</span>
            </div>
          )}
        </div>
      )}

      {/* PDF Local Preview Modal */}
      <PdfPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        file={selectedFile}
      />
    </div>
  );
}

export default TeamIdUploader;
