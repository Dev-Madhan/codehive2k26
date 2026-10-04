import * as React from "react";
import Link from "next/link";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  FileCode2Icon,
  LayersIcon,
  ShieldCheckIcon,
  DatabaseIcon,
  CpuIcon,
  CheckCircleIcon,
  TerminalIcon,
  ExternalLinkIcon,
} from "lucide-react";

export default function DocsPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="bg-background min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto bg-background text-foreground font-mono space-y-8">
          {/* Header */}
          <div className="border-b border-border pb-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold text-blue-400 bg-blue-600/15 border border-blue-500/30 mb-2">
              &gt; engineering / blueprint_v2.0
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase">
              CodeHive 2K26 Technical Blueprint
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Production-ready architecture, database design, security model, and role specifications.
            </p>
          </div>

          {/* Quick Architecture Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase">
                <CpuIcon className="size-4" />
                <span>Next.js 16 App Router</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Server Actions for secure mutations, Route Handlers for webhooks, TypeScript type-safety end-to-end.
              </p>
            </div>

            <div className="border border-border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
                <DatabaseIcon className="size-4" />
                <span>PostgreSQL / Neon + Prisma</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Relational source of truth for events, registrations, participants, payments, and check-ins.
              </p>
            </div>

            <div className="border border-border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase">
                <ShieldCheckIcon className="size-4" />
                <span>Better-Auth RBAC</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Role-based access control protecting admin console with Google &amp; GitHub OAuth integrations.
              </p>
            </div>
          </div>

          {/* 3 Core Experience Pillars (from PDF blueprint) */}
          <div className="border border-border bg-card p-5 space-y-4">
            <h2 className="text-sm font-bold text-foreground uppercase flex items-center gap-2">
              <LayersIcon className="size-4 text-blue-400" />
              <span>Three Functional Pillars</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="border border-border/60 p-3 bg-background">
                <h3 className="font-bold text-blue-400 uppercase mb-2">01 • Public Experience</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Landing page &amp; event highlights</li>
                  <li>• Event catalogue &amp; details</li>
                  <li>• Multi-step registration flow</li>
                  <li>• Confirmation &amp; QR pass generation</li>
                </ul>
              </div>

              <div className="border border-border/60 p-3 bg-background">
                <h3 className="font-bold text-emerald-400 uppercase mb-2">02 • Admin Console</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Real-time operations dashboard</li>
                  <li>• Registration search &amp; status transitions</li>
                  <li>• Participant registry &amp; college breakdown</li>
                  <li>• Event track &amp; schedule configuration</li>
                </ul>
              </div>

              <div className="border border-border/60 p-3 bg-background">
                <h3 className="font-bold text-amber-400 uppercase mb-2">03 • On-Site Operations</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• QR code scanning station</li>
                  <li>• Sub-second check-in verification</li>
                  <li>• Duplicate entry prevention invariant</li>
                  <li>• Real-time attendance rate telemetry</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Database Entities & Invariants */}
          <div className="border border-border bg-card p-5 space-y-4">
            <h2 className="text-sm font-bold text-foreground uppercase flex items-center gap-2">
              <TerminalIcon className="size-4 text-blue-400" />
              <span>Core Invariants &amp; Registration Format</span>
            </h2>

            <div className="space-y-2 text-xs text-foreground-secondary">
              <div className="flex items-center gap-2">
                <span className="text-blue-400 font-bold">&gt; Registration ID Pattern:</span>
                <code className="bg-background px-2 py-0.5 border border-border text-amber-400">CH26-XXXXXX</code>
                <span className="text-slate-500">(e.g. CH26-8F3K21)</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-blue-400 font-bold">&gt; Status Lifecycle:</span>
                <span className="text-muted-foreground">PENDING → CONFIRMED → CANCELLED → ATTENDED</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-blue-400 font-bold">&gt; Uniqueness Constraint:</span>
                <span className="text-muted-foreground">Database compound index on [participantId, eventId]</span>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
