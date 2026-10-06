"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VELTECH_BUS_ROUTES } from "@/lib/constants/transport";
import { generateExportFile, ExportOptions, ExportColumnOptions } from "@/lib/export-excel";
import { toast } from "sonner";
import {
  FileSpreadsheetIcon,
  DownloadIcon,
  FilterIcon,
  BusIcon,
  LayersIcon,
  CheckCircle2Icon,
  UsersIcon,
  Loader2Icon,
  SparklesIcon,
  FileTextIcon,
  GraduationCapIcon,
  UserCheckIcon,
  QrCodeIcon,
  ShieldCheckIcon,
} from "lucide-react";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  events?: Array<{ id: string; name: string; slug?: string | null }>;
  defaultScope?: "MASTER" | "REGISTRATIONS" | "TRANSPORT" | "SUMMARY";
}

export function ExportDataDialog({
  open,
  onOpenChange,
  events = [],
  defaultScope = "MASTER",
}: ExportDialogProps) {
  const [scope, setScope] = useState<"MASTER" | "REGISTRATIONS" | "TRANSPORT" | "SUMMARY">(defaultScope);
  const [format, setFormat] = useState<"XLSX" | "CSV">("XLSX");
  const [eventId, setEventId] = useState<string>("ALL");
  const [transportFilter, setTransportFilter] = useState<"ALL" | "BUS_ONLY" | "SELF">("ALL");
  const [routeFilter, setRouteFilter] = useState<string>("ALL");
  const [checkInFilter, setCheckInFilter] = useState<"ALL" | "CHECKED_IN" | "PENDING">("ALL");
  const [formatFilter, setFormatFilter] = useState<"ALL" | "TEAM" | "SOLO">("ALL");

  const [columns, setColumns] = useState<ExportColumnOptions>({
    contactInfo: true,
    academicInfo: true,
    teamInfo: true,
    transportInfo: true,
    gateTelemetry: true,
    paymentDetails: true,
  });

  const [matchingCount, setMatchingCount] = useState<number | null>(null);
  const [isCounting, setIsCounting] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [, startTransition] = useTransition();

  // Reset default scope when opening
  useEffect(() => {
    if (open) {
      setScope(defaultScope);
    }
  }, [open, defaultScope]);

  // Live matching records prediction
  useEffect(() => {
    if (!open) return;

    let isMounted = true;
    setIsCounting(true);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/admin/export", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId,
            transport: transportFilter,
            route: routeFilter,
            checkIn: checkInFilter,
            format: formatFilter,
            preview: true,
          }),
        });

        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.success) {
            setMatchingCount(json.count);
          }
        }
      } catch (err) {
        console.error("Preview count error:", err);
      } finally {
        if (isMounted) setIsCounting(false);
      }
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [open, eventId, transportFilter, routeFilter, checkInFilter, formatFilter]);

  const handleExport = async () => {
    try {
      setIsExporting(true);

      const res = await fetch("/api/admin/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          transport: transportFilter,
          route: routeFilter,
          checkIn: checkInFilter,
          format: formatFilter,
          preview: false,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch export dataset from server.");
      }

      const json = await res.json();
      if (!json.success || !json.data) {
        throw new Error(json.error?.message || "Invalid export response.");
      }

      const { registrations, summaryList } = json.data;

      // Active filters description for the Excel header banner
      const activeFilterParts: string[] = [];
      if (eventId !== "ALL") {
        const ev = events.find((e) => e.id === eventId);
        activeFilterParts.push(`Event: ${ev?.name || eventId}`);
      }
      if (transportFilter === "BUS_ONLY") activeFilterParts.push("Transport: Bus Shuttle");
      if (transportFilter === "SELF") activeFilterParts.push("Transport: Self Travel");
      if (routeFilter !== "ALL") activeFilterParts.push(`Route: ${routeFilter}`);
      if (checkInFilter === "CHECKED_IN") activeFilterParts.push("Gate: Checked-In");
      if (checkInFilter === "PENDING") activeFilterParts.push("Gate: Awaiting Check-In");
      if (formatFilter === "TEAM") activeFilterParts.push("Format: Teams");
      if (formatFilter === "SOLO") activeFilterParts.push("Format: Solo");

      const exportOptions: ExportOptions = {
        scope,
        format,
        includeKpiSummary: true,
        columns,
        activeFiltersText: activeFilterParts.join(" • ") || "None (All Records)",
      };

      // Generate styled workbook / csv binary
      const { buffer, filename, mimeType } = await generateExportFile(
        registrations,
        summaryList,
        exportOptions
      );

      // Trigger browser download via Blob
      const blob = new Blob([buffer as any], { type: mimeType });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      toast.success(
        format === "XLSX"
          ? `Executive Excel workbook "${filename}" generated successfully!`
          : `CSV export "${filename}" downloaded!`
      );

      onOpenChange(false);
    } catch (err: any) {
      console.error("Export failure:", err);
      toast.error(err?.message || "Failed to generate export file.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] max-w-4xl bg-[#0F0F0F] border border-[#262626] text-white p-0 gap-0 rounded-none shadow-2xl overflow-hidden font-mono text-xs max-h-[88vh] flex flex-col">
        {/* ── Dialog Header Banner ── */}
        <DialogHeader className="p-4 sm:p-6 border-b border-[#262626] bg-[#080808] space-y-1.5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-white bg-white/10 border border-[#404040] px-2 py-0.5 uppercase tracking-wider inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-none bg-white animate-pulse" />
              DATA EXPORT TOOL
            </span>
          </div>
          <DialogTitle className="text-base sm:text-xl font-bold text-white uppercase tracking-tight flex items-center gap-2.5">
            <FileSpreadsheetIcon className="size-5 sm:size-5.5 text-white shrink-0" />
            <span>Export Registrations Data</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
            Choose what data you want to export and how you want it formatted. You can download it as an Excel or CSV file.
          </DialogDescription>
        </DialogHeader>

        {/* ── Modal Scrollable Body ── */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto no-scrollbar flex-1">
          {/* ── 01. Target Scope Selection ── */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#262626] pb-1.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-white bg-white/10 border border-[#404040] px-1.5 py-0.5">
                  01
                </span>
                <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <LayersIcon className="size-3.5 text-white" />
                  Choose What to Export
                </h3>
              </div>
              <span className="font-mono text-[10px] text-zinc-500 uppercase hidden sm:inline">
                Select Report Type
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {[
                {
                  id: "MASTER",
                  label: "Master Workbook",
                  desc: "Complete file with all data in separate tabs",
                  badge: "RECOMMENDED",
                },
                {
                  id: "REGISTRATIONS",
                  label: "Registrations",
                  desc: "List of participants, teams, and contact info",
                },
                {
                  id: "TRANSPORT",
                  label: "Transport Details",
                  desc: "Bus routes, pickup points, and passenger counts",
                },
                {
                  id: "SUMMARY",
                  label: "Event Summary",
                  desc: "Overall attendance and event statistics",
                },
              ].map((item) => {
                const isSelected = scope === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setScope(item.id as any)}
                    className={`p-3 text-left border transition-all relative cursor-pointer flex flex-col justify-between min-h-[82px] ${
                      isSelected
                        ? "border-white bg-white/10 shadow-sm"
                        : "border-[#262626] bg-[#080808] hover:border-zinc-500 hover:bg-[#161616]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <p className={`font-bold text-xs uppercase tracking-tight ${isSelected ? "text-white" : "text-zinc-300"}`}>
                        {item.label}
                      </p>
                      {item.badge ? (
                        <span className="text-[8px] font-bold px-1.5 py-0.5 bg-white/10 text-white border border-white/20 shrink-0">
                          {item.badge}
                        </span>
                      ) : isSelected ? (
                        <span className="size-2 rounded-none bg-white shrink-0 mt-1" />
                      ) : null}
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-snug">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── 02. Detailed Filterization Matrix ── */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#262626] pb-1.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-white bg-white/10 border border-[#404040] px-1.5 py-0.5">
                  02
                </span>
                <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <FilterIcon className="size-3.5 text-white" />
                  Filter Data
                </h3>
              </div>
              <span className="font-mono text-[10px] text-zinc-500 uppercase hidden sm:inline">
                Choose what to include
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-[#080808] border border-[#262626] p-3.5 sm:p-4">
              {/* Event Filter */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-300 block">
                  Select Event:
                </label>
                <Select
                  value={eventId}
                  onValueChange={(val) => {
                    if (val) setEventId(val);
                  }}
                >
                  <SelectTrigger className="w-full h-9">
                    <SelectValue placeholder="[ ALL EVENTS ]" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-zinc-500 border-b border-[#262626] mb-1 flex items-center justify-between">
                      <span>// HOSTED EVENTS</span>
                      <span className="text-white font-bold">{events.length} TOTAL</span>
                    </div>
                    <SelectItem value="ALL">[ ALL EVENTS ]</SelectItem>
                    {events.map((ev) => (
                      <SelectItem key={ev.id} value={ev.id}>
                        {ev.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Team vs Solo Format Filter */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-300 block">
                  Participant Type:
                </label>
                <div className="grid grid-cols-3 h-9 p-0.5 border border-[#262626] bg-[#0F0F0F]">
                  {[
                    { id: "ALL", label: "All Formats" },
                    { id: "TEAM", label: "Teams" },
                    { id: "SOLO", label: "Solo" },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => setFormatFilter(btn.id as any)}
                      className={`h-full text-[10px] font-bold uppercase transition-all cursor-pointer flex items-center justify-center ${
                        formatFilter === btn.id
                          ? "bg-white text-black font-bold shadow-xs"
                          : "text-zinc-400 hover:text-white hover:bg-[#161616]"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transportation Filter */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-300 block">
                  Transport Option:
                </label>
                <div className="grid grid-cols-3 h-9 p-0.5 border border-[#262626] bg-[#0F0F0F]">
                  {[
                    { id: "ALL", label: "All" },
                    { id: "BUS_ONLY", label: "Bus Only" },
                    { id: "SELF", label: "Self Travel" },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => {
                        setTransportFilter(btn.id as any);
                        if (btn.id === "SELF") setRouteFilter("ALL");
                      }}
                      className={`h-full text-[10px] font-bold uppercase transition-all cursor-pointer flex items-center justify-center ${
                        transportFilter === btn.id
                          ? "bg-white text-black font-bold shadow-xs"
                          : "text-zinc-400 hover:text-white hover:bg-[#161616]"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gate Check-in Status Filter */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-300 block">
                  Check-In Status:
                </label>
                <div className="grid grid-cols-3 h-9 p-0.5 border border-[#262626] bg-[#0F0F0F]">
                  {[
                    { id: "ALL", label: "All" },
                    { id: "CHECKED_IN", label: "Checked-In" },
                    { id: "PENDING", label: "Awaiting" },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => setCheckInFilter(btn.id as any)}
                      className={`h-full text-[10px] font-bold uppercase transition-all cursor-pointer flex items-center justify-center ${
                        checkInFilter === btn.id
                          ? "bg-white text-black font-bold shadow-xs"
                          : "text-zinc-400 hover:text-white hover:bg-[#161616]"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specific Bus Route Filter (Full width conditionally) */}
              {transportFilter !== "SELF" && (
                <div className="space-y-1.5 sm:col-span-2 pt-2 border-t border-[#262626]">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <BusIcon className="size-3.5 text-white" />
                    Specific Bus Route:
                  </label>
                  <Select
                    value={routeFilter}
                    onValueChange={(val) => {
                      if (val) setRouteFilter(val);
                    }}
                  >
                    <SelectTrigger className="w-full h-9">
                      <SelectValue placeholder="[ ALL BUS ROUTES & CORRIDORS ]" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 no-scrollbar scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                      <div className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-zinc-500 border-b border-[#262626] mb-1 flex items-center justify-between">
                        <span>// VEL TECH BUS CORRIDORS</span>
                        <span className="text-white font-bold">{VELTECH_BUS_ROUTES.length} ROUTES</span>
                      </div>
                      <SelectItem value="ALL">[ ALL BUS ROUTES &amp; CORRIDORS ]</SelectItem>
                      {VELTECH_BUS_ROUTES.map((r) => (
                        <SelectItem key={r.id} value={r.name}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* ── 03. Column Inclusions (Symmetrical 3x2 Grid) ── */}
          {scope !== "SUMMARY" && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#262626] pb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-white bg-white/10 border border-[#404040] px-1.5 py-0.5">
                    03
                  </span>
                  <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <UsersIcon className="size-3.5 text-white" />
                    Choose Columns to Export
                  </h3>
                </div>
                <span className="font-mono text-[10px] text-zinc-500 uppercase hidden sm:inline">
                  Select information to include
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {[
                  {
                    key: "contactInfo",
                    label: "Contact Information",
                    sub: "Name, email & phone number",
                    icon: UsersIcon,
                  },
                  {
                    key: "academicInfo",
                    label: "College Details",
                    sub: "College name, department & year",
                    icon: GraduationCapIcon,
                  },
                  {
                    key: "teamInfo",
                    label: "Team Information",
                    sub: "Solo/Team, team name & members",
                    icon: UserCheckIcon,
                  },
                  {
                    key: "transportInfo",
                    label: "Transport Details",
                    sub: "Bus route, pickup point & seats",
                    icon: BusIcon,
                  },
                  {
                    key: "gateTelemetry",
                    label: "Check-In Status",
                    sub: "Whether they have arrived",
                    icon: ShieldCheckIcon,
                  },
                  {
                    key: "paymentDetails",
                    label: "Registration ID",
                    sub: "Ticket ID and payment status",
                    icon: QrCodeIcon,
                  },
                ].map((col) => {
                  const isChecked = Boolean((columns as any)[col.key]);
                  const Icon = col.icon;
                  return (
                    <label
                      key={col.key}
                      className={`flex items-start gap-3 p-3 border cursor-pointer transition-all ${
                        isChecked
                          ? "border-white bg-[#161616] shadow-xs"
                          : "border-[#262626] bg-[#080808] opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) =>
                          setColumns((prev) => ({
                            ...prev,
                            [col.key]: Boolean(checked),
                          }))
                        }
                        className="mt-0.5"
                      />
                      <div className="min-w-0 space-y-0.5">
                        <p className="font-bold text-xs text-white uppercase tracking-tight flex items-center gap-1.5">
                          <Icon className="size-3 text-white shrink-0" />
                          <span className="truncate">{col.label}</span>
                        </p>
                        <p className="text-[10px] text-zinc-400 leading-snug">{col.sub}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── 04. Format Selection & Live Preview Card ── */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#262626] pb-1.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-white bg-white/10 border border-[#404040] px-1.5 py-0.5">
                  04
                </span>
                <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <FileTextIcon className="size-3.5 text-white" />
                  Final Preview &amp; Export
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 bg-[#080808] border border-[#262626] p-3.5 sm:p-4">
              {/* Output format buttons */}
              <div className="md:col-span-7 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-300">
                    File Type:
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase hidden sm:inline-block">
                    {format === "XLSX" ? "Excel format (.xlsx)" : "CSV format (.csv)"}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormat("XLSX")}
                    className={`h-11 px-3 text-xs font-bold uppercase border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      format === "XLSX"
                        ? "border-white bg-white/10 text-white font-bold"
                        : "border-[#262626] bg-[#0F0F0F] text-zinc-400 hover:text-white hover:bg-[#161616]"
                    }`}
                  >
                    <FileSpreadsheetIcon className="size-4 text-white shrink-0" />
                    <span className="truncate">Excel (.xlsx)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormat("CSV")}
                    className={`h-11 px-3 text-xs font-bold uppercase border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      format === "CSV"
                        ? "border-white bg-white/10 text-white font-bold"
                        : "border-[#262626] bg-[#0F0F0F] text-zinc-400 hover:text-white hover:bg-[#161616]"
                    }`}
                  >
                    <DownloadIcon className="size-4 text-white shrink-0" />
                    <span className="truncate">CSV (.csv)</span>
                  </button>
                </div>
              </div>

              {/* Matches Prediction block */}
              <div className="md:col-span-5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-300">
                    Estimated Records:
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[9px] text-zinc-400 tracking-wider">
                    <span className="relative flex size-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-none bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-none size-1.5 bg-white"></span>
                    </span>
                    LIVE PREVIEW
                  </span>
                </div>

                <div className="h-11 border border-[#262626] bg-[#0F0F0F] px-3 sm:px-3.5 flex items-center justify-between gap-2.5">
                  {isCounting ? (
                    <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono">
                      <Loader2Icon className="size-4 animate-spin text-white shrink-0" />
                      <span>Counting records...</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`size-6 flex items-center justify-center shrink-0 border ${
                            matchingCount === 0
                              ? "bg-amber-950/60 border-amber-500/40 text-amber-400"
                              : "bg-white/10 border-white/20 text-white"
                          }`}
                        >
                          <CheckCircle2Icon className="size-3.5" />
                        </div>
                        <div className="flex items-baseline gap-1.5 truncate">
                          <span
                            className={`text-base font-bold font-mono tabular-nums ${
                              matchingCount === 0 ? "text-amber-400" : "text-white"
                            }`}
                          >
                            {matchingCount ?? 0}
                          </span>
                          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-tight">
                            Records
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {matchingCount === 0 ? (
                          <span className="text-[9px] font-mono uppercase px-2 py-0.5 border border-amber-500/30 bg-amber-950/40 text-amber-300 font-semibold tracking-wider">
                            No Records
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono uppercase px-2 py-0.5 border border-white/30 bg-white/10 text-white font-semibold tracking-wider">
                            Ready to Download
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Dialog Action Footer ── */}
        <DialogFooter className="p-3.5 sm:p-4 border-t border-[#262626] bg-[#080808] flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
          <div className="text-[10px] text-zinc-400 hidden lg:flex items-center gap-2">
            <span className="size-1.5 rounded-none bg-white" />
            <span>Cleanly formatted for Microsoft Excel and Google Sheets</span>
          </div>

          <div className="flex items-center justify-end gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isExporting}
              className="w-full sm:w-auto h-9 sm:h-10 px-4 border border-[#262626] text-zinc-300 hover:text-white hover:bg-[#161616] transition-colors cursor-pointer font-bold text-xs uppercase disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting || matchingCount === 0}
              className="w-full sm:w-auto h-9 sm:h-10 inline-flex items-center justify-center gap-2 px-6 font-mono text-xs uppercase font-bold text-black bg-white hover:bg-zinc-200 border border-white transition-all cursor-pointer shadow-none disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {isExporting ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Generating {format}...
                </>
              ) : (
                <>
                  <DownloadIcon className="size-4" />
                  Download {format === "XLSX" ? "Excel" : "CSV"}
                </>
              )}
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
