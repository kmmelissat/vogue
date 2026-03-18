import {
  getActivos,
  getCobros,
  getVenta,
  getReclutamientos,
  getVentaDetalle1,
  getVentaDetalle2,
  getVentaDetalle3,
  getVentaDetalle4,
  getCobrosDetalle1,
  getCobrosDetalle2,
  getCobrosDetalle3,
  getCobrosDetalle4,
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
    console.log('[Server] 📊 Fetching KPIs:', {
      endpoints: ['activos', 'cobros', 'venta', 'reclutamientos'],
      fechas
    });
    const startTime = performance.now();
    
    const [activosRes, cobrosRes, ventaRes, reclutamientosRes] = await Promise.all([
      getActivos(fechas),
      getCobros(fechas),
      getVenta(fechas),
      getReclutamientos(fechas),
    ]);
    
    const duration = Math.round(performance.now() - startTime);
    console.log(`[Server] ✅ KPIs fetched in ${duration}ms`);

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
  reporteDetalle3: ReportePorZonaDetalle | null;
  reportePorTipoCredito: ReportePorZonaDetalle | null;
  ventaData: any | null;
  error: string | null;
}> {
  try {
    console.log('[Server] 🛒 Fetching Venta + Detalles:', {
      endpoints: [
        'venta (principal)',
        'venta/detalle_1 (zona)',
        'venta/detalle_2 (impulsadora)',
        'venta/detalle_3 (línea)',
        'venta/detalle_4 (tipo crédito)'
      ],
      fechas
    });
    const startTime = performance.now();
    
    const [ventaRes, ventaDetalle1Res, ventaDetalle2Res, ventaDetalle3Res, ventaDetalle4Res] = await Promise.all([
      getVenta(fechas),
      getVentaDetalle1(fechas),
      getVentaDetalle2(fechas),
      getVentaDetalle3(fechas),
      getVentaDetalle4(fechas),
    ]);
    
    const duration = Math.round(performance.now() - startTime);
    console.log(`[Server] ✅ Venta + Detalles fetched in ${duration}ms`);

    if (!ventaRes.success) {
      throw new Error(ventaRes.error.message);
    }

    if (!ventaDetalle1Res.success) {
      throw new Error(ventaDetalle1Res.error.message);
    }
    if (!ventaDetalle2Res.success) {
      throw new Error(ventaDetalle2Res.error.message);
    }
    if (!ventaDetalle3Res.success) {
      throw new Error(ventaDetalle3Res.error.message);
    }
    if (!ventaDetalle4Res.success) {
      throw new Error(ventaDetalle4Res.error.message);
    }

    const ventaData = "data" in ventaRes ? ventaRes.data.detalle : null;
    const reportePorZona = "data" in ventaDetalle1Res ? ventaDetalle1Res.data.detalle : null;
    const reportePorImpulsadora = "data" in ventaDetalle2Res ? ventaDetalle2Res.data.detalle : null;
    const reporteDetalle3 = "data" in ventaDetalle3Res ? ventaDetalle3Res.data.detalle : null;
    const reportePorTipoCredito = "data" in ventaDetalle4Res ? ventaDetalle4Res.data.detalle : null;

    if (!ventaData) {
      throw new Error("Datos de venta principal inválidos");
    }
    if (!reportePorZona || !Array.isArray(reportePorZona.datos)) {
      throw new Error("Datos de zona inválidos");
    }
    if (!reportePorImpulsadora || !Array.isArray(reportePorImpulsadora.datos)) {
      throw new Error("Datos de impulsadora inválidos");
    }
    if (!reporteDetalle3 || !Array.isArray(reporteDetalle3.datos)) {
      throw new Error("Datos de detalle 3 inválidos");
    }
    if (!reportePorTipoCredito || !Array.isArray(reportePorTipoCredito.datos)) {
      throw new Error("Datos de tipo de crédito inválidos");
    }

    return { reportePorZona, reportePorImpulsadora, reporteDetalle3, reportePorTipoCredito, ventaData, error: null };
  } catch (e) {
    return {
      reportePorZona: null,
      reportePorImpulsadora: null,
      reporteDetalle3: null,
      reportePorTipoCredito: null,
      ventaData: null,
      error: e instanceof Error ? e.message : "Error al cargar datos",
    };
  }
}

export async function fetchCobrosDetallesServer(fechas: FechasParams): Promise<{
  reportePorMedio: ReportePorZonaDetalle | null;
  reportePorTipoDocumento: ReportePorZonaDetalle | null;
  reportePorMunicipio: ReportePorZonaDetalle | null;
  reportePorZona: ReportePorZonaDetalle | null;
  cobrosData: any | null;
  error: string | null;
}> {
  try {
    console.log('[Server] 💰 Fetching Cobros + Detalles:', {
      endpoints: [
        'cobros (principal)',
        'cobros/detalle_1 (medio)',
        'cobros/detalle_2 (tipo documento)',
        'cobros/detalle_3 (municipio)',
        'cobros/detalle_4 (zona)'
      ],
      fechas
    });
    const startTime = performance.now();
    
    const [cobrosRes, cobrosDetalle1Res, cobrosDetalle2Res, cobrosDetalle3Res, cobrosDetalle4Res] = await Promise.all([
      getCobros(fechas),
      getCobrosDetalle1(fechas),
      getCobrosDetalle2(fechas),
      getCobrosDetalle3(fechas),
      getCobrosDetalle4(fechas),
    ]);
    
    const duration = Math.round(performance.now() - startTime);
    console.log(`[Server] ✅ Cobros + Detalles fetched in ${duration}ms`);

    if (!cobrosRes.success) {
      throw new Error(cobrosRes.error.message);
    }

    if (!cobrosDetalle1Res.success) {
      throw new Error(cobrosDetalle1Res.error.message);
    }
    if (!cobrosDetalle2Res.success) {
      throw new Error(cobrosDetalle2Res.error.message);
    }
    if (!cobrosDetalle3Res.success) {
      throw new Error(cobrosDetalle3Res.error.message);
    }
    if (!cobrosDetalle4Res.success) {
      throw new Error(cobrosDetalle4Res.error.message);
    }

    const cobrosData = "data" in cobrosRes ? cobrosRes.data.detalle : null;
    const reportePorMedio = "data" in cobrosDetalle1Res ? cobrosDetalle1Res.data.detalle : null;
    const reportePorTipoDocumento = "data" in cobrosDetalle2Res ? cobrosDetalle2Res.data.detalle : null;
    const reportePorMunicipio = "data" in cobrosDetalle3Res ? cobrosDetalle3Res.data.detalle : null;
    const reportePorZona = "data" in cobrosDetalle4Res ? cobrosDetalle4Res.data.detalle : null;

    if (!cobrosData) {
      throw new Error("Datos de cobros principal inválidos");
    }
    if (!reportePorMedio || !Array.isArray(reportePorMedio.datos)) {
      throw new Error("Datos de medio inválidos");
    }
    if (!reportePorTipoDocumento || !Array.isArray(reportePorTipoDocumento.datos)) {
      throw new Error("Datos de tipo documento inválidos");
    }
    if (!reportePorMunicipio || !Array.isArray(reportePorMunicipio.datos)) {
      throw new Error("Datos de municipio inválidos");
    }
    if (!reportePorZona || !Array.isArray(reportePorZona.datos)) {
      throw new Error("Datos de zona inválidos");
    }

    return { reportePorMedio, reportePorTipoDocumento, reportePorMunicipio, reportePorZona, cobrosData, error: null };
  } catch (e) {
    return {
      reportePorMedio: null,
      reportePorTipoDocumento: null,
      reportePorMunicipio: null,
      reportePorZona: null,
      cobrosData: null,
      error: e instanceof Error ? e.message : "Error al cargar datos",
    };
  }
}
