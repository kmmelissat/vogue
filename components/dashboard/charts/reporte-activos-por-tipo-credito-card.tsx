"use client";

import { ReporteBarrasCard } from "./reporte-barras-card";
import type { ReportePorZonaDetalle } from "@/api/types";

type ReporteActivosPorTipoCreditoCardProps = {
  reportePorTipoCredito: ReportePorZonaDetalle | null;
};

export function ReporteActivosPorTipoCreditoCard({
  reportePorTipoCredito,
}: ReporteActivosPorTipoCreditoCardProps) {
  return (
    <ReporteBarrasCard
      reporte={reportePorTipoCredito}
      tituloFallback="Reporte Activos por Tipo de Crédito"
      columnaEtiqueta="Tipo"
    />
  );
}
