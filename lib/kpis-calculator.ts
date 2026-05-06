import type { ActivosDetalle, CobrosDetalle, VentaDetalle } from "@/api/types";
import { parseNumberLabel } from "@/lib/utils";
import type { ReporteKpis } from "@/hooks/use-reporte-data";

/**
 * Calcula todos los KPIs derivados a partir de los datos de activos, cobros y venta.
 * Esta función pura se usa tanto en server-side como client-side.
 */
export function calculateKpis(
  activos: ActivosDetalle,
  cobros: CobrosDetalle,
  venta: VentaDetalle,
  reclutamientos: number
): ReporteKpis {
  const dias = activos.dias || cobros.dias || venta.dias || 1;
  const devoluciones = parseNumberLabel(venta.devoluciones_label);
  const anulaciones = parseNumberLabel(cobros.anulaciones_label);

  const activoNeto = activos.activo_neto ?? 0;
  const cobroBruto = cobros.cobro_bruto ?? 0;
  const cobroNeto = cobros.cobro_neto ?? 0;
  const ventaBruta = venta.venta_bruta ?? 0;
  const ventaNeta = venta.venta_neta ?? 0;

  return {
    activoNeto,
    cobroBruto,
    cobroNeto,
    ventaBruta,
    ventaNeta,
    devoluciones,
    anulaciones,
    reclutamientos,
    arpu: activoNeto > 0 ? cobroNeto / activoNeto : 0,
    cobroPromedioDia: dias > 0 ? cobroNeto / dias : 0,
    ventaPromedioDia: dias > 0 ? ventaNeta / dias : 0,
    pctDevoluciones: ventaBruta > 0 ? (devoluciones / ventaBruta) * 100 : 0,
    pctAnulaciones: cobroBruto > 0 ? (anulaciones / cobroBruto) * 100 : 0,
    ratioCobrosVentas: ventaNeta > 0 ? cobroNeto / ventaNeta : 0,
    reclutamientosDia: dias > 0 ? reclutamientos / dias : 0,
    dias,
  };
}
