"use client";

import { useEffect, useState } from "react";
import { getGateStats } from "@/actions/checkin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckInResult } from "@/types/registration";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HistoryIcon, UsersIcon, CheckCircle2Icon } from "lucide-react";

interface GateStatsBarProps {
  recentScans: CheckInResult[];
  shiftCount: number;
}

export function GateStatsBar({ recentScans, shiftCount }: GateStatsBarProps) {
  const [stats, setStats] = useState<{
    totalConfirmed: number;
    totalCheckedIn: number;
    percentage: number;
  }>({
    totalConfirmed: 0,
    totalCheckedIn: 0,
    percentage: 0,
  });

  useEffect(() => {
    let isCancelled = false;

    getGateStats()
      .then((data) => {
        if (!isCancelled) setStats(data);
      })
      .catch(() => {});

    // Refresh stats every 30 seconds
    const interval = setInterval(() => {
      getGateStats()
        .then((data) => {
          if (!isCancelled) setStats(data);
        })
        .catch(() => {});
    }, 30000);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [shiftCount]);

  return (
    <div className="flex items-center justify-between gap-2 p-2 sm:p-2.5 bg-[#080808] border border-[#262626] font-mono text-xs">
      <div className="flex items-center gap-1.5 min-w-0">
        <Badge
          variant="outline"
          className="rounded-none border-[#262626] bg-[#141414] text-white font-mono text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 uppercase shrink-0"
        >
          <UsersIcon className="size-2.5 sm:size-3 mr-1 text-white shrink-0" />
          <span className="hidden sm:inline">GATE: </span>
          <span>
            {stats.totalCheckedIn}/{stats.totalConfirmed} ({stats.percentage}%)
          </span>
        </Badge>

        <Badge
          variant="secondary"
          className="rounded-none text-[#A3A3A3] font-mono text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 uppercase bg-[#181818] hidden xs:inline-flex sm:inline-flex"
        >
          <span>SHIFT: {shiftCount}</span>
        </Badge>
      </div>

      {recentScans.length > 0 && (
        <Dialog>
          <DialogTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 rounded-none border-[#262626] bg-[#121212] text-[#E5E5E5] hover:text-white text-[10px] sm:text-[11px] font-mono shrink-0 cursor-pointer active:scale-95"
              >
                <HistoryIcon className="size-3 mr-1 text-white shrink-0" />
                <span>[ LOG ({recentScans.length}) ]</span>
              </Button>
            }
          />
          <DialogContent className="rounded-none border-[#262626] bg-[#0A0A0A] font-mono text-white max-w-md w-[95vw] sm:w-full p-4 sm:p-6">
            <DialogHeader className="border-b border-[#262626] pb-3">
              <DialogTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <HistoryIcon className="size-4 text-white" />
                <span>Recent Gate Admissions</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-2 max-h-85 overflow-y-auto pr-1">
              {recentScans.map((scan, i) => (
                <div
                  key={`${scan.registrationNumber}-${i}`}
                  className="flex items-center justify-between p-2.5 bg-[#121212] border border-[#262626] text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle2Icon className="size-4 text-emerald-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-white text-[11px] truncate">
                        {scan.participantName}
                      </p>
                      <p className="text-[10px] text-[#737373] truncate">
                        {scan.registrationNumber} • {scan.eventName}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#A3A3A3] shrink-0 ml-2">
                    {new Date(scan.checkedInAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
