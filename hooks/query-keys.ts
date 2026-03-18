import type { FechasParams } from "@/api/types";

/**
 * Centraliza todas las query keys para mantener consistencia
 * y facilitar invalidación de caché.
 */
export const queryKeys = {
  /**
   * Key para los KPIs del reporte principal
   * @example ["reporte", "kpis", { fecha_inicio: "2026-03-01", fecha_fin: "2026-03-31" }]
   */
  reporteKpis: (fechas: FechasParams | null) => 
    ["reporte", "kpis", fechas] as const,
  
  /**
   * Key para los detalles de venta (zona + impulsadora)
   * @example ["venta", "detalles", { fecha_inicio: "2026-03-01", fecha_fin: "2026-03-31" }]
   */
  ventaDetalles: (fechas: FechasParams | null) => 
    ["venta", "detalles", fechas] as const,
};
