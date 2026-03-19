"use client";

import { useQuery } from "@tanstack/react-query";
import { getReclutamientos } from "@/api/reporteVisual";
import type { FechasParams, ReportePorZonaDetalle } from "@/api/types";
import { queryKeys } from "./query-keys";
import { parseNumberLabel } from "@/lib/utils";

export type ReclutamientosKpis = {
  totalReclutamientos: number;
  reclutamientosPorDia: number;
  dias: number;
  
  // Por tipo
  proCount: number;
  proPct: number;
  ofiCount: number;
  ofiPct: number;
  rdsCount: number;
  rdsPct: number;
  empCount: number;
  empPct: number;
  
  // Por estatus
  aprobadosCount: number;
  aprobadosPct: number;
  procesandoCount: number;
  procesandoPct: number;
  denegadosCount: number;
  denegadosPct: number;
  tasaAprobacion: number;
  
  // Por tipo de crédito
  creCount: number;
  crePct: number;
  conCount: number;
  conPct: number;
  
  // Top performers
  tipoTop: { nombre: string; valor: number } | null;
};

type UseReclutamientosKpisOptions = {
  initialData?: ReclutamientosKpis | null;
  initialReclutamientosData?: number | null;
  reportePorTipo?: ReportePorZonaDetalle | null;
  reportePorEstatus?: ReportePorZonaDetalle | null;
  reporteDetalle3?: ReportePorZonaDetalle | null;
  reportePorTipoCredito?: ReportePorZonaDetalle | null;
  initialDataUpdatedAt?: number;
};

function getTopItem(reporte: ReportePorZonaDetalle | null): { nombre: string; valor: number } | null {
  if (!reporte || !reporte.datos || reporte.datos.length === 0) return null;
  
  const sorted = [...reporte.datos]
    .filter(d => !d.Etiqueta.includes("EMP"))
    .map(d => ({ nombre: d.Etiqueta, valor: parseNumberLabel(d.Valor) }))
    .sort((a, b) => b.valor - a.valor);
  
  return sorted[0] ?? null;
}

async function fetchReclutamientosKpis(
  params: FechasParams,
  signal: AbortSignal,
  detalles: {
    reportePorTipo?: ReportePorZonaDetalle | null;
    reportePorEstatus?: ReportePorZonaDetalle | null;
    reporteDetalle3?: ReportePorZonaDetalle | null;
    reportePorTipoCredito?: ReportePorZonaDetalle | null;
  },
  initialReclutamientosData?: number | null
): Promise<ReclutamientosKpis> {
  let totalReclutamientos = initialReclutamientosData ?? 0;
  
  if (totalReclutamientos === 0) {
    const reclutamientosRes = await getReclutamientos(params, signal);
    if (!reclutamientosRes.success) throw new Error(reclutamientosRes.error.message);
    totalReclutamientos = "data" in reclutamientosRes ? reclutamientosRes.data.detalle : 0;
  }

  const fechaInicio = new Date(params.fecha_inicio);
  const fechaFin = new Date(params.fecha_fin);
  const dias = Math.max(1, Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  const reclutamientosPorDia = totalReclutamientos / dias;

  // Por tipo
  const tipos = detalles.reportePorTipo?.datos ?? [];
  const pro = tipos.find(d => d.Etiqueta === "PRO");
  const ofi = tipos.find(d => d.Etiqueta === "OFI");
  const rds = tipos.find(d => d.Etiqueta === "RDS");
  const emp = tipos.find(d => d.Etiqueta === "EMP");
  
  const proCount = pro ? parseNumberLabel(pro.Valor) : 0;
  const ofiCount = ofi ? parseNumberLabel(ofi.Valor) : 0;
  const rdsCount = rds ? parseNumberLabel(rds.Valor) : 0;
  const empCount = emp ? parseNumberLabel(emp.Valor) : 0;
  
  const totalTipos = proCount + ofiCount + rdsCount + empCount;
  const proPct = totalTipos > 0 ? (proCount / totalTipos) * 100 : 0;
  const ofiPct = totalTipos > 0 ? (ofiCount / totalTipos) * 100 : 0;
  const rdsPct = totalTipos > 0 ? (rdsCount / totalTipos) * 100 : 0;
  const empPct = totalTipos > 0 ? (empCount / totalTipos) * 100 : 0;

  // Por estatus
  const estatus = detalles.reportePorEstatus?.datos ?? [];
  const aprobados = estatus.find(d => d.Etiqueta === "APR");
  const procesando = estatus.find(d => d.Etiqueta === "PRO");
  const denegados = estatus.find(d => d.Etiqueta === "DEN");
  
  const aprobadosCount = aprobados ? parseNumberLabel(aprobados.Valor) : 0;
  const procesandoCount = procesando ? parseNumberLabel(procesando.Valor) : 0;
  const denegadosCount = denegados ? parseNumberLabel(denegados.Valor) : 0;
  
  const totalEstatus = aprobadosCount + procesandoCount + denegadosCount;
  const aprobadosPct = totalEstatus > 0 ? (aprobadosCount / totalEstatus) * 100 : 0;
  const procesandoPct = totalEstatus > 0 ? (procesandoCount / totalEstatus) * 100 : 0;
  const denegadosPct = totalEstatus > 0 ? (denegadosCount / totalEstatus) * 100 : 0;
  const tasaAprobacion = (aprobadosCount + denegadosCount) > 0 
    ? (aprobadosCount / (aprobadosCount + denegadosCount)) * 100 
    : 0;

  // Por tipo de crédito
  const tiposCredito = detalles.reportePorTipoCredito?.datos ?? [];
  const cre = tiposCredito.find(d => d.Etiqueta === "CRE");
  const con = tiposCredito.find(d => d.Etiqueta === "CON");
  
  const creCount = cre ? parseNumberLabel(cre.Valor) : 0;
  const conCount = con ? parseNumberLabel(con.Valor) : 0;
  
  const totalTiposCredito = creCount + conCount;
  const crePct = totalTiposCredito > 0 ? (creCount / totalTiposCredito) * 100 : 0;
  const conPct = totalTiposCredito > 0 ? (conCount / totalTiposCredito) * 100 : 0;

  return {
    totalReclutamientos,
    reclutamientosPorDia,
    dias,
    proCount,
    proPct,
    ofiCount,
    ofiPct,
    rdsCount,
    rdsPct,
    empCount,
    empPct,
    aprobadosCount,
    aprobadosPct,
    procesandoCount,
    procesandoPct,
    denegadosCount,
    denegadosPct,
    tasaAprobacion,
    creCount,
    crePct,
    conCount,
    conPct,
    tipoTop: getTopItem(detalles.reportePorTipo ?? null),
  };
}

export function useReclutamientosKpis(
  fechas: FechasParams | null,
  options: UseReclutamientosKpisOptions = {},
) {
  const { 
    initialData,
    initialReclutamientosData,
    reportePorTipo,
    reportePorEstatus,
    reporteDetalle3,
    reportePorTipoCredito,
  } = options;

  const query = useQuery({
    queryKey: [...queryKeys.reporteKpis(fechas), 'reclutamientos-kpis'],
    queryFn: ({ signal }) => {
      if (!fechas) throw new Error("Fechas requeridas");
      return fetchReclutamientosKpis(fechas, signal, {
        reportePorTipo,
        reportePorEstatus,
        reporteDetalle3,
        reportePorTipoCredito,
      }, initialReclutamientosData);
    },
    enabled: !!fechas,
    initialData: initialData ?? undefined,
    initialDataUpdatedAt: options.initialDataUpdatedAt,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
  });

  return {
    kpis: query.data ?? null,
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
