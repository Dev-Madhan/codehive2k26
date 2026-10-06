"use client";

import { useMemo, useState } from "react";
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
import { BusIcon, MapPinIcon, ClockIcon, SearchIcon, XIcon } from "lucide-react";

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
  const [routeSearch, setRouteSearch] = useState("");
  const [stopSearch, setStopSearch] = useState("");

  // Find current selected route object
  const currentRoute = useMemo(() => {
    return VELTECH_BUS_ROUTES.find((r) => r.name === routeValue);
  }, [routeValue]);

  // Filter routes based on search term (name, area, bus number, or stops inside corridor)
  const filteredRoutes = useMemo(() => {
    if (!routeSearch.trim()) return VELTECH_BUS_ROUTES;
    const q = routeSearch.toLowerCase().trim();
    return VELTECH_BUS_ROUTES.filter((r) => {
      return (
        r.name.toLowerCase().includes(q) ||
        r.area.toLowerCase().includes(q) ||
        r.busNumber.toLowerCase().includes(q) ||
        r.corridor.toLowerCase().includes(q)
      );
    });
  }, [routeSearch]);

  const availableStops = currentRoute?.stops || [];

  // Filter stops based on search term
  const filteredStops = useMemo(() => {
    if (!stopSearch.trim()) return availableStops;
    const q = stopSearch.toLowerCase().trim();
    return availableStops.filter((s) => s.toLowerCase().includes(q));
  }, [availableStops, stopSearch]);

  return (
    <div className="space-y-3.5 sm:space-y-4 p-3.5 sm:p-4 rounded-none border border-[#262626] bg-[#080808]">
      {title && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-[#262626] pb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <BusIcon className="size-4 text-white shrink-0" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-white truncate">
              {title}
            </span>
          </div>
          {passengerCount && (
            <span className="self-start sm:self-auto text-[10px] font-mono font-semibold px-2 py-0.5 rounded-none border border-[#404040] bg-[#161616] text-[#E5E5E5] shrink-0">
              {passengerCount} Seat{passengerCount > 1 ? "s" : ""} Reserved
            </span>
          )}
        </div>
      )}

      {/* Grid: Route and Stop Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
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
            <SelectTrigger className="h-11 sm:h-10 w-full min-w-0 rounded-none border border-[#262626] bg-[#0F0F0F] px-3 text-white font-sans text-base sm:text-xs focus:border-white focus:ring-1 focus:ring-white data-placeholder:text-neutral-500 overflow-x-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <SelectValue placeholder="Select Vel Tech bus route corridor" />
            </SelectTrigger>
            <SelectContent
              className="max-h-72"
              header={
                <div className="bg-[#0F0F0F] p-2 space-y-1.5">
                  <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-[#737373] font-mono px-0.5">
                    <span>// VEL TECH CORRIDORS</span>
                    <span className="text-white font-bold">{filteredRoutes.length} / {VELTECH_BUS_ROUTES.length} ROUTES</span>
                  </div>
                  <div className="relative">
                    <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-neutral-400 pointer-events-none" />
                    <input
                      type="text"
                      value={routeSearch}
                      onChange={(e) => setRouteSearch(e.target.value)}
                      onKeyDown={(e) => e.stopPropagation()}
                      placeholder="Search routes or areas (e.g. V6, Saidapet)..."
                      className="w-full h-8 pl-8 pr-6 text-xs font-mono bg-[#141414] border border-[#262626] text-white placeholder:text-neutral-500 focus:outline-none focus:border-white rounded-none"
                    />
                    {routeSearch && (
                      <button
                        type="button"
                        onClick={() => setRouteSearch("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                      >
                        <XIcon className="size-3" />
                      </button>
                    )}
                  </div>
                </div>
              }
            >
              {filteredRoutes.length === 0 ? (
                <div className="py-4 text-center text-xs font-mono text-neutral-500">
                  No matching route corridors found
                </div>
              ) : (
                <SelectGroup>
                  {filteredRoutes.map((route) => (
                    <SelectItem
                      key={route.id}
                      value={route.name}
                      className="rounded-none hover:bg-[#161616] py-2 px-2.5 text-neutral-200 border-b border-[#1A1A1A] last:border-b-0 cursor-pointer"
                    >
                      <div className="flex flex-col min-w-0 w-full gap-1 py-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="bg-white text-black font-mono font-bold text-[9px] px-1.5 py-0.5 tracking-wider shrink-0">
                              {route.busNumber || "BUS"}
                            </span>
                            <span className="font-bold text-white text-xs truncate">
                              {route.area}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                            Departs {route.departureTime}
                          </span>
                        </div>
                        <div className="overflow-x-auto whitespace-nowrap scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden touch-pan-x">
                          <span className="text-[10px] font-mono text-neutral-400 whitespace-nowrap tracking-wide">
                            {route.corridor}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}
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
            <SelectTrigger className="h-11 sm:h-10 w-full min-w-0 rounded-none border border-[#262626] bg-[#0F0F0F] px-3 text-white font-sans text-base sm:text-xs focus:border-white focus:ring-1 focus:ring-white data-placeholder:text-neutral-500 disabled:opacity-50 overflow-x-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <SelectValue
                placeholder={
                  routeValue ? "Choose major boarding stop" : "First select route corridor"
                }
              />
            </SelectTrigger>
            <SelectContent
              className="max-h-64"
              header={
                <div className="bg-[#0F0F0F] p-2 space-y-1.5">
                  <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-[#737373] font-mono px-0.5">
                    <span>// BOARDING STOPS</span>
                    <span className="text-white font-bold">{filteredStops.length} / {availableStops.length} STOPS</span>
                  </div>
                  {availableStops.length > 8 && (
                    <div className="relative">
                      <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-neutral-400 pointer-events-none" />
                      <input
                        type="text"
                        value={stopSearch}
                        onChange={(e) => setStopSearch(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                        placeholder="Filter stops..."
                        className="w-full h-8 pl-8 pr-6 text-xs font-mono bg-[#141414] border border-[#262626] text-white placeholder:text-neutral-500 focus:outline-none focus:border-white rounded-none"
                      />
                      {stopSearch && (
                        <button
                          type="button"
                          onClick={() => setStopSearch("")}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                        >
                          <XIcon className="size-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              }
            >
              {filteredStops.length === 0 ? (
                <div className="py-4 text-center text-xs font-mono text-neutral-500">
                  No matching stops found
                </div>
              ) : (
                <SelectGroup>
                  {filteredStops.map((stop, idx) => (
                    <SelectItem
                      key={stop}
                      value={stop}
                      className="rounded-none hover:bg-[#161616] py-1.5 px-2.5 text-neutral-200 border-b border-[#1A1A1A] last:border-b-0 cursor-pointer"
                    >
                      <div className="overflow-x-auto whitespace-nowrap scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden touch-pan-x w-full flex items-center gap-2">
                        <span className="text-[10px] font-mono text-neutral-500 shrink-0">
                          {String(idx + 1).padStart(2, "0")}.
                        </span>
                        <span className="whitespace-nowrap text-xs text-white">{stop}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Selected Route Info Card */}
      {currentRoute && (
        <div className="p-3 border border-[#262626] bg-[#0A0A0A] space-y-1.5 font-mono text-[11px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-[#1F1F1F] pb-1.5">
            <div className="flex items-center gap-2">
              <span className="bg-white text-black font-bold px-1.5 py-0.5 text-[10px] tracking-wider uppercase shrink-0">
                BUS {currentRoute.busNumber || "TRANSIT"}
              </span>
              <span className="text-white font-semibold truncate">{currentRoute.area} Sector</span>
            </div>
            <div className="text-[#A3A3A3] text-[10px] shrink-0">
              Origin: <span className="text-white font-bold">{currentRoute.departureTime}</span> &bull; Campus: <span className="text-white font-bold">{currentRoute.arrivalTime}</span>
            </div>
          </div>
          <div className="overflow-x-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <p className="text-[10px] text-[#A3A3A3] whitespace-nowrap leading-relaxed">
              Corridor: {currentRoute.corridor}
            </p>
          </div>
        </div>
      )}

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
            className="h-11 sm:h-10 pl-9 rounded-none border border-[#262626] bg-[#0F0F0F] text-white font-sans text-base sm:text-sm placeholder:text-neutral-500 focus:border-white focus:ring-1 focus:ring-white"
          />
        </div>
        <p className="hidden sm:block text-[10px] font-mono text-neutral-400 leading-normal">
          Enter an easily recognizable spot (e.g. Metro gate, shop, pillar number, or ATM) where the bus captain can locate you.
        </p>
      </div>

      {/* Schedule Advisory Box */}
      {showScheduleNotice && (
        <div className="p-2.5 sm:p-3 rounded-none border border-[#262626] bg-[#0F0F0F] text-xs font-mono text-neutral-300 space-y-1 sm:space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-white text-[10px] sm:text-[11px]">
            <ClockIcon className="size-3.5 text-white shrink-0" />
            <span>Vel Tech Campus Transit Protocol &bull; {VELTECH_DEPARTURE_TIME}</span>
          </div>
          {/* Mobile concise note */}
          <p className="sm:hidden text-[11px] text-neutral-400 font-sans leading-normal">
            Pickup starts from <strong className="text-white font-mono">{VELTECH_DEPARTURE_TIME}</strong>. Report <strong className="text-white font-mono">{VELTECH_REPORTING_TIME}</strong>.
          </p>
          {/* Desktop full note */}
          <p className="hidden sm:block text-[11px] text-neutral-400 leading-relaxed font-sans">
            Vel Tech campus buses commence pickup from designated city routes starting from{" "}
            <strong className="text-white font-mono">{VELTECH_DEPARTURE_TIME}</strong>. Please report to your designated boarding stop{" "}
            <strong className="text-white font-mono">{VELTECH_REPORTING_TIME}</strong>. Our student transport coordinator and bus captain will coordinate via mobile.
          </p>
        </div>
      )}
    </div>
  );
}

export default VelTechPickupSelector;

