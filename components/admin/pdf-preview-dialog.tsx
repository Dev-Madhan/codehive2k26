"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FileTextIcon,
  ExternalLinkIcon,
  CopyIcon,
  Trash2Icon,
  Loader2Icon,
  CheckIcon,
  ShieldAlertIcon,
  GraduationCapIcon,
  CalendarIcon,
} from "lucide-react";
import { AttendeePdfItem } from "@/components/admin/settings-client";

interface PdfPreviewDialogProps {
  item: AttendeePdfItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestDelete?: (item: AttendeePdfItem) => void;
}

export function PdfPreviewDialog({
  item,
  open,
  onOpenChange,
  onRequestDelete,
}: PdfPreviewDialogProps) {
  const [copied, setCopied] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (open) {
      setIsLoading(true);
      setCopied(false);
    }
  }, [open, item]);

  if (!item) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(item.collegeIdUrl);
      setCopied(true);
      toast.success("Tigris S3 URL copied to clipboard.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link to clipboard.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] bg-[#060D1A] border border-[#152A54] text-white p-0 overflow-hidden font-mono text-xs rounded-none shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <DialogHeader className="p-4 border-b border-[#152A54] bg-[#03060E] space-y-2 shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold text-blue-400 bg-blue-600/15 border border-blue-500/30 uppercase">
                <FileTextIcon className="size-3" />
                DOCUMENT_INSPECTOR // TIGRIS_S3
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 uppercase flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                VERIFIED_STORAGE
              </span>
            </div>

            <div className="text-[10px] text-slate-400">
              Uploaded:{" "}
              {new Date(item.uploadedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <DialogTitle className="text-base font-bold text-white uppercase tracking-tight flex items-center gap-2">
                <span>{item.name}</span>
                <span className="text-xs font-normal text-slate-400">
                  ({item.phone})
                </span>
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-xs flex flex-wrap items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-slate-300">
                  <GraduationCapIcon className="size-3 text-slate-400" />
                  {item.college}
                  {item.department ? ` • ${item.department}` : ""}
                  {item.year ? ` • ${item.year}` : ""}
                </span>
                <span className="flex items-center gap-1 text-blue-400">
                  <CalendarIcon className="size-3" />
                  {item.eventName}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Embedded Document Viewer */}
        <div className="relative flex-1 bg-black min-h-[50vh] sm:min-h-[60vh] flex flex-col">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#060D1A]/90 gap-3 text-slate-400">
              <Loader2Icon className="size-8 text-blue-400 animate-spin" />
              <div className="text-xs uppercase tracking-wider text-white">
                Streaming Tigris S3 Document...
              </div>
              <div className="text-[11px] text-slate-500 max-w-xs text-center truncate font-mono">
                {item.collegeIdUrl}
              </div>
            </div>
          )}

          <iframe
            src={`${item.collegeIdUrl}#toolbar=0&navpanes=0`}
            title={`College ID - ${item.name}`}
            className="w-full h-full flex-1 border-0 bg-[#03060E]"
            onLoad={() => setIsLoading(false)}
          />
        </div>

        {/* Action Footer */}
        <DialogFooter className="p-3 sm:p-4 border-t border-[#152A54] bg-[#030712] flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="rounded-none border-[#152A54] bg-[#060D1A] text-slate-300 hover:text-white hover:bg-[#0B162C] text-xs uppercase"
            >
              {copied ? (
                <>
                  <CheckIcon className="size-3.5 mr-1 text-emerald-400" />
                  [ Copied S3 Link ]
                </>
              ) : (
                <>
                  <CopyIcon className="size-3.5 mr-1 text-slate-400" />
                  [ Copy S3 Link ]
                </>
              )}
            </Button>

            <a
              href={item.collegeIdUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-400 hover:text-white bg-[#060D1A] hover:bg-[#0B162C] border border-[#152A54] hover:border-blue-500/50 uppercase transition-all"
            >
              <ExternalLinkIcon className="size-3.5" />
              <span>Full Screen</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            {onRequestDelete && (
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onRequestDelete(item);
                }}
                className="rounded-none bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-200 border border-red-900/70 hover:border-red-600 text-xs font-bold uppercase transition-all"
              >
                <Trash2Icon className="size-3.5 mr-1" />
                [ Purge Document ]
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="rounded-none border-[#152A54] bg-transparent text-slate-300 hover:bg-[#0B162C] hover:text-white text-xs uppercase"
            >
              [ Close ]
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
