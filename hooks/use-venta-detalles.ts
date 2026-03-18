"use client";

import { useQuery } from "@tanstack/react-query";
import { getVentaDetalle1, getVentaDetalle2 } from "@/api/reporteVisual";
import type { FechasParams, ReportePorZonaDetalle } from "@/api/types";
import { queryKeys } from "./query-keys";

type VentaDetalles = {
  reportePorZona: ReportePorZonaDetalle | null;
  reportePorImpulsadora: ReportePorZonaDetalle | null;
};

type UseVentaDetallesOptions = {
  initialReportePorZona?: ReportePorZonaDetalle | null;
  initialReportePorImpulsadora?: ReportePorZonaDetalle | null;
};

async function fetchVentaDetalles(
  params: FechasParams,
  signal: AbortSignal,
): Promise<VentaDetalles> {
  const [ventaDetalle1Res, ventaDetalle2Res] = await Promise.all([
    getVentaDetalle1(params, signal),
    getVentaDetalle2(params, signal),
  ]);

  if (!ventaDetalle1Res.success) {
    throw new Error(ventaDetalle1Res.error.message);
  }
  if (!ventaDetalle2Res.success) {
    throw new Error(ventaDetalle2Res.error.message);
  }

  const reportePorZona =
    "data" in ventaDetalle1Res ? ventaDetalle1Res.data.detalle : null;
  const reportePorImpulsadora =
    "data" in ventaDetalle2Res ? ventaDetalle2Res.data.detalle : null;

  if (!reportePorZona || !Array.isArray(reportePorZona.datos)) {
    throw new Error("Datos de zona inválidos");
  }
  if (!reportePorImpulsadora || !Array.isArray(reportePorImpulsadora.datos)) {
    throw new Error("Datos de impulsadora inválidos");
  }

  return { reportePorZona, reportePorImpulsadora };
}

export function useVentaDetalles(
  fechas: FechasParams | null,
  options: UseVentaDetallesOptions = {},
) {
  const { initialReportePorZona, initialReportePorImpulsadora } = options;
  const initialData =
    initialReportePorZona || initialReportePorImpulsadora
      ? {
          reportePorZona: initialReportePorZona,
          reportePorImpulsadora: initialReportePorImpulsadora,
        }
      : undefined;

  const query = useQuery({
    queryKey: queryKeys.ventaDetalles(fechas),
    queryFn: ({ signal }) => {
      if (!fechas) throw new Error("Fechas requeridas");
      return fetchVentaDetalles(fechas, signal);
    },
    enabled: !!fechas,
    initialData,
    staleTime: 5 * 60 * 1000,
  });

  return {
    reportePorZona: query.data?.reportePorZona ?? null,
    reportePorImpulsadora: query.data?.reportePorImpulsadora ?? null,
    state: query.isLoading
      ? "loading"
      : query.isError
        ? "error"
        : query.isSuccess
          ? "success"
          : "idle",
    error: query.error instanceof Error ? query.error.message : null,
    retry: query.refetch,
    lastUpdated: query.dataUpdatedAt ? new Date(query.dataUpdatedAt) : null,
  };
}
