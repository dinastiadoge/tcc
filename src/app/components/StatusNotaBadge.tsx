import { AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react";
import type { StatusNota } from "../types";

const estilos: Record<StatusNota, { classe: string; rotulo: string; Icone: typeof CheckCircle }> = {
  autorizada: { classe: "bg-green-100 text-green-700", rotulo: "Autorizada", Icone: CheckCircle },
  cancelada: { classe: "bg-red-100 text-red-700", rotulo: "Cancelada", Icone: XCircle },
  processando: { classe: "bg-yellow-100 text-yellow-700", rotulo: "Processando", Icone: Clock },
  rejeitada: { classe: "bg-orange-100 text-orange-700", rotulo: "Rejeitada", Icone: AlertTriangle },
};

export function StatusNotaBadge({ status, motivo }: { status: StatusNota; motivo?: string | null }) {
  const { classe, rotulo, Icone } = estilos[status] ?? estilos.processando;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${classe}`}
      title={status === "rejeitada" && motivo ? motivo : undefined}
    >
      <Icone size={14} className={status === "processando" ? "animate-pulse" : undefined} />
      {rotulo}
    </span>
  );
}
