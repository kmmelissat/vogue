"use client";

import { ReporteBarrasCard } from "./reporte-barras-card";
import type { ReportePorZonaDetalle } from "@/api/types";

type ReporteActivosPorRangoCardProps = {
  reportePorRango: ReportePorZonaDetalle | null;
};

export function ReporteActivosPorRangoCard({
  reportePorRango,
}: ReporteActivosPorRangoCardProps) {
  return (
    <ReporteBarrasCard
      reporte={reportePorRango}
      tituloFallback="Reporte Activos por Rango"
      columnaEtiqueta="Rango"
    />
  );
}
