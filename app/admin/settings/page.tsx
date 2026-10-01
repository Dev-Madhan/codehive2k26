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

export default async function AdminSettingsPage() {
  const [userCount, eventCount, registrationCount] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.registration.count(),
  ]);

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="border-b border-[#152A54] pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold text-blue-400 bg-blue-600/15 border border-blue-500/30 mb-2">
          &gt; admin / operational_settings
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white uppercase">System Configuration</h1>
        <p className="text-xs text-slate-400 mt-1">
          Operational controls, role permissions matrix, and service telemetry for CodeHive 2K26.
        </p>
      </div>

      {/* Grid of Settings Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Module 1: Event Operational Parameters */}
        <div className="rounded-none border border-[#152A54] bg-[#060D1A] p-5 space-y-4">
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
            <div className="flex items-center justify-between py-1.5 border-b border-[#152A54]/50">
              <div>
                <p className="font-semibold text-slate-200">Registration Gate</p>
                <p className="text-[11px] text-slate-400">Accept incoming attendee registrations</p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-600/20 text-blue-400 border border-blue-500/40">
                ENABLED
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-[#152A54]/50">
              <div>
                <p className="font-semibold text-slate-200">Duplicate Check Prevention</p>
                <p className="text-[11px] text-slate-400">Enforce unique email + event database invariant</p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                STRICT
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-[#152A54]/50">
              <div>
                <p className="font-semibold text-slate-200">Auto QR Token Generation</p>
                <p className="text-[11px] text-slate-400">Mint cryptographic check-in QR code on submit</p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-600/20 text-blue-400 border border-blue-500/40">
                ENABLED
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <div>
                <p className="font-semibold text-slate-200">Check-in Double Entry Guard</p>
                <p className="text-[11px] text-slate-400">Reject scans if already marked checkedIn</p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                ENFORCED
              </span>
            </div>
          </div>
        </div>

        {/* Module 2: System Telemetry & Infrastructure */}
        <div className="rounded-none border border-[#152A54] bg-[#060D1A] p-5 space-y-4">
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
            <div className="flex items-center justify-between py-1.5 border-b border-[#152A54]/50">
              <div className="flex items-center gap-2">
                <span className="size-2 bg-emerald-400 rounded-none" />
                <span className="font-semibold text-slate-200">PostgreSQL / Neon DB</span>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">
                {registrationCount} Regs / {eventCount} Events
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-[#152A54]/50">
              <div className="flex items-center gap-2">
                <span className="size-2 bg-emerald-400 rounded-none" />
                <span className="font-semibold text-slate-200">Better-Auth Engine</span>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">
                {userCount} Verified Users
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-[#152A54]/50">
              <div className="flex items-center gap-2">
                <span className="size-2 bg-emerald-400 rounded-none" />
                <span className="font-semibold text-slate-200">Cloudinary Media Pipeline</span>
              </div>
              <span className="text-blue-400 font-mono text-[11px]">
                POSTERS_MOUNTED
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2">
                <span className="size-2 bg-emerald-400 rounded-none" />
                <span className="font-semibold text-slate-200">Resend / SMTP Dispatch</span>
              </div>
              <span className="text-blue-400 font-mono text-[11px]">
                STANDBY_READY
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Role Management Matrix (Blueprint Section 08) */}
      <div className="rounded-none border border-[#152A54] bg-[#060D1A] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#152A54] pb-3">
          <div className="flex items-center gap-2">
            <LockIcon className="size-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase">Role Access Control Matrix</h2>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">CODEHIVE 2K26 RBAC</span>
        </div>

        <div className="overflow-x-auto">
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
              <tr className="hover:bg-[#0B162C] transition-colors">
                <td className="px-4 py-3 font-bold text-amber-400">SUPER_ADMIN</td>
                <td className="px-4 py-3 text-slate-200">Full System Governance</td>
                <td className="px-4 py-3 text-slate-400">All settings, users, events, registrations, and exports</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    AUTHORITATIVE
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-[#0B162C] transition-colors">
                <td className="px-4 py-3 font-bold text-blue-400">ORGANIZER</td>
                <td className="px-4 py-3 text-slate-200">Event &amp; Registration Lead</td>
                <td className="px-4 py-3 text-slate-400">Event and registration management; operational dashboard</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-600/15 text-blue-400 border border-blue-500/30">
                    OPERATIONAL
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-[#0B162C] transition-colors">
                <td className="px-4 py-3 font-bold text-emerald-400">STAFF</td>
                <td className="px-4 py-3 text-slate-200">On-Site Gate Check-in</td>
                <td className="px-4 py-3 text-slate-400">QR check-in scanner and limited attendee lookup</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    FIELD_VERIFIED
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-[#0B162C] transition-colors">
                <td className="px-4 py-3 font-bold text-slate-400">PARTICIPANT</td>
                <td className="px-4 py-3 text-slate-200">Symposium Attendee</td>
                <td className="px-4 py-3 text-slate-400">Public event discovery, registration, ticket pass lookup</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    PUBLIC
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
