"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Role } from "@prisma/client";
import { toast } from "sonner";
import {
  ActivityIcon,
  ShieldCheckIcon,
  FileTextIcon,
  SearchIcon,
  ExternalLinkIcon,
  Trash2Icon,
  RefreshCwIcon,
  GlobeIcon,
  SmartphoneIcon,
  LaptopIcon,
  CheckCircle2Icon,
  ClockIcon,
  UsersIcon,
  EyeIcon,
  CopyIcon,
  CheckIcon,
  Loader2Icon,
  ServerIcon,
  ShieldAlertIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RoleAssignDialog, TargetUserInfo } from "@/components/admin/role-assign-dialog";
import { DeletePdfDialog, TargetPdfItem } from "@/components/admin/delete-pdf-dialog";
import { PdfPreviewDialog } from "@/components/admin/pdf-preview-dialog";
import { revokeUserSession } from "@/actions/admin-settings";

export interface ActivitySessionItem {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: Role;
  userImage?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  isActive: boolean;
}

export interface UserDirectoryItem {
  id: string;
  name: string;
  email: string;
  role: Role;
  image?: string | null;
  college?: string | null;
  department?: string | null;
  year?: string | null;
  phone?: string | null;
  createdAt: string;
  sessionsCount: number;
}

export interface AttendeePdfItem {
  id: string;
  name: string;
  phone: string;
  college: string;
  department?: string | null;
  year?: string | null;
  email?: string | null;
  eventName: string;
  eventSlug: string;
  collegeIdUrl: string;
  uploadedAt: string;
}

interface SettingsClientProps {
  activitySessions: ActivitySessionItem[];
  users: UserDirectoryItem[];
  pdfItems: AttendeePdfItem[];
  currentSessionId?: string;
}

type TabType = "activity" | "roles" | "pdfs";

interface ParsedUA {
  browser: string;
  os: string;
  isMobile: boolean;
}

function parseUserAgent(ua?: string | null): ParsedUA {
  if (!ua) return { browser: "Browser Client", os: "System Client", isMobile: false };

  let os = "Desktop";
  let isMobile = false;

  if (/windows/i.test(ua)) os = "Windows";
  else if (/macintosh|mac os x/i.test(ua)) os = "macOS";
  else if (/android/i.test(ua)) {
    os = "Android";
    isMobile = true;
  } else if (/iphone|ipad|ipod/i.test(ua)) {
    os = "iOS";
    isMobile = true;
  } else if (/linux/i.test(ua)) os = "Linux";

  let browser = "Web Client";
  if (/edg/i.test(ua)) browser = "Edge";
  else if (/chrome|crios/i.test(ua) && !/opr|edg/i.test(ua)) browser = "Chrome";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
  else if (/opr|opera/i.test(ua)) browser = "Opera";

  return { browser, os, isMobile };
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDays = Math.floor(diffHour / 24);
  return `${diffDays}d ago`;
}

function formatExpiresIn(expiresAtString: string): { text: string; isExpired: boolean } {
  const expiresAt = new Date(expiresAtString);
  const now = new Date();
  const diffSec = Math.floor((expiresAt.getTime() - now.getTime()) / 1000);

  if (diffSec <= 0) return { text: "Expired", isExpired: true };
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return { text: `in ${diffMin}m`, isExpired: false };
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return { text: `in ${diffHour}h`, isExpired: false };
  const diffDays = Math.floor(diffHour / 24);
  return { text: `in ${diffDays}d`, isExpired: false };
}

export function SettingsClient({
  activitySessions,
  users,
  pdfItems,
  currentSessionId,
}: SettingsClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<TabType>("activity");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [copiedUrl, setCopiedUrl] = React.useState<string | null>(null);

  // Sub-filters
  const [activityStatusFilter, setActivityStatusFilter] = React.useState<"ALL" | "ACTIVE" | "EXPIRED">("ALL");
  const [roleFilter, setRoleFilter] = React.useState<"ALL" | "ADMIN" | "PARTICIPANT">("ALL");
  const [eventFilter, setEventFilter] = React.useState<string>("ALL");

  // Dialog states
  const [roleDialogOpen, setRoleDialogOpen] = React.useState(false);
  const [selectedUserForRole, setSelectedUserForRole] = React.useState<TargetUserInfo | null>(null);

  const [pdfDialogOpen, setPdfDialogOpen] = React.useState(false);
  const [selectedPdfForDelete, setSelectedPdfForDelete] = React.useState<TargetPdfItem | null>(null);

  // PDF Preview Dialog
  const [previewPdfOpen, setPreviewPdfOpen] = React.useState(false);
  const [selectedPdfForPreview, setSelectedPdfForPreview] = React.useState<AttendeePdfItem | null>(null);

  // Revoke Session State
  const [terminatingSessionId, setTerminatingSessionId] = React.useState<string | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      toast.success("Tigris S3 document URL copied.");
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  const handleRevokeSession = async (sessionId: string, userEmail: string) => {
    try {
      setTerminatingSessionId(sessionId);
      const res = await revokeUserSession(sessionId);
      if (!res.success) {
        toast.error(res.error?.message || "Failed to terminate session.");
        return;
      }
      toast.success(`Session for ${userEmail} terminated.`);
      handleRefresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to terminate session.");
    } finally {
      setTerminatingSessionId(null);
    }
  };

  // Distinct events for PDF tab filter
  const eventOptions = React.useMemo(() => {
    const set = new Set(pdfItems.map((p) => p.eventName));
    return Array.from(set);
  }, [pdfItems]);

  // Metrics aggregation
  const activeSessionsCount = React.useMemo(() => {
    return activitySessions.filter((s) => s.isActive).length;
  }, [activitySessions]);

  const adminUsersCount = React.useMemo(() => {
    return users.filter((u) => u.role === "ADMIN").length;
  }, [users]);

  const participantUsersCount = React.useMemo(() => {
    return users.filter((u) => u.role === "PARTICIPANT").length;
  }, [users]);

  // Filter Activity Sessions
  const filteredSessions = React.useMemo(() => {
    return activitySessions.filter((s) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.userName.toLowerCase().includes(q) ||
        s.userEmail.toLowerCase().includes(q) ||
        (s.ipAddress && s.ipAddress.toLowerCase().includes(q)) ||
        (s.userAgent && s.userAgent.toLowerCase().includes(q));

      const matchesStatus =
        activityStatusFilter === "ALL" ||
        (activityStatusFilter === "ACTIVE" && s.isActive) ||
        (activityStatusFilter === "EXPIRED" && !s.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [activitySessions, searchQuery, activityStatusFilter]);

  // Filter Users
  const filteredUsers = React.useMemo(() => {
    return users.filter((u) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.college && u.college.toLowerCase().includes(q)) ||
        (u.department && u.department.toLowerCase().includes(q));

      const matchesRole =
        roleFilter === "ALL" || u.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  // Filter PDFs
  const filteredPdfs = React.useMemo(() => {
    return pdfItems.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.college.toLowerCase().includes(q) ||
        (p.email && p.email.toLowerCase().includes(q)) ||
        (p.phone && p.phone.toLowerCase().includes(q)) ||
        p.eventName.toLowerCase().includes(q);

      const matchesEvent =
        eventFilter === "ALL" || p.eventName === eventFilter;

      return matchesSearch && matchesEvent;
    });
  }, [pdfItems, searchQuery, eventFilter]);

  return (
    <div className="space-y-6 font-mono max-w-full">
      {/* Top Page Header */}
      <div className="border-b border-[#152A54] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold text-blue-400 bg-blue-600/15 border border-blue-500/30 mb-2">
            &gt; ADMIN // OPERATIONAL_HUB
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
            System Settings &amp; Telemetry
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time session telemetry, administrative governance, and Tigris S3 document inspection.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="rounded-none border border-[#152A54] bg-[#060D1A] hover:bg-[#0B162C] hover:border-blue-500/50 text-slate-300 hover:text-white text-xs uppercase transition-all shrink-0 cursor-pointer"
        >
          <RefreshCwIcon className={`size-3.5 mr-1.5 ${isRefreshing ? "animate-spin text-blue-400" : ""}`} />
          [ Refresh Feed ]
        </Button>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* HERO TELEMETRY METRIC OVERVIEW CARDS */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Live Sessions */}
        <div
          onClick={() => {
            setActiveTab("activity");
            setActivityStatusFilter("ACTIVE");
          }}
          className={`p-3.5 border transition-all cursor-pointer bg-[#060D1A] ${
            activeTab === "activity" && activityStatusFilter === "ACTIVE"
              ? "border-emerald-500 ring-1 ring-emerald-500/30"
              : "border-[#152A54] hover:border-emerald-500/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Active Sessions</span>
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full size-2 bg-emerald-500"></span>
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">{activeSessionsCount}</span>
            <span className="text-[10px] text-emerald-400 uppercase">ONLINE</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 truncate flex items-center gap-1">
            <ActivityIcon className="size-3 text-emerald-400" />
            <span>{activitySessions.length} total logged sessions</span>
          </div>
        </div>

        {/* Metric 2: Admin Accounts */}
        <div
          onClick={() => {
            setActiveTab("roles");
            setRoleFilter("ADMIN");
          }}
          className={`p-3.5 border transition-all cursor-pointer bg-[#060D1A] ${
            activeTab === "roles" && roleFilter === "ADMIN"
              ? "border-amber-500 ring-1 ring-amber-500/30"
              : "border-[#152A54] hover:border-amber-500/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Administrators</span>
            <ShieldCheckIcon className="size-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">{adminUsersCount}</span>
            <span className="text-[10px] text-amber-400 uppercase">ELEVATED</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 truncate">
            {participantUsersCount} standard participants
          </div>
        </div>

        {/* Metric 3: Total Accounts */}
        <div
          onClick={() => {
            setActiveTab("roles");
            setRoleFilter("ALL");
          }}
          className={`p-3.5 border transition-all cursor-pointer bg-[#060D1A] ${
            activeTab === "roles" && roleFilter === "ALL"
              ? "border-blue-500 ring-1 ring-blue-500/30"
              : "border-[#152A54] hover:border-blue-500/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">User Directory</span>
            <UsersIcon className="size-4 text-blue-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">{users.length}</span>
            <span className="text-[10px] text-blue-400 uppercase">ACCOUNTS</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 truncate">
            Registered symposium profiles
          </div>
        </div>

        {/* Metric 4: Tigris S3 Documents */}
        <div
          onClick={() => {
            setActiveTab("pdfs");
            setEventFilter("ALL");
          }}
          className={`p-3.5 border transition-all cursor-pointer bg-[#060D1A] ${
            activeTab === "pdfs"
              ? "border-red-500 ring-1 ring-red-500/30"
              : "border-[#152A54] hover:border-red-500/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Tigris S3 Storage</span>
            <FileTextIcon className="size-4 text-red-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">{pdfItems.length}</span>
            <span className="text-[10px] text-red-400 uppercase">DOCUMENTS</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 truncate flex items-center gap-1">
            <ServerIcon className="size-3 text-red-400" />
            <span>Live College ID files</span>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* PRIMARY TAB NAVIGATION */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#152A54] pb-3">
        <button
          type="button"
          onClick={() => {
            setActiveTab("activity");
            setSearchQuery("");
          }}
          className={`flex items-center gap-2 px-4 py-2 font-bold text-xs uppercase tracking-wider border rounded-none transition-all cursor-pointer ${
            activeTab === "activity"
              ? "border-blue-500 bg-blue-600/20 text-white shadow-xs"
              : "border-[#152A54] bg-[#060D1A] text-slate-400 hover:text-slate-200 hover:border-slate-500"
          }`}
        >
          <ActivityIcon className={`size-3.5 ${activeTab === "activity" ? "text-blue-400" : "text-slate-500"}`} />
          <span>Activity Log</span>
          <span className="px-1.5 py-0.2 text-[10px] bg-[#0E1B38] text-blue-400 border border-blue-500/30">
            {activeSessionsCount} LIVE
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("roles");
            setSearchQuery("");
          }}
          className={`flex items-center gap-2 px-4 py-2 font-bold text-xs uppercase tracking-wider border rounded-none transition-all cursor-pointer ${
            activeTab === "roles"
              ? "border-amber-500 bg-amber-500/15 text-white shadow-xs"
              : "border-[#152A54] bg-[#060D1A] text-slate-400 hover:text-slate-200 hover:border-slate-500"
          }`}
        >
          <ShieldCheckIcon className={`size-3.5 ${activeTab === "roles" ? "text-amber-400" : "text-slate-500"}`} />
          <span>Role Assigner</span>
          <span className="px-1.5 py-0.2 text-[10px] bg-amber-950/40 text-amber-400 border border-amber-500/30">
            {users.length} USERS
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("pdfs");
            setSearchQuery("");
          }}
          className={`flex items-center gap-2 px-4 py-2 font-bold text-xs uppercase tracking-wider border rounded-none transition-all cursor-pointer ${
            activeTab === "pdfs"
              ? "border-red-500 bg-red-950/20 text-white shadow-xs"
              : "border-[#152A54] bg-[#060D1A] text-slate-400 hover:text-slate-200 hover:border-slate-500"
          }`}
        >
          <FileTextIcon className={`size-3.5 ${activeTab === "pdfs" ? "text-red-400" : "text-slate-500"}`} />
          <span>PDF Access</span>
          <span className="px-1.5 py-0.2 text-[10px] bg-red-950/40 text-red-400 border border-red-500/30">
            {pdfItems.length} STORED
          </span>
        </button>
      </div>

      {/* Control / Search Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#060D1A] border border-[#152A54] p-3">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === "activity"
                ? "Filter sessions by user name, email, IP, browser..."
                : activeTab === "roles"
                ? "Search users by name, email, college, department..."
                : "Search attendees by name, college, event, phone..."
            }
            className="pl-9 h-9 rounded-none border-[#152A54] bg-[#03060E] text-xs font-mono text-white placeholder:text-slate-600 focus-visible:border-blue-500"
          />
        </div>

        {/* Tab-Specific Sub-Filters */}
        <div className="flex items-center gap-2 shrink-0">
          {activeTab === "activity" && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[10px] text-slate-400 uppercase hidden sm:inline">Status:</span>
              <button
                type="button"
                onClick={() => setActivityStatusFilter("ALL")}
                className={`px-2.5 py-1 text-[11px] font-bold border transition-colors cursor-pointer ${
                  activityStatusFilter === "ALL"
                    ? "border-blue-500 bg-blue-600/20 text-white"
                    : "border-[#152A54] bg-[#03060E] text-slate-400 hover:text-white"
                }`}
              >
                ALL ({activitySessions.length})
              </button>
              <button
                type="button"
                onClick={() => setActivityStatusFilter("ACTIVE")}
                className={`px-2.5 py-1 text-[11px] font-bold border transition-colors cursor-pointer ${
                  activityStatusFilter === "ACTIVE"
                    ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                    : "border-[#152A54] bg-[#03060E] text-slate-400 hover:text-white"
                }`}
              >
                LIVE ({activeSessionsCount})
              </button>
              <button
                type="button"
                onClick={() => setActivityStatusFilter("EXPIRED")}
                className={`px-2.5 py-1 text-[11px] font-bold border transition-colors cursor-pointer ${
                  activityStatusFilter === "EXPIRED"
                    ? "border-slate-500 bg-slate-800 text-slate-200"
                    : "border-[#152A54] bg-[#03060E] text-slate-400 hover:text-white"
                }`}
              >
                EXPIRED ({activitySessions.length - activeSessionsCount})
              </button>
            </div>
          )}

          {activeTab === "roles" && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[10px] text-slate-400 uppercase hidden sm:inline">Role:</span>
              <button
                type="button"
                onClick={() => setRoleFilter("ALL")}
                className={`px-2.5 py-1 text-[11px] font-bold border transition-colors cursor-pointer ${
                  roleFilter === "ALL"
                    ? "border-blue-500 bg-blue-600/20 text-white"
                    : "border-[#152A54] bg-[#03060E] text-slate-400 hover:text-white"
                }`}
              >
                ALL ({users.length})
              </button>
              <button
                type="button"
                onClick={() => setRoleFilter("ADMIN")}
                className={`px-2.5 py-1 text-[11px] font-bold border transition-colors cursor-pointer ${
                  roleFilter === "ADMIN"
                    ? "border-amber-500 bg-amber-500/20 text-amber-300"
                    : "border-[#152A54] bg-[#03060E] text-slate-400 hover:text-white"
                }`}
              >
                ADMINS ({adminUsersCount})
              </button>
              <button
                type="button"
                onClick={() => setRoleFilter("PARTICIPANT")}
                className={`px-2.5 py-1 text-[11px] font-bold border transition-colors cursor-pointer ${
                  roleFilter === "PARTICIPANT"
                    ? "border-blue-500 bg-blue-500/20 text-blue-300"
                    : "border-[#152A54] bg-[#03060E] text-slate-400 hover:text-white"
                }`}
              >
                PARTICIPANTS ({participantUsersCount})
              </button>
            </div>
          )}

          {activeTab === "pdfs" && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[10px] text-slate-400 uppercase hidden sm:inline">Track:</span>
              <select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                className="h-8 bg-[#03060E] border border-[#152A54] text-xs text-slate-200 px-2 rounded-none font-mono focus:border-blue-500"
              >
                <option value="ALL">All Events ({pdfItems.length})</option>
                {eventOptions.map((ev) => (
                  <option key={ev} value={ev}>
                    {ev}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* TAB 1: ACTIVITY LOG TABULAR COLUMN */}
      {/* ──────────────────────────────────────────────────────────── */}
      {activeTab === "activity" && (
        <div className="border border-[#152A54] bg-[#060D1A] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#152A54] bg-[#030712] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ActivityIcon className="size-4 text-blue-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Live Login &amp; Session Activity ({filteredSessions.length})
              </h2>
            </div>
            <span className="text-[10px] text-slate-400">
              Auto-authenticated via OAuth &amp; Better Auth
            </span>
          </div>

          <div
            className="overflow-x-auto no-scrollbar scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <table className="w-full text-left text-xs min-w-[780px]">
              <thead className="bg-[#03060E] text-[10px] uppercase tracking-wider text-slate-400 border-b border-[#152A54]">
                <tr>
                  <th className="px-4 py-3">Logged-in User</th>
                  <th className="px-4 py-3">Client Endpoint / Device</th>
                  <th className="px-4 py-3">Session Status</th>
                  <th className="px-4 py-3">Last Active</th>
                  <th className="px-4 py-3 text-right">Security Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#152A54]">
                {filteredSessions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                      &gt; NO_ACTIVITY_SESSIONS_FOUND
                    </td>
                  </tr>
                ) : (
                  filteredSessions.map((session) => {
                    const parsedUA = parseUserAgent(session.userAgent);
                    const expiry = formatExpiresIn(session.expiresAt);
                    const isSelf = currentSessionId && session.id === currentSessionId;
                    const isTerminating = terminatingSessionId === session.id;

                    return (
                      <tr key={session.id} className="hover:bg-[#0B162C] transition-colors">
                        {/* User Identity */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-none bg-[#03060E] border border-[#152A54] flex items-center justify-center font-bold text-xs text-blue-400 shrink-0">
                              {session.userName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white truncate">{session.userName}</span>
                                <span
                                  className={`px-1.5 py-0.2 text-[9px] font-bold border uppercase shrink-0 ${
                                    session.userRole === "ADMIN"
                                      ? "text-amber-400 border-amber-500/40 bg-amber-500/10"
                                      : "text-blue-400 border-blue-500/40 bg-blue-500/10"
                                  }`}
                                >
                                  {session.userRole}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-400 truncate">{session.userEmail}</span>
                            </div>
                          </div>
                        </td>

                        {/* Client Endpoint */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {parsedUA.isMobile ? (
                              <SmartphoneIcon className="size-3.5 text-slate-400 shrink-0" />
                            ) : (
                              <LaptopIcon className="size-3.5 text-slate-400 shrink-0" />
                            )}
                            <div className="flex flex-col text-[11px] min-w-0">
                              <span className="text-white font-medium truncate">
                                {parsedUA.browser} • {parsedUA.os}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                IP: {session.ipAddress || "Internal / Proxy"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {session.isActive ? (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/40 uppercase">
                                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                LIVE
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 text-[10px] font-bold text-slate-400 bg-slate-900 border border-slate-700 uppercase">
                                EXPIRED
                              </span>
                            )}
                            <span className="text-[10px] text-slate-500">
                              {expiry.text}
                            </span>
                          </div>
                        </td>

                        {/* Last Active */}
                        <td className="px-4 py-3 text-slate-300 text-[11px]">
                          <div className="flex flex-col">
                            <span className="text-white font-medium">
                              {formatRelativeTime(session.updatedAt)}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {new Date(session.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </td>

                        {/* Security Action */}
                        <td className="px-4 py-3 text-right">
                          {isSelf ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/40 uppercase">
                              <CheckCircle2Icon className="size-3 text-emerald-400" />
                              [ CURRENT_SESSION ]
                            </span>
                          ) : (
                            <Button
                              type="button"
                              size="sm"
                              disabled={isTerminating}
                              onClick={() => handleRevokeSession(session.id, session.userEmail)}
                              className="rounded-none text-[11px] font-bold uppercase bg-red-950/30 hover:bg-red-900/50 text-red-400 hover:text-red-200 border border-red-900/60 hover:border-red-600 transition-all cursor-pointer h-7 px-2.5"
                            >
                              {isTerminating ? (
                                <span className="flex items-center gap-1">
                                  <Loader2Icon className="size-3 animate-spin" />
                                  Ending...
                                </span>
                              ) : (
                                "[ Revoke Session ]"
                              )}
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* TAB 2: ROLE ASSIGNER TABULAR COLUMN */}
      {/* ──────────────────────────────────────────────────────────── */}
      {activeTab === "roles" && (
        <div className="border border-[#152A54] bg-[#060D1A] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#152A54] bg-[#030712] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="size-4 text-amber-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                User Directory &amp; RBAC Privilege Assigner ({filteredUsers.length})
              </h2>
            </div>
            <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 uppercase">
              ADMIN GOVERNANCE ONLY
            </span>
          </div>

          <div
            className="overflow-x-auto no-scrollbar scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <table className="w-full text-left text-xs min-w-[760px]">
              <thead className="bg-[#03060E] text-[10px] uppercase tracking-wider text-slate-400 border-b border-[#152A54]">
                <tr>
                  <th className="px-4 py-3">Account User</th>
                  <th className="px-4 py-3">Academic Institution</th>
                  <th className="px-4 py-3">Current Role</th>
                  <th className="px-4 py-3">Registered On</th>
                  <th className="px-4 py-3 text-right">Privilege Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#152A54]">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                      &gt; NO_MATCHING_USERS_FOUND
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-[#0B162C] transition-colors">
                      {/* User */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-none bg-[#03060E] border border-[#152A54] flex items-center justify-center font-bold text-xs text-white shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-white truncate">{user.name}</span>
                            <span className="text-[11px] text-slate-400 truncate">{user.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* College */}
                      <td className="px-4 py-3 text-slate-300">
                        {user.college ? (
                          <div className="flex flex-col min-w-0 max-w-[260px]">
                            <span className="text-white font-medium truncate">{user.college}</span>
                            <span className="text-[10px] text-slate-500 truncate">
                              {user.department || "Dept"} {user.year ? `• Year ${user.year}` : ""}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px] italic">Not submitted</span>
                        )}
                      </td>

                      {/* Current Role */}
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold border uppercase shrink-0 ${
                            user.role === "ADMIN"
                              ? "text-amber-400 border-amber-500/40 bg-amber-500/10"
                              : "text-blue-400 border-blue-500/40 bg-blue-500/10"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* Registered Date */}
                      <td className="px-4 py-3 text-slate-400 text-[11px]">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3 text-right">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => {
                            setSelectedUserForRole({
                              id: user.id,
                              name: user.name,
                              email: user.email,
                              role: user.role,
                            });
                            setRoleDialogOpen(true);
                          }}
                          className={`rounded-none text-xs font-bold uppercase transition-all shadow-xs cursor-pointer ${
                            user.role === "ADMIN"
                              ? "border border-amber-500/50 bg-[#060D1A] text-amber-400 hover:bg-amber-950/30"
                              : "border border-blue-500/50 bg-blue-600 hover:bg-blue-500 text-white"
                          }`}
                        >
                          [ Assign Role ]
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* TAB 3: PDF ACCESS & TIGRIS STORAGE TABULAR COLUMN */}
      {/* ──────────────────────────────────────────────────────────── */}
      {activeTab === "pdfs" && (
        <div className="border border-[#152A54] bg-[#060D1A] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#152A54] bg-[#030712] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileTextIcon className="size-4 text-red-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Uploaded College ID Documents &amp; Tigris Storage ({filteredPdfs.length})
              </h2>
            </div>
            <span className="text-[10px] text-red-400 bg-red-950/30 border border-red-900/50 px-2 py-0.5 uppercase">
              TIGRIS S3 DIRECT DELETION
            </span>
          </div>

          <div
            className="overflow-x-auto no-scrollbar scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <table className="w-full text-left text-xs min-w-[820px]">
              <thead className="bg-[#03060E] text-[10px] uppercase tracking-wider text-slate-400 border-b border-[#152A54]">
                <tr>
                  <th className="px-4 py-3">Attendee Name</th>
                  <th className="px-4 py-3">Contact Info</th>
                  <th className="px-4 py-3">College Institution</th>
                  <th className="px-4 py-3">Registered Event</th>
                  <th className="px-4 py-3">Document Actions</th>
                  <th className="px-4 py-3 text-right">Storage Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#152A54]">
                {filteredPdfs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                      &gt; NO_ATTENDEE_DOCUMENTS_FOUND
                    </td>
                  </tr>
                ) : (
                  filteredPdfs.map((pdf) => {
                    const isCopied = copiedUrl === pdf.collegeIdUrl;

                    return (
                      <tr key={pdf.id} className="hover:bg-[#0B162C] transition-colors">
                        {/* Name */}
                        <td className="px-4 py-3 font-bold text-white truncate">
                          {pdf.name}
                        </td>

                        {/* Contact */}
                        <td className="px-4 py-3 text-slate-300">
                          <div className="flex flex-col text-[11px]">
                            <span className="text-white font-mono">{pdf.phone}</span>
                            {pdf.email && <span className="text-slate-400 truncate max-w-[200px]">{pdf.email}</span>}
                          </div>
                        </td>

                        {/* College */}
                        <td className="px-4 py-3 text-slate-200">
                          <div className="flex flex-col min-w-0 max-w-[240px]">
                            <span className="font-semibold text-white truncate">{pdf.college}</span>
                            <span className="text-[10px] text-slate-500 truncate">
                              {pdf.department || "General"} {pdf.year ? `• Year ${pdf.year}` : ""}
                            </span>
                          </div>
                        </td>

                        {/* Event */}
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 text-[10px] font-bold text-blue-400 bg-blue-600/15 border border-blue-500/30 uppercase truncate">
                            {pdf.eventName}
                          </span>
                        </td>

                        {/* Document Actions: In-App Inspect & Direct View */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            {/* In-App Quick Inspector */}
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => {
                                setSelectedPdfForPreview(pdf);
                                setPreviewPdfOpen(true);
                              }}
                              className="rounded-none h-7 px-2.5 text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-500 border border-blue-500 transition-colors uppercase cursor-pointer"
                            >
                              <EyeIcon className="size-3 mr-1" />
                              <span>Inspect</span>
                            </Button>

                            {/* Direct External Link */}
                            <a
                              href={pdf.collegeIdUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-400 hover:text-white bg-[#03060E] hover:bg-[#0B162C] border border-[#152A54] transition-colors"
                              title="Open raw document in new tab"
                            >
                              <ExternalLinkIcon className="size-3" />
                            </a>

                            {/* Copy URL */}
                            <button
                              type="button"
                              onClick={() => handleCopyLink(pdf.collegeIdUrl)}
                              className="p-1 text-slate-400 hover:text-white bg-[#03060E] hover:bg-[#0B162C] border border-[#152A54] transition-colors cursor-pointer"
                              title="Copy Tigris S3 URL"
                            >
                              {isCopied ? (
                                <CheckIcon className="size-3 text-emerald-400" />
                              ) : (
                                <CopyIcon className="size-3" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Delete Action */}
                        <td className="px-4 py-3 text-right">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              setSelectedPdfForDelete({
                                id: pdf.id,
                                name: pdf.name,
                                college: pdf.college,
                                eventName: pdf.eventName,
                                pdfUrl: pdf.collegeIdUrl,
                              });
                              setPdfDialogOpen(true);
                            }}
                            className="rounded-none text-xs font-bold uppercase bg-red-950/30 hover:bg-red-900/50 text-red-400 hover:text-red-200 border border-red-900/60 hover:border-red-600 transition-all cursor-pointer h-7 px-2.5"
                          >
                            <Trash2Icon className="size-3 mr-1 text-red-400" />
                            [ Delete PDF ]
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Role Assigner Dialog Modal */}
      <RoleAssignDialog
        user={selectedUserForRole}
        open={roleDialogOpen}
        onOpenChange={setRoleDialogOpen}
        onSuccess={() => {
          handleRefresh();
        }}
      />

      {/* Delete PDF Dialog Modal (Warning notice & direct Tigris S3 purge) */}
      <DeletePdfDialog
        item={selectedPdfForDelete}
        open={pdfDialogOpen}
        onOpenChange={setPdfDialogOpen}
        onSuccess={() => {
          handleRefresh();
        }}
      />

      {/* In-App Instant PDF Document Inspector Modal */}
      <PdfPreviewDialog
        item={selectedPdfForPreview}
        open={previewPdfOpen}
        onOpenChange={setPreviewPdfOpen}
        onRequestDelete={(item) => {
          setSelectedPdfForDelete({
            id: item.id,
            name: item.name,
            college: item.college,
            eventName: item.eventName,
            pdfUrl: item.collegeIdUrl,
          });
          setPdfDialogOpen(true);
        }}
      />
    </div>
  );
}
