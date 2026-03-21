"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function KpiQueryError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-destructive">{message}</p>
      <Button variant="outline" size="sm" onClick={() => onRetry()}>
        <RefreshCw className="mr-2 h-4 w-4" />
        Reintentar métricas
      </Button>
    </div>
  );
}
