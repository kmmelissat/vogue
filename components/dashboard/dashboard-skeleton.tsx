"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

/** Skeleton del contenido (KPI cards). Coincide con 4+3+3. El header se mantiene visible. */
export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {/* Fila 1 — Estratégicos (4) */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="py-0 border-l-4">
            <CardContent className="flex items-center gap-2 p-3">
              <Skeleton className="size-8 shrink-0 rounded-md" />
              <div className="flex-1 space-y-2 min-w-0">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Fila 2 — Productividad (3) */}
      <div className="grid gap-2 grid-cols-1 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="py-0 border-l-4">
            <CardContent className="flex items-center gap-2 p-2">
              <Skeleton className="size-6 shrink-0 rounded-md" />
              <div className="flex-1 space-y-1.5 min-w-0">
                <Skeleton className="h-2.5 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Fila 3 — Calidad (3) */}
      <div className="grid gap-2 grid-cols-1 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="py-0 border-l-4">
            <CardContent className="flex items-center gap-2 p-2">
              <Skeleton className="size-6 shrink-0 rounded-md" />
              <div className="flex-1 space-y-1.5 min-w-0">
                <Skeleton className="h-2.5 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
