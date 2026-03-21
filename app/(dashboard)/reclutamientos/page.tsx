import { fetchReclutamientosDetallesServer, getDefaultFechas } from "@/lib/server-data";
import { ReclutamientosContent } from "@/components/dashboard/reclutamientos-content";

export default async function ReclutamientosPage() {
  const initialFechas = getDefaultFechas();
  const { reportePorTipo, reportePorEstatus, reportePorTipoCredito, reclutamientosData, error } =
    await fetchReclutamientosDetallesServer(initialFechas);

  return (
    <ReclutamientosContent
      initialReportePorTipo={reportePorTipo}
      initialReportePorEstatus={reportePorEstatus}
      initialReportePorTipoCredito={reportePorTipoCredito}
      initialReclutamientosData={reclutamientosData}
      initialFechas={initialFechas}
      initialError={error}
    />
  );
}
