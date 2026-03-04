"use client";

import * as React from "react";
import { DashboardHeader } from "./dashboard-header";
import { DashboardSkeleton } from "./dashboard-skeleton";
import { KpiCards } from "./kpi-cards";
import { useReporteData } from "@/hooks/use-reporte-data";
import type { FechasParams } from "@/api/types";

export function DashboardPage() {
  const [fechas, setFechas] = React.useState<FechasParams | null>(null);
  const { kpis, state, error } = useReporteData(fechas);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardHeader onDateChange={setFechas} />
      <main className="flex-1 p-6">
        {state === "loading" && <DashboardSkeleton />}
        {state === "error" && (
          <p className="text-destructive py-8 text-center">{error}</p>
        )}
        {state === "success" && kpis && <KpiCards kpis={kpis} />}
      </main>
    </div>
  );
}
