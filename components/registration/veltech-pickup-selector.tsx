"use client";

import { useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  VELTECH_BUS_ROUTES,
  VELTECH_DEPARTURE_TIME,
  VELTECH_REPORTING_TIME,
} from "@/lib/constants/transport";
import { BusIcon, MapPinIcon, ClockIcon } from "lucide-react";

interface VelTechPickupSelectorProps {
  title?: string;
  routeValue: string;
  stopValue: string;
  landmarkValue: string;
  onRouteChange: (route: string) => void;
  onStopChange: (stop: string) => void;
  onLandmarkChange: (landmark: string) => void;
  disabled?: boolean;
  showScheduleNotice?: boolean;
  passengerCount?: number;
}

export function VelTechPickupSelector({
  title,
  routeValue,
  stopValue,
  landmarkValue,
  onRouteChange,
  onStopChange,
  onLandmarkChange,
  disabled = false,
  showScheduleNotice = true,
  passengerCount,
}: VelTechPickupSelectorProps) {
  // Find current selected route object
  const currentRoute = useMemo(() => {
    return VELTECH_BUS_ROUTES.find((r) => r.name === routeValue);
  }, [routeValue]);

  const availableStops = currentRoute?.stops || [];

  return (
    <div className="space-y-4 p-4 rounded-none border border-[#262626] bg-[#080808]">
      {title && (
        <div className="flex items-center justify-between border-b border-[#262626] pb-2.5">
          <div className="flex items-center gap-2">
            <BusIcon className="size-4 text-white" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-white">
              {title}
            </span>
          </div>
          {passengerCount && (
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-none border border-[#404040] bg-[#161616] text-[#E5E5E5]">
              {passengerCount} Seat{passengerCount > 1 ? "s" : ""} Reserved
            </span>
          )}
        </div>
      )}

      {/* Grid: Route and Stop Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Tier 1: Route Corridor */}
        <div className="space-y-1.5">
          <Label className="font-sans text-xs uppercase tracking-wider text-neutral-300 font-semibold block">
            1. Vel Tech Route Corridor <span className="text-red-400">*</span>
          </Label>
          <Select
            value={routeValue}
            onValueChange={(val) => {
              if (val) {
                onRouteChange(val);
                // Auto reset stop if not valid in new route
                const nextRoute = VELTECH_BUS_ROUTES.find((r) => r.name === val);
                if (nextRoute && !nextRoute.stops.includes(stopValue)) {
                  onStopChange("");
                }
              }
            }}
            disabled={disabled}
          >
            <SelectTrigger className="h-11 sm:h-10 w-full rounded-none border border-[#262626] bg-[#0F0F0F] px-3 text-white font-sans text-base sm:text-xs focus:border-white focus:ring-1 focus:ring-white data-placeholder:text-neutral-500">
              <SelectValue placeholder="Select Vel Tech bus route corridor" />
            </SelectTrigger>
            <SelectContent className="max-h-64 border-[#262626] bg-[#0F0F0F] text-white">
              <div className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#737373] border-b border-[#262626] mb-1 flex items-center justify-between font-mono">
                <span>// VEL TECH CORRIDORS</span>
                <span className="text-white font-bold">{VELTECH_BUS_ROUTES.length} ROUTES</span>
              </div>
              <SelectGroup>
                {VELTECH_BUS_ROUTES.map((route) => (
                  <SelectItem
                    key={route.id}
                    value={route.name}
                    className="rounded-none hover:bg-[#161616] py-2 text-neutral-200"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">{route.name}</span>
                      <span className="text-[10px] font-mono text-[#737373]">
                        {route.corridor}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Tier 2: Designated Boarding Stop */}
        <div className="space-y-1.5">
          <Label className="font-sans text-xs uppercase tracking-wider text-neutral-300 font-semibold block">
            2. Designated Boarding Stop <span className="text-red-400">*</span>
          </Label>
          <Select
            value={stopValue}
            onValueChange={(val) => {
              if (val) onStopChange(val);
            }}
            disabled={disabled || !routeValue}
          >
            <SelectTrigger className="h-11 sm:h-10 w-full rounded-none border border-[#262626] bg-[#0F0F0F] px-3 text-white font-sans text-base sm:text-xs focus:border-white focus:ring-1 focus:ring-white data-placeholder:text-neutral-500 disabled:opacity-50">
              <SelectValue
                placeholder={
                  routeValue ? "Choose major boarding stop" : "First select route corridor"
                }
              />
            </SelectTrigger>
            <SelectContent className="max-h-56 border-[#262626] bg-[#0F0F0F] text-white">
              <div className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#737373] border-b border-[#262626] mb-1 flex items-center justify-between font-mono">
                <span>// BOARDING STOPS</span>
                <span className="text-white font-bold">{availableStops.length} STOPS</span>
              </div>
              <SelectGroup>
                {availableStops.map((stop) => (
                  <SelectItem
                    key={stop}
                    value={stop}
                    className="rounded-none hover:bg-[#161616] py-1.5 text-neutral-200"
                  >
                    {stop}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tier 3: Precise Boarding Landmark / Reference Point */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="font-sans text-xs uppercase tracking-wider text-neutral-300 font-semibold block">
            3. Precise Landmark &amp; Boarding Point <span className="text-red-400">*</span>
          </Label>
          <span className="text-[10px] font-mono text-[#737373]">
            Min 3 characters
          </span>
        </div>
        <div className="relative">
          <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-500 pointer-events-none" />
          <Input
            value={landmarkValue}
            onChange={(e) => onLandmarkChange(e.target.value)}
            disabled={disabled}
            placeholder="e.g. Exit Gate B, Opposite Rohini Theatre / Near Indian Bank ATM"
            className="h-11 sm:h-10 pl-9 rounded-none border border-[#262626] bg-[#0F0F0F] text-white font-sans text-base sm:text-xs placeholder:text-neutral-500 focus:border-white focus:ring-1 focus:ring-white"
          />
        </div>
        <p className="text-[10px] font-mono text-neutral-400">
          Enter an easily recognizable spot (e.g. Metro gate, shop, pillar number, or ATM) where the bus captain can locate you.
        </p>
      </div>

      {/* Schedule Advisory Box */}
      {showScheduleNotice && (
        <div className="p-3 rounded-none border border-[#262626] bg-[#0F0F0F] text-xs font-mono text-neutral-300 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-white text-[11px]">
            <ClockIcon className="size-3.5 text-white" />
            <span>Vel Tech Campus Transit Protocol • {VELTECH_DEPARTURE_TIME}</span>
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
            Vel Tech campus buses commence pickup from designated city routes starting from{" "}
            <strong className="text-white font-mono">6:00 AM onwards</strong>. Please be at your designated landmark by{" "}
            <strong className="text-white font-mono">{VELTECH_REPORTING_TIME}</strong>. Our student transport coordinator and bus captain will coordinate via mobile.
          </p>
        </div>
      )}
    </div>
  );
}
