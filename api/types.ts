/**
 * Parámetros de fecha requeridos por todos los endpoints de reporte_visual.
 * Formato: YYYY-MM-DD (ej: 2026-02-01)
 */
export type FechasParams = {
  fecha_inicio: string;
  fecha_fin: string;
};

/** Regex para validar formato YYYY-MM-DD */
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function isValidDateFormat(date: string): boolean {
  if (!DATE_REGEX.test(date)) return false;
  const d = new Date(date);
  return !Number.isNaN(d.getTime());
}

export function validateFechasParams(params: FechasParams): {
  valid: boolean;
  error?: string;
} {
  if (!params.fecha_inicio || !params.fecha_fin) {
    return { valid: false, error: "fecha_inicio y fecha_fin son requeridos" };
  }
  if (!isValidDateFormat(params.fecha_inicio)) {
    return {
      valid: false,
      error: "fecha_inicio debe tener formato YYYY-MM-DD (ej: 2026-02-01)",
    };
  }
  if (!isValidDateFormat(params.fecha_fin)) {
    return {
      valid: false,
      error: "fecha_fin debe tener formato YYYY-MM-DD (ej: 2026-02-01)",
    };
  }
  if (new Date(params.fecha_inicio) > new Date(params.fecha_fin)) {
    return {
      valid: false,
      error: "fecha_inicio debe ser anterior o igual a fecha_fin",
    };
  }
  return { valid: true };
}

export type ApiError = {
  message: string;
  statusCode?: number;
  code?: string;
  originalError?: unknown;
};

export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError };
