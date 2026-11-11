import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  titulo: string;
  aberto: boolean;
  onFechar: () => void;
  children: ReactNode;
  largura?: string;
}

/** Janela simples sobre a tela (Esc ou clique fora fecha). */
export function Modal({ titulo, aberto, onFechar, children, largura = "max-w-2xl" }: ModalProps) {
  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e: KeyboardEvent) => e.key === "Escape" && onFechar();
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aberto, onFechar]);

  if (!aberto) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/40 p-4 overflow-y-auto"
      onMouseDown={(e) => e.target === e.currentTarget && onFechar()}
    >
      <div className={`w-full ${largura} bg-white rounded-xl shadow-xl my-8`} role="dialog" aria-label={titulo}>
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg text-gray-900">{titulo}</h2>
          <button onClick={onFechar} className="p-1 text-gray-500 hover:text-gray-700" aria-label="Fechar">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

export const campoClasse =
  "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

export function Campo({ rotulo, erro, children, className = "" }: { rotulo: string; erro?: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-xs text-gray-600 mb-1.5">{rotulo}</label>
      {children}
      {erro && <p className="text-xs text-red-600 mt-1">{erro}</p>}
    </div>
  );
}
