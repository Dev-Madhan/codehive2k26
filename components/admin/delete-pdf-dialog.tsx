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
import { ShieldAlertIcon, Trash2Icon, Loader2Icon, ExternalLinkIcon } from "lucide-react";
import { deleteUploadedCollegeIdPdf } from "@/actions/admin-settings";

export interface TargetPdfItem {
  id: string;
  name: string;
  college: string;
  eventName: string;
  pdfUrl: string;
}

interface DeletePdfDialogProps {
  item: TargetPdfItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeletePdfDialog({
  item,
  open,
  onOpenChange,
  onSuccess,
}: DeletePdfDialogProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  if (!item) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await deleteUploadedCollegeIdPdf(item.id, item.pdfUrl);

      if (!res.success) {
        toast.error(res.error?.message || "Failed to delete PDF from storage.");
        return;
      }

      toast.success("Document permanently purged from Tigris S3.");
      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={isDeleting ? undefined : onOpenChange}>
      <DialogContent className="max-w-md w-full bg-[#0F0F0F] border border-red-900/60 text-white p-0 overflow-hidden font-mono text-xs rounded-none shadow-2xl">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-5 pr-12 border-b border-red-900/40 bg-red-950/20 space-y-1">
          <div className="flex items-center gap-2 text-red-400 font-bold uppercase text-xs">
            <ShieldAlertIcon className="size-4 text-red-400" />
            <span>&gt; DANGER // TIGRIS_S3_PURGE</span>
          </div>
          <DialogTitle className="text-base font-bold text-white uppercase tracking-tight">
            Permanently Delete College ID Document
          </DialogTitle>
          <DialogDescription className="text-red-300/80 text-xs">
            This action cannot be undone. The document will be expunged from Tigris S3 storage.
          </DialogDescription>
        </DialogHeader>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Warning Banner */}
          <div className="border border-red-800/60 bg-red-950/30 p-3 space-y-1.5 text-red-200">
            <p className="font-bold text-xs uppercase tracking-wide text-red-300">
              ⚠️ Permanent Destruction Notice
            </p>
            <p className="text-[11px] leading-relaxed text-red-200/90">
              You are about to remove this uploaded ID card (flagged as fake, duplicate, or invalid).
              It will be <strong>deleted directly from Tigris S3 storage</strong> and the verification URL on this participant&apos;s record will be permanently cleared.
            </p>
          </div>

          {/* Attendee Details Card */}
          <div className="border border-[#262626] bg-[#080808] p-3 space-y-2 text-xs">
            <div className="flex justify-between items-start gap-2 border-b border-[#262626]/60 pb-2">
              <span className="text-[#737373] uppercase text-[10px]">Attendee:</span>
              <span className="font-bold text-white text-right truncate">{item.name}</span>
            </div>

            <div className="flex justify-between items-start gap-2 border-b border-[#262626]/60 pb-2">
              <span className="text-[#737373] uppercase text-[10px]">College:</span>
              <span className="font-semibold text-slate-200 text-right truncate max-w-[240px]">
                {item.college || "N/A"}
              </span>
            </div>

            <div className="flex justify-between items-start gap-2 border-b border-[#262626]/60 pb-2">
              <span className="text-[#737373] uppercase text-[10px]">Event Track:</span>
              <span className="font-mono text-white font-bold text-right truncate">
                {item.eventName}
              </span>
            </div>

            <div className="flex justify-between items-center gap-2 pt-1">
              <span className="text-[#737373] uppercase text-[10px]">File Target:</span>
              <a
                href={item.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-white hover:underline truncate max-w-[200px]"
              >
                <span>View Current PDF</span>
                <ExternalLinkIcon className="size-3 shrink-0" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="p-4 sm:p-5 border-t border-[#262626] bg-[#080808] flex flex-row items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isDeleting}
            onClick={() => onOpenChange(false)}
            className="rounded-none border-[#262626] bg-transparent text-[#E5E5E5] hover:bg-[#161616] hover:text-white"
          >
            [ Cancel ]
          </Button>

          <Button
            type="button"
            disabled={isDeleting}
            onClick={handleDelete}
            className="rounded-none bg-red-600 hover:bg-red-700 text-white font-bold uppercase border border-red-500 transition-all shadow-sm"
          >
            {isDeleting ? (
              <span className="flex items-center gap-1.5">
                <Loader2Icon className="size-3.5 animate-spin" />
                Purging from S3...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Trash2Icon className="size-3.5" />
                [ Purge PDF from Tigris ]
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
