import { API_ENDPOINTS } from "./constants";
import { apiGet } from "./client";
import type { FechasParams } from "./types";
import { validateFechasParams } from "./types";

type ReporteResponse = unknown;

function createReporteFetcher(
  endpoint: string,
) {
  return async (params: FechasParams) => {
    const validation = validateFechasParams(params);
    if (!validation.valid) {
      return {
        success: false as const,
        error: {
          message: validation.error ?? "Parámetros inválidos",
          code: "VALIDATION_ERROR",
        },
      };
    }
    return apiGet<ReporteResponse>(endpoint, params);
  };
}

/**
 * Obtiene el reporte de activos para el rango de fechas indicado.
 */
export const getActivos = createReporteFetcher(API_ENDPOINTS.reporteVisual.activos);

/**
 * Obtiene el reporte de cobros para el rango de fechas indicado.
 */
export const getCobros = createReporteFetcher(API_ENDPOINTS.reporteVisual.cobros);

/**
 * Obtiene el reporte de venta para el rango de fechas indicado.
 */
export const getVenta = createReporteFetcher(API_ENDPOINTS.reporteVisual.venta);

/**
 * Obtiene el reporte de reclutamientos para el rango de fechas indicado.
 */
export const getReclutamientos = createReporteFetcher(
  API_ENDPOINTS.reporteVisual.reclutamientos,
);
