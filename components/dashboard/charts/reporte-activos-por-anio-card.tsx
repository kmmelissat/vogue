"use client";

import { ReporteBarrasCard } from "./reporte-barras-card";
import type { ReportePorZonaDetalle } from "@/api/types";

type ReporteActivosPorAnioCardProps = {
  reportePorAnio: ReportePorZonaDetalle | null;
};

export function ReporteActivosPorAnioCard({
  reportePorAnio,
}: ReporteActivosPorAnioCardProps) {
  return (
    <ReporteBarrasCard
      reporte={reportePorAnio}
      tituloFallback="Reporte Activos por Año"
      columnaEtiqueta="Año"
    />
  );
}
