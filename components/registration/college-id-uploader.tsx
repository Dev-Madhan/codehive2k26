"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  useMediaDrop,
  type UploadTransport,
  type MediaDropFile,
  createHttpError,
} from "react-mediadrop";
import {
  UploadCloudIcon,
  CheckCircle2Icon,
  XCircleIcon,
  Loader2Icon,
  FileImageIcon,
  XIcon,
  RefreshCwIcon,
  AlertTriangleIcon,
  EyeIcon,
  ExternalLinkIcon,
} from "lucide-react";

// ─────────────────────────────────────────────────
// TRANSPORT — raw binary POST to /api/upload/college-id
// ─────────────────────────────────────────────────
const transport: UploadTransport = {
  upload(mediaFile, { onProgress, signal }) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload/college-id");
      // Send as the file's own MIME type so the API can validate it
      xhr.setRequestHeader("Content-Type", mediaFile.type);

      // Upload progress events
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          onProgress({ loaded: e.loaded, total: e.total });
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const json = JSON.parse(xhr.responseText) as { url: string };
            resolve({ response: json }); // { url: "https://res.cloudinary.com/..." }
          } catch {
            reject(createHttpError("Invalid server response", xhr.status));
          }
        } else {
          let msg = "Upload failed";
          try {
            const json = JSON.parse(xhr.responseText) as { error?: string };
            msg = json.error ?? msg;
          } catch {}
          reject(createHttpError(msg, xhr.status));
        }
      });

      xhr.addEventListener("error", () =>
        reject(createHttpError("Network error during upload"))
      );

      // Honour AbortSignal from react-mediadrop cancel/retry
      signal.addEventListener("abort", () => {
        xhr.abort();
        reject(createHttpError("Upload cancelled"));
      });

      // Send the raw File — mediaFile.file is the native browser File object
      xhr.send(mediaFile.file);
    });
  },
};

// ─────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────
interface CollegeIdUploaderProps {
  /** Unique identifier so each uploader instance is independent */
  id: string;
  /** Called after a successful Cloudinary upload with the secure URL */
  onUploadSuccess: (url: string) => void;
  /** Called when the uploaded file is removed */
  onRemove: () => void;
  /** Optional: current URL if re-mounting with an already-uploaded file */
  currentUrl?: string;
  /** Label shown inside the dropzone e.g. "Member 02" */
  memberLabel?: string;
}

// ─────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────
function getUploadedUrl(file: MediaDropFile): string | null {
  if (
    file.uploadStatus === "done" &&
    file.uploadResult != null &&
    typeof file.uploadResult === "object" &&
    "response" in file.uploadResult
  ) {
    const result = file.uploadResult as { response?: { url?: string } };
    return result.response?.url ?? null;
  }
  return null;
}

function getProgressPercent(file: MediaDropFile): number {
  if (!file.progress) return 0;
  const total = file.progress.total;
  if (total === null || total === 0) return 0;
  return Math.round((file.progress.loaded / total) * 100);
}

// ─────────────────────────────────────────────────
// PREVIEW MODAL COMPONENT (Lightbox dialog)
// ─────────────────────────────────────────────────
interface CollegeIdPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  fileName?: string;
  memberLabel?: string;
  fileSize?: number;
}

function CollegeIdPreviewModal({
  isOpen,
  onClose,
  imageUrl,
  fileName,
  memberLabel,
  fileSize,
}: CollegeIdPreviewModalProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Close on ESC and prevent background body scrolling
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  // Reset states when opening or URL changes
  useEffect(() => {
    if (isOpen) {
      setImageLoading(true);
      setImageError(false);
    }
  }, [isOpen, imageUrl]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="College ID Preview Box"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
    >
      {/* Dark overlay backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-background/85 backdrop-blur-md transition-opacity duration-200 cursor-pointer"
      />

      {/* Cyber-Terminal Modal Box */}
      <div
        className="relative z-10 flex flex-col w-full max-w-2xl max-h-[90vh] rounded-none border border-border bg-card shadow-2xl shadow-blue-950/50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top glowing cyan/blue accent bar */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="inline-flex size-7 items-center justify-center rounded-none border border-border bg-card text-blue-400">
              <EyeIcon className="size-3.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                  College ID Preview
                </span>
                {memberLabel && (
                  <span className="font-mono text-[10px] px-1.5 py-0.5 border border-blue-500/30 bg-blue-950/40 text-blue-300">
                    {memberLabel}
                  </span>
                )}
              </div>
              {fileName && (
                <p className="truncate font-mono text-[10px] text-slate-500 mt-0.5">
                  {fileName}
                </p>
              )}
            </div>
          </div>

          {/* Close button with ESC hint */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="inline-flex items-center gap-1.5 px-2 py-1 font-mono text-[11px] text-muted-foreground hover:text-foreground border border-border hover:border-red-500/60 hover:bg-red-950/20 transition-colors cursor-pointer"
          >
            <span className="hidden sm:inline text-[10px] text-slate-500">ESC</span>
            <XIcon className="size-3.5" />
          </button>
        </div>

        {/* Image Preview Body */}
        <div className="relative flex-1 overflow-auto p-4 sm:p-6 bg-background flex items-center justify-center min-h-[260px] max-h-[68vh]">
          {/* Cyber grid pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #3B82F6 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />

          {/* Loading Indicator */}
          {imageLoading && !imageError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/85 z-10">
              <Loader2Icon className="size-6 animate-spin text-blue-400" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Loading ID Preview...
              </span>
            </div>
          )}

          {/* Error Message */}
          {imageError ? (
            <div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
              <AlertTriangleIcon className="size-8 text-amber-400" />
              <p className="font-mono text-xs text-foreground-secondary">
                Unable to display ID preview
              </p>
              <p className="font-mono text-[10px] text-slate-500">
                The image could not be loaded or the URL has expired.
              </p>
              {imageUrl && (
                <a
                  href={imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] text-blue-400 hover:text-blue-300 underline"
                >
                  Open direct URL ↗
                </a>
              )}
            </div>
          ) : (
            <div className="relative border border-border bg-card p-2 max-w-full shadow-inner">
              <img
                src={imageUrl}
                alt={fileName || "Uploaded College ID Card"}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageLoading(false);
                  setImageError(true);
                }}
                className={`max-h-[60vh] w-auto max-w-full object-contain mx-auto select-none transition-opacity duration-200 ${
                  imageLoading ? "opacity-0" : "opacity-100"
                }`}
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-background px-4 py-2.5">
          <div className="flex items-center gap-3 font-mono text-[10px] text-slate-500">
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <CheckCircle2Icon className="size-3" />
              ID UPLOAD VERIFIED
            </span>
            {fileSize !== undefined && (
              <span>{(fileSize / 1024).toFixed(0)} KB</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {imageUrl && imageUrl.startsWith("http") && (
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-blue-400 hover:text-blue-300 border border-border hover:border-blue-500/60 bg-card transition-colors"
              >
                <ExternalLinkIcon className="size-3" />
                Raw Link
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-foreground-secondary hover:text-foreground border border-border hover:border-slate-500 bg-card transition-colors cursor-pointer"
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
// COMPONENT
// ─────────────────────────────────────────────────
export function CollegeIdUploader({
  id,
  onUploadSuccess,
  onRemove,
  currentUrl,
  memberLabel,
}: CollegeIdUploaderProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);

  const {
    files,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    isFocused,
    uploadFile,
    cancelUpload,
    retryUpload,
    removeFile,
  } = useMediaDrop({
    transport,
    restrictions: {
      accept: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
      maxFiles: 1,
      maxSize: 5 * 1024 * 1024, // 5 MB
    },
  });

  const hasFile = files.length > 0;
  const activeFile = files[0] as MediaDropFile | undefined;

  // ── Create local blob preview URL for instant display ──
  useEffect(() => {
    if (activeFile?.file) {
      const objectUrl = URL.createObjectURL(activeFile.file);
      setLocalPreviewUrl(objectUrl);
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else {
      setLocalPreviewUrl(null);
    }
  }, [activeFile?.file]);

  // ── Auto-upload on acceptance + notify parent on success ──
  useEffect(() => {
    for (const file of files) {
      if (file.status === "accepted" && file.uploadStatus === undefined) {
        uploadFile(file.id);
      }

      if (file.uploadStatus === "done") {
        const url = getUploadedUrl(file);
        if (url) onUploadSuccess(url);
      }
    }
  }, [files, uploadFile, onUploadSuccess]);

  // ── Remove handler ──
  const handleRemove = useCallback(
    (fileId?: string) => {
      setIsPreviewOpen(false);
      if (fileId) {
        removeFile(fileId);
      }
      onRemove();
    },
    [removeFile, onRemove]
  );

  // ── Dropzone border/background class ──
  const borderClass = isDragAccept
    ? "border-blue-400 bg-blue-950/20"
    : isDragReject
      ? "border-red-500 bg-red-950/20"
      : isDragActive
        ? "border-blue-500 bg-secondary"
        : isFocused
          ? "border-blue-500/70"
          : "border-border hover:border-blue-500/50";

  // URL priority: uploaded Cloudinary URL > local blob preview > currentUrl
  const uploadedUrl = activeFile ? getUploadedUrl(activeFile) : null;
  const effectivePreviewUrl = uploadedUrl || localPreviewUrl || currentUrl || null;

  // Case where an ID was already uploaded previously and passed via currentUrl
  const isExistingUploaded = !hasFile && Boolean(currentUrl);

  return (
    <div className="space-y-2">
      {/* ── Dropzone (hidden once a file card is showing) ── */}
      {!hasFile && !isExistingUploaded && (
        <div
          {...getRootProps()}
          className={`
            relative cursor-pointer rounded-none border border-dashed
            px-4 py-6 text-center transition-all duration-200
            ${borderClass}
          `}
        >
          <input {...getInputProps()} id={`college-id-input-${id}`} />

          {/* Cyber scan-line overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, #3B82F6 0px, transparent 1px, transparent 3px)",
            }}
          />

          <div className="relative flex flex-col items-center gap-2">
            <div className="inline-flex size-9 items-center justify-center rounded-none border border-border bg-background">
              <UploadCloudIcon
                className={`size-5 transition-colors ${
                  isDragAccept
                    ? "text-blue-400"
                    : isDragReject
                      ? "text-red-400"
                      : "text-slate-500"
                }`}
              />
            </div>

            <div>
              <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-foreground-secondary">
                {isDragActive
                  ? isDragAccept
                    ? "Release to upload"
                    : "File type not accepted"
                  : "Drop College ID here"}
              </p>
              <p className="mt-0.5 text-[10px] font-mono text-slate-500">
                {memberLabel && (
                  <span className="text-blue-400/70">[{memberLabel}]&nbsp;</span>
                )}
                JPG · PNG · WebP &nbsp;·&nbsp; Max 5 MB
              </p>
            </div>

            <button
              type="button"
              className="mt-1 inline-flex items-center gap-1.5 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-blue-400 border border-border bg-background hover:border-blue-500/60 hover:text-blue-300 transition-colors cursor-pointer"
            >
              <FileImageIcon className="size-3" />
              Browse Files
            </button>
          </div>
        </div>
      )}

      {/* ── File card for newly dropped/selected file ── */}
      {hasFile && activeFile && (
        <div className="rounded-none border border-border bg-background px-4 py-3 space-y-2">
          {/* File meta row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Thumbnail (clickable for preview if available) or File Icon */}
              {effectivePreviewUrl ? (
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  className="size-9 shrink-0 border border-border hover:border-blue-500/70 overflow-hidden bg-card relative group cursor-pointer transition-colors"
                  title="Click to preview ID card"
                >
                  <img
                    src={effectivePreviewUrl}
                    alt="Thumbnail"
                    className="size-full object-cover"
                  />
                  <div className="absolute inset-0 bg-blue-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <EyeIcon className="size-3.5 text-blue-300" />
                  </div>
                </button>
              ) : (
                <div className="size-9 shrink-0 flex items-center justify-center border border-border bg-card text-blue-400/70">
                  <FileImageIcon className="size-4" />
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate font-mono text-[11px] text-foreground-secondary">
                  {activeFile.name}
                </p>
                <p className="font-mono text-[10px] text-slate-500">
                  {(activeFile.size / 1024).toFixed(0)} KB
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Status badge */}
              {activeFile.uploadStatus === "uploading" && (
                <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-blue-400">
                  <Loader2Icon className="size-3 animate-spin" />
                  Uploading
                </span>
              )}
              {activeFile.uploadStatus === "done" && (
                <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                  <CheckCircle2Icon className="size-3" />
                  Uploaded
                </span>
              )}
              {activeFile.uploadStatus === "error" && (
                <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-red-400">
                  <XCircleIcon className="size-3" />
                  Failed
                </span>
              )}
              {activeFile.status === "rejected" && (
                <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-red-400">
                  <AlertTriangleIcon className="size-3" />
                  Rejected
                </span>
              )}

              {/* Preview Button (available once active or uploaded) */}
              {effectivePreviewUrl && (
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  className="inline-flex items-center gap-1 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-blue-400 hover:text-blue-300 bg-blue-950/30 hover:bg-blue-900/40 border border-blue-500/40 hover:border-blue-400 transition-colors cursor-pointer"
                >
                  <EyeIcon className="size-3" />
                  <span className="hidden sm:inline">Preview</span>
                </button>
              )}

              {/* Cancel during upload */}
              {(activeFile.uploadStatus === "queued" ||
                activeFile.uploadStatus === "uploading") && (
                <button
                  type="button"
                  aria-label="Cancel upload"
                  onClick={() => cancelUpload(activeFile.id)}
                  className="size-6 inline-flex items-center justify-center border border-border hover:border-red-500/60 text-muted-foreground hover:text-red-400 transition-colors cursor-pointer"
                >
                  <XIcon className="size-3" />
                </button>
              )}

              {/* Retry on error */}
              {activeFile.uploadStatus === "error" && (
                <button
                  type="button"
                  aria-label="Retry upload"
                  onClick={() => retryUpload(activeFile.id)}
                  className="size-6 inline-flex items-center justify-center border border-border hover:border-blue-500/60 text-muted-foreground hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <RefreshCwIcon className="size-3" />
                </button>
              )}

              {/* Remove file */}
              <button
                type="button"
                aria-label="Remove file"
                onClick={() => handleRemove(activeFile.id)}
                className="size-6 inline-flex items-center justify-center border border-border hover:border-red-500/60 text-muted-foreground hover:text-red-400 transition-colors cursor-pointer"
              >
                <XIcon className="size-3" />
              </button>
            </div>
          </div>

          {/* Slim progress bar */}
          {(activeFile.uploadStatus === "queued" ||
            activeFile.uploadStatus === "uploading") && (
            <div className="h-[2px] w-full bg-secondary overflow-hidden rounded-none">
              <div
                className="h-full bg-blue-500 transition-all duration-200"
                style={{ width: `${getProgressPercent(activeFile)}%` }}
              />
            </div>
          )}

          {/* Rejection error */}
          {activeFile.status === "rejected" && activeFile.errors.length > 0 && (
            <p className="font-mono text-[10px] text-red-400">
              {activeFile.errors[0]?.message}
            </p>
          )}

          {/* Upload error */}
          {activeFile.uploadStatus === "error" && activeFile.uploadError && (
            <p className="font-mono text-[10px] text-red-400">
              {activeFile.uploadError.message}
            </p>
          )}
        </div>
      )}

      {/* ── Existing file card (when currentUrl is present and no new file dropped) ── */}
      {isExistingUploaded && currentUrl && (
        <div className="rounded-none border border-border bg-background px-4 py-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="size-9 shrink-0 border border-border hover:border-blue-500/70 overflow-hidden bg-card relative group cursor-pointer transition-colors"
                title="Click to preview ID card"
              >
                <img
                  src={currentUrl}
                  alt="Thumbnail"
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-blue-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <EyeIcon className="size-3.5 text-blue-300" />
                </div>
              </button>

              <div className="min-w-0">
                <p className="truncate font-mono text-[11px] text-foreground-secondary">
                  {memberLabel ? `${memberLabel} ID Card` : "College ID Card"}
                </p>
                <p className="font-mono text-[10px] text-emerald-400/80">
                  Saved on server
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                <CheckCircle2Icon className="size-3" />
                Uploaded
              </span>

              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-blue-400 hover:text-blue-300 bg-blue-950/30 hover:bg-blue-900/40 border border-blue-500/40 hover:border-blue-400 transition-colors cursor-pointer"
              >
                <EyeIcon className="size-3" />
                Preview ID
              </button>

              <button
                type="button"
                aria-label="Remove uploaded ID"
                onClick={() => handleRemove()}
                className="size-6 inline-flex items-center justify-center border border-border hover:border-red-500/60 text-muted-foreground hover:text-red-400 transition-colors cursor-pointer"
                title="Remove and replace file"
              >
                <XIcon className="size-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── In-page Preview Box Modal (Lightbox) ── */}
      {effectivePreviewUrl && (
        <CollegeIdPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          imageUrl={effectivePreviewUrl}
          fileName={activeFile?.name || (memberLabel ? `${memberLabel} College ID` : "College ID Card")}
          memberLabel={memberLabel}
          fileSize={activeFile?.size}
        />
      )}
    </div>
  );
}

export default CollegeIdUploader;

