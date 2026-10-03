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
import { ShieldAlertIcon, Trash2Icon, Loader2Icon } from "lucide-react";
import { deleteEvent } from "@/actions/event";

interface DeleteEventDialogProps {
  eventId: string | null;
  eventName: string;
  registrationsCount?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteEventDialog({
  eventId,
  eventName,
  registrationsCount = 0,
  open,
  onOpenChange,
  onSuccess,
}: DeleteEventDialogProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (!eventId) return;

    try {
      setIsDeleting(true);
      const res = await deleteEvent(eventId);
      if (!res.success) {
        toast.error(res.error?.message || "Failed to delete event.");
        return;
      }

      toast.success(`Event track "${eventName}" removed.`);
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={isDeleting ? undefined : onOpenChange}>
      <DialogContent className="max-w-md w-full bg-[#060D1A] border border-red-900/60 text-white p-0 overflow-hidden font-mono text-xs rounded-none shadow-2xl">
        <DialogHeader className="p-4 sm:p-5 border-b border-red-900/40 bg-red-950/20 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-red-400 bg-red-950/60 border border-red-500/40 px-2 py-0.5 uppercase tracking-wider inline-flex items-center gap-1.5">
              <ShieldAlertIcon className="size-3 text-red-400" />
              CRITICAL PURGE ACTION
            </span>
          </div>
          <DialogTitle className="text-sm sm:text-base font-bold text-white uppercase tracking-tight">
            Delete Event Track
          </DialogTitle>
          <DialogDescription className="text-xs text-red-400/90 leading-relaxed">
            Are you sure you want to permanently remove this event from the symposium?
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 sm:p-5 space-y-3">
          <div className="border border-red-900/40 bg-red-950/10 p-3 space-y-1">
            <p className="text-sm font-bold text-white uppercase">{eventName}</p>
            {registrationsCount > 0 ? (
              <p className="text-xs text-amber-400 font-semibold mt-1">
                ⚠️ Warning: {registrationsCount} candidate registration(s) are linked to this event.
              </p>
            ) : (
              <p className="text-[11px] text-slate-400">
                No active registrations linked to this event track.
              </p>
            )}
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            This action cannot be undone. The track will be removed from the public catalogue and admin consoles immediately.
          </p>
        </div>

        <DialogFooter className="p-4 border-t border-[#152A54] bg-[#03060E] flex flex-row items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="rounded-none border-[#152A54] bg-[#060D1A] text-slate-300 font-mono text-xs uppercase"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-none bg-red-700 hover:bg-red-600 text-white font-mono text-xs uppercase font-bold px-4 cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2Icon className="size-3.5 animate-spin mr-1.5" />
                <span>Removing...</span>
              </>
            ) : (
              <>
                <Trash2Icon className="size-3.5 mr-1.5" />
                <span>Confirm Deletion</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
