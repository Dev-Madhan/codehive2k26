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
      <div className="relative z-10 w-full max-w-5xl h-[94dvh] sm:h-[88vh] flex flex-col rounded-none border border-[#152A54] bg-[#060D1A] shadow-2xl shadow-blue-950/40 overflow-hidden">
        {/* Top Glowing Accent Line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-blue-600 via-sky-400 to-blue-600 shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-3 sm:px-5 py-3 border-b border-[#152A54] bg-[#03060E] shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="size-8 rounded-none border border-rose-500/50 bg-rose-500/15 flex items-center justify-center text-rose-400 shrink-0 shadow-sm shadow-rose-950/40">
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
                <span className="hidden xs:inline-flex px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-sky-400 bg-sky-950/60 border border-sky-500/30">
                  PDF
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <span>{formatBytes(file.size)}</span>
                <span className="text-slate-600">&bull;</span>
                <span className="text-emerald-400 font-semibold">Local Document Preview</span>
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <a
              href={blobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-sky-400 bg-blue-600/15 border border-blue-500/30 hover:bg-blue-600/25 hover:border-blue-400 transition-colors"
              title="Open PDF in a new browser tab for full zooming controls"
            >
              <ExternalLinkIcon className="size-3 text-sky-400" />
              <span className="hidden xs:inline">Open in Tab</span>
              <span className="xs:hidden">Open</span>
            </a>
            <a
              href={blobUrl}
              download={file.name}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-slate-300 bg-[#0B162C] border border-[#152A54] hover:text-white hover:border-slate-500 transition-colors"
              title="Download local copy"
            >
              <DownloadIcon className="size-3 text-slate-400" />
              <span>Download</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1 px-2 py-1.5 text-slate-400 hover:text-white border border-transparent hover:border-[#152A54] bg-transparent hover:bg-[#0B162C] transition-colors cursor-pointer"
              aria-label="Close Preview"
            >
              <span className="hidden sm:inline text-[10px] font-mono text-slate-500">ESC</span>
              <XIcon className="size-4" />
            </button>
          </div>
        </div>

        {/* Main Document Preview Area (Fixed 100% full flex height - no 150px collapsing!) */}
        <div className="relative flex-1 min-h-0 w-full bg-[#02050E] overflow-hidden">
          {/* Subtle cyber grid backdrop */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(circle, #38BDF8 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Iframe with #view=FitH to automatically scale the document to fit container width */}
          <iframe
            src={`${blobUrl}#view=FitH&toolbar=1`}
            title={`PDF Preview: ${file.name}`}
            className="absolute inset-0 w-full h-full border-0 bg-[#02050E]"
          />
        </div>

        {/* Mobile Quick Action Strip */}
        <div className="flex sm:hidden items-center justify-between px-3.5 py-2 bg-[#03060E] border-t border-[#152A54] text-[11px] font-mono text-slate-400 shrink-0">
          <span className="text-[10px] text-slate-400">Pinch or zoom limited?</span>
          <a
            href={blobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-sky-400 hover:underline text-[11px]"
          >
            <span>Open in Fullscreen Tab</span>
            <ExternalLinkIcon className="size-3" />
          </a>
        </div>

        {/* Desktop / Global Footer */}
        <div className="flex items-center justify-between px-3.5 sm:px-5 py-2.5 sm:py-3 border-t border-[#152A54] bg-[#03060E] text-[11px] font-mono text-slate-400 shrink-0">
          <div className="flex items-center gap-2 text-slate-400 text-[10px] sm:text-[11px]">
            <ShieldCheckIcon className="size-3.5 text-blue-400 shrink-0 hidden xs:block" />
            <span className="truncate max-w-[200px] sm:max-w-md">
              Single PDF document verified for team ID cards
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={blobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1 font-mono text-xs text-slate-400 hover:text-white border border-[#152A54] bg-[#0B162C] transition-colors"
            >
              <span>Full Tab</span>
              <ExternalLinkIcon className="size-3" />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-slate-300 bg-[#0B162C] border border-[#152A54] hover:text-white hover:border-blue-500 transition-colors cursor-pointer"
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-none border border-blue-500/50 bg-[#03060E] shadow-sm">
            {/* File info */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-11 rounded-none border border-rose-500/40 bg-rose-500/10 flex items-center justify-center text-rose-400 shrink-0">
                <FileTextIcon className="size-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider truncate max-w-[220px] sm:max-w-xs">
                    {selectedFile.name}
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-none border border-rose-500/40 bg-rose-500/15 text-[9px] font-mono font-bold text-rose-300">
                    PDF
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-mono text-slate-400">
                    {formatBytes(selectedFile.size)}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-semibold">
                    <CheckCircle2Icon className="size-3 text-emerald-400" />
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
                className="inline-flex items-center justify-center gap-1.5 h-10 px-3 font-mono text-xs font-bold uppercase tracking-wider text-blue-400 bg-[#0B162C] border border-[#152A54] hover:text-white hover:border-blue-500 transition-colors cursor-pointer"
                title="Preview PDF"
              >
                <EyeIcon className="size-3.5" />
                <span>Preview</span>
              </button>

              <button
                type="button"
                onClick={handleRemove}
                disabled={disabled}
                className="inline-flex items-center justify-center gap-1.5 h-10 px-3 font-mono text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-950/20 border border-rose-900/50 hover:bg-rose-900/40 hover:text-rose-200 transition-colors cursor-pointer disabled:opacity-50"
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
            className={`relative flex flex-col items-center justify-center p-5 sm:p-8 text-center border-2 border-dashed transition-all cursor-pointer select-none rounded-none ${
              isDragReject
                ? "border-rose-500 bg-rose-950/20 text-rose-300"
                : isDragActive
                ? "border-blue-500 bg-blue-950/25 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                : "border-[#152A54] bg-[#03060E] text-slate-400 hover:border-blue-500/60 hover:bg-[#060D1A]"
            } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
          >
            <input {...getInputProps()} id={id} disabled={disabled} />

            <div className="size-12 rounded-none border border-[#152A54] bg-[#060D1A] flex items-center justify-center text-blue-400 mb-3 group-hover:scale-105 transition-transform">
              <UploadCloudIcon className="size-6" />
            </div>

            <p className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-1">
              Drag & Drop Single PDF Here, or{" "}
              <span className="text-blue-400 underline underline-offset-4">Browse</span>
            </p>

            <p className="text-[11px] font-mono text-slate-400 max-w-md mt-0.5">
              The team leader must upload a single PDF containing the collection of ID cards of all team members
            </p>

            <div className="inline-flex items-center gap-2 mt-3 px-2 py-1 rounded-none border border-[#152A54] bg-[#060D1A] text-[10px] font-mono text-slate-400">
              <span className="font-semibold text-rose-400">PDF FORMAT ONLY</span>
              <span className="text-slate-600">•</span>
              <span>MAX 10 MB</span>
            </div>
          </div>

          {/* Validation/Rejection Error */}
          {rejectionMessage && (
            <div className="flex items-center gap-2 p-2.5 rounded-none border border-rose-500/50 bg-rose-950/30 text-rose-300 text-xs font-mono">
              <AlertTriangleIcon className="size-4 shrink-0 text-rose-400" />
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
