"use client";

import * as React from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useDateRange } from "@/hooks/use-date-range";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { PeriodSelector } from "./period-selector";
import { Button } from "@/components/ui/button";
import { Moon, Sun, RefreshCw } from "lucide-react";
import type { FechasParams } from "@/api/types";
import { cn } from "@/lib/utils";

export type VistaActiva = "principal" | "personalizable";

function useRelativeTime(date: Date | null): string {
  const [label, setLabel] = React.useState("");

  React.useEffect(() => {
    if (!date) { setLabel(""); return; }

    const update = () => {
      const diffMs = Date.now() - date.getTime();
      const diffMin = Math.floor(diffMs / 60_000);
      if (diffMin < 1) setLabel("Actualizado ahora");
      else if (diffMin === 1) setLabel("Actualizado hace 1 min");
      else setLabel(`Actualizado hace ${diffMin} min`);
    };

    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, [date]);

  return label;
}

export type DashboardHeaderProps = {
  onDateChange?: (params: FechasParams) => void;
  onRefresh?: () => void;
  lastUpdated?: Date | null;
  vistaActiva: VistaActiva;
  onVistaChange: (vista: VistaActiva) => void;
};

export function DashboardHeader({
  onDateChange,
  onRefresh,
  lastUpdated,
  vistaActiva,
  onVistaChange,
}: DashboardHeaderProps) {
  const {
    period,
    dateRange,
    periodLabel,
    periods,
    applyPeriod,
    onDateRangeChange,
  } = useDateRange(onDateChange);

  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const relativeTime = useRelativeTime(lastUpdated ?? null);

  return (
    <header className="flex flex-col gap-4 border-b border-border bg-card px-5 py-5 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <Image
          src="/vogue_logo.svg"
          alt="Vogue"
          width={73}
          height={44}
          className="block h-11 shrink-0 object-contain"
        />
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Vogue dashboard ejecutivo
          </h1>
          <p className="text-sm text-muted-foreground">
            Período: {periodLabel}
            {relativeTime && (
              <span className="ml-3 text-xs opacity-60">{relativeTime}</span>
            )}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Selector de vista */}
        <div className="flex items-center rounded-lg border border-border bg-muted/50 p-0.5">
          <button
            type="button"
            onClick={() => onVistaChange("principal")}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
              vistaActiva === "principal"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Dashboard Principal
          </button>
          <button
            type="button"
            onClick={() => onVistaChange("personalizable")}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
              vistaActiva === "personalizable"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Dashboard Personalizable
          </button>
        </div>

        <PeriodSelector
          period={period}
          periods={periods}
          onPeriodChange={applyPeriod}
        />
        <div className="flex items-center gap-2 border-l border-border pl-2">
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
            numberOfMonths={2}
          />
        </div>
        <div className="flex items-center gap-1 border-l border-border pl-2">
          {onRefresh && vistaActiva === "principal" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              title="Actualizar datos"
              className="h-8 w-8"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            title={isDark ? "Modo claro" : "Modo oscuro"}
            className="h-8 w-8"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
