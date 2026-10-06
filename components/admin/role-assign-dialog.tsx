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
import { ShieldCheckIcon, UserIcon, AlertTriangleIcon, Loader2Icon } from "lucide-react";
import { updateUserRole } from "@/actions/admin-settings";
import { Role } from "@prisma/client";

export interface TargetUserInfo {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface RoleAssignDialogProps {
  user: TargetUserInfo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function RoleAssignDialog({
  user,
  open,
  onOpenChange,
  onSuccess,
}: RoleAssignDialogProps) {
  const [selectedRole, setSelectedRole] = React.useState<Role>("PARTICIPANT");
  const [isUpdating, setIsUpdating] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      setSelectedRole(user.role);
    }
  }, [user]);

  if (!user) return null;

  const handleUpdate = async () => {
    if (selectedRole === user.role) {
      onOpenChange(false);
      return;
    }

    try {
      setIsUpdating(true);
      const res = await updateUserRole(user.id, selectedRole);

      if (!res.success) {
        toast.error(res.error?.message || "Failed to update role.");
        return;
      }

      toast.success(res.message || `Updated role to ${selectedRole}`);
      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsUpdating(false);
    }
  };

  const isElevatingToAdmin = selectedRole === "ADMIN" && user.role !== "ADMIN";
  const isDemotingToParticipant = selectedRole === "PARTICIPANT" && user.role === "ADMIN";

  return (
    <Dialog open={open} onOpenChange={isUpdating ? undefined : onOpenChange}>
      <DialogContent className="max-w-md w-full bg-[#0F0F0F] border border-[#262626] text-white p-0 overflow-hidden font-mono text-xs rounded-none shadow-2xl">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-5 pr-12 border-b border-[#262626] bg-[#080808] space-y-1">
          <div className="flex items-center gap-2 text-zinc-400 font-bold uppercase text-xs">
            <ShieldCheckIcon className="size-4 text-white" />
            <span>&gt; ADMIN // ROLE_ASSIGNER</span>
          </div>
          <DialogTitle className="text-base font-bold text-white uppercase tracking-tight">
            Modify Access Privileges
          </DialogTitle>
          <DialogDescription className="text-zinc-400 text-xs">
            Assign administrative or participant governance tier for this user.
          </DialogDescription>
        </DialogHeader>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Target User Info Card */}
          <div className="border border-[#262626] bg-[#080808] p-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="size-7 rounded-none bg-[#161616] border border-[#262626] flex items-center justify-center text-white font-bold shrink-0">
                  <UserIcon className="size-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-white truncate">{user.name}</p>
                  <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold uppercase border shrink-0 ${
                  user.role === "ADMIN"
                    ? "text-amber-400 border-amber-500/40 bg-amber-500/10"
                    : "text-white border-[#404040] bg-[#161616]"
                }`}
              >
                CURRENT: {user.role}
              </span>
            </div>
          </div>

          {/* Role Tier Selection */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">
              Target Role Assignment:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole("PARTICIPANT")}
                className={`p-3 text-left border rounded-none transition-all cursor-pointer ${
                  selectedRole === "PARTICIPANT"
                    ? "border-white bg-white/10 text-white"
                    : "border-[#262626] bg-[#080808] text-zinc-400 hover:border-zinc-500"
                }`}
              >
                <div className="font-bold text-xs uppercase flex items-center justify-between">
                  <span>PARTICIPANT</span>
                  {selectedRole === "PARTICIPANT" && (
                    <span className="size-1.5 bg-white rounded-none animate-pulse" />
                  )}
                </div>
                <p className="text-[10px] text-zinc-400 mt-1">
                  Default Attendee Access
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("ADMIN")}
                className={`p-3 text-left border rounded-none transition-all cursor-pointer ${
                  selectedRole === "ADMIN"
                    ? "border-amber-400 bg-amber-500/15 text-white"
                    : "border-[#262626] bg-[#080808] text-zinc-400 hover:border-zinc-500"
                }`}
              >
                <div className="font-bold text-xs uppercase flex items-center justify-between">
                  <span>ADMIN</span>
                  {selectedRole === "ADMIN" && (
                    <span className="size-1.5 bg-amber-400 rounded-none animate-pulse" />
                  )}
                </div>
                <p className="text-[10px] text-zinc-400 mt-1">
                  Full Authority &amp; Gate Pass Scanner
                </p>
              </button>
            </div>
          </div>

          {/* Contextual Warning Banner */}
          {isElevatingToAdmin && (
            <div className="border border-amber-500/30 bg-amber-500/10 p-3 flex items-start gap-2.5">
              <AlertTriangleIcon className="size-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-amber-300 uppercase">
                  Elevated Privileges Notice
                </p>
                <p className="text-[10px] text-zinc-300 leading-relaxed">
                  Granting ADMIN privileges will empower this user with live gate check-in scanners, attendee data management, event modification, and Tigris storage control.
                </p>
              </div>
            </div>
          )}

          {isDemotingToParticipant && (
            <div className="border border-[#262626] bg-[#161616] p-3 flex items-start gap-2.5">
              <ShieldCheckIcon className="size-4 text-white shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-white uppercase">
                  Restricting to Participant Tier
                </p>
                <p className="text-[10px] text-zinc-300 leading-relaxed">
                  This user will immediately lose access to the administrative console and live scanner facilities.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <DialogFooter className="p-4 sm:p-5 border-t border-[#262626] bg-[#080808] flex flex-row items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isUpdating}
            onClick={() => onOpenChange(false)}
            className="rounded-none border-[#262626] bg-transparent text-zinc-300 hover:bg-[#161616] hover:text-white"
          >
            [ Cancel ]
          </Button>

          <Button
            type="button"
            disabled={isUpdating || selectedRole === user.role}
            onClick={handleUpdate}
            className={`rounded-none font-bold uppercase transition-all shadow-sm ${
              selectedRole === "ADMIN"
                ? "bg-amber-600 hover:bg-amber-500 text-black border border-amber-400"
                : "bg-white hover:bg-zinc-200 text-black border border-white"
            }`}
          >
            {isUpdating ? (
              <span className="flex items-center gap-1.5">
                <Loader2Icon className="size-3.5 animate-spin" />
                Updating...
              </span>
            ) : (
              `[ Confirm: ${selectedRole} ]`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
