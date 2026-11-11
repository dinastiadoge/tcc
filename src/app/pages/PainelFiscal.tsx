import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { FileText, Download, Archive, Filter, RotateCcw, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { notasService } from '../services';
import type { NotaFiscal, StatusNota } from '../types';
import { StatusNotaBadge } from '../components/StatusNotaBadge';
import { useApi, useIntervalo } from '../lib/useApi';
import { baixarArquivo, data, dinheiro, documento, hojeIso, hora, mensagemErro } from '../lib/formato';

const filtros: { valor: StatusNota | ''; rotulo: string }[] = [
  { valor: '', rotulo: 'Todas' },
  { valor: 'autorizada', rotulo: 'Autorizadas' },
  { valor: 'processando', rotulo: 'Processando' },
  { valor: 'rejeitada', rotulo: 'Rejeitadas' },
  { valor: 'cancelada', rotulo: 'Canceladas' },
];

/** Notas emitidas pela loja (a nota de entrada é do fornecedor e fica na tela de entrada). */
const emitidaPelaLoja = (n: NotaFiscal) => n.tipo !== 'ENTRADA';

export function PainelFiscal() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<StatusNota | ''>('');
  const [mostrarFiltro, setMostrarFiltro] = useState(false);
  const [ocupado, setOcupado] = useState<string | null>(null);

  const { dados, carregando, erro, recarregar } = useApi(() => notasService.listar(), []);
  const notas = useMemo(() => (dados ?? []).filter(emitidaPelaLoja), [dados]);
  const visiveis = status ? notas.filter((n) => n.status === status) : notas;

  // Enquanto houver nota em processamento, atualiza a lista para mostrar o retorno da SEFAZ.
  useIntervalo(recarregar, 3000, notas.some((n) => n.status === 'processando'));

  const hoje = hojeIso();
  const deHoje = notas.filter((n) => data(n.emitidaEm) === data(hoje));
  const estatisticas = [
    { label: 'Emitidas Hoje', valor: String(deHoje.length), cor: 'text-blue-700' },
    {
      label: 'Total do Dia',
      valor: dinheiro(deHoje.filter((n) => n.status === 'autorizada').reduce((s, n) => s + n.valorTotal, 0)),
      cor: 'text-green-700',
    },
    { label: 'Autorizadas', valor: String(notas.filter((n) => n.status === 'autorizada').length), cor: 'text-green-700' },
    { label: 'Canceladas', valor: String(notas.filter((n) => n.status === 'cancelada').length), cor: 'text-red-700' },
  ];
  const rejeitadas = notas.filter((n) => n.status === 'rejeitada').length;

  const executar = async (chave: string, acao: () => Promise<void>) => {
    setOcupado(chave);
    try {
      await acao();
    } catch (e) {
      toast.error(mensagemErro(e));
    } finally {
      setOcupado(null);
    }
  };

  const baixar = (nota: NotaFiscal, formato: 'xml' | 'pdf') =>
    executar(`${formato}-${nota.id}`, async () => {
      const blob = formato === 'xml' ? await notasService.baixarXml(nota.id) : await notasService.baixarPdf(nota.id);
      baixarArquivo(blob, `${nota.tipo}-${nota.numero}.${formato}`);
    });

  const reenviar = (nota: NotaFiscal) =>
    executar(`reenviar-${nota.id}`, async () => {
      await notasService.reenviar(nota.id);
      toast.success(`Nota ${nota.numero} reenviada para a SEFAZ.`);
      await recarregar();
    });

  const enviarLote = () =>
    executar('lote', async () => {
      await notasService.enviarLoteContador();
      toast.success('Lote do mês enviado ao contador.');
    });

  const exportar = () =>
    executar('relatorio', async () => {
      const blob = await notasService.relatorio(status ? { status } : {});
      baixarArquivo(blob, `notas_${hoje}.csv`);
    });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl text-gray-900 mb-2">Painel Fiscal</h1>
        <p className="text-sm sm:text-base text-gray-600">Gestão de notas fiscais e documentos</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {estatisticas.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className={`text-lg sm:text-2xl ${stat.cor}`}>{carregando ? '...' : stat.valor}</p>
          </div>
        ))}
      </div>

      {rejeitadas > 0 && (
        <button
          onClick={() => {
            setMostrarFiltro(true);
            setStatus('rejeitada');
          }}
          className="w-full flex items-start gap-3 p-4 mb-4 sm:mb-6 bg-orange-50 border border-orange-200 rounded-xl text-left"
        >
          <AlertTriangle className="text-orange-600 flex-shrink-0 mt-0.5" size={18} />
          <span className="text-sm text-orange-800">
            {rejeitadas === 1 ? '1 nota foi rejeitada' : `${rejeitadas} notas foram rejeitadas`} pela SEFAZ. Veja o
            motivo, corrija o cadastro e use "Reenviar".
          </span>
        </button>
      )}

      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 mb-4 sm:mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-base sm:text-lg text-gray-900">Ações Rápidas</h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => navigate('/pdv')}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base"
            >
              <FileText size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span>Emitir NF-e</span>
            </button>
            <button
              onClick={enviarLote}
              disabled={ocupado === 'lote'}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white rounded-lg transition-colors text-sm sm:text-base"
            >
              {ocupado === 'lote' ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Archive size={16} className="sm:w-[18px] sm:h-[18px]" />
              )}
              <span className="hidden sm:inline">Enviar Lote ao Contador</span>
              <span className="sm:hidden">Enviar Lote</span>
            </button>
            <button
              onClick={exportar}
              disabled={ocupado === 'relatorio'}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white rounded-lg transition-colors text-sm sm:text-base"
            >
              <Download size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">Exportar Relatório</span>
              <span className="sm:hidden">Exportar</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg text-gray-900">Notas Fiscais Recentes</h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {mostrarFiltro &&
              filtros.map((f) => (
                <button
                  key={f.rotulo}
                  onClick={() => setStatus(f.valor)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    status === f.valor ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {f.rotulo}
                </button>
              ))}
            <button
              onClick={() => setMostrarFiltro((v) => !v)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors text-sm sm:text-base"
            >
              <Filter size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span>Filtrar</span>
            </button>
          </div>
        </div>

        {erro && <p className="mb-4 text-sm text-red-600">{erro}</p>}

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-600">Número</th>
                <th className="text-left py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-600">Cliente</th>
                <th className="text-left py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-600">CPF/CNPJ</th>
                <th className="text-right py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-600">Valor</th>
                <th className="text-center py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-600">Data/Hora</th>
                <th className="text-center py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-600">Status</th>
                <th className="text-center py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {visiveis.map((nota) => (
                <tr key={nota.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors align-top">
                  <td className="py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-900">
                    {nota.numero}/{nota.serie}
                    <span className="block text-xs text-gray-400">
                      {nota.tipo === 'NFCE' ? 'NFC-e' : nota.tipo === 'DEVOLUCAO' ? 'Devolução' : 'NF-e'}
                    </span>
                  </td>
                  <td className="py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-900">
                    {nota.clienteNome ?? 'Consumidor final'}
                    {nota.status === 'rejeitada' && nota.motivoRejeicao && (
                      <span className="block mt-1 text-xs text-orange-700">{nota.motivoRejeicao}</span>
                    )}
                  </td>
                  <td className="py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-600">
                    {documento(nota.clienteDocumento) || '-'}
                  </td>
                  <td className="py-3 px-2 sm:px-3 text-right text-xs sm:text-sm text-green-600">
                    {dinheiro(nota.valorTotal)}
                  </td>
                  <td className="py-3 px-2 sm:px-3 text-center text-xs sm:text-sm text-gray-600">
                    {data(nota.emitidaEm)} {hora(nota.emitidaEm)}
                  </td>
                  <td className="py-3 px-2 sm:px-3 text-center">
                    <StatusNotaBadge status={nota.status} motivo={nota.motivoRejeicao} />
                  </td>
                  <td className="py-3 px-2 sm:px-3 text-center">
                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                      {nota.status === 'rejeitada' ? (
                        <button
                          onClick={() => reenviar(nota)}
                          disabled={ocupado === `reenviar-${nota.id}`}
                          className="flex items-center gap-1 px-2 py-1 text-xs text-orange-700 border border-orange-200 hover:bg-orange-50 rounded transition-colors"
                          title="Transmitir de novo depois de corrigir a causa"
                        >
                          {ocupado === `reenviar-${nota.id}` ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <RotateCcw size={13} />
                          )}
                          Reenviar
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => baixar(nota, 'xml')}
                            disabled={nota.status === 'processando' || ocupado === `xml-${nota.id}`}
                            className="p-1 sm:p-1.5 hover:bg-gray-100 rounded transition-colors disabled:opacity-40"
                            title="Baixar XML"
                          >
                            <Download size={14} className="text-gray-600 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => baixar(nota, 'pdf')}
                            disabled={nota.status === 'processando' || ocupado === `pdf-${nota.id}`}
                            className="p-1 sm:p-1.5 hover:bg-gray-100 rounded transition-colors disabled:opacity-40"
                            title="Baixar PDF"
                          >
                            <FileText size={14} className="text-gray-600 sm:w-4 sm:h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!carregando && visiveis.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-sm text-gray-400">
                    Nenhuma nota encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
