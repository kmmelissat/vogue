"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getVentaDetalle1,
  getCobrosDetalle4,
  getActivosDetalle2,
  getVentaDetalle4,
} from "@/api/reporteVisual";
import type { FechasParams, ReportePorZonaDetalle } from "@/api/types";
import { queryKeys } from "./query-keys";
import type { DashboardDetalles } from "@/lib/server-data";

type UseDashboardDetallesOptions = {
  initialData?: DashboardDetalles | null;
  initialDataUpdatedAt?: number;
};

async function fetchDashboardDetalles(
  params: FechasParams,
  signal: AbortSignal
): Promise<DashboardDetalles> {
  const [ventaZonaRes, cobrosZonaRes, activosTipoRes, ventaTipoRes] =
    await Promise.all([
      getVentaDetalle1(params, signal),
      getCobrosDetalle4(params, signal),
      getActivosDetalle2(params, signal),
      getVentaDetalle4(params, signal),
    ]);

  if (!ventaZonaRes.success) throw new Error(ventaZonaRes.error.message);
  if (!cobrosZonaRes.success) throw new Error(cobrosZonaRes.error.message);
  if (!activosTipoRes.success) throw new Error(activosTipoRes.error.message);
  if (!ventaTipoRes.success) throw new Error(ventaTipoRes.error.message);

  const ventaPorZona =
    "data" in ventaZonaRes ? ventaZonaRes.data.detalle : null;
  const cobrosPorZona =
    "data" in cobrosZonaRes ? cobrosZonaRes.data.detalle : null;
  const activosPorTipoCredito =
    "data" in activosTipoRes ? activosTipoRes.data.detalle : null;
  const ventaPorTipoCredito =
    "data" in ventaTipoRes ? ventaTipoRes.data.detalle : null;

  if (!ventaPorZona?.datos) throw new Error("Datos venta por zona inválidos");
  if (!cobrosPorZona?.datos) throw new Error("Datos cobros por zona inválidos");
  if (!activosPorTipoCredito?.datos)
    throw new Error("Datos activos por tipo crédito inválidos");
  if (!ventaPorTipoCredito?.datos)
    throw new Error("Datos venta por tipo crédito inválidos");

  return {
    ventaPorZona,
    cobrosPorZona,
    activosPorTipoCredito,
    ventaPorTipoCredito,
  };
}

export function useDashboardDetalles(
  fechas: FechasParams | null,
  options: UseDashboardDetallesOptions = {}
) {
  const query = useQuery({
    queryKey: queryKeys.dashboardDetalles(fechas),
    queryFn: ({ signal }) => {
      if (!fechas) throw new Error("Fechas requeridas");
      return fetchDashboardDetalles(fechas, signal);
    },
    enabled: !!fechas,
    initialData: options.initialData ?? undefined,
    initialDataUpdatedAt: options.initialDataUpdatedAt,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
  });

  return {
    ventaPorZona: query.data?.ventaPorZona ?? null,
    cobrosPorZona: query.data?.cobrosPorZona ?? null,
    activosPorTipoCredito: query.data?.activosPorTipoCredito ?? null,
    ventaPorTipoCredito: query.data?.ventaPorTipoCredito ?? null,
    state:
      query.isFetching || query.isLoading
        ? "loading"
        : query.isError
          ? "error"
          : query.isSuccess
            ? "success"
            : "idle",
    error: query.error instanceof Error ? query.error.message : null,
  };
}
