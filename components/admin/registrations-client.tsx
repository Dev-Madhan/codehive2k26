"use client";

import * as React from "react";
import {
  SearchIcon,
  CheckCircle2Icon,
  ClockIcon,
  BusIcon,
  CopyIcon,
  CheckIcon,
  Building2Icon,
  CalendarIcon,
  FilterIcon,
  XIcon,
  UserIcon,
  RefreshCwIcon,
  RadioIcon,
  BellIcon,
  BellOffIcon,
  SparklesIcon,
  PhoneIcon,
  MailIcon,
  GraduationCapIcon,
  BookOpenIcon,
  CalendarCheckIcon,
  MapPinIcon,
  UsersIcon,
  Trash2Icon,
  ShieldAlertIcon,
  BadgeCheckIcon,
  TicketIcon,
  XCircleIcon,
  AlertTriangleIcon,
  ClockIcon as ClockAltIcon,
  DownloadIcon,
} from "lucide-react";
import { toast } from "sonner";
import { ExportDataDialog } from "@/components/admin/export-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deleteRegistration } from "@/actions/registration";

export interface RegistrationItem {
  id: string;
  registrationNumber: string;
  status: string;
  checkedIn: boolean;
  transportOptIn: boolean;
  pickupRoute?: string | null;
  pickupStop?: string | null;
  pickupLandmark?: string | null;
  passengersCount: number;
  createdAt: Date | string;
  participant: {
    id?: string;
    name: string;
    email: string;
    phone: string;
    college: string;
    department?: string;
    year?: string;
    imageUrl?: string | null;
  };
  event: {
    name: string;
    slug?: string;
    venue?: string;
    startAt?: Date | string;
  };
  team?: {
    id: string;
    name: string;
    members?: {
      id: string;
      name: string;
      phone: string;
      email?: string | null;
      college?: string | null;
      department?: string | null;
      year?: string | null;
      transportOptIn: boolean;
      pickupRoute?: string | null;
      pickupStop?: string | null;
      pickupLandmark?: string | null;
    }[];
  } | null;
  checkIn?: {
    checkedInAt: Date | string;
  } | null;
}

interface EventOption {
  id: string;
  name: string;
  slug?: string;
}

// ─── Participant Detail Dialog ───────────────────────────────────────────────

function ParticipantDetailDialog({
  registration,
  open,
  onOpenChange,
  onRemove,
}: {
  registration: RegistrationItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRemove: () => void;
}) {
  const { participant, event, team, checkIn } = registration;
  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(registration.registrationNumber);
    setIsCopied(true);
    toast.success(`Copied Pass Code: ${registration.registrationNumber}`);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const initials = participant.name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "PA";

  const registeredAt = new Date(registration.createdAt).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const checkedInAt = checkIn
    ? new Date(checkIn.checkedInAt).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl w-full bg-[#0F0F0F] border border-[#262626] text-white p-0 overflow-hidden font-mono max-h-[90vh] flex flex-col no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        showCloseButton={false}
      >
        {/* ── Header Banner ── */}
        <div className="relative bg-[#080808] border-b border-[#262626] p-5 shrink-0">
          {/* Terminal breadcrumb */}
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold text-white bg-[#161616] border border-[#262626] tracking-wider">
              &gt; ADMIN // PARTICIPANT_DOSSIER
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="text-[#737373] hover:text-white transition-colors p-1 border border-transparent hover:border-[#262626] hover:bg-[#161616] cursor-pointer"
            >
              <XIcon className="size-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          {/* Participant identity block */}
          <div className="flex items-center gap-4">
            {/* Avatar */}
            {participant.imageUrl ? (
              <img
                src={participant.imageUrl}
                alt={participant.name}
                className="size-14 object-cover border-2 border-[#404040] shrink-0"
              />
            ) : (
              <div className="size-14 rounded-none bg-[#161616] border-2 border-[#404040] text-white font-bold text-lg flex items-center justify-center shrink-0">
                {initials}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-white tracking-tight truncate">
                {participant.name}
              </h2>
              <p className="text-xs text-[#A3A3A3] truncate">{participant.email}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {/* Registration Status Badge */}
                <span
                  className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border ${
                    registration.checkedIn
                      ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                      : "border-amber-500/40 bg-amber-500/10 text-amber-400"
                  }`}
                >
                  {registration.checkedIn ? (
                    <>
                      <CheckCircle2Icon className="size-3 shrink-0 text-emerald-400" />
                      <span>VERIFIED</span>
                    </>
                  ) : (
                    <>
                      <ClockIcon className="size-3 shrink-0 text-amber-400" />
                      <span>PENDING</span>
                    </>
                  )}
                </span>

                {/* Entry Type Badge */}
                <span
                  className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border ${
                    Boolean(team && team.name) 
                      ? "border-purple-500/40 bg-purple-500/15 text-purple-300"
                      : "border-sky-500/40 bg-sky-500/15 text-sky-300"
                  }`}
                >
                  <UsersIcon className="size-3 shrink-0" />
                  <span>{team && team.name ? `TEAM ENTRY (${team.name})` : "INDIVIDUAL ENTRY"}</span>
                </span>

                {/* Pass Code Badge with copy action */}
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold text-white bg-[#161616] border border-[#262626] px-2 py-0.5 hover:bg-[#1F1F1F] hover:border-[#404040] transition-colors cursor-pointer"
                  title="Click to copy pass code"
                >
                  <TicketIcon className="size-3 shrink-0 text-white" />
                  <span>{registration.registrationNumber}</span>
                  {isCopied ? (
                    <CheckIcon className="size-2.5 text-emerald-400" />
                  ) : (
                    <CopyIcon className="size-2.5 text-[#737373]" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Scrollable Content (Scrollbar Hidden, Full Scroll Functionality Retained) ── */}
        <div className="overflow-y-auto flex-1 p-5 space-y-5 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

          {/* ── Section: Personal Information ── */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <UserIcon className="size-3.5 text-white" />
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-white">
                PERSONAL INFORMATION
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <InfoField
                icon={<PhoneIcon className="size-3 text-[#737373]" />}
                label="PHONE NUMBER"
                value={participant.phone}
              />
              <InfoField
                icon={<MailIcon className="size-3 text-[#737373]" />}
                label="EMAIL ADDRESS"
                value={participant.email}
                mono
              />
              <InfoField
                icon={<Building2Icon className="size-3 text-[#737373]" />}
                label="COLLEGE / INSTITUTION"
                value={participant.college}
              />
              {participant.department && (
                <InfoField
                  icon={<BookOpenIcon className="size-3 text-[#737373]" />}
                  label="DEPARTMENT"
                  value={participant.department}
                />
              )}
              {participant.year && (
                <InfoField
                  icon={<GraduationCapIcon className="size-3 text-[#737373]" />}
                  label="ACADEMIC YEAR"
                  value={participant.year}
                />
              )}
            </div>
          </div>

          <div className="border-t border-[#262626]" />

          {/* ── Section: Registration Details ── */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TicketIcon className="size-3.5 text-white" />
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-white">
                REGISTRATION DETAILS
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <InfoField
                icon={<BadgeCheckIcon className="size-3 text-[#737373]" />}
                label="PASS ID"
                value={registration.registrationNumber}
                mono
                highlight
              />
              <InfoField
                icon={<UsersIcon className="size-3 text-[#737373]" />}
                label="ENTRY TYPE"
                value={team && team.name ? `TEAM (${team.name})` : "INDIVIDUAL"}
                highlight={Boolean(team && team.name)}
              />
              <InfoField
                icon={<CalendarCheckIcon className="size-3 text-[#737373]" />}
                label="REGISTERED ON"
                value={registeredAt}
              />
              <InfoField
                icon={<SparklesIcon className="size-3 text-[#737373]" />}
                label="EVENT"
                value={event.name}
              />
              {event.venue && (
                <InfoField
                  icon={<MapPinIcon className="size-3 text-[#737373]" />}
                  label="VENUE"
                  value={event.venue}
                />
              )}
              {event.startAt && (
                <InfoField
                  icon={<CalendarIcon className="size-3 text-[#737373]" />}
                  label="EVENT DATE"
                  value={new Date(event.startAt).toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                />
              )}
              <div className="flex flex-col gap-0.5 bg-[#080808] border border-[#262626] p-2.5">
                <span className="text-[10px] uppercase tracking-wider text-[#737373] font-semibold">
                  CHECK-IN STATUS
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {registration.checkedIn ? (
                    <>
                      <CheckCircle2Icon className="size-3.5 text-emerald-400 shrink-0" />
                      <span className="text-[11px] font-bold uppercase text-emerald-400">
                        VERIFIED{" "}
                        {checkedInAt && (
                          <span className="text-[#737373] font-normal lowercase tracking-normal">
                            · {checkedInAt}
                          </span>
                        )}
                      </span>
                    </>
                  ) : (
                    <>
                      <ClockIcon className="size-3.5 text-amber-400 shrink-0" />
                      <span className="text-[11px] font-bold uppercase text-amber-400">
                        PENDING CHECK-IN
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Section: Transport Details ── */}
          {registration.transportOptIn && (
            <>
              <div className="border-t border-[#262626]" />
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BusIcon className="size-3.5 text-white" />
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-white">
                    TRANSPORT DETAILS
                  </h3>
                </div>
                <div className="bg-[#080808] border border-[#262626] p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-white uppercase tracking-wider">
                      <BusIcon className="size-3 shrink-0" />
                      BUS TRANSPORT • {registration.passengersCount} SEAT{registration.passengersCount > 1 ? "S" : ""}
                    </span>
                    <span className="text-[10px] font-bold text-[#E5E5E5] font-mono">
                      DEPARTURE: 06:00 AM
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {registration.pickupRoute && (
                      <InfoField
                        icon={<MapPinIcon className="size-3 text-[#737373]" />}
                        label="PICKUP ROUTE"
                        value={registration.pickupRoute}
                      />
                    )}
                    {registration.pickupStop && (
                      <InfoField
                        icon={<MapPinIcon className="size-3 text-[#737373]" />}
                        label="PICKUP STOP"
                        value={registration.pickupStop}
                      />
                    )}
                    {registration.pickupLandmark && (
                      <InfoField
                        icon={<MapPinIcon className="size-3 text-[#737373]" />}
                        label="LANDMARK"
                        value={registration.pickupLandmark}
                      />
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Section: Team Members ── */}
          {team && team.members && team.members.length > 0 && (
            <>
              <div className="border-t border-[#262626]" />
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <UsersIcon className="size-3.5 text-white" />
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-white">
                    TEAM • {team.name}
                  </h3>
                </div>
                <div className="space-y-2">
                  {team.members.map((member, idx) => (
                    <div
                      key={member.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 bg-[#080808] border border-[#262626] px-3 py-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[10px] text-[#737373] shrink-0 font-bold font-mono">
                          #{idx + 1}
                        </span>
                        <div className="min-w-0">
                          <span className="text-xs text-white font-semibold truncate block">
                            {member.name}
                          </span>
                          <span className="text-[10px] text-[#A3A3A3] truncate block font-mono">
                            {member.phone}{member.email ? ` • ${member.email}` : ""}{member.department ? ` • ${member.department}` : ""}{member.year ? ` (${member.year})` : ""}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 self-start sm:self-auto">
                        {member.transportOptIn ? (
                          <span className="text-[9px] text-white font-bold border border-[#262626] bg-[#161616] px-1.5 py-0.5 tracking-wider font-mono">
                            BUS PASS {member.pickupRoute ? `• ${member.pickupRoute}` : ""}
                          </span>
                        ) : (
                          <span className="text-[9px] text-neutral-400 border border-[#262626] bg-[#0c0c0c] px-1.5 py-0.5 tracking-wider font-mono">
                            OWN TRANSPORT
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Footer Actions ── */}
        <div className="shrink-0 border-t border-[#262626] bg-[#080808] px-5 py-3 flex items-center justify-between gap-3">
          <button
            onClick={onRemove}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-wider font-bold text-red-400 border border-red-900/60 bg-red-950/30 hover:bg-red-950/60 hover:text-red-300 transition-colors cursor-pointer"
          >
            <Trash2Icon className="size-3 shrink-0" />
            <span>REMOVE CANDIDATE</span>
          </button>
          <button
            onClick={() => onOpenChange(false)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[11px] uppercase tracking-wider font-bold text-[#E5E5E5] border border-[#262626] bg-[#0F0F0F] hover:bg-[#161616] hover:text-white transition-colors cursor-pointer"
          >
            <span>CLOSE</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Info Field Sub-component ────────────────────────────────────────────────

function InfoField({
  icon,
  label,
  value,
  mono = false,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5 bg-[#080808] border border-[#262626] p-2.5">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-[10px] uppercase tracking-wider text-[#737373] font-semibold">{label}</span>
      </div>
      <span
        className={`text-[11px] font-semibold truncate ${
          highlight ? "text-white font-mono font-bold" : "text-[#E5E5E5]"
        } ${mono ? "font-mono" : ""}`}
        title={value}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Remove Candidate Confirmation Dialog ───────────────────────────────────

function RemoveCandidateDialog({
  registration,
  open,
  onOpenChange,
  onConfirm,
  isRemoving,
}: {
  registration: RegistrationItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isRemoving: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={isRemoving ? undefined : onOpenChange}>
      <DialogContent
        className="max-w-md w-full bg-[#0F0F0F] border border-red-900/60 text-white p-0 overflow-hidden font-mono no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        showCloseButton={false}
      >
        {/* Danger header */}
        <div className="border-b border-red-900/40 bg-red-950/20 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="size-9 flex items-center justify-center border border-red-500/40 bg-red-950/40 text-red-400 shrink-0">
              <ShieldAlertIcon className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-sm font-bold text-white uppercase tracking-wider">
                REMOVE CANDIDATE
              </DialogTitle>
              <DialogDescription className="text-[11px] text-red-400 mt-0.5">
                Permanent action. Candidate record will be deleted from the database.
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Confirmation body */}
        <div className="px-5 py-4 space-y-4 max-h-[75vh] overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <p className="text-xs text-[#E5E5E5] leading-relaxed">
            You are about to permanently delete the registration record for:
          </p>

          {/* Candidate card */}
          <div className="border border-red-900/50 bg-red-950/10 p-3 space-y-1.5">
            <p className="text-sm font-bold text-white">{registration.participant.name}</p>
            <p className="text-[11px] text-[#A3A3A3] font-mono">{registration.participant.email}</p>
            <div className="flex items-center gap-2 pt-0.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-[#161616] border border-[#262626] px-2 py-0.5 font-mono">
                <TicketIcon className="size-2.5" />
                <span>{registration.registrationNumber}</span>
              </span>
              <span className="text-[10px] text-[#737373]">•</span>
              <span className="text-[10px] text-[#E5E5E5] uppercase tracking-wider font-semibold">
                {registration.event.name}
              </span>
            </div>
          </div>

          {/* Warning list */}
          <div className="bg-[#080808] border border-red-900/40 p-3 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
              <ShieldAlertIcon className="size-3.5 shrink-0" />
              <span>CRITICAL ACTION WARNING:</span>
            </p>
            <ul className="space-y-1.5 text-[11px] text-[#E5E5E5]">
              <li className="flex items-start gap-2">
                <XCircleIcon className="size-3.5 text-red-400 shrink-0 mt-0.5" />
                <span>Permanent deletion of participant registration record</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircleIcon className="size-3.5 text-red-400 shrink-0 mt-0.5" />
                <span>Purge linked gate check-in pass and payment records</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircleIcon className="size-3.5 text-red-400 shrink-0 mt-0.5" />
                <span>Revoke candidate event pass code and QR credentials</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action buttons */}
        <div className="border-t border-[#262626] bg-[#080808] px-5 py-3 flex items-center justify-end gap-2">
          <button
            onClick={() => onOpenChange(false)}
            disabled={isRemoving}
            className="px-4 py-1.5 text-[11px] uppercase tracking-wider font-bold text-[#E5E5E5] border border-[#262626] bg-[#0F0F0F] hover:bg-[#161616] hover:text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            CANCEL
          </button>
          <button
            onClick={onConfirm}
            disabled={isRemoving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[11px] uppercase tracking-wider font-bold text-white border border-red-600 bg-red-700 hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRemoving ? (
              <>
                <span className="size-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>REMOVING...</span>
              </>
            ) : (
              <>
                <Trash2Icon className="size-3 shrink-0" />
                <span>CONFIRM REMOVAL</span>
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main RegistrationsClient Component ─────────────────────────────────────

export function RegistrationsClient({
  initialRegistrations,
  events = [],
}: {
  initialRegistrations: RegistrationItem[];
  events?: EventOption[];
}) {
  const [registrations, setRegistrations] =
    React.useState<RegistrationItem[]>(initialRegistrations);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<"ALL" | "TEAM" | "INDIVIDUAL" | "CHECKED_IN" | "PENDING" | "BUS">("ALL");
  const [selectedEvent, setSelectedEvent] = React.useState<string>("ALL");
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  // Real-time synchronization state
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [autoSync, setAutoSync] = React.useState(true);
  const [lastSyncedAt, setLastSyncedAt] = React.useState<Date>(new Date());
  const [newlyAddedIds, setNewlyAddedIds] = React.useState<Set<string>>(new Set());
  const [soundEnabled, setSoundEnabled] = React.useState(false);

  // Dialog state
  const [selectedRegistration, setSelectedRegistration] =
    React.useState<RegistrationItem | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = React.useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = React.useState(false);
  const [isRemoving, setIsRemoving] = React.useState(false);
  const [exportDialogOpen, setExportDialogOpen] = React.useState(false);

  // Sync initial registrations when prop changes
  React.useEffect(() => {
    setRegistrations(initialRegistrations);
  }, [initialRegistrations]);

  // Audio chime for new registrations using Web Audio API
  const playLiveTone = React.useCallback(() => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // AudioContext might require user gesture, safe to ignore
    }
  }, []);

  // Fetch live registrations from /api/registrations
  const fetchLiveRegistrations = React.useCallback(
    async (isManual = false) => {
      try {
        setIsSyncing(true);
        const res = await fetch(`/api/registrations?t=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
          },
        });

        if (!res.ok) {
          throw new Error("Sync failed");
        }

        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const freshData: RegistrationItem[] = json.data;

          setRegistrations((prev) => {
            const existingIds = new Set(prev.map((r) => r.id));
            const newItems = freshData.filter((r) => !existingIds.has(r.id));

            if (newItems.length > 0 && prev.length > 0) {
              const newIds = new Set(newItems.map((r) => r.id));
              setNewlyAddedIds((prevIds) => new Set([...prevIds, ...newIds]));

              // Auto-clear highlight after 10 seconds
              setTimeout(() => {
                setNewlyAddedIds((current) => {
                  const next = new Set(current);
                  newIds.forEach((id) => next.delete(id));
                  return next;
                });
              }, 10000);

              // Notify with toast
              newItems.slice(0, 3).forEach((item) => {
                toast.success(`⚡ Live Registration Received!`, {
                  description: `${item.participant.name} registered for ${item.event.name}. Pass: ${item.registrationNumber}`,
                  duration: 6000,
                });
              });

              if (soundEnabled) {
                playLiveTone();
              }
            }

            return freshData;
          });

          setLastSyncedAt(new Date());

          if (isManual) {
            toast.success("Registrations synchronized with database", {
              description: `Live total: ${json.data.length} registrations`,
            });
          }
        }
      } catch (err) {
        console.error("[Registrations Real-Time Sync Error]", err);
        if (isManual) {
          toast.error("Failed to sync registrations. Retrying...");
        }
      } finally {
        setIsSyncing(false);
      }
    },
    [soundEnabled, playLiveTone]
  );

  // Immediate fetch on mount to ensure fresh data right away
  React.useEffect(() => {
    fetchLiveRegistrations(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-sync polling timer (every 5 seconds)
  React.useEffect(() => {
    if (!autoSync) return;

    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        fetchLiveRegistrations(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [autoSync, fetchLiveRegistrations]);

  // Window focus & visibility change listener
  React.useEffect(() => {
    const handleVisibilityOrFocus = () => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        fetchLiveRegistrations(false);
      }
    };

    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);

    return () => {
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
    };
  }, [fetchLiveRegistrations]);

  const handleCopy = (regNo: string) => {
    navigator.clipboard.writeText(regNo);
    setCopiedId(regNo);
    toast.success(`Copied Pass Code: ${regNo}`);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Open participant detail dialog
  const handleOpenDetail = (registration: RegistrationItem) => {
    setSelectedRegistration(registration);
    setDetailDialogOpen(true);
    setRemoveDialogOpen(false);
  };

  // Trigger remove dialog from within detail dialog
  const handleRequestRemove = () => {
    setDetailDialogOpen(false);
    setTimeout(() => setRemoveDialogOpen(true), 150); // slight delay for animation
  };

  // Handle confirmed remove from database
  const handleConfirmRemove = async () => {
    if (!selectedRegistration) return;

    setIsRemoving(true);
    try {
      const result = await deleteRegistration(selectedRegistration.id);

      if (result.success) {
        toast.success("Candidate removed successfully", {
          description: `${selectedRegistration.participant.name}'s registration has been permanently deleted.`,
          duration: 5000,
        });
        // Remove from local state immediately
        setRegistrations((prev) =>
          prev.filter((r) => r.id !== selectedRegistration.id)
        );
        setRemoveDialogOpen(false);
        setSelectedRegistration(null);
      } else {
        toast.error("Failed to remove candidate", {
          description: result.error?.message || "An unexpected error occurred.",
          duration: 5000,
        });
      }
    } catch (err) {
      console.error("Remove candidate error:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsRemoving(false);
    }
  };

  // Derive available event names for filtering
  const availableEvents = React.useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => set.add(e.name));
    registrations.forEach((r) => set.add(r.event.name));
    return Array.from(set);
  }, [events, registrations]);

  // Filter registrations based on search, status filter, and event filter
  const filteredRegistrations = React.useMemo(() => {
    return registrations.filter((r) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.registrationNumber.toLowerCase().includes(q) ||
        r.participant.name.toLowerCase().includes(q) ||
        r.participant.college.toLowerCase().includes(q) ||
        r.participant.email.toLowerCase().includes(q) ||
        r.event.name.toLowerCase().includes(q) ||
        (r.team?.name && r.team.name.toLowerCase().includes(q)) ||
        (r.pickupStop && r.pickupStop.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (filter === "TEAM") return Boolean(r.team && r.team.name);
      if (filter === "INDIVIDUAL") return !r.team || !r.team.name;
      if (filter === "CHECKED_IN") return r.checkedIn;
      if (filter === "PENDING") return !r.checkedIn;
      if (filter === "BUS") return r.transportOptIn;

      if (selectedEvent !== "ALL" && r.event.name !== selectedEvent) {
        return false;
      }

      return true;
    });
  }, [registrations, search, filter, selectedEvent]);

  // Dynamic counts computed directly from real-time registrations
  const totalCount = registrations.length;
  const teamCount = registrations.filter((r) => Boolean(r.team && r.team.name)).length;
  const individualCount = totalCount - teamCount;
  const checkedInCount = registrations.filter((r) => r.checkedIn).length;
  const busCount = registrations.filter((r) => r.transportOptIn).length;

  // Real physical candidates count (team members + solo registrations)
  const totalCandidates = React.useMemo(() => {
    return registrations.reduce((acc, r) => {
      if (r.team?.members && r.team.members.length > 0) {
        return acc + r.team.members.length;
      }
      if (r.team) {
        return acc + 3; // Standard 3-member team
      }
      return acc + 1; // Solo candidate
    }, 0);
  }, [registrations]);

  // Total builders in teams
  const teamBuildersCount = React.useMemo(() => {
    return registrations.reduce((acc, r) => {
      if (!r.team) return acc;
      return acc + (r.team.members?.length || 3);
    }, 0);
  }, [registrations]);

  // Total bus passenger seats needed across all registrations
  const totalBusPassengers = React.useMemo(() => {
    return registrations.reduce((acc, r) => {
      if (!r.transportOptIn) return acc;
      return acc + (r.passengersCount || 1);
    }, 0);
  }, [registrations]);

  // Real candidates count in filtered view
  const filteredCandidates = React.useMemo(() => {
    return filteredRegistrations.reduce((acc, r) => {
      if (r.team?.members && r.team.members.length > 0) {
        return acc + r.team.members.length;
      }
      if (r.team) {
        return acc + 3; // Standard 3-member team
      }
      return acc + 1; // Solo candidate
    }, 0);
  }, [filteredRegistrations]);

  return (
    <div className="space-y-4 font-mono">
      {/* ── Dialogs ── */}
      {selectedRegistration && (
        <>
          <ParticipantDetailDialog
            registration={selectedRegistration}
            open={detailDialogOpen}
            onOpenChange={(open) => {
              setDetailDialogOpen(open);
              if (!open) setSelectedRegistration(null);
            }}
            onRemove={handleRequestRemove}
          />
          <RemoveCandidateDialog
            registration={selectedRegistration}
            open={removeDialogOpen}
            onOpenChange={(open) => {
              if (!isRemoving) {
                setRemoveDialogOpen(open);
                if (!open) setSelectedRegistration(null);
              }
            }}
            onConfirm={handleConfirmRemove}
            isRemoving={isRemoving}
          />
        </>
      )}

      {/* ── Real-Time Status & Live Sync Control Strip ── */}
      <div className="flex items-center justify-between gap-1.5 border border-[#262626] bg-[#080808] px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs">
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className={`size-2 rounded-full ${
                autoSync
                  ? isSyncing
                    ? "bg-amber-400 animate-ping"
                    : "bg-emerald-400 animate-pulse"
                  : "bg-[#737373]"
              }`}
            />
            <span
              className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${
                autoSync ? "text-emerald-400" : "text-[#737373]"
              }`}
            >
              {autoSync ? (isSyncing ? "SYNCING..." : "LIVE SYNC ACTIVE") : "SYNC PAUSED"}
            </span>
          </div>

          <span className="text-[#404040] hidden sm:inline">&bull;</span>

          <span className="text-[11px] text-[#737373] hidden sm:inline">
            Auto-refresh (5s)
          </span>

          <span className="text-[#404040] hidden md:inline">&bull;</span>

          <span className="text-[9px] sm:text-[11px] text-[#737373] truncate">
            <span className="hidden min-[420px]:inline">Last update: </span>
            <strong className="text-[#E5E5E5]" suppressHydrationWarning>
              {lastSyncedAt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Audio Chime Toggle */}
          <button
            type="button"
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) {
                playLiveTone();
                toast.success("Live sound alert enabled");
              } else {
                toast.info("Live sound alert muted");
              }
            }}
            title={soundEnabled ? "Mute audio alerts" : "Enable sound chime for incoming registrations"}
            className={`p-1 sm:p-1.5 border transition-colors cursor-pointer ${
              soundEnabled
                ? "bg-[#161616] text-white border-[#404040]"
                : "bg-[#080808] text-[#737373] border-[#262626] hover:text-white hover:border-[#404040]"
            }`}
          >
            {soundEnabled ? <BellIcon className="size-3.5" /> : <BellOffIcon className="size-3.5" />}
          </button>

          {/* Auto-Sync Toggle */}
          <button
            type="button"
            onClick={() => setAutoSync((prev) => !prev)}
            className={`px-1.5 py-0.5 sm:px-2 sm:py-1 text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold border transition-colors cursor-pointer ${
              autoSync
                ? "bg-[#161616] text-[#E5E5E5] border-[#404040]"
                : "bg-[#080808] text-[#737373] border-[#262626] hover:text-white hover:border-[#404040]"
            }`}
          >
            {autoSync ? "AUTO: ON" : "AUTO: OFF"}
          </button>

          {/* Manual Refresh Trigger */}
          <button
            type="button"
            onClick={() => fetchLiveRegistrations(true)}
            disabled={isSyncing}
            className="flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] uppercase tracking-wider font-bold bg-white hover:bg-[#E5E5E5] disabled:opacity-50 text-black border border-white cursor-pointer transition-colors"
          >
            <RefreshCwIcon className={`size-3 ${isSyncing ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* ── Top Metric Cards (Dynamically Live Updated) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 sm:gap-3">
        <div className="border border-[#262626] bg-[#0F0F0F] p-2 sm:p-3">
          <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#737373]">Total Headcount</p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base sm:text-2xl font-bold text-white tabular-nums">
              {totalCandidates}
            </span>
            <span className="text-[9px] sm:text-[10px] text-zinc-400 uppercase font-semibold">Candidates</span>
          </div>
          <p className="text-[9px] sm:text-[10px] text-[#737373] mt-0.5 truncate">
            {totalCount} passes ({teamCount} teams)
          </p>
        </div>
        <div className="border border-[#262626] bg-[#0F0F0F] p-2 sm:p-3">
          <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-purple-400">Team Entries</p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base sm:text-2xl font-bold text-purple-400 tabular-nums">
              {teamCount}
            </span>
            <span className="text-[9px] sm:text-[10px] text-purple-400/80 uppercase font-semibold">Teams</span>
          </div>
          <p className="text-[9px] sm:text-[10px] text-[#737373] mt-0.5 truncate">
            {teamBuildersCount} builders ({totalCount > 0 ? Math.round((teamCount / totalCount) * 100) : 0}%)
          </p>
        </div>
        <div className="border border-[#262626] bg-[#0F0F0F] p-2 sm:p-3">
          <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-sky-400">Individual</p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base sm:text-2xl font-bold text-sky-400 tabular-nums">
              {individualCount}
            </span>
            <span className="text-[9px] sm:text-[10px] text-sky-400/80 uppercase font-semibold">Solo</span>
          </div>
          <p className="text-[9px] sm:text-[10px] text-[#737373] mt-0.5 truncate">
            {totalCount > 0 ? Math.round((individualCount / totalCount) * 100) : 0}% of passes
          </p>
        </div>
        <div className="border border-[#262626] bg-[#0F0F0F] p-2 sm:p-3">
          <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-emerald-400">Verified</p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base sm:text-2xl font-bold text-emerald-400 tabular-nums">
              {checkedInCount}
            </span>
            <span className="text-[9px] sm:text-[10px] text-emerald-400/80 uppercase font-semibold">Admitted</span>
          </div>
          <p className="text-[9px] sm:text-[10px] text-[#737373] mt-0.5 truncate">
            {totalCount > 0 ? Math.round((checkedInCount / totalCount) * 100) : 0}% turnout
          </p>
        </div>
        <div className="border border-[#262626] bg-[#0F0F0F] p-2 sm:p-3 col-span-2 sm:col-span-1 flex sm:flex-col items-center sm:items-start justify-between gap-1 sm:gap-0">
          <div>
            <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-amber-400">Bus Transport</p>
            <p className="text-[9px] sm:text-[10px] text-[#737373] mt-0.5">
              across {busCount} team passes
            </p>
          </div>
          <div className="flex items-baseline gap-1 sm:mt-0.5 shrink-0">
            <span className="text-base sm:text-2xl font-bold text-amber-400 tabular-nums">
              {totalBusPassengers}
            </span>
            <span className="text-[9px] sm:text-[10px] text-amber-400/80 uppercase font-semibold">Seats</span>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="flex flex-col gap-2 sm:gap-2.5 border border-[#262626] bg-[#0F0F0F] p-2.5 sm:p-3">
        {/* Search Input */}
        <div className="relative w-full">
          <SearchIcon className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#737373]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search attendee, pass, event, college..."
            className="w-full bg-[#080808] border border-[#262626] pl-8 sm:pl-9 pr-7 sm:pr-8 py-1.5 sm:py-2 text-xs text-white placeholder:text-[#737373] focus:outline-hidden focus:border-white rounded-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#737373] hover:text-white p-0.5 cursor-pointer"
            >
              <XIcon className="size-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills & Event Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
          {/* Status Filter Pills */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar pb-0.5 text-xs [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {[
              { id: "ALL", label: `All (${totalCount})` },
              { id: "TEAM", label: `Team (${teamCount})` },
              { id: "INDIVIDUAL", label: `Individual (${individualCount})` },
              { id: "CHECKED_IN", label: `Verified (${checkedInCount})` },
              { id: "PENDING", label: `Pending (${totalCount - checkedInCount})` },
              { id: "BUS", label: `Bus (${busCount})` },
            ].map((tab) => {
              const isActive = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id as typeof filter)}
                  className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                    isActive
                      ? "bg-white text-black border-white shadow-xs font-bold"
                      : "bg-[#080808] text-[#737373] border-[#262626] hover:bg-[#161616] hover:text-white hover:border-[#404040]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Event Filter Dropdown */}
          {availableEvents.length > 0 && (
            <div className="flex items-center gap-2 shrink-0 text-xs w-full sm:w-auto pt-1 sm:pt-0 border-t border-[#1C1C1C] sm:border-t-0">
              <span className="text-[10px] text-[#737373] uppercase font-bold tracking-wider font-mono shrink-0">
                EVENT:
              </span>
              <Select
                value={selectedEvent}
                onValueChange={(val) => {
                  if (val !== null) setSelectedEvent(val);
                }}
              >
                <SelectTrigger
                  size="sm"
                  className="h-7 w-full sm:w-auto sm:min-w-[180px] sm:max-w-[260px] rounded-none border border-[#262626] bg-[#080808] text-white font-mono text-xs px-2.5 py-1 hover:border-[#404040] hover:bg-[#161616] focus-visible:border-white focus-visible:ring-1 focus-visible:ring-white/40 shadow-none transition-colors cursor-pointer [&_svg]:text-white gap-2"
                  aria-label="Filter by Event"
                >
                  <SelectValue placeholder="All Hosted Events" />
                </SelectTrigger>
                <SelectContent
                  align="end"
                  side="bottom"
                  sideOffset={4}
                  alignItemWithTrigger={false}
                  className="rounded-none border border-[#262626] bg-[#0F0F0F] font-mono text-xs text-white shadow-2xl p-1 no-scrollbar min-w-[210px] ring-1 ring-[#262626] z-50 animate-in fade-in-0 zoom-in-95 duration-100"
                >
                  <div className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#737373] border-b border-[#262626] mb-1 flex items-center justify-between">
                    <span>// HOSTED EVENTS</span>
                    <span className="text-white font-bold">{availableEvents.length} TOTAL</span>
                  </div>
                  <SelectItem
                    value="ALL"
                    className="rounded-none font-mono text-xs text-[#A3A3A3] hover:bg-[#161616] hover:text-white data-[highlighted]:bg-[#161616] data-[highlighted]:text-white data-[selected]:text-white data-[selected]:bg-[#1F1F1F] data-[selected]:font-bold cursor-pointer py-1.5 px-2.5 transition-colors [&_svg]:text-white"
                  >
                    All Hosted Events ({availableEvents.length})
                  </SelectItem>
                  {availableEvents.map((evtName) => (
                    <SelectItem
                      key={evtName}
                      value={evtName}
                      className="rounded-none font-mono text-xs text-[#A3A3A3] hover:bg-[#161616] hover:text-white data-[highlighted]:bg-[#161616] data-[highlighted]:text-white data-[selected]:text-white data-[selected]:bg-[#1F1F1F] data-[selected]:font-bold cursor-pointer py-1.5 px-2.5 transition-colors [&_svg]:text-white"
                    >
                      {evtName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* ── Results Count Bar ── */}
      <div className="flex items-center justify-between gap-2 text-[10px] sm:text-[11px] text-[#737373] px-0.5 sm:px-1">
        <span className="truncate">
          {/* Mobile view (< sm): 'Showing 50 passes' or 'Showing 48/50 passes' */}
          <span className="sm:hidden">
            Showing <strong className="text-white">{filteredRegistrations.length}</strong>
            {filteredRegistrations.length !== totalCount ? `/${totalCount}` : ""} passes
          </span>
          {/* Desktop view (>= sm): 'Showing 50 of 50 passes' */}
          <span className="hidden sm:inline">
            Showing <strong className="text-white">{filteredRegistrations.length}</strong> of {totalCount} passes
          </span>
          {newlyAddedIds.size > 0 && (
            <span className="ml-1.5 px-1 py-0.5 text-[9px] bg-[#161616] text-white border border-[#404040]">
              +{newlyAddedIds.size} NEW
            </span>
          )}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {(search || filter !== "ALL" || selectedEvent !== "ALL") && (
            <button
              onClick={() => {
                setSearch("");
                setFilter("ALL");
                setSelectedEvent("ALL");
              }}
              className="text-white hover:underline cursor-pointer text-[10px] sm:text-[11px] mr-1"
            >
              [ Reset ]
            </button>
          )}
          <button
            type="button"
            onClick={() => setExportDialogOpen(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1 font-mono text-[10px] sm:text-xs uppercase font-semibold text-black bg-white hover:bg-[#E5E5E5] border border-white transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            <DownloadIcon className="size-3" />
            <span className="hidden min-[420px]:inline">[ Export Data ]</span>
            <span className="min-[420px]:hidden">[ Export ]</span>
          </button>
        </div>
      </div>

      {/* ── Mobile Card View (< md) ── */}
      <div className="block md:hidden space-y-2.5">
        {filteredRegistrations.length === 0 ? (
          <div className="border border-[#262626] bg-[#0F0F0F] p-6 text-center text-xs text-[#737373]">
            No registrations match your search criteria.
          </div>
        ) : (
          filteredRegistrations.map((r) => {
            const isNew = newlyAddedIds.has(r.id);
            return (
              <div
                key={r.id}
                className={`border p-3 space-y-2 transition-all relative ${
                  isNew
                    ? "border-white bg-[#161616] shadow-md shadow-white/5"
                    : "border-[#262626] bg-[#0F0F0F] hover:border-[#404040]"
                }`}
              >
                {/* Card Header: Reg ID + Status Badges */}
                <div className="flex items-center justify-between gap-1.5 border-b border-[#262626] pb-1.5">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopy(r.registrationNumber)}
                      className="flex items-center gap-1 text-white font-bold text-[11px] bg-[#161616] border border-[#262626] px-1.5 py-0.5 hover:bg-[#1F1F1F] hover:border-[#404040] transition-colors cursor-pointer"
                      title="Click to copy pass code"
                    >
                      <span>{r.registrationNumber}</span>
                      {copiedId === r.registrationNumber ? (
                        <CheckIcon className="size-2.5 text-emerald-400" />
                      ) : (
                        <CopyIcon className="size-2.5 text-[#737373]" />
                      )}
                    </button>

                    {isNew && (
                      <span className="px-1 py-0.2 text-[8px] font-bold bg-white text-black animate-pulse">
                        NEW
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <span
                      className={`inline-flex items-center gap-1 text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 border ${
                        r.team && r.team.name
                          ? "border-purple-500/40 bg-purple-500/15 text-purple-300"
                          : "border-sky-500/40 bg-sky-500/15 text-sky-300"
                      }`}
                    >
                      {r.team && r.team.name ? "TEAM" : "INDIVIDUAL"}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 border ${
                        r.checkedIn
                          ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                          : "border-amber-500/40 bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {r.checkedIn ? (
                        <>
                          <CheckCircle2Icon className="size-2.5 shrink-0 text-emerald-400" />
                          <span>VERIFIED</span>
                        </>
                      ) : (
                        <>
                          <ClockIcon className="size-2.5 shrink-0 text-amber-400" />
                          <span>PENDING</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Attendee Info & Quick Action */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(r)}
                      className="text-xs sm:text-sm font-bold text-white hover:text-white transition-colors text-left cursor-pointer group flex items-center gap-1.5 min-w-0"
                      title="Click to view full candidate details"
                    >
                      <span className="truncate">{r.participant.name}</span>
                      <UserIcon className="size-3 text-[#737373] group-hover:text-white transition-colors shrink-0" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(r)}
                      className="text-[9px] text-[#A3A3A3] hover:text-white uppercase font-bold border border-[#262626] bg-[#161616] px-1.5 py-0.5 shrink-0 transition-colors cursor-pointer"
                    >
                      [ Details ]
                    </button>
                  </div>
                  {r.team && r.team.name && (
                    <div className="flex items-center gap-1 text-[10px] text-purple-300 font-bold truncate">
                      <UsersIcon className="size-3 text-purple-400 shrink-0" />
                      <span className="truncate">Team: {r.team.name} ({r.team.members?.length || 3} members)</span>
                    </div>
                  )}
                  <p className="text-[11px] text-[#A3A3A3] truncate">{r.participant.email}</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#737373] truncate">
                    <Building2Icon className="size-3 text-[#737373] shrink-0" />
                    <span className="truncate">{r.participant.college}</span>
                  </div>
                </div>

                {/* Event Info */}
                <div className="flex items-center justify-between gap-2 text-xs pt-1 border-t border-[#1C1C1C]">
                  <span className="text-[#737373] text-[10px] uppercase font-semibold">Event Track:</span>
                  <span className="text-[#E5E5E5] text-[11px] font-semibold truncate text-right">
                    {r.event.name}
                  </span>
                </div>

                {/* Transport Details (Crucial for Mobile) */}
                <div className="pt-1.5 border-t border-[#262626]">
                  {r.transportOptIn ? (
                    <div className="bg-[#080808] border border-[#262626] p-2 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                          <BusIcon className="size-3" />
                          BUS • {r.passengersCount} SEAT{r.passengersCount > 1 ? "S" : ""}
                        </span>
                        <span className="text-[10px] text-[#E5E5E5] font-bold">DEP: 6:00 AM</span>
                      </div>
                      {r.pickupStop && (
                        <p className="text-white text-[11px] font-semibold truncate">
                          Stop: {r.pickupStop}
                        </p>
                      )}
                      {r.pickupLandmark && (
                        <p className="text-[#737373] text-[10px] truncate">
                          Landmark: {r.pickupLandmark}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-[10px] text-[#737373]">
                      <span>Commute Mode:</span>
                      <span className="px-1.5 py-0.5 border border-[#262626] bg-[#080808] text-[9px] text-[#737373] uppercase tracking-wider">
                        SELF TRANSPORT
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Desktop Table View (>= md) ── */}
      <div className="hidden md:block rounded-none border border-[#262626] bg-[#0F0F0F] overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#080808] text-[11px] uppercase tracking-wider text-[#737373] border-b border-[#262626]">
            <tr>
              <th className="px-4 py-3">Reg ID</th>
              <th className="px-4 py-3">Participant</th>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Entry Type</th>
              <th className="px-4 py-3">College</th>
              <th className="px-4 py-3">Transport (6:00 AM)</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Checked In</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#262626]">
            {filteredRegistrations.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-[#737373]">
                  No registrations found matching the filters.
                </td>
              </tr>
            ) : (
              filteredRegistrations.map((r) => {
                const isNew = newlyAddedIds.has(r.id);
                return (
                  <tr
                    key={r.id}
                    className={`transition-colors ${
                      isNew
                        ? "bg-[#161616] border-l-2 border-l-white"
                        : "hover:bg-[#161616]"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopy(r.registrationNumber)}
                          className="inline-flex items-center gap-1.5 text-white font-bold hover:underline cursor-pointer"
                          title="Click to copy pass code"
                        >
                          {r.registrationNumber}
                          {copiedId === r.registrationNumber ? (
                            <CheckIcon className="size-3 text-emerald-400" />
                          ) : (
                            <CopyIcon className="size-3 text-[#737373]" />
                          )}
                        </button>
                        {isNew && (
                          <span className="px-1.5 py-0.2 text-[9px] font-bold bg-white text-black rounded-none animate-pulse">
                            NEW
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {/* Participant name — clickable */}
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(r)}
                        className="group flex items-center gap-1.5 text-left cursor-pointer"
                        title="Click to view full candidate details"
                      >
                        <div>
                          <p className="font-semibold text-white group-hover:text-white transition-colors flex items-center gap-1">
                            {r.participant.name}
                            <UserIcon className="size-3 text-[#737373] group-hover:text-white transition-colors shrink-0 opacity-0 group-hover:opacity-100" />
                          </p>
                          <p
                            className="text-[10px] text-[#737373] truncate max-w-[170px]"
                            title={r.participant.email}
                          >
                            {r.participant.email}
                          </p>
                        </div>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-[#E5E5E5] font-semibold">{r.event.name}</td>
                    <td className="px-4 py-3">
                      {r.team && r.team.name ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 border border-purple-500/40 bg-purple-500/15 text-purple-300 w-fit">
                            <UsersIcon className="size-2.5 shrink-0" />
                            TEAM
                          </span>
                          <span
                            className="text-[11px] text-white font-semibold truncate max-w-[130px]"
                            title={r.team.name}
                          >
                            {r.team.name}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 border border-sky-500/40 bg-sky-500/15 text-sky-300 w-fit">
                          <UserIcon className="size-2.5 shrink-0" />
                          INDIVIDUAL
                        </span>
                      )}
                    </td>
                    <td
                      className="px-4 py-3 text-[#A3A3A3] truncate max-w-[180px]"
                      title={r.participant.college}
                    >
                      {r.participant.college}
                    </td>
                    <td className="px-4 py-3">
                      {r.transportOptIn ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded-none border border-[#262626] bg-[#161616] text-white inline-block w-fit">
                            BUS • {r.passengersCount} SEAT{r.passengersCount > 1 ? "S" : ""}
                          </span>
                          <span
                            className="text-[11px] text-white font-semibold truncate max-w-[160px]"
                            title={r.pickupStop || ""}
                          >
                            {r.pickupStop}
                          </span>
                          <span
                            className="text-[10px] text-[#737373] truncate max-w-[160px]"
                            title={r.pickupLandmark || ""}
                          >
                            {r.pickupLandmark}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] uppercase font-mono text-[#737373] px-1.5 py-0.5 border border-[#262626] bg-[#080808]">
                          SELF
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-none border border-[#262626] bg-[#161616] text-[#E5E5E5] font-bold">
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-none border ${
                          r.checkedIn
                            ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                            : "border-amber-500/40 bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {r.checkedIn ? (
                          <>
                            <CheckCircle2Icon className="size-2.5 shrink-0 text-emerald-400" />
                            <span>VERIFIED</span>
                          </>
                        ) : (
                          <>
                            <ClockIcon className="size-2.5 shrink-0 text-amber-400" />
                            <span>PENDING</span>
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Custom Filtered Data Export Dialog ── */}
      <ExportDataDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        events={events}
        defaultScope="REGISTRATIONS"
      />
    </div>
  );
}
