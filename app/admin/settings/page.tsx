import * as React from "react";
import {
  Settings2Icon,
  ShieldCheckIcon,
  DatabaseIcon,
  KeyIcon,
  MailIcon,
  SlidersIcon,
  LockIcon,
  CheckCircle2Icon,
  RefreshCwIcon,
} from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminSettingsPage() {
  const [userCount, eventCount, registrationCount] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.registration.count(),
  ]);

  const roles = [
    {
      tier: "SUPER_ADMIN",
      scope: "Full System Governance",
      ops: "All settings, users, events, registrations, and exports",
      status: "AUTHORITATIVE",
      color: "text-amber-400 border-amber-500/30 bg-amber-500/15",
    },
    {
      tier: "ORGANIZER",
      scope: "Event & Registration Lead",
      ops: "Event and registration management; operational dashboard",
      status: "OPERATIONAL",
      color: "text-blue-400 border-blue-500/30 bg-blue-600/15",
    },
    {
      tier: "STAFF",
      scope: "On-Site Gate Check-in",
      ops: "QR check-in scanner and limited attendee lookup",
      status: "FIELD_VERIFIED",
      color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/15",
    },
    {
      tier: "PARTICIPANT",
      scope: "Symposium Attendee",
      ops: "Public event discovery, registration, ticket pass lookup",
      status: "PUBLIC",
      color: "text-slate-300 border-slate-700 bg-slate-800",
    },
  ];

  return (
    <div className="space-y-6 font-mono max-w-full">
      {/* Header */}
      <div className="border-b border-[#152A54] pb-3 sm:pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold text-blue-400 bg-blue-600/15 border border-blue-500/30 mb-2">
          &gt; admin / operational_settings
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">System Configuration</h1>
        <p className="text-xs text-slate-400 mt-1">
          Operational controls, role permissions matrix, and service telemetry for CodeHive 2K26.
        </p>
      </div>

      {/* Grid of Settings Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Module 1: Event Operational Parameters */}
        <div className="rounded-none border border-[#152A54] bg-[#060D1A] p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#152A54] pb-3">
            <div className="flex items-center gap-2">
              <SlidersIcon className="size-4 text-blue-400" />
              <h2 className="text-sm font-bold text-white uppercase">Event Controls</h2>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 font-bold uppercase">
              ACTIVE
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start sm:items-center justify-between py-1.5 border-b border-[#152A54]/50 gap-2">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-200">Registration Gate</p>
                <p className="text-[10px] sm:text-[11px] text-slate-400">Accept incoming attendee registrations</p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-600/20 text-blue-400 border border-blue-500/40 shrink-0">
                ENABLED
              </span>
            </div>

            <div className="flex items-start sm:items-center justify-between py-1.5 border-b border-[#152A54]/50 gap-2">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-200">Duplicate Check Prevention</p>
                <p className="text-[10px] sm:text-[11px] text-slate-400">Enforce unique email + event invariant</p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
                STRICT
              </span>
            </div>

            <div className="flex items-start sm:items-center justify-between py-1.5 border-b border-[#152A54]/50 gap-2">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-200">Auto QR Token Generation</p>
                <p className="text-[10px] sm:text-[11px] text-slate-400">Mint cryptographic check-in QR on submit</p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-600/20 text-blue-400 border border-blue-500/40 shrink-0">
                ENABLED
              </span>
            </div>

            <div className="flex items-start sm:items-center justify-between py-1.5 gap-2">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-200">Check-in Double Entry Guard</p>
                <p className="text-[10px] sm:text-[11px] text-slate-400">Reject scans if already marked checkedIn</p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
                ENFORCED
              </span>
            </div>
          </div>
        </div>

        {/* Module 2: System Telemetry & Infrastructure */}
        <div className="rounded-none border border-[#152A54] bg-[#060D1A] p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#152A54] pb-3">
            <div className="flex items-center gap-2">
              <DatabaseIcon className="size-4 text-blue-400" />
              <h2 className="text-sm font-bold text-white uppercase">Service Telemetry</h2>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 font-bold uppercase">
              100% HEALTHY
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-[#152A54]/50 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="size-2 bg-emerald-400 rounded-none shrink-0" />
                <span className="font-semibold text-slate-200 truncate">Neon PostgreSQL</span>
              </div>
              <span className="text-slate-400 font-mono text-[10px] sm:text-[11px] shrink-0">
                {registrationCount} Regs / {eventCount} Events
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-[#152A54]/50 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="size-2 bg-emerald-400 rounded-none shrink-0" />
                <span className="font-semibold text-slate-200 truncate">Better-Auth</span>
              </div>
              <span className="text-slate-400 font-mono text-[10px] sm:text-[11px] shrink-0">
                {userCount} Verified Users
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-[#152A54]/50 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="size-2 bg-emerald-400 rounded-none shrink-0" />
                <span className="font-semibold text-slate-200 truncate">Cloud Storage</span>
              </div>
              <span className="text-blue-400 font-mono text-[10px] sm:text-[11px] shrink-0">
                POSTERS_MOUNTED
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="size-2 bg-emerald-400 rounded-none shrink-0" />
                <span className="font-semibold text-slate-200 truncate">SMTP / Resend</span>
              </div>
              <span className="text-blue-400 font-mono text-[10px] sm:text-[11px] shrink-0">
                STANDBY_READY
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Role Management Matrix (Mobile Responsive) */}
      <div className="rounded-none border border-[#152A54] bg-[#060D1A] p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#152A54] pb-3">
          <div className="flex items-center gap-2">
            <LockIcon className="size-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase">Role Access Control Matrix</h2>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">CODEHIVE RBAC</span>
        </div>

        {/* ── Mobile Role Cards (< md) ── */}
        <div className="block md:hidden space-y-3">
          {roles.map((r) => (
            <div key={r.tier} className="bg-[#03060E] border border-[#152A54] p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold px-2 py-0.5 border ${r.color}`}>
                  {r.tier}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                  {r.status}
                </span>
              </div>
              <div className="space-y-1 text-xs">
                <p className="font-semibold text-white">{r.scope}</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">{r.ops}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Desktop Role Table (>= md) ── */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#03060E] text-[11px] uppercase tracking-wider text-slate-400 border-b border-[#152A54]">
              <tr>
                <th className="px-4 py-3">Role Tier</th>
                <th className="px-4 py-3">Scope &amp; Authority</th>
                <th className="px-4 py-3">Operations Allowed</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#152A54]">
              {roles.map((r) => (
                <tr key={r.tier} className="hover:bg-[#0B162C] transition-colors">
                  <td className="px-4 py-3 font-bold text-white">{r.tier}</td>
                  <td className="px-4 py-3 text-slate-200">{r.scope}</td>
                  <td className="px-4 py-3 text-slate-400">{r.ops}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-[10px] font-bold border ${r.color}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
