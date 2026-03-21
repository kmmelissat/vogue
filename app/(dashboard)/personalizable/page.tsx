"use client";

import * as React from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { PersonalizablePage } from "@/components/dashboard/personalizable/personalizable-page";
import { getDefaultFechas } from "@/lib/date-utils";
import type { FechasParams } from "@/api/types";

export default function PersonalizableDashboardPage() {
  const [defaultFechas] = React.useState(() => getDefaultFechas());
  const [fechas, setFechas] = React.useState<FechasParams | null>(defaultFechas);

  return (
    <>
      <DashboardHeader initialFechas={defaultFechas} onDateChange={setFechas} />
      <div className="flex-1 p-6">
        <PersonalizablePage fechas={fechas} />
      </div>
    </>
  );
}
