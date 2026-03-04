"use client";

import {
  Users,
  Banknote,
  ShoppingCart,
  UserPlus,
  TrendingUp,
  Receipt,
  Calendar,
  RotateCcw,
  XCircle,
  BarChart3,
} from "lucide-react";
import { KpiCard } from "./kpi-card";
import { formatMoney, formatNumber } from "@/lib/utils";
import type { ReporteKpis } from "@/hooks/use-reporte-data";

function formatPercent(n: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(n / 100);
}

function formatRatio(n: number): string {
  return (Math.round(n * 10) / 10).toFixed(1) + "×";
}

/* Fila 1 — KPIs estratégicos (4) */
const ROW1_ESTRATEGICOS = [
  {
    key: "activoNeto" as const,
    title: "Activos netos",
    icon: Users,
    format: (k: ReporteKpis) => formatNumber(k.activoNeto),
    description: "Tamaño de la red de usuarios activos.",
  },
  {
    key: "reclutamientos" as const,
    title: "Reclutamientos",
    icon: UserPlus,
    format: (k: ReporteKpis) => formatNumber(k.reclutamientos),
    description: "Nuevos integrantes sumados al período.",
  },
  {
    key: "ventaNeta" as const,
    title: "Venta neta",
    icon: ShoppingCart,
    format: (k: ReporteKpis) => formatMoney(k.ventaNeta),
    description: "Dinero vendido menos devoluciones.",
  },
  {
    key: "cobroNeto" as const,
    title: "Cobro neto",
    icon: Banknote,
    format: (k: ReporteKpis) => formatMoney(k.cobroNeto),
    description: "Dinero efectivamente cobrado.",
  },
];

/* Fila 2 — Productividad del negocio (3) */
const ROW2_PRODUCTIVIDAD = [
  {
    key: "arpu" as const,
    title: "ARPU",
    icon: TrendingUp,
    format: (k: ReporteKpis) => formatMoney(k.arpu),
    description: "Ingreso promedio por cada activo.",
  },
  {
    key: "ventaPromedioDia" as const,
    title: "Venta promedio diaria",
    icon: Calendar,
    format: (k: ReporteKpis) => formatMoney(k.ventaPromedioDia),
    description: "Ritmo diario de ventas.",
  },
  {
    key: "cobroPromedioDia" as const,
    title: "Cobro promedio diario",
    icon: Receipt,
    format: (k: ReporteKpis) => formatMoney(k.cobroPromedioDia),
    description: "Flujo de caja diario.",
  },
];

/* Fila 3 — Calidad del ingreso (3) */
const ROW3_CALIDAD = [
  {
    key: "pctDevoluciones" as const,
    title: "% Devoluciones",
    icon: RotateCcw,
    format: (k: ReporteKpis) => formatPercent(k.pctDevoluciones),
    description: "Calidad de ventas. Alto = posibles problemas.",
  },
  {
    key: "pctAnulaciones" as const,
    title: "% Anulaciones",
    icon: XCircle,
    format: (k: ReporteKpis) => formatPercent(k.pctAnulaciones),
    description: "Cobros anulados. Alto = errores o fraude.",
  },
  {
    key: "ratioCobrosVentas" as const,
    title: "Ratio cobros/ventas",
    icon: BarChart3,
    format: (k: ReporteKpis) => formatRatio(k.ratioCobrosVentas),
    description: ">1 cobra más de lo vendido; <1 ventas sin cobrar.",
  },
];

type KpiCardsProps = {
  kpis: ReporteKpis;
};

export function KpiCards({ kpis }: KpiCardsProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Fila 1 — Estratégicos */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {ROW1_ESTRATEGICOS.map(({ key, title, icon, format, description }, i) => (
          <KpiCard
            key={key}
            title={title}
            value={format(kpis)}
            icon={icon}
            description={description}
            size="default"
            variant={i as 0 | 1 | 2 | 3}
          />
        ))}
      </div>
      {/* Fila 2 — Productividad */}
      <div className="grid gap-2 grid-cols-1 sm:grid-cols-3">
        {ROW2_PRODUCTIVIDAD.map(({ key, title, icon, format, description }, i) => (
          <KpiCard
            key={key}
            title={title}
            value={format(kpis)}
            icon={icon}
            description={description}
            size="compact"
            variant={(i + 4) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}
          />
        ))}
      </div>
      {/* Fila 3 — Calidad del ingreso */}
      <div className="grid gap-2 grid-cols-1 sm:grid-cols-3">
        {ROW3_CALIDAD.map(({ key, title, icon, format, description }, i) => (
          <KpiCard
            key={key}
            title={title}
            value={format(kpis)}
            icon={icon}
            description={description}
            size="compact"
            variant={(i + 7) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}
          />
        ))}
      </div>
    </div>
  );
}
