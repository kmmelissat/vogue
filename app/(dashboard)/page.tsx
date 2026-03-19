import {
  fetchKpisServer,
  fetchDashboardDetallesServer,
  getDefaultFechas,
} from "@/lib/server-data";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default async function HomePage() {
  const initialFechas = getDefaultFechas();
  const [kpisResult, detallesResult] = await Promise.all([
    fetchKpisServer(initialFechas),
    fetchDashboardDetallesServer(initialFechas),
  ]);
  const { kpis, error } = kpisResult;
  const initialDashboardDetalles =
    detallesResult.data ?? null;
  const detallesError = detallesResult.error;

  return (
    <DashboardContent
      initialKpis={kpis}
      initialFechas={initialFechas}
      initialError={error}
      initialDashboardDetalles={initialDashboardDetalles}
      initialDashboardDetallesError={detallesError}
    />
  );
}
