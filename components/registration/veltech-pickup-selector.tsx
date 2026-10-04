"use client";

import { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getVelTechBusRoutes,
  VELTECH_SCHEDULE_NOTE,
  type VelTechRoute,
} from "@/lib/constants/transport";
import {
  BusIcon,
  CheckIcon,
  ChevronDownIcon,
  MapPinIcon,
  ClockIcon,
} from "lucide-react";

type SelectionTarget = "route" | "stop";

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
  const [routes, setRoutes] = useState<VelTechRoute[]>([]);
  const [routeLoadError, setRouteLoadError] = useState<string | null>(null);
  const [selectionTarget, setSelectionTarget] = useState<SelectionTarget | null>(null);

  useEffect(() => {
    let active = true;

    getVelTechBusRoutes()
      .then((loadedRoutes) => {
        if (active) {
          setRoutes(loadedRoutes);
          setRouteLoadError(null);
        }
      })
      .catch((error: unknown) => {
        if (!active) return;
        setRouteLoadError(
          error instanceof Error ? error.message : "Unable to load bus route data."
        );
      });

    return () => {
      active = false;
    };
  }, []);

  // Find current selected route object
  const currentRoute = useMemo(() => {
    return routes.find((route) => route.name === routeValue);
  }, [routeValue, routes]);

  const availableStops = currentRoute?.stops || [];

  const selectRoute = (route: VelTechRoute) => {
    onRouteChange(route.name);
    if (!route.stops.includes(stopValue)) onStopChange("");
    setSelectionTarget(null);
  };

  const selectStop = (stop: string) => {
    onStopChange(stop);
    setSelectionTarget(null);
  };

  return (
    <div className="space-y-4 p-4 rounded-none border border-border bg-background">
      {title && (
        <div className="flex items-center justify-between border-b border-border/80 pb-2.5">
          <div className="flex items-center gap-2">
            <BusIcon className="size-4 text-sky-400" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-foreground">
              {title}
            </span>
          </div>
          {passengerCount && (
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-none border border-sky-500/30 bg-sky-500/10 text-sky-300">
              {passengerCount} Seat{passengerCount > 1 ? "s" : ""} Reserved
            </span>
          )}
        </div>
      )}

      {/* Grid: Route and Stop Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Tier 1: Route Corridor */}
        <div className="space-y-1.5">
          <Label className="font-sans text-xs uppercase tracking-wider text-foreground-secondary font-semibold block">
            1. Vel Tech Route Corridor <span className="text-red-400">*</span>
          </Label>
          <button
            type="button"
            onClick={() => setSelectionTarget("route")}
            disabled={disabled || routes.length === 0}
            aria-haspopup="dialog"
            aria-expanded={selectionTarget === "route"}
            className="h-11 sm:h-10 w-full rounded-none border border-border bg-card px-3 text-foreground font-sans text-base sm:text-xs transition-colors hover:border-blue-500 focus-visible:border-blue-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="flex items-center justify-between gap-2 text-left">
              <span className={`truncate ${routeValue ? "text-foreground" : "text-muted-foreground"}`}>
                {routeValue || (routeLoadError ? "Route data unavailable" : "Select AC or non-AC bus route")}
              </span>
              <ChevronDownIcon className="size-4 shrink-0 text-sky-400" />
            </span>
          </button>
          {routeLoadError && (
            <p role="alert" className="text-xs text-rose-400">
              {routeLoadError}
            </p>
          )}
          {routes.length === 0 && !routeLoadError && (
            <p className="text-xs text-muted-foreground">Loading AC and non-AC routes…</p>
          )}
        </div>

        {/* Tier 2: Designated Boarding Stop */}
        <div className="space-y-1.5">
          <Label className="font-sans text-xs uppercase tracking-wider text-foreground-secondary font-semibold block">
            2. Designated Boarding Stop <span className="text-red-400">*</span>
          </Label>
          <button
            type="button"
            onClick={() => setSelectionTarget("stop")}
            disabled={disabled || !routeValue || availableStops.length === 0}
            aria-haspopup="dialog"
            aria-expanded={selectionTarget === "stop"}
            className="h-11 sm:h-10 w-full rounded-none border border-border bg-card px-3 text-foreground font-sans text-base sm:text-xs transition-colors hover:border-blue-500 focus-visible:border-blue-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="flex items-center justify-between gap-2 text-left">
              <span className={`truncate ${stopValue ? "text-foreground" : "text-muted-foreground"}`}>
                {stopValue || (routeValue ? "Choose boarding stop" : "First select route corridor")}
              </span>
              <ChevronDownIcon className="size-4 shrink-0 text-sky-400" />
            </span>
          </button>
        </div>
      </div>

      <Dialog
        open={selectionTarget !== null}
        onOpenChange={(open) => {
          if (!open) setSelectionTarget(null);
        }}
      >
        <DialogContent className="max-w-xl gap-3 p-4 sm:p-5">
          <DialogHeader className="pr-8">
            <DialogTitle className="font-mono text-sm uppercase tracking-wider text-foreground">
              {selectionTarget === "route" ? "Select a bus route" : "Select a boarding stop"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {selectionTarget === "route"
                ? "Choose an AC or non-AC route."
                : `Choose a stop on ${currentRoute?.name ?? "the selected route"}.`}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[min(65dvh,32rem)] overflow-y-auto overscroll-contain border border-border bg-background p-2 [scrollbar-color:var(--primary)_var(--background)] [scrollbar-width:thin]">
            {selectionTarget === "route"
              ? (["AC", "Non-AC"] as const).map((serviceType) => {
                  const serviceRoutes = routes.filter(
                    (route) => route.serviceType === serviceType
                  );
                  return (
                    <section key={serviceType} className="mb-3 last:mb-0">
                      <h3 className="sticky top-0 z-10 border-b border-border bg-background px-2 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-sky-400">
                        {serviceType} routes ({serviceRoutes.length})
                      </h3>
                      <div className="space-y-1 pt-1">
                        {serviceRoutes.map((route) => (
                          <button
                            key={route.id}
                            type="button"
                            onClick={() => selectRoute(route)}
                            className="flex w-full items-center justify-between gap-3 border border-transparent px-2.5 py-2.5 text-left font-sans text-xs text-foreground transition-colors hover:border-sky-500/40 hover:bg-sky-950/30 focus-visible:border-sky-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-500"
                          >
                            <span>{route.name}</span>
                            {routeValue === route.name && (
                              <CheckIcon className="size-4 shrink-0 text-sky-400" />
                            )}
                          </button>
                        ))}
                      </div>
                    </section>
                  );
                })
              : availableStops.map((stop) => (
                  <button
                    key={stop}
                    type="button"
                    onClick={() => selectStop(stop)}
                    className="flex w-full items-center justify-between gap-3 border border-transparent px-2.5 py-2.5 text-left font-sans text-xs text-foreground transition-colors hover:border-sky-500/40 hover:bg-sky-950/30 focus-visible:border-sky-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-500"
                  >
                    <span>{stop}</span>
                    {stopValue === stop && (
                      <CheckIcon className="size-4 shrink-0 text-sky-400" />
                    )}
                  </button>
                ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Tier 3: Precise Boarding Landmark / Reference Point */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="font-sans text-xs uppercase tracking-wider text-foreground-secondary font-semibold block">
            3. Precise Landmark &amp; Boarding Point <span className="text-red-400">*</span>
          </Label>
          <span className="text-[10px] font-mono text-slate-500">
            Min 3 characters
          </span>
        </div>
        <div className="relative">
          <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-500 pointer-events-none" />
          <Input
            value={landmarkValue}
            onChange={(e) => onLandmarkChange(e.target.value)}
            disabled={disabled}
            placeholder="e.g. Exit Gate B, Opposite Rohini Theatre / Near Indian Bank ATM"
            className="h-11 sm:h-10 pl-9 rounded-none border border-border bg-card text-foreground font-sans text-base sm:text-xs placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <p className="text-[10px] font-mono text-muted-foreground">
          Enter an easily recognizable spot (e.g. Metro gate, shop, pillar number, or ATM) where the bus captain can locate you.
        </p>
      </div>

      {/* Schedule Advisory Box */}
      {showScheduleNotice && (
        <div className="p-3 rounded-none border border-sky-500/30 bg-sky-950/20 text-xs font-mono text-sky-300 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-sky-400 text-[11px]">
            <ClockIcon className="size-3.5" />
            <span>Supplied route details • confirm pickup time</span>
          </div>
          <p className="text-[11px] text-foreground-secondary leading-relaxed font-sans">
            Pickup points and road details are listed for each route.{" "}
            <strong className="text-sky-400 font-mono">{VELTECH_SCHEDULE_NOTE}</strong>. Our student transport coordinator and bus captain will coordinate via mobile.
          </p>
        </div>
      )}
    </div>
  );
}
