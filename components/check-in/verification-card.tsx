"use client";

import { useState, useEffect, useMemo } from "react";
import { CheckInResult } from "@/types/registration";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  ShieldCheckIcon,
  AlertTriangleIcon,
  BusIcon,
  UsersIcon,
  CheckIcon,
  ArrowRightIcon,
  CopyIcon,
  EyeIcon,
  ClockIcon,
} from "lucide-react";

interface VerificationCardProps {
  result: CheckInResult;
  onNextScan: () => void;
  onAdmitNow?: () => void;
  isInspectMode?: boolean;
}

export function VerificationCard({
  result,
  onNextScan,
  onAdmitNow,
  isInspectMode = false,
}: VerificationCardProps) {
  const [copied, setCopied] = useState(false);

  // Extract and clean leader name
  const leaderName = result.participantName.trim();

  // Deduplicate other members and exclude leader
  const uniqueOtherMembers = useMemo(() => {
    if (!result.teamMembers || result.teamMembers.length === 0) return [];
    const seen = new Set<string>();
    const filtered: string[] = [];
    result.teamMembers.forEach((raw) => {
      const name = raw.trim();
      if (!name) return;
      if (name.toLowerCase() === leaderName.toLowerCase()) return;
      const lower = name.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        filtered.push(name);
      }
    });
    return filtered;
  }, [result.teamMembers, leaderName]);

  // Local state for absent toggles (default is present)
  const [absentMembers, setAbsentMembers] = useState<Record<string, boolean>>({});

  const toggleMember = (name: string) => {
    setAbsentMembers((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const isMemberPresent = (member: string) => !absentMembers[member];

  // Keyboard shortcut: Space or Enter triggers next scan
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        onNextScan();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNextScan]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(result.registrationNumber);
      setCopied(true);
      toast.success("Pass code copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy code");
    }
  };

  const isDuplicate = Boolean(result.alreadyCheckedIn);
  const presentCount = 1 + uniqueOtherMembers.filter((m) => isMemberPresent(m)).length;
  const totalCount = 1 + uniqueOtherMembers.length;

  return (
    <Card
      className={`rounded-none border font-mono shadow-xl animate-in fade-in slide-in-from-top-3 duration-200 overflow-hidden ${
        isDuplicate
          ? "border-amber-500/80 bg-[#0B0707]"
          : isInspectMode
          ? "border-cyan-500/70 bg-[#070A0D]"
          : "border-[#2E2E2E] bg-[#0A0A0A]"
      }`}
    >
      {/* ── Status Indicator Accent Bar ── */}
      <div
        className={`h-1 w-full ${
          isDuplicate
            ? "bg-amber-500"
            : isInspectMode
            ? "bg-cyan-500"
            : "bg-emerald-500"
        }`}
      />

      {/* ── Minimal Header: Status Badge & Timestamp ── */}
      <CardHeader className="border-b border-[#222222] p-3 sm:p-4 flex flex-row items-center justify-between space-y-0 bg-[#0E0E0E]">
        <div className="flex items-center gap-2">
          {isDuplicate ? (
            <AlertTriangleIcon className="size-4 text-amber-400 shrink-0" />
          ) : isInspectMode ? (
            <EyeIcon className="size-4 text-cyan-400 shrink-0" />
          ) : (
            <ShieldCheckIcon className="size-4 text-emerald-400 shrink-0" />
          )}
          <Badge
            variant={isDuplicate ? "destructive" : "outline"}
            className={`rounded-none text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-0.5 shrink-0 ${
              isDuplicate
                ? "bg-amber-500/20 text-amber-300 border-amber-500/60"
                : isInspectMode
                ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/50"
                : "bg-emerald-500/15 text-emerald-400 border-emerald-500/60"
            }`}
          >
            {isDuplicate ? "⚠ ALREADY CHECKED IN" : isInspectMode ? "◉ INSPECT ONLY" : "● ADMITTED"}
          </Badge>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-[#888888]">
          <ClockIcon className="size-3 text-[#737373]" />
          <span>
            {new Date(result.checkedInAt).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-3.5 sm:p-4 space-y-3 text-xs">
        {/* ── Pass Code Strip with One-Tap Copy ── */}
        <div className="flex items-center justify-between bg-[#121212] border border-[#222222] px-3 py-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[9px] uppercase tracking-wider text-[#737373] font-bold shrink-0">
              PASS:
            </span>
            <span className="text-sm sm:text-base font-black text-white tracking-widest truncate">
              {result.registrationNumber}
            </span>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopyCode}
            className="h-6 px-1.5 rounded-none text-[10px] text-[#A3A3A3] hover:text-white uppercase font-mono cursor-pointer shrink-0"
          >
            {copied ? (
              <CheckIcon className="size-3 text-emerald-400" />
            ) : (
              <CopyIcon className="size-3" />
            )}
          </Button>
        </div>

        {/* ── Candidate & Event Primary Details ── */}
        <div className="space-y-1.5 bg-[#0D0D0D] border border-[#222222] p-3">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[9px] text-[#737373] uppercase font-bold shrink-0">
              CANDIDATE:
            </span>
            <span className="text-sm sm:text-base font-bold text-white text-right truncate">
              {result.participantName}
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-2 border-t border-[#1C1C1C] pt-1.5">
            <span className="text-[9px] text-[#737373] uppercase font-bold shrink-0">
              EVENT:
            </span>
            <span className="text-xs font-semibold text-[#E5E5E5] text-right truncate">
              {result.eventName}
            </span>
          </div>

          {result.college && (
            <div className="flex items-baseline justify-between gap-2 border-t border-[#1C1C1C] pt-1.5">
              <span className="text-[9px] text-[#737373] uppercase font-bold shrink-0">
                COLLEGE:
              </span>
              <span className="text-[11px] text-[#A3A3A3] text-right truncate">
                {result.college} {result.department ? `(${result.department})` : ""}
              </span>
            </div>
          )}
        </div>

        {/* ── Transportation Badge (Only if opted in) ── */}
        {result.transportOptIn && (
          <div className="flex items-center justify-between gap-2 bg-[#121212] border border-[#222222] p-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <BusIcon className="size-3.5 text-white shrink-0" />
              <div className="min-w-0">
                <span className="text-white font-bold text-xs block truncate">
                  {result.pickupRoute || "College Bus Pass"}
                </span>
                {result.pickupStop && (
                  <span className="text-[10px] text-[#888888] block truncate">
                    Stop: {result.pickupStop}
                  </span>
                )}
              </div>
            </div>
            <Badge
              variant="outline"
              className="rounded-none border-[#333333] text-[9px] font-mono shrink-0"
            >
              {result.passengersCount || 1} SEAT{(result.passengersCount || 1) > 1 ? "S" : ""}
            </Badge>
          </div>
        )}

        {/* ── Team Headcount Checklist (Only if team event) ── */}
        {result.teamName && (
          <div className="space-y-2 bg-[#0D0D0D] border border-[#222222] p-2.5 sm:p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] text-[#737373] uppercase font-bold flex items-center gap-1.5 truncate">
                <UsersIcon className="size-3 text-white shrink-0" />
                <span className="truncate">TEAM: {result.teamName.toUpperCase()}</span>
              </span>
              <Badge
                variant="outline"
                className="rounded-none border-[#333333] bg-[#141414] text-[9px] text-white font-mono px-1.5 py-0 shrink-0"
              >
                {presentCount}/{totalCount} Present
              </Badge>
            </div>

            <div className="space-y-1">
              {/* Leader Row (Always Checked, Never Duplicated) */}
              <div className="flex items-center justify-between p-2 bg-[#141414] border border-[#222222]">
                <div className="flex items-center gap-2 min-w-0">
                  <Checkbox
                    checked
                    disabled
                    className="rounded-none border-emerald-500 bg-emerald-500 text-black data-[state=checked]:bg-emerald-500 data-[state=checked]:text-black"
                  />
                  <span className="text-white text-xs font-semibold truncate">
                    {leaderName}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="rounded-none border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-[8px] font-bold px-1 py-0 uppercase shrink-0"
                >
                  LEADER
                </Badge>
              </div>

              {/* Deduplicated Other Team Members */}
              {uniqueOtherMembers.map((member) => {
                const isPresent = isMemberPresent(member);
                return (
                  <div
                    key={member}
                    onClick={() => toggleMember(member)}
                    className={`flex items-center justify-between p-2 border cursor-pointer select-none transition-colors active:scale-[0.99] touch-manipulation ${
                      isPresent
                        ? "bg-[#141414] border-[#2A2A2A]"
                        : "bg-[#080808] border-[#1C1C1C] opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Checkbox
                        checked={isPresent}
                        onCheckedChange={() => toggleMember(member)}
                        className="rounded-none border-[#555555]"
                      />
                      <span
                        className={`text-xs truncate ${
                          isPresent ? "text-white font-medium" : "text-[#737373] line-through"
                        }`}
                      >
                        {member}
                      </span>
                    </div>
                    <span
                      className={`text-[9px] font-mono font-bold uppercase shrink-0 ${
                        isPresent ? "text-emerald-400" : "text-[#737373]"
                      }`}
                    >
                      {isPresent ? "PRESENT" : "ABSENT"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>

      <Separator className="bg-[#222222]" />

      <CardFooter className="p-3 sm:p-4 flex flex-col gap-2 bg-[#0E0E0E]">
        {isInspectMode && onAdmitNow && (
          <Button
            type="button"
            onClick={onAdmitNow}
            className="w-full rounded-none bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs uppercase font-bold h-11 cursor-pointer active:scale-[0.99] transition-transform"
          >
            <CheckIcon className="size-3.5 mr-1.5" />
            <span>[ ADMIT &amp; CHECK-IN ATTENDEE NOW ]</span>
          </Button>
        )}

        <Button
          type="button"
          onClick={onNextScan}
          className="w-full rounded-none bg-white hover:bg-neutral-200 text-black font-mono text-xs sm:text-sm uppercase tracking-wider font-black h-11 sm:h-12 shadow-md cursor-pointer active:scale-[0.99] transition-transform flex items-center justify-center gap-1.5"
        >
          <span>[ + SCAN NEXT ATTENDEE ]</span>
          <ArrowRightIcon className="size-4 shrink-0" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default VerificationCard;
