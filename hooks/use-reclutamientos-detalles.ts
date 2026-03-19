"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  getReclutamientosDetalle1, 
  getReclutamientosDetalle2, 
  getReclutamientosDetalle3, 
  getReclutamientosDetalle4 
} from "@/api/reporteVisual";
import type { FechasParams, ReportePorZonaDetalle } from "@/api/types";
import { queryKeys } from "./query-keys";

type ReclutamientosDetalles = {
  reportePorTipo: ReportePorZonaDetalle | null;
  reportePorEstatus: ReportePorZonaDetalle | null;
  reporteDetalle3: ReportePorZonaDetalle | null;
  reportePorTipoCredito: ReportePorZonaDetalle | null;
};

type UseReclutamientosDetallesOptions = {
  initialReportePorTipo?: ReportePorZonaDetalle | null;
  initialReportePorEstatus?: ReportePorZonaDetalle | null;
  initialReporteDetalle3?: ReportePorZonaDetalle | null;
  initialReportePorTipoCredito?: ReportePorZonaDetalle | null;
  initialDataUpdatedAt?: number;
};

async function fetchReclutamientosDetalles(
  params: FechasParams,
  signal: AbortSignal,
): Promise<ReclutamientosDetalles> {
  const [detalle1Res, detalle2Res, detalle3Res, detalle4Res] = await Promise.all([
    getReclutamientosDetalle1(params, signal),
    getReclutamientosDetalle2(params, signal),
    getReclutamientosDetalle3(params, signal),
    getReclutamientosDetalle4(params, signal),
  ]);

  if (!detalle1Res.success) {
    throw new Error(detalle1Res.error.message);
  }
  if (!detalle2Res.success) {
    throw new Error(detalle2Res.error.message);
  }
  if (!detalle3Res.success) {
    throw new Error(detalle3Res.error.message);
  }
  if (!detalle4Res.success) {
    throw new Error(detalle4Res.error.message);
  }

  const reportePorTipo =
    "data" in detalle1Res ? detalle1Res.data.detalle : null;
  const reportePorEstatus =
    "data" in detalle2Res ? detalle2Res.data.detalle : null;
  const reporteDetalle3 =
    "data" in detalle3Res ? detalle3Res.data.detalle : null;
  const reportePorTipoCredito =
    "data" in detalle4Res ? detalle4Res.data.detalle : null;

  if (!reportePorTipo || !Array.isArray(reportePorTipo.datos)) {
    throw new Error("Datos de tipo inválidos");
  }
  if (!reportePorEstatus || !Array.isArray(reportePorEstatus.datos)) {
    throw new Error("Datos de estatus inválidos");
  }
  if (!reporteDetalle3 || !Array.isArray(reporteDetalle3.datos)) {
    throw new Error("Datos de detalle 3 inválidos");
  }
  if (!reportePorTipoCredito || !Array.isArray(reportePorTipoCredito.datos)) {
    throw new Error("Datos de tipo de crédito inválidos");
  }

  return { reportePorTipo, reportePorEstatus, reporteDetalle3, reportePorTipoCredito };
}

export function useReclutamientosDetalles(
  fechas: FechasParams | null,
  options: UseReclutamientosDetallesOptions = {},
) {
  const { initialReportePorTipo, initialReportePorEstatus, initialReporteDetalle3, initialReportePorTipoCredito } = options;
  const initialData =
    initialReportePorTipo || initialReportePorEstatus || initialReporteDetalle3 || initialReportePorTipoCredito
      ? {
          reportePorTipo: initialReportePorTipo,
          reportePorEstatus: initialReportePorEstatus,
          reporteDetalle3: initialReporteDetalle3,
          reportePorTipoCredito: initialReportePorTipoCredito,
        }
      : undefined;

  const query = useQuery({
    queryKey: [...queryKeys.reporteKpis(fechas), "reclutamientos-detalles"],
    queryFn: ({ signal }) => {
      if (!fechas) throw new Error("Fechas requeridas");
      return fetchReclutamientosDetalles(fechas, signal);
    },
    enabled: !!fechas,
    initialData,
    initialDataUpdatedAt: options.initialDataUpdatedAt,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
  });

  return {
    reportePorTipo: query.data?.reportePorTipo ?? null,
    reportePorEstatus: query.data?.reportePorEstatus ?? null,
    reporteDetalle3: query.data?.reporteDetalle3 ?? null,
    reportePorTipoCredito: query.data?.reportePorTipoCredito ?? null,
    state: query.isFetching || query.isLoading
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
