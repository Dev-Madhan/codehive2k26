"use client";

import { useState } from "react";
import { CheckInResult } from "@/types/registration";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ShieldCheckIcon,
  AlertTriangleIcon,
  ClockIcon,
  BusIcon,
  UsersIcon,
  UserCheckIcon,
  CheckIcon,
  ArrowRightIcon,
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
  // Local state to keep track of team members physically present
  const [presentMembers, setPresentMembers] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (result.teamMembers) {
      result.teamMembers.forEach((m) => {
        initial[m] = true;
      });
    }
    return initial;
  });

  const toggleMember = (name: string) => {
    setPresentMembers((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const isDuplicate = Boolean(result.alreadyCheckedIn);

  return (
    <Card
      className={`rounded-none border-2 font-mono shadow-2xl animate-in fade-in zoom-in-95 duration-200 ${
        isDuplicate
          ? "border-amber-500/80 bg-[#0F0808]"
          : "border-white/80 bg-[#080808]"
      }`}
    >
      {/* ── Status Header ── */}
      <CardHeader className="border-b border-[#262626] p-3 sm:p-4 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2 min-w-0">
          {isDuplicate ? (
            <AlertTriangleIcon className="size-5 text-amber-400 shrink-0" />
          ) : (
            <ShieldCheckIcon className="size-5 text-white shrink-0" />
          )}
          <div className="min-w-0">
            <span className="text-xs font-bold uppercase tracking-wider text-white block truncate">
              {isDuplicate
                ? "Duplicate Pass Warning"
                : isInspectMode
                ? "Pass Inspected • Active"
                : "Pass Verified • Admitted"}
            </span>
            <span className="text-[10px] text-[#737373] block truncate">
              {isDuplicate
                ? "This pass was already scanned for entry"
                : isInspectMode
                ? "Candidate details verified in inspect mode"
                : "Candidate officially checked into event"}
            </span>
          </div>
        </div>

        <Badge
          variant={isDuplicate ? "destructive" : "outline"}
          className={`rounded-none text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 shrink-0 ${
            isDuplicate
              ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
              : isInspectMode
              ? "bg-[#1C1C1C] text-white border-white/40"
              : "bg-white text-black border-white"
          }`}
        >
          {isDuplicate ? "ALREADY CHECKED IN" : isInspectMode ? "INSPECT ONLY" : "ATTENDED"}
        </Badge>
      </CardHeader>

      <CardContent className="p-3 sm:p-5 space-y-3 text-xs">
        {/* Pass Code & Attendee Name */}
        <div className="flex items-baseline justify-between gap-1 border-b border-[#262626]/80 pb-2">
          <span className="text-[#737373] uppercase text-[10px] shrink-0">Pass Code:</span>
          <span className="text-base sm:text-xl font-bold text-white tracking-widest text-right">
            {result.registrationNumber}
          </span>
        </div>

        <div className="flex items-baseline justify-between gap-1 border-b border-[#262626]/80 pb-2">
          <span className="text-[#737373] uppercase text-[10px] shrink-0">Candidate:</span>
          <span className="font-bold text-white text-sm sm:text-base text-right truncate">
            {result.participantName}
          </span>
        </div>

        <div className="flex items-baseline justify-between gap-1 border-b border-[#262626]/80 pb-2">
          <span className="text-[#737373] uppercase text-[10px] shrink-0">Event:</span>
          <span className="font-semibold text-[#E5E5E5] text-right truncate">{result.eventName}</span>
        </div>

        {result.college && (
          <div className="flex items-baseline justify-between gap-1 border-b border-[#262626]/80 pb-2">
            <span className="text-[#737373] uppercase text-[10px] shrink-0">College:</span>
            <span className="text-[#A3A3A3] text-right text-[11px] sm:text-xs truncate">
              {result.college} {result.department ? `(${result.department})` : ""}
            </span>
          </div>
        )}

        {/* Transportation Route Badge */}
        {result.transportOptIn && (
          <div className="p-2.5 bg-[#141414] border border-[#262626] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <BusIcon className="size-4 text-white shrink-0" />
              <div className="min-w-0">
                <span className="text-[9px] uppercase text-[#737373] block">College Bus Pass:</span>
                <span className="text-white font-bold text-xs truncate block">
                  {result.pickupRoute || "Assigned Bus Route"}
                </span>
                {result.pickupStop && (
                  <span className="text-[10px] text-[#A3A3A3] block truncate">
                    Stop: {result.pickupStop}
                  </span>
                )}
              </div>
            </div>
            <Badge variant="outline" className="rounded-none border-white/40 text-[9px] sm:text-[10px] font-mono shrink-0">
              {result.passengersCount || 1} SEAT{(result.passengersCount || 1) > 1 ? "S" : ""}
            </Badge>
          </div>
        )}

        {/* Team Details & Member Headcount Checkbox Roster */}
        {result.teamName && (
          <div className="space-y-2 pt-1 border-b border-[#262626]/80 pb-3">
            <div className="flex items-center justify-between">
              <span className="text-[#737373] uppercase text-[10px] flex items-center gap-1.5 truncate">
                <UsersIcon className="size-3 text-white shrink-0" />
                <span className="truncate">Team: {result.teamName.toUpperCase()}</span>
              </span>
              <span className="text-[10px] text-[#A3A3A3] shrink-0">
                {Object.values(presentMembers).filter(Boolean).length + 1}/{(result.teamMembers?.length || 0) + 1} Present
              </span>
            </div>

            {result.teamMembers && result.teamMembers.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="text-[9px] text-[#737373] uppercase">Gate Headcount Checklist:</div>
                <div className="flex items-center gap-2 p-2 bg-[#121212] border border-[#262626]">
                  <Checkbox checked disabled className="rounded-none border-white" />
                  <span className="text-white text-xs font-semibold truncate">{result.participantName}</span>
                  <Badge variant="outline" className="rounded-none text-[8px] px-1 py-0 ml-auto shrink-0">
                    LEADER
                  </Badge>
                </div>

                {result.teamMembers.map((member, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggleMember(member)}
                    className="flex items-center gap-2 p-2 bg-[#121212] border border-[#262626] cursor-pointer hover:border-[#404040] active:bg-[#181818] touch-manipulation"
                  >
                    <Checkbox
                      checked={Boolean(presentMembers[member])}
                      onCheckedChange={() => toggleMember(member)}
                      className="rounded-none border-[#737373]"
                    />
                    <span className="text-white text-xs truncate">{member}</span>
                    <span className="text-[9px] text-[#737373] ml-auto shrink-0">
                      {presentMembers[member] ? "PRESENT" : "ABSENT"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Timestamp & Auditor Information */}
        <div className="flex items-center justify-between text-[10px] text-[#737373] pt-1">
          <span className="flex items-center gap-1">
            <ClockIcon className="size-3 shrink-0" />
            Time: {new Date(result.checkedInAt).toLocaleTimeString("en-IN")}
          </span>
          {result.checkedInBy && (
            <span className="flex items-center gap-1 text-[#A3A3A3] truncate">
              <UserCheckIcon className="size-3 shrink-0" />
              Staff: {result.checkedInBy}
            </span>
          )}
        </div>
      </CardContent>

      <Separator className="bg-[#262626]" />

      <CardFooter className="p-3 sm:p-4 flex flex-col sm:flex-row gap-2">
        {isInspectMode && onAdmitNow && (
          <Button
            type="button"
            onClick={onAdmitNow}
            className="w-full rounded-none bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs uppercase font-bold h-11 sm:h-12 cursor-pointer active:scale-[0.99] transition-transform"
          >
            <CheckIcon className="size-3.5 mr-1.5" />
            <span>[ ADMIT &amp; CHECK-IN ATTENDEE NOW ]</span>
          </Button>
        )}

        <Button
          type="button"
          onClick={onNextScan}
          className="w-full rounded-none bg-white hover:bg-neutral-200 text-black font-mono text-xs sm:text-sm uppercase tracking-wider font-bold h-11 sm:h-12 shadow-md cursor-pointer active:scale-[0.99] transition-transform"
        >
          <span>[ + SCAN NEXT ATTENDEE ]</span>
          <ArrowRightIcon className="size-3.5 ml-1.5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
