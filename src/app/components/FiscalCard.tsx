import { useState } from 'react';
import { FileText, Download, Archive, Loader2 } from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { notasService } from '../services';
import type { NotaFiscal } from '../types';
import { useApi } from '../lib/useApi';
import { baixarArquivo, dinheiro, hora, mensagemErro } from '../lib/formato';
import { StatusNotaBadge } from './StatusNotaBadge';

export function FiscalCard() {
  const { dados, carregando } = useApi(() => notasService.listar(), []);
  const [enviandoLote, setEnviandoLote] = useState(false);
  // As últimas notas emitidas pela loja (a lista vem da mais nova para a mais antiga).
  const notasEmitidas = (dados ?? []).filter((n) => n.tipo !== 'ENTRADA').slice(0, 4);

  const baixar = async (nota: NotaFiscal, formato: 'xml' | 'pdf') => {
    try {
      const blob = formato === 'xml' ? await notasService.baixarXml(nota.id) : await notasService.baixarPdf(nota.id);
      baixarArquivo(blob, `${nota.tipo}-${nota.numero}.${formato}`);
    } catch (e) {
      toast.error(mensagemErro(e));
    }
  };

  const enviarLote = async () => {
    setEnviandoLote(true);
    try {
      await notasService.enviarLoteContador();
      toast.success('Lote do mês enviado ao contador.');
    } catch (e) {
      toast.error(mensagemErro(e));
    } finally {
      setEnviandoLote(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <FileText className="text-blue-600" size={20} />
        <h2 className="text-base sm:text-lg text-gray-900">Ações Fiscais</h2>
        <Link to="/fiscal" className="ml-auto text-xs text-blue-600 hover:underline">Painel fiscal</Link>
      </div>

      <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
        {notasEmitidas.map((nota) => (
          <div key={nota.id} className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs sm:text-sm text-gray-900">
                  {nota.tipo === 'NFCE' ? 'NFC-e' : 'NF-e'} {nota.numero}
                </span>
                <span className="text-xs text-gray-500">{hora(nota.emitidaEm)}</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 truncate mt-0.5">{nota.clienteNome ?? 'Consumidor final'}</p>
              {nota.status !== 'autorizada' && (
                <div className="mt-1">
                  <StatusNotaBadge status={nota.status} motivo={nota.motivoRejeicao} />
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-4">
              <span className="text-xs sm:text-sm text-green-600 mr-1 sm:mr-2 hidden sm:inline">{dinheiro(nota.valorTotal)}</span>
              <button
                onClick={() => baixar(nota, 'xml')}
                disabled={nota.status === 'processando'}
                className="p-1 sm:p-1.5 hover:bg-white rounded transition-colors disabled:opacity-40"
                title="Baixar XML"
              >
                <Download size={14} className="text-gray-600 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={() => baixar(nota, 'pdf')}
                disabled={nota.status === 'processando'}
                className="p-1 sm:p-1.5 hover:bg-white rounded transition-colors disabled:opacity-40"
                title="Baixar PDF"
              >
                <FileText size={14} className="text-gray-600 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        ))}
        {notasEmitidas.length === 0 && (
          <p className="py-4 text-center text-sm text-gray-400">{carregando ? 'Carregando...' : 'Nenhuma nota emitida ainda'}</p>
        )}
      </div>

      <button
        onClick={enviarLote}
        disabled={enviandoLote}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
      >
        {enviandoLote ? <Loader2 size={18} className="animate-spin" /> : <Archive size={18} className="sm:w-5 sm:h-5" />}
        <span>Enviar lote para Contador</span>
      </button>
    </div>
  );
}
