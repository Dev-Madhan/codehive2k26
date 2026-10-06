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
  ClockIcon,
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
      <DialogContent className="max-w-4xl w-[95vw] bg-[#0F0F0F] border border-[#262626] text-white p-0 overflow-hidden font-mono text-xs rounded-none shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <DialogHeader className="p-4 pr-12 border-b border-[#262626] bg-[#080808] space-y-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold text-white bg-[#161616] border border-[#262626] uppercase">
              <FileTextIcon className="size-3" />
              DOCUMENT_INSPECTOR // TIGRIS_S3
            </span>
            <span className="text-[10px] text-white bg-[#161616] border border-[#262626] px-2 py-0.5 uppercase flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-white animate-pulse" />
              VERIFIED_STORAGE
            </span>
          </div>

          <div>
            <DialogTitle className="text-base font-bold text-white uppercase tracking-tight flex items-center gap-2">
              <span>{item.name}</span>
              <span className="text-xs font-normal text-[#A3A3A3]">
                ({item.phone})
              </span>
            </DialogTitle>
            <DialogDescription className="text-[#A3A3A3] text-xs flex flex-wrap items-center gap-3 mt-1.5">
              <span className="flex items-center gap-1 text-[#E5E5E5]">
                <GraduationCapIcon className="size-3 text-[#737373]" />
                {item.college}
                {item.department ? ` • ${item.department}` : ""}
                {item.year ? ` • ${item.year}` : ""}
              </span>
              <span className="flex items-center gap-1 text-white font-semibold">
                <CalendarIcon className="size-3" />
                {item.eventName}
              </span>
              <span className="flex items-center gap-1 text-[#737373] font-mono">
                <ClockIcon className="size-3 text-[#737373]" />
                Uploaded:{" "}
                {new Date(item.uploadedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Embedded Document Viewer */}
        <div className="relative flex-1 bg-black min-h-[50vh] sm:min-h-[60vh] flex flex-col">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0F0F0F]/90 gap-3 text-[#A3A3A3]">
              <Loader2Icon className="size-8 text-white animate-spin" />
              <div className="text-xs uppercase tracking-wider text-white">
                Streaming Tigris S3 Document...
              </div>
              <div className="text-[11px] text-[#737373] max-w-xs text-center truncate font-mono">
                {item.collegeIdUrl}
              </div>
            </div>
          )}

          <iframe
            src={`${item.collegeIdUrl}#toolbar=0&navpanes=0`}
            title={`College ID - ${item.name}`}
            className="w-full h-full flex-1 border-0 bg-[#080808]"
            onLoad={() => setIsLoading(false)}
          />
        </div>

        {/* Action Footer */}
        <DialogFooter className="p-3 sm:p-4 border-t border-[#262626] bg-[#080808] flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="rounded-none border-[#262626] bg-[#0F0F0F] text-[#E5E5E5] hover:text-white hover:bg-[#161616] text-xs uppercase"
            >
              {copied ? (
                <>
                  <CheckIcon className="size-3.5 mr-1 text-white" />
                  [ Copied S3 Link ]
                </>
              ) : (
                <>
                  <CopyIcon className="size-3.5 mr-1 text-[#737373]" />
                  [ Copy S3 Link ]
                </>
              )}
            </Button>

            <a
              href={item.collegeIdUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white hover:text-white bg-[#0F0F0F] hover:bg-[#161616] border border-[#262626] hover:border-[#404040] uppercase transition-all"
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
              className="rounded-none border-[#262626] bg-transparent text-[#E5E5E5] hover:bg-[#161616] hover:text-white text-xs uppercase"
            >
              [ Close ]
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
