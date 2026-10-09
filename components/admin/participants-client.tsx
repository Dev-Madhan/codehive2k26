"use client";

import * as React from "react";
import {
  SearchIcon,
  UsersIcon,
  CrownIcon,
  CheckCircle2Icon,
  ClockIcon,
  BusIcon,
  FileTextIcon,
  XIcon,
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  RefreshCwIcon,
  UserIcon,
  EyeIcon,
  ExternalLinkIcon,
  BellIcon,
  BellOffIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExportDataDialog } from "@/components/admin/export-dialog";

// ─── Interfaces ─────────────────────────────────────────────────────────────

export interface RawRegistrationItem {
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
    department?: string | null;
    year?: string | null;
    imageUrl?: string | null;
  };
  event: {
    id?: string;
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
      collegeIdUrl?: string | null;
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

export interface EventOption {
  id: string;
  name: string;
  slug?: string;
}

export interface FlattenedAttendee {
  uniqueKey: string;
  registrationId: string;
  registrationNumber: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  department?: string | null;
  year?: string | null;
  collegeIdUrl?: string | null;
  role: "LEADER" | "MEMBER" | "INDIVIDUAL";
  teamId?: string | null;
  teamName?: string | null;
  teamLeaderName?: string | null;
  teamSize: number;
  memberIndex: number; // 0 for Leader / Solo, 1 for Member 1, 2 for Member 2
  isLastInTeam: boolean;
  eventId: string;
  eventName: string;
  checkedIn: boolean;
  checkedInAt?: Date | string | null;
  transportOptIn: boolean;
  pickupRoute?: string | null;
  pickupStop?: string | null;
  pickupLandmark?: string | null;
  registeredAt: Date | string;
  teamMembers?: {
    id: string;
    name: string;
    phone: string;
    email?: string | null;
    collegeIdUrl?: string | null;
  }[];
}

// ─── Flattening Engine (Leader -> Member 1 -> Member 2 Sequential Order) ─────

function flattenRegistrationsToAttendees(
  registrations: RawRegistrationItem[]
): FlattenedAttendee[] {
  const result: FlattenedAttendee[] = [];

  for (const reg of registrations) {
    const isTeam = Boolean(reg.team && reg.team.name);
    const eventName = reg.event?.name || "General Event";
    const eventId = reg.event?.id || reg.event?.slug || "evt";
    const checkedIn = Boolean(reg.checkedIn);
    const checkedInAt = reg.checkIn?.checkedInAt;

    if (isTeam && reg.team) {
      const team = reg.team;
      const rawMembers = team.members || [];

      // Find if team leader is already listed in team.members
      const leaderMember = rawMembers.find(
        (m) =>
          (m.email && m.email.toLowerCase().trim() === reg.participant.email.toLowerCase().trim()) ||
          (m.phone && m.phone.trim() === reg.participant.phone.trim())
      );

      // Remaining members excluding leader
      const nonLeaderMembers = rawMembers.filter((m) => m !== leaderMember);
      const teamSize = 1 + nonLeaderMembers.length;

      // 1. Emit Team Leader First
      result.push({
        uniqueKey: `leader-${reg.id}-${reg.participant.id || "0"}`,
        registrationId: reg.id,
        registrationNumber: reg.registrationNumber,
        name: reg.participant.name,
        email: reg.participant.email,
        phone: reg.participant.phone,
        college: reg.participant.college,
        department: reg.participant.department,
        year: reg.participant.year,
        collegeIdUrl: reg.participant.imageUrl || leaderMember?.collegeIdUrl || null,
        role: "LEADER",
        teamId: team.id,
        teamName: team.name,
        teamLeaderName: reg.participant.name,
        teamSize,
        memberIndex: 0,
        isLastInTeam: nonLeaderMembers.length === 0,
        eventId,
        eventName,
        checkedIn,
        checkedInAt,
        transportOptIn: reg.transportOptIn,
        pickupRoute: reg.pickupRoute,
        pickupStop: reg.pickupStop,
        pickupLandmark: reg.pickupLandmark,
        registeredAt: reg.createdAt,
        teamMembers: rawMembers,
      });

      // 2. Emit Each Team Member Immediately Following The Leader
      nonLeaderMembers.forEach((member, idx) => {
        const isLast = idx === nonLeaderMembers.length - 1;
        result.push({
          uniqueKey: `member-${reg.id}-${member.id}`,
          registrationId: reg.id,
          registrationNumber: reg.registrationNumber,
          name: member.name,
          email: member.email || "—",
          phone: member.phone,
          college: member.college || reg.participant.college,
          department: member.department || reg.participant.department,
          year: member.year || reg.participant.year,
          collegeIdUrl: member.collegeIdUrl || null,
          role: "MEMBER",
          teamId: team.id,
          teamName: team.name,
          teamLeaderName: reg.participant.name,
          teamSize,
          memberIndex: idx + 1,
          isLastInTeam: isLast,
          eventId,
          eventName,
          checkedIn,
          checkedInAt,
          transportOptIn: member.transportOptIn,
          pickupRoute: member.pickupRoute || (reg.transportOptIn ? reg.pickupRoute : null),
          pickupStop: member.pickupStop || (reg.transportOptIn ? reg.pickupStop : null),
          pickupLandmark: member.pickupLandmark || (reg.transportOptIn ? reg.pickupLandmark : null),
          registeredAt: reg.createdAt,
          teamMembers: rawMembers,
        });
      });
    } else {
      // Solo / Individual Candidate
      result.push({
        uniqueKey: `solo-${reg.id}-${reg.participant.id || "0"}`,
        registrationId: reg.id,
        registrationNumber: reg.registrationNumber,
        name: reg.participant.name,
        email: reg.participant.email,
        phone: reg.participant.phone,
        college: reg.participant.college,
        department: reg.participant.department,
        year: reg.participant.year,
        collegeIdUrl: reg.participant.imageUrl || null,
        role: "INDIVIDUAL",
        teamId: null,
        teamName: null,
        teamLeaderName: null,
        teamSize: 1,
        memberIndex: 0,
        isLastInTeam: true,
        eventId,
        eventName,
        checkedIn,
        checkedInAt,
        transportOptIn: reg.transportOptIn,
        pickupRoute: reg.pickupRoute,
        pickupStop: reg.pickupStop,
        pickupLandmark: reg.pickupLandmark,
        registeredAt: reg.createdAt,
      });
    }
  }

  return result;
}

// ─── ID Card Lightbox Modal ─────────────────────────────────────────────────

function IdCardLightboxDialog({
  doc,
  open,
  onOpenChange,
}: {
  doc: { url: string; name: string; college?: string; role: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [copied, setCopied] = React.useState(false);

  if (!doc) return null;

  const isPdf =
    doc.url.toLowerCase().includes(".pdf") ||
    doc.url.toLowerCase().includes("/pdf") ||
    doc.url.toLowerCase().startsWith("data:application/pdf");

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(doc.url);
    setCopied(true);
    toast.success("Document link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl w-[94vw] sm:w-full bg-[#0F0F0F] border border-[#262626] text-white p-0 overflow-hidden font-mono no-scrollbar"
        showCloseButton={false}
      >
        <div className="bg-[#080808] border-b border-[#262626] p-3 sm:p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] uppercase font-bold px-1.5 sm:px-2 py-0.5 bg-[#161616] border border-[#262626] text-emerald-400 shrink-0">
              <FileTextIcon className="size-3" />
              COLLEGE ID
            </span>
            <span className="text-xs sm:text-sm font-bold text-white truncate">{doc.name}</span>
            <span className="text-[10px] text-[#737373] uppercase font-mono hidden min-[400px]:inline">({doc.role})</span>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="text-[#737373] hover:text-white p-1 border border-transparent hover:border-[#262626] hover:bg-[#161616] cursor-pointer"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        <div className="p-3 sm:p-4 bg-black flex items-center justify-center min-h-[260px] sm:min-h-[340px] max-h-[60vh] sm:max-h-[70vh] overflow-auto">
          {isPdf ? (
            <div className="w-full flex flex-col items-center justify-center border border-[#262626] bg-[#0A0A0A] p-4 sm:p-6 text-center">
              <FileTextIcon className="size-10 sm:size-12 text-red-400 mb-2 sm:mb-3" />
              <p className="text-xs sm:text-sm font-bold text-white">College ID Document (PDF)</p>
              <p className="text-[11px] sm:text-xs text-[#A3A3A3] mt-1 mb-4 truncate max-w-full">
                {doc.name} • {doc.college || "Vel Tech Multi Tech"}
              </p>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white text-black hover:bg-neutral-200 transition-colors"
                >
                  <ExternalLinkIcon className="size-3.5" />
                  Open PDF in New Tab
                </a>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-[#262626] bg-[#161616] text-white hover:bg-[#202020] transition-colors cursor-pointer"
                >
                  {copied ? <CheckIcon className="size-3.5 text-emerald-400" /> : <CopyIcon className="size-3.5" />}
                  Copy URL
                </button>
              </div>
            </div>
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={doc.url}
              alt={`College ID for ${doc.name}`}
              className="max-h-[50vh] sm:max-h-[60vh] max-w-full object-contain border border-[#262626]"
            />
          )}
        </div>

        <div className="border-t border-[#262626] bg-[#080808] px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between text-xs gap-2">
          <span className="text-[10px] sm:text-[11px] text-[#737373] truncate">
            Institution: <span className="text-white">{doc.college || "Registered Institution"}</span>
          </span>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] sm:text-[11px] font-bold border border-[#262626] bg-[#161616] text-[#E5E5E5] hover:text-white hover:bg-[#202020] transition-colors"
            >
              <ExternalLinkIcon className="size-3" />
              <span>Full View</span>
            </a>
            <button
              onClick={() => onOpenChange(false)}
              className="px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-bold bg-white text-black hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Attendee Dossier Modal ─────────────────────────────────────────────────

function AttendeeDossierDialog({
  attendee,
  open,
  onOpenChange,
  onOpenIdPreview,
}: {
  attendee: FlattenedAttendee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenIdPreview: (attendee: FlattenedAttendee) => void;
}) {
  if (!attendee) return null;

  const initials = attendee.name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AT";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-xl w-[94vw] sm:w-full bg-[#0F0F0F] border border-[#262626] text-white p-0 overflow-hidden font-mono no-scrollbar max-h-[88vh] flex flex-col"
        showCloseButton={false}
      >
        <div className="bg-[#080808] border-b border-[#262626] p-3.5 sm:p-5 shrink-0">
          <div className="flex items-center justify-between mb-2.5 sm:mb-3">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-white bg-[#161616] border border-[#262626] tracking-wider">
              &gt; ADMIN // ATTENDEE_DOSSIER
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="text-[#737373] hover:text-white p-1 border border-transparent hover:border-[#262626] hover:bg-[#161616] cursor-pointer"
            >
              <XIcon className="size-4" />
            </button>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="size-11 sm:size-12 bg-[#161616] border border-[#404040] text-white font-bold text-sm sm:text-base flex items-center justify-center shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm sm:text-base font-bold text-white truncate">{attendee.name}</h2>
              <p className="text-[11px] sm:text-xs text-[#A3A3A3] truncate font-mono">{attendee.email}</p>
              <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 flex-wrap">
                {attendee.role === "LEADER" ? (
                  <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 sm:px-2 py-0.5 bg-white text-black">
                    <CrownIcon className="size-3" />
                    TEAM LEADER {attendee.teamName ? `(${attendee.teamName})` : ""}
                  </span>
                ) : attendee.role === "MEMBER" ? (
                  <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 sm:px-2 py-0.5 bg-[#161616] text-zinc-300 border border-[#262626]">
                    <UsersIcon className="size-3 text-zinc-400" />
                    MEMBER #{attendee.memberIndex + 1} {attendee.teamName ? `(${attendee.teamName})` : ""}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 sm:px-2 py-0.5 bg-[#161616] text-zinc-400 border border-[#262626]">
                    <UserIcon className="size-3 text-zinc-400" />
                    INDIVIDUAL ENTRY
                  </span>
                )}

                <span
                  className={`inline-flex items-center gap-1 text-[9px] sm:text-[10px] uppercase font-bold px-1.5 sm:px-2 py-0.5 border ${
                    attendee.checkedIn
                      ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                      : "border-[#262626] bg-[#161616] text-zinc-400"
                  }`}
                >
                  {attendee.checkedIn ? "GATE VERIFIED" : "PENDING CHECK-IN"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-3.5 sm:p-5 space-y-3 sm:space-y-4 no-scrollbar">
          {/* Personal Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-xs">
            <div className="bg-[#080808] border border-[#262626] p-2 sm:p-2.5">
              <span className="text-[9px] sm:text-[10px] uppercase text-[#737373] block font-semibold">Phone Number</span>
              <span className="text-white font-bold font-mono mt-0.5 block">{attendee.phone}</span>
            </div>
            <div className="bg-[#080808] border border-[#262626] p-2 sm:p-2.5">
              <span className="text-[9px] sm:text-[10px] uppercase text-[#737373] block font-semibold">Pass Code</span>
              <span className="text-white font-bold font-mono mt-0.5 block">{attendee.registrationNumber}</span>
            </div>
            <div className="bg-[#080808] border border-[#262626] p-2 sm:p-2.5 sm:col-span-2">
              <span className="text-[9px] sm:text-[10px] uppercase text-[#737373] block font-semibold">College / University</span>
              <span className="text-white font-semibold mt-0.5 block">{attendee.college}</span>
            </div>
            {attendee.department && (
              <div className="bg-[#080808] border border-[#262626] p-2 sm:p-2.5">
                <span className="text-[9px] sm:text-[10px] uppercase text-[#737373] block font-semibold">Department</span>
                <span className="text-white font-semibold mt-0.5 block">{attendee.department}</span>
              </div>
            )}
            {attendee.year && (
              <div className="bg-[#080808] border border-[#262626] p-2 sm:p-2.5">
                <span className="text-[9px] sm:text-[10px] uppercase text-[#737373] block font-semibold">Academic Year</span>
                <span className="text-white font-semibold mt-0.5 block">{attendee.year}</span>
              </div>
            )}
          </div>

          {/* Event Track */}
          <div className="bg-[#080808] border border-[#262626] p-2.5 sm:p-3 text-xs">
            <span className="text-[9px] sm:text-[10px] uppercase text-[#737373] block font-semibold">Registered Event Track</span>
            <span className="text-white font-bold text-xs sm:text-sm block mt-0.5">{attendee.eventName}</span>
          </div>

          {/* Transport Info */}
          <div className="bg-[#080808] border border-[#262626] p-2.5 sm:p-3 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] sm:text-[10px] uppercase text-[#737373] font-semibold flex items-center gap-1.5">
                <BusIcon className="size-3 text-zinc-400" />
                Commute Mode
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-white font-mono">
                {attendee.transportOptIn ? "CAMPUS BUS TRANSIT" : "SELF COMMUTE"}
              </span>
            </div>
            {attendee.transportOptIn ? (
              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#1C1C1C] text-[10px] sm:text-[11px]">
                <div>
                  <span className="text-[#737373] block">Route:</span>
                  <span className="text-white font-semibold">{attendee.pickupRoute || "City Corridor"}</span>
                </div>
                <div>
                  <span className="text-[#737373] block">Stop:</span>
                  <span className="text-white font-semibold">{attendee.pickupStop || "Main Stop"}</span>
                </div>
              </div>
            ) : (
              <p className="text-[10px] sm:text-[11px] text-[#A3A3A3] mt-1">Arranging independent commute to campus.</p>
            )}
          </div>

          {/* ID Card preview action */}
          <div className="bg-[#080808] border border-[#262626] p-2.5 sm:p-3 flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-white block">College ID Card Document</span>
              <span className="text-[9px] sm:text-[10px] text-[#737373] block mt-0.5 truncate">
                {attendee.collegeIdUrl ? "Uploaded and attached to profile" : "No ID document uploaded"}
              </span>
            </div>
            {attendee.collegeIdUrl && (
              <button
                type="button"
                onClick={() => onOpenIdPreview(attendee)}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold bg-white text-black hover:bg-neutral-200 transition-colors cursor-pointer shrink-0"
              >
                <EyeIcon className="size-3 sm:size-3.5" />
                <span>View ID Card</span>
              </button>
            )}
          </div>
        </div>

        <div className="border-t border-[#262626] bg-[#080808] px-3.5 sm:px-5 py-2.5 sm:py-3 flex items-center justify-end">
          <button
            onClick={() => onOpenChange(false)}
            className="px-3.5 sm:px-4 py-1 sm:py-1.5 text-xs font-bold bg-[#161616] border border-[#262626] text-white hover:bg-[#202020] transition-colors cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main ParticipantsClient Component ───────────────────────────────────────

export function ParticipantsClient({
  initialRegistrations,
  events = [],
}: {
  initialRegistrations: RawRegistrationItem[];
  events?: EventOption[];
}) {
  const [registrations, setRegistrations] =
    React.useState<RawRegistrationItem[]>(initialRegistrations);
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<"ALL" | "LEADER" | "MEMBER" | "INDIVIDUAL">("ALL");
  const [selectedEvent, setSelectedEvent] = React.useState<string>("ALL");
  const [transportFilter, setTransportFilter] = React.useState<"ALL" | "BUS" | "OWN">("ALL");
  const [checkInFilter, setCheckInFilter] = React.useState<"ALL" | "CHECKED_IN" | "PENDING">("ALL");
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  // Real-time synchronization state
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [autoSync, setAutoSync] = React.useState(true);
  const [lastSyncedAt, setLastSyncedAt] = React.useState<Date>(new Date());
  const [soundEnabled, setSoundEnabled] = React.useState(false);

  // Dialogs
  const [selectedIdDoc, setSelectedIdDoc] = React.useState<{
    url: string;
    name: string;
    college?: string;
    role: string;
  } | null>(null);
  const [idPreviewOpen, setIdPreviewOpen] = React.useState(false);
  const [selectedDossier, setSelectedDossier] = React.useState<FlattenedAttendee | null>(null);
  const [dossierOpen, setDossierOpen] = React.useState(false);
  const [exportDialogOpen, setExportDialogOpen] = React.useState(false);

  // Flatten raw registrations into ordered attendees
  const allAttendees = React.useMemo(() => {
    return flattenRegistrationsToAttendees(registrations);
  }, [registrations]);

  // Audio tone
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
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // safe ignore
    }
  }, []);

  // Live polling fetch
  const fetchLiveRegistrations = React.useCallback(
    async (isManual = false) => {
      try {
        setIsSyncing(true);
        const res = await fetch(`/api/registrations?t=${Date.now()}`, {
          cache: "no-store",
          headers: { "Pragma": "no-cache", "Cache-Control": "no-cache" },
        });

        if (!res.ok) throw new Error("Sync failed");
        const json = await res.json();

        if (json.success && Array.isArray(json.data)) {
          const freshData: RawRegistrationItem[] = json.data;

          setRegistrations((prev) => {
            if (freshData.length > prev.length && prev.length > 0) {
              toast.success("⚡ Live Attendee Update Received!", {
                description: `Database refreshed with ${freshData.length} registrations.`,
                duration: 5000,
              });
              if (soundEnabled) playLiveTone();
            }
            return freshData;
          });

          setLastSyncedAt(new Date());
          if (isManual) {
            toast.success("Participants synchronized with database");
          }
        }
      } catch (err) {
        console.error("[Participants Sync Error]", err);
        if (isManual) toast.error("Failed to sync participants.");
      } finally {
        setIsSyncing(false);
      }
    },
    [soundEnabled, playLiveTone]
  );

  // Auto-sync timer (every 5 seconds)
  React.useEffect(() => {
    if (!autoSync) return;
    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        fetchLiveRegistrations(false);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [autoSync, fetchLiveRegistrations]);

  // Copy handler
  const handleCopy = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`Copied ${label}: ${text}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Open ID Card Preview
  const handleOpenIdDoc = (attendee: FlattenedAttendee) => {
    if (!attendee.collegeIdUrl) {
      toast.info("No College ID card uploaded for this candidate.");
      return;
    }
    setSelectedIdDoc({
      url: attendee.collegeIdUrl,
      name: attendee.name,
      college: attendee.college,
      role: attendee.role,
    });
    setIdPreviewOpen(true);
  };

  // Open Dossier
  const handleOpenDossier = (attendee: FlattenedAttendee) => {
    setSelectedDossier(attendee);
    setDossierOpen(true);
  };

  // ─── Metrics Calculation ──────────────────────────────────────────────────

  const totalAttendees = allAttendees.length;
  const leadersCount = allAttendees.filter((a) => a.role === "LEADER").length;
  const membersCount = allAttendees.filter((a) => a.role === "MEMBER").length;
  const soloCount = allAttendees.filter((a) => a.role === "INDIVIDUAL").length;

  const uniqueCollegesCount = React.useMemo(() => {
    const set = new Set<string>();
    allAttendees.forEach((a) => {
      if (a.college) set.add(a.college.trim().toLowerCase());
    });
    return set.size;
  }, [allAttendees]);

  const busCount = allAttendees.filter((a) => a.transportOptIn).length;
  const verifiedCount = allAttendees.filter((a) => a.checkedIn).length;

  // ─── Filtering Logic ──────────────────────────────────────────────────────

  const filteredAttendees = React.useMemo(() => {
    return allAttendees.filter((a) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.phone.includes(q) ||
        a.college.toLowerCase().includes(q) ||
        (a.department && a.department.toLowerCase().includes(q)) ||
        (a.teamName && a.teamName.toLowerCase().includes(q)) ||
        a.registrationNumber.toLowerCase().includes(q) ||
        (a.pickupStop && a.pickupStop.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (roleFilter !== "ALL" && a.role !== roleFilter) {
        return false;
      }

      if (selectedEvent !== "ALL" && a.eventName !== selectedEvent) {
        return false;
      }

      if (transportFilter === "BUS" && !a.transportOptIn) return false;
      if (transportFilter === "OWN" && a.transportOptIn) return false;

      if (checkInFilter === "CHECKED_IN" && !a.checkedIn) return false;
      if (checkInFilter === "PENDING" && a.checkedIn) return false;

      return true;
    });
  }, [allAttendees, search, roleFilter, selectedEvent, transportFilter, checkInFilter]);

  // Available event names
  const availableEventNames = React.useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => set.add(e.name));
    allAttendees.forEach((a) => set.add(a.eventName));
    return Array.from(set);
  }, [events, allAttendees]);

  return (
    <div className="space-y-4 font-mono max-w-full">
      {/* ── Lightbox & Dossier Modals ── */}
      <IdCardLightboxDialog
        doc={selectedIdDoc}
        open={idPreviewOpen}
        onOpenChange={setIdPreviewOpen}
      />
      <AttendeeDossierDialog
        attendee={selectedDossier}
        open={dossierOpen}
        onOpenChange={setDossierOpen}
        onOpenIdPreview={handleOpenIdDoc}
      />

      {/* ── Real-Time Status & Live Sync Control Strip ── */}
      <div className="flex items-center justify-between gap-1.5 border border-[#262626] bg-[#080808] px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs">
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className={`size-2 rounded-full ${
                autoSync
                  ? isSyncing
                    ? "bg-white animate-ping"
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
            title={soundEnabled ? "Mute audio alerts" : "Enable sound chime for incoming attendees"}
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

          {/* Custom Export Trigger */}
          <button
            type="button"
            onClick={() => setExportDialogOpen(true)}
            className="flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] uppercase tracking-wider font-bold bg-[#161616] hover:bg-[#202020] text-white border border-[#262626] hover:border-[#404040] cursor-pointer transition-colors"
          >
            <DownloadIcon className="size-3" />
            <span className="hidden min-[380px]:inline">Export</span>
          </button>
        </div>
      </div>

      {/* ── 4 Section Metric Cards (CodeHive 2K26 Terminal Palette) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Card 1: Total Attendees */}
        <div className="border border-[#262626] bg-[#0F0F0F] p-3 sm:p-4">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-400">Total Attendees</p>
          <p className="text-xl sm:text-2xl font-bold text-white mt-0.5 tabular-nums">
            {totalAttendees}
          </p>
          <p className="text-[10px] text-zinc-500 mt-1 truncate">
            {leadersCount} leaders • {membersCount} members
          </p>
        </div>

        {/* Card 2: Team Leaders */}
        <div className="border border-[#262626] bg-[#0F0F0F] p-3 sm:p-4">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-400">Team Leaders</p>
          <p className="text-xl sm:text-2xl font-bold text-white mt-0.5 tabular-nums">
            {leadersCount}
          </p>
          <p className="text-[10px] text-zinc-500 mt-1 truncate">
            Squad leads &amp; POCs
          </p>
        </div>

        {/* Card 3: Team Members */}
        <div className="border border-[#262626] bg-[#0F0F0F] p-3 sm:p-4">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-400">Team Members</p>
          <p className="text-xl sm:text-2xl font-bold text-white mt-0.5 tabular-nums">
            {membersCount}
          </p>
          <p className="text-[10px] text-zinc-500 mt-1 truncate">
            Active collaborators
          </p>
        </div>

        {/* Card 4: Institutions */}
        <div className="border border-[#262626] bg-[#0F0F0F] p-3 sm:p-4">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-400">Institutions</p>
          <p className="text-xl sm:text-2xl font-bold text-white mt-0.5 tabular-nums">
            {uniqueCollegesCount}
          </p>
          <p className="text-[10px] text-zinc-500 mt-1 truncate">
            {busCount} bus commuters
          </p>
        </div>
      </div>

      {/* ── Sub-Telemetry Strip (Gate Turnout & Transport) ── */}
      <div className="flex items-center justify-between flex-wrap gap-2 border border-[#262626] bg-[#080808] px-3 py-2 text-[11px] text-zinc-400">
        <div className="flex items-center gap-2.5 sm:gap-3.5 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Gate Verified:</span>
            <strong className="text-white font-bold tabular-nums">
              {verifiedCount} / {totalAttendees}
            </strong>
            <span className="text-emerald-400 font-semibold text-[10px]">
              ({totalAttendees > 0 ? Math.round((verifiedCount / totalAttendees) * 100) : 0}%)
            </span>
          </div>
          <span className="text-[#333333] hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Bus Commuters:</span>
            <strong className="text-white font-bold tabular-nums">{busCount}</strong>
          </div>
          {soloCount > 0 && (
            <>
              <span className="text-[#333333] hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Solo Entries:</span>
                <strong className="text-white font-bold tabular-nums">{soloCount}</strong>
              </div>
            </>
          )}
        </div>
        <div className="text-[10px] text-zinc-500 uppercase tracking-wider hidden md:block">
          Auto-synchronized with registration database
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="flex flex-col gap-2 sm:gap-2.5 border border-[#262626] bg-[#0F0F0F] p-2.5 sm:p-3">
        {/* Global Search Input */}
        <div className="relative w-full">
          <SearchIcon className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#737373]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search participant, team, pass code, college, phone..."
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

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
          {/* Role Status Filter Tabs */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar pb-0.5 text-xs">
            {[
              { id: "ALL", label: `All (${totalAttendees})` },
              { id: "LEADER", label: `Leaders (${leadersCount})` },
              { id: "MEMBER", label: `Members (${membersCount})` },
              ...(soloCount > 0 ? [{ id: "INDIVIDUAL", label: `Solo (${soloCount})` }] : []),
            ].map((tab) => {
              const isActive = roleFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setRoleFilter(tab.id as typeof roleFilter)}
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

          {/* Dropdown Filters */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 sm:gap-2">
            {/* Event Filter */}
            <Select value={selectedEvent} onValueChange={(val) => { if (val) setSelectedEvent(val); }}>
              <SelectTrigger className="col-span-2 sm:col-span-1 h-7 sm:h-7 text-[10px] sm:text-[11px] bg-[#080808] border-[#262626] text-white rounded-none px-2 py-1 min-w-[130px]">
                <SelectValue placeholder="Event Track" />
              </SelectTrigger>
              <SelectContent className="bg-[#0F0F0F] border-[#262626] text-white font-mono text-xs rounded-none">
                <SelectItem value="ALL">All Event Tracks</SelectItem>
                {availableEventNames.map((e) => (
                  <SelectItem key={e} value={e}>
                    {e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Transport Filter */}
            <Select value={transportFilter} onValueChange={(v) => { if (v) setTransportFilter(v as "ALL" | "BUS" | "OWN"); }}>
              <SelectTrigger className="h-7 sm:h-7 text-[10px] sm:text-[11px] bg-[#080808] border-[#262626] text-white rounded-none px-2 py-1 min-w-[110px]">
                <SelectValue placeholder="Commute" />
              </SelectTrigger>
              <SelectContent className="bg-[#0F0F0F] border-[#262626] text-white font-mono text-xs rounded-none">
                <SelectItem value="ALL">All Commute</SelectItem>
                <SelectItem value="BUS">Bus Transit</SelectItem>
                <SelectItem value="OWN">Own Commute</SelectItem>
              </SelectContent>
            </Select>

            {/* Check-In Filter */}
            <Select value={checkInFilter} onValueChange={(v) => { if (v) setCheckInFilter(v as "ALL" | "CHECKED_IN" | "PENDING"); }}>
              <SelectTrigger className="h-7 sm:h-7 text-[10px] sm:text-[11px] bg-[#080808] border-[#262626] text-white rounded-none px-2 py-1 min-w-[110px]">
                <SelectValue placeholder="Gate Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#0F0F0F] border-[#262626] text-white font-mono text-xs rounded-none">
                <SelectItem value="ALL">All Gate Status</SelectItem>
                <SelectItem value="CHECKED_IN">Gate Verified</SelectItem>
                <SelectItem value="PENDING">Pending Check-in</SelectItem>
              </SelectContent>
            </Select>

            {/* Reset Button */}
            {(search || roleFilter !== "ALL" || selectedEvent !== "ALL" || transportFilter !== "ALL" || checkInFilter !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setRoleFilter("ALL");
                  setSelectedEvent("ALL");
                  setTransportFilter("ALL");
                  setCheckInFilter("ALL");
                }}
                className="col-span-2 sm:col-span-1 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-[#E5E5E5] hover:text-black bg-[#161616] hover:bg-white border border-[#262626] hover:border-white transition-colors cursor-pointer text-center"
              >
                [ Reset ]
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Results Count Bar ── */}
      <div className="flex items-center justify-between text-[11px] text-[#737373] px-1">
        <span>
          Showing <strong className="text-white">{filteredAttendees.length}</strong> of {totalAttendees} participants
        </span>
        <span className="text-[10px] uppercase tracking-wider text-[#737373] hidden min-[400px]:inline">
          Order: Leader &rarr; Member 1 &rarr; Member 2
        </span>
      </div>

      {/* ── Mobile Card View (< md) (Minimal, High-Density & Terminal Aesthetic) ── */}
      <div className="block md:hidden space-y-1.5">
        {filteredAttendees.length === 0 ? (
          <div className="border border-[#262626] bg-[#0F0F0F] p-6 text-center text-xs text-zinc-500">
            No participants found matching the active filters.
          </div>
        ) : (
          filteredAttendees.map((a) => {
            const isLeader = a.role === "LEADER";
            const isMember = a.role === "MEMBER";

            return (
              <div
                key={a.uniqueKey}
                className={`border border-[#262626] bg-[#0F0F0F] p-2.5 transition-colors space-y-2 ${
                  isLeader
                    ? "border-l-2 border-l-white"
                    : isMember
                    ? "border-l-2 border-l-zinc-600 ml-2 bg-[#0A0A0A]"
                    : ""
                }`}
              >
                {/* Line 1: Role, Team / Pass Code, and Gate Status */}
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {/* Role Tag */}
                    {isLeader ? (
                      <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-white text-black shrink-0">
                        LEADER
                      </span>
                    ) : isMember ? (
                      <span className="text-[9px] uppercase font-mono font-semibold px-1.5 py-0.5 bg-[#161616] text-zinc-300 border border-[#262626] shrink-0">
                        M#{a.memberIndex + 1}
                      </span>
                    ) : (
                      <span className="text-[9px] uppercase font-mono font-semibold px-1.5 py-0.5 bg-[#161616] text-zinc-400 border border-[#262626] shrink-0">
                        SOLO
                      </span>
                    )}

                    {/* Team Tag if part of a team */}
                    {a.teamName ? (
                      <span className="text-white font-bold text-xs truncate max-w-[130px]">
                        {a.teamName}
                      </span>
                    ) : null}

                    {/* Pass Code with copy feedback */}
                    <button
                      type="button"
                      onClick={() => handleCopy(a.registrationNumber, `pass-${a.uniqueKey}`, "Pass Code")}
                      className="inline-flex items-center gap-1 text-[10px] font-mono text-zinc-300 bg-[#161616] border border-[#262626] px-1.5 py-0.5 hover:text-white transition-colors cursor-pointer shrink-0"
                      title="Tap to copy pass code"
                    >
                      <span>{a.registrationNumber}</span>
                      {copiedKey === `pass-${a.uniqueKey}` ? (
                        <CheckIcon className="size-2.5 text-emerald-400" />
                      ) : (
                        <CopyIcon className="size-2 text-zinc-500" />
                      )}
                    </button>
                  </div>

                  {/* Gate Check-in Status */}
                  <span
                    className={`inline-flex items-center gap-1 text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 border shrink-0 ${
                      a.checkedIn
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                        : "border-[#262626] bg-[#080808] text-zinc-500"
                    }`}
                  >
                    {a.checkedIn ? (
                      <>
                        <CheckCircle2Icon className="size-2.5 text-emerald-400" />
                        <span>VERIFIED</span>
                      </>
                    ) : (
                      <>
                        <ClockIcon className="size-2.5 text-zinc-500" />
                        <span>PENDING</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Line 2: Identity & Direct Actions */}
                <div className="flex items-center justify-between gap-2 pt-0.5 border-t border-[#1C1C1C]">
                  {/* Name and College */}
                  <div
                    className="min-w-0 flex-1 cursor-pointer"
                    onClick={() => handleOpenDossier(a)}
                  >
                    <p className="text-xs font-bold text-white truncate hover:underline">
                      {a.name}
                    </p>
                    <p className="text-[10px] text-zinc-400 truncate">
                      {a.college}
                    </p>
                  </div>

                  {/* Direct Action Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {a.collegeIdUrl && (
                      <button
                        type="button"
                        onClick={() => handleOpenIdDoc(a)}
                        className="text-[9px] uppercase font-bold border border-emerald-500/40 bg-emerald-950/20 hover:bg-emerald-950/50 text-emerald-400 px-2 py-1 transition-colors cursor-pointer flex items-center gap-1"
                        title="Preview College ID Card"
                      >
                        <EyeIcon className="size-2.5" />
                        <span>[ ID ]</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleOpenDossier(a)}
                      className="text-[9px] uppercase font-bold border border-[#262626] bg-[#161616] text-zinc-300 hover:text-white hover:border-[#404040] px-2 py-1 transition-colors cursor-pointer"
                      title="View full attendee dossier"
                    >
                      [ DETAILS ]
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Desktop Table View (>= md) ── */}
      <div className="hidden md:block rounded-none border border-[#262626] bg-[#0F0F0F] overflow-x-auto no-scrollbar">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#080808] text-[11px] uppercase tracking-wider text-[#737373] border-b border-[#262626]">
            <tr>
              <th className="px-4 py-3">Attendee</th>
              <th className="px-4 py-3">Team &amp; Event Track</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Institution &amp; Dept</th>
              <th className="px-4 py-3">Transport</th>
              <th className="px-4 py-3">College ID</th>
              <th className="px-4 py-3">Gate Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#262626]">
            {filteredAttendees.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-[#737373]">
                  No participants found matching the active filters.
                </td>
              </tr>
            ) : (
              filteredAttendees.map((a) => {
                const isLeader = a.role === "LEADER";
                const isMember = a.role === "MEMBER";

                return (
                  <tr
                    key={a.uniqueKey}
                    className={`transition-colors ${
                      isLeader
                        ? "bg-[#141414] hover:bg-[#1A1A1A] border-l-2 border-l-white"
                        : isMember
                        ? "hover:bg-[#141414] border-l-2 border-l-zinc-700"
                        : "hover:bg-[#141414]"
                    }`}
                  >
                    {/* Attendee Name & Role Tree */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {/* Hierarchy Indicator */}
                        {isLeader ? (
                          <span className="text-white font-mono font-bold shrink-0 text-xs" title="Team Leader">
                            ▲
                          </span>
                        ) : isMember ? (
                          <span className="text-zinc-500 font-mono text-xs shrink-0 select-none" title={`Team Member #${a.memberIndex + 1}`}>
                            {a.isLastInTeam ? "└─" : "├─"}
                          </span>
                        ) : (
                          <span className="text-zinc-500 font-mono text-xs shrink-0 select-none" title="Solo Attendee">
                            •
                          </span>
                        )}

                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => handleOpenDossier(a)}
                            className="font-semibold text-white hover:underline text-left truncate block cursor-pointer"
                          >
                            {a.name}
                          </button>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {isLeader ? (
                              <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 bg-white text-black tracking-wider">
                                LEADER
                              </span>
                            ) : isMember ? (
                              <span className="text-[9px] uppercase font-mono font-semibold px-1.5 py-0.5 border border-[#333333] bg-[#161616] text-zinc-300">
                                MEMBER #{a.memberIndex + 1}
                              </span>
                            ) : (
                              <span className="text-[9px] uppercase font-mono font-semibold px-1.5 py-0.5 border border-[#262626] bg-[#111111] text-zinc-400">
                                INDIVIDUAL
                              </span>
                            )}
                            <span className="text-[10px] text-zinc-500 font-mono">
                              {a.registrationNumber}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Team & Event Track */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5 max-w-[190px]">
                        {a.teamName ? (
                          <span
                            className="text-xs font-bold text-white truncate"
                            title={`Team: ${a.teamName} (${a.teamSize} members)`}
                          >
                            {a.teamName}
                          </span>
                        ) : (
                          <span className="text-xs text-zinc-500 font-mono">
                            Solo Candidate
                          </span>
                        )}
                        <span
                          className="text-[10px] text-zinc-400 truncate"
                          title={a.eventName}
                        >
                          {a.eventName}
                        </span>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5 max-w-[170px]">
                        <button
                          type="button"
                          onClick={() => handleCopy(a.phone, `phone-${a.uniqueKey}`, "phone")}
                          className="text-xs text-white font-mono hover:underline text-left truncate flex items-center gap-1 cursor-pointer"
                          title="Click to copy phone"
                        >
                          <span>{a.phone}</span>
                          {copiedKey === `phone-${a.uniqueKey}` && (
                            <CheckIcon className="size-2.5 text-emerald-400 shrink-0" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopy(a.email, `email-${a.uniqueKey}`, "email")}
                          className="text-[10px] text-zinc-400 font-mono hover:underline text-left truncate flex items-center gap-1 cursor-pointer"
                          title="Click to copy email"
                        >
                          <span className="truncate">{a.email}</span>
                          {copiedKey === `email-${a.uniqueKey}` && (
                            <CheckIcon className="size-2.5 text-emerald-400 shrink-0" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Institution & Dept */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5 max-w-[190px]" title={a.college}>
                        <span className="text-xs text-[#E5E5E5] font-semibold truncate">
                          {a.college}
                        </span>
                        <span className="text-[10px] text-zinc-500 truncate">
                          {a.department ? a.department : "Engineering"}
                          {a.year ? ` • Year ${a.year}` : ""}
                        </span>
                      </div>
                    </td>

                    {/* Transport */}
                    <td className="px-4 py-3">
                      {a.transportOptIn ? (
                        <div className="flex flex-col gap-0.5 max-w-[160px]">
                          <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 border border-[#262626] bg-[#161616] text-white w-fit flex items-center gap-1">
                            <BusIcon className="size-2.5 text-zinc-400" />
                            BUS PASS
                          </span>
                          <span className="text-[11px] text-white font-semibold truncate" title={a.pickupStop || "Main Corridor"}>
                            {a.pickupStop || a.pickupRoute || "Assigned Stop"}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] uppercase font-mono text-zinc-500 px-1.5 py-0.5 border border-[#262626] bg-[#080808]">
                          SELF
                        </span>
                      )}
                    </td>

                    {/* College ID Card */}
                    <td className="px-4 py-3">
                      {a.collegeIdUrl ? (
                        <button
                          type="button"
                          onClick={() => handleOpenIdDoc(a)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase font-bold font-mono border border-emerald-500/40 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-950/50 hover:text-emerald-300 transition-colors cursor-pointer"
                          title="Click to preview verified College ID Card"
                        >
                          <FileTextIcon className="size-2.5" />
                          <span>View ID</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-zinc-600 font-mono">
                          None
                        </span>
                      )}
                    </td>

                    {/* Gate Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border ${
                          a.checkedIn
                            ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                            : "border-[#262626] bg-[#080808] text-zinc-400"
                        }`}
                      >
                        {a.checkedIn ? (
                          <>
                            <CheckCircle2Icon className="size-2.5 shrink-0 text-emerald-400" />
                            <span>VERIFIED</span>
                          </>
                        ) : (
                          <>
                            <ClockIcon className="size-2.5 shrink-0 text-zinc-500" />
                            <span>PENDING</span>
                          </>
                        )}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenDossier(a)}
                        className="p-1.5 text-[#A3A3A3] hover:text-white border border-[#262626] bg-[#161616] hover:bg-[#202020] transition-colors cursor-pointer"
                        title="View attendee profile dossier"
                      >
                        <UserIcon className="size-3" />
                        <span className="sr-only">Dossier</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Custom Data Export Dialog ── */}
      <ExportDataDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        events={events}
        defaultScope="REGISTRATIONS"
      />
    </div>
  );
}
