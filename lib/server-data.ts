import {
  getActivos,
  getCobros,
  getVenta,
  getReclutamientos,
  getVentaDetalle1,
  getVentaDetalle2,
} from "@/api/reporteVisual";
import type { FechasParams, ReportePorZonaDetalle } from "@/api/types";
import type { ReporteKpis } from "@/hooks/use-reporte-data";
import { calculateKpis } from "./kpis-calculator";

export function getDefaultFechas(): FechasParams {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);

  return {
    fecha_inicio: thirtyDaysAgo.toISOString().split("T")[0],
    fecha_fin: now.toISOString().split("T")[0],
  };
}

export async function fetchKpisServer(
  fechas: FechasParams
): Promise<{ kpis: ReporteKpis | null; error: string | null }> {
  try {
    const [activosRes, cobrosRes, ventaRes, reclutamientosRes] = await Promise.all([
      getActivos(fechas),
      getCobros(fechas),
      getVenta(fechas),
      getReclutamientos(fechas),
    ]);

    if (!activosRes.success) throw new Error(activosRes.error.message);
    if (!cobrosRes.success) throw new Error(cobrosRes.error.message);
    if (!ventaRes.success) throw new Error(ventaRes.error.message);
    if (!reclutamientosRes.success) throw new Error(reclutamientosRes.error.message);

    const a = "data" in activosRes ? activosRes.data.detalle : null;
    const c = "data" in cobrosRes ? cobrosRes.data.detalle : null;
    const v = "data" in ventaRes ? ventaRes.data.detalle : null;
    const r = "data" in reclutamientosRes ? reclutamientosRes.data.detalle : 0;

    if (!a || !c || !v) throw new Error("Datos incompletos");

    const kpis = calculateKpis(a, c, v, r);
    return { kpis, error: null };
  } catch (e) {
    return {
      kpis: null,
      error: e instanceof Error ? e.message : "Error al cargar datos",
    };
  }
}

export async function fetchVentaDetallesServer(fechas: FechasParams): Promise<{
  reportePorZona: ReportePorZonaDetalle | null;
  reportePorImpulsadora: ReportePorZonaDetalle | null;
  error: string | null;
}> {
  try {
    const [ventaDetalle1Res, ventaDetalle2Res] = await Promise.all([
      getVentaDetalle1(fechas),
      getVentaDetalle2(fechas),
    ]);

    if (!ventaDetalle1Res.success) {
      throw new Error(ventaDetalle1Res.error.message);
    }
    if (!ventaDetalle2Res.success) {
      throw new Error(ventaDetalle2Res.error.message);
    }

    const reportePorZona = "data" in ventaDetalle1Res ? ventaDetalle1Res.data.detalle : null;
    const reportePorImpulsadora = "data" in ventaDetalle2Res ? ventaDetalle2Res.data.detalle : null;

    if (!reportePorZona || !Array.isArray(reportePorZona.datos)) {
      throw new Error("Datos de zona inválidos");
    }
    if (!reportePorImpulsadora || !Array.isArray(reportePorImpulsadora.datos)) {
      throw new Error("Datos de impulsadora inválidos");
    }

    return { reportePorZona, reportePorImpulsadora, error: null };
  } catch (e) {
    return {
      reportePorZona: null,
      reportePorImpulsadora: null,
      error: e instanceof Error ? e.message : "Error al cargar datos",
    };
  }
}
