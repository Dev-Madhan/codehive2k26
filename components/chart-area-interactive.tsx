"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DashboardChartPoint } from "@/types/dashboard";

export const description = "Interactive CodeHive registration telemetry area chart";

const chartConfig = {
  registrations: {
    label: "Registrations",
    color: "#FFFFFF",
  },
  checkIns: {
    label: "Gate Check-Ins",
    color: "#737373",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive({
  data: liveData,
}: {
  data?: DashboardChartPoint[];
}) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("30d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  // Fallback data if liveData is empty
  const baseData = React.useMemo(() => {
    if (liveData && liveData.length > 0) {
      return liveData;
    }
    // Generate a default 30-day baseline leading to today
    const now = new Date();
    const fallback: DashboardChartPoint[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      fallback.push({
        date: d.toISOString().split("T")[0],
        registrations: 0,
        checkIns: 0,
      });
    }
    return fallback;
  }, [liveData]);

  const filteredData = React.useMemo(() => {
    if (!baseData || baseData.length === 0) return [];

    let daysToInclude = 30;
    if (timeRange === "7d") daysToInclude = 7;
    if (timeRange === "90d") daysToInclude = 90;

    if (baseData.length <= daysToInclude) {
      return baseData;
    }

    return baseData.slice(-daysToInclude);
  }, [baseData, timeRange]);

  return (
    <Card className="@container/card rounded-none border border-[#262626] bg-[#0F0F0F] shadow-none max-w-full overflow-hidden py-0 gap-1 sm:gap-2">
      <CardHeader className="p-3 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
        <div className="space-y-0.5 sm:space-y-1">
          <CardTitle className="font-mono font-bold text-white text-sm sm:text-base flex items-center gap-2">
            <span>&gt; Registration Telemetry &amp; Gate Influx</span>
          </CardTitle>
          <CardDescription className="font-mono text-[11px] sm:text-xs text-[#A3A3A3]">
            <span className="hidden @[540px]/card:block">
              Daily candidate registration velocity and verified gate admission flow
            </span>
            <span className="@[540px]/card:hidden">Registration &amp; gate influx</span>
          </CardDescription>
        </div>
        <CardAction className="self-start sm:self-auto">
          <div className="hidden @[640px]/card:flex items-center gap-1.5 font-mono">
            {[
              { value: "90d", label: "90 Days" },
              { value: "30d", label: "30 Days" },
              { value: "7d", label: "7 Days" },
            ].map((item) => {
              const isActive = timeRange === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setTimeRange(item.value)}
                  className={`px-2.5 py-1 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer rounded-none border ${
                    isActive
                      ? "bg-white text-black border-white font-bold shadow-sm"
                      : "bg-[#080808] text-[#A3A3A3] border-[#262626] hover:bg-[#161616] hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <Select
            value={timeRange}
            onValueChange={(value) => {
              if (value !== null) {
                setTimeRange(value);
              }
            }}
          >
            <SelectTrigger
              className="flex w-32 sm:w-36 rounded-none border-[#262626] bg-[#080808] font-mono text-xs text-[#E5E5E5] **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[640px]/card:hidden"
              size="sm"
              aria-label="Select a timeframe"
            >
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-[#262626] bg-[#0F0F0F] font-mono text-xs text-[#E5E5E5]">
              <SelectItem value="90d" className="rounded-none hover:bg-[#161616]">
                90 Days
              </SelectItem>
              <SelectItem value="30d" className="rounded-none hover:bg-[#161616]">
                30 Days
              </SelectItem>
              <SelectItem value="7d" className="rounded-none hover:bg-[#161616]">
                7 Days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-1.5 sm:px-5 pt-0 sm:pt-0 pb-2.5 sm:pb-3.5">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[190px] sm:h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillRegistrations" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#FFFFFF"
                  stopOpacity={0.45}
                />
                <stop
                  offset="95%"
                  stopColor="#FFFFFF"
                  stopOpacity={0.02}
                />
              </linearGradient>
              <linearGradient id="fillCheckIns" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#737373"
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor="#737373"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#262626" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={28}
              stroke="#737373"
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={{ stroke: "#FFFFFF", strokeWidth: 1, strokeDasharray: "2 2" }}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="checkIns"
              type="monotone"
              fill="url(#fillCheckIns)"
              stroke="#737373"
              strokeWidth={1.5}
              stackId="a"
            />
            <Area
              dataKey="registrations"
              type="monotone"
              fill="url(#fillRegistrations)"
              stroke="#FFFFFF"
              strokeWidth={2}
              stackId="b"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
