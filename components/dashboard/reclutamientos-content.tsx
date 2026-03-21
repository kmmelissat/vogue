"use client";

import * as React from "react";
import { useReclutamientosDetalles } from "@/hooks/use-reclutamientos-detalles";
import { useReclutamientosKpis } from "@/hooks/use-reclutamientos-kpis";
import { useFechasState } from "@/hooks/use-fechas-state";
import type { ReportePorZonaDetalle, FechasParams } from "@/api/types";
import { DashboardHeader } from "./dashboard-header";
import { ReclutamientosPorTipoPie } from "./charts/reclutamientos-por-tipo-pie";
import { ReclutamientosPorEstatusDonut } from "./charts/reclutamientos-por-estatus-donut";
import { ReclutamientosPorTipoCreditoBar } from "./charts/reclutamientos-por-tipo-credito-bar";
import { ReclutamientosKpiCards } from "./kpis/reclutamientos-kpi-cards";
import { TasaAprobacionGauge } from "./charts/tasa-aprobacion-gauge";
import { KpiQueryError } from "./kpi-query-error";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

function ReporteCardSkeleton() {
  return (
    <Card className="flex h-full flex-col gap-3 overflow-hidden py-4">
      <CardHeader className="px-4 pb-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-1 h-3 w-56" />
      </CardHeader>
      <CardContent className="flex flex-1 items-center justify-center px-4 pt-0">
        <Skeleton className="h-[280px] w-[280px] rounded-full" />
      </CardContent>
    </Card>
  );
}

function GaugeSkeleton() {
  return (
    <Card className="flex h-full flex-col gap-3 overflow-hidden py-4">
      <CardHeader className="px-4 pb-2">
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent className="flex flex-1 items-center justify-center px-4 pt-0">
        <Skeleton className="h-[220px] w-[220px] rounded-full" />
      </CardContent>
    </Card>
  );
}

type ReclutamientosContentProps = {
  initialReportePorTipo: ReportePorZonaDetalle | null;
  initialReportePorEstatus: ReportePorZonaDetalle | null;
  initialReportePorTipoCredito: ReportePorZonaDetalle | null;
  initialReclutamientosData: number | null;
  initialFechas: FechasParams;
  initialError: string | null;
};

export function ReclutamientosContent({
  initialReportePorTipo,
  initialReportePorEstatus,
  initialReportePorTipoCredito,
  initialReclutamientosData,
  initialFechas,
  initialError,
}: ReclutamientosContentProps) {
  const { fechas, isInitialFechas, initialDataTimestamp, onDateChange } =
    useFechasState({ initialFechas });

  const {
    reportePorTipo,
    reportePorEstatus,
    reportePorTipoCredito,
    state,
    error,
    retry,
  } = useReclutamientosDetalles(fechas, {
    initialReportePorTipo: isInitialFechas ? initialReportePorTipo : undefined,
    initialReportePorEstatus: isInitialFechas ? initialReportePorEstatus : undefined,
    initialReportePorTipoCredito: isInitialFechas
      ? initialReportePorTipoCredito
      : undefined,
    initialDataUpdatedAt: isInitialFechas ? initialDataTimestamp : undefined,
  });

  const {
    kpis: reclutamientosKpis,
    state: kpisState,
    error: kpisError,
    retry: retryKpis,
  } = useReclutamientosKpis(fechas, {
    reportePorTipo,
    reportePorEstatus,
    reportePorTipoCredito,
    initialReclutamientosData: isInitialFechas
      ? initialReclutamientosData
      : undefined,
    initialDataUpdatedAt: isInitialFechas ? initialDataTimestamp : undefined,
    isSsrHydration: isInitialFechas,
  });

  const displayError = error ?? initialError;

  return (
    <>
      <DashboardHeader
        initialFechas={initialFechas}
        onDateChange={onDateChange}
      />
      <div className="flex-1 space-y-6 p-6">
        {(state === "idle" || state === "loading") && (
          <>
            <div className="space-y-6">
              <Card className="overflow-hidden border-2">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-10 w-64" />
                      <div className="flex gap-4">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                    <Skeleton className="h-12 w-24" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-3">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
              </div>
            </div>

            <div className="grid items-stretch gap-5 lg:grid-cols-2">
              <ReporteCardSkeleton />
              <ReporteCardSkeleton />
              <ReporteCardSkeleton />
              <ReporteCardSkeleton />
            </div>
          </>
        )}
        {state === "error" && displayError && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-destructive">{displayError}</p>
            <Button variant="outline" size="sm" onClick={() => retry()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reintentar
            </Button>
          </div>
        )}
        {state === "success" && (
          <>
            {kpisState === "error" && kpisError && (
              <KpiQueryError message={kpisError} onRetry={retryKpis} />
            )}
            {kpisState === "success" && reclutamientosKpis && (
              <ReclutamientosKpiCards kpis={reclutamientosKpis} />
            )}

            <div className="grid items-stretch gap-5 lg:grid-cols-2">
              <ReclutamientosPorTipoPie reportePorTipo={reportePorTipo} />
              <ReclutamientosPorEstatusDonut reportePorEstatus={reportePorEstatus} />
            </div>

            <div className="grid items-stretch gap-5 lg:grid-cols-2">
              {kpisState === "success" && reclutamientosKpis ? (
                <TasaAprobacionGauge
                  aprobados={reclutamientosKpis.aprobadosCount}
                  denegados={reclutamientosKpis.denegadosCount}
                  procesando={reclutamientosKpis.procesandoCount}
                />
              ) : kpisState === "loading" ? (
                <GaugeSkeleton />
              ) : null}
              <ReclutamientosPorTipoCreditoBar
                reportePorTipoCredito={reportePorTipoCredito}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
