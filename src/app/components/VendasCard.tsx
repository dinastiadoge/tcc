import { useState } from 'react';
import { Search, Plus, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { clientesService } from '../services';
import type { Cliente } from '../types';
import { documento, mensagemErro, somenteDigitos } from '../lib/formato';

export function VendasCard() {
  const navigate = useNavigate();
  const [doc, setDoc] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const buscar = async () => {
    const digitos = somenteDigitos(doc);
    setCliente(null);
    setAviso(null);
    if (digitos.length !== 11 && digitos.length !== 14) {
      setAviso('Informe um CPF ou CNPJ completo.');
      return;
    }
    setBuscando(true);
    try {
      const lista = await clientesService.listar({ documento: digitos });
      if (lista.length > 0) setCliente(lista[0]);
      else setAviso('Cliente não cadastrado.');
    } catch (e) {
      setAviso(mensagemErro(e));
    } finally {
      setBuscando(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
      <h2 className="text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">Vendas Ágeis</h2>

      <div className="space-y-3 sm:space-y-4">
        <div>
          <label htmlFor="cnpj" className="block text-xs sm:text-sm text-gray-700 mb-2">
            Buscar Cliente por CNPJ
          </label>
          <div className="relative">
            <input
              id="cnpj"
              type="text"
              value={doc}
              onChange={(e) => setDoc(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && buscar()}
              onBlur={() => doc && buscar()}
              placeholder="00.000.000/0000-00"
              className="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            {buscando ? (
              <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" size={16} />
            ) : (
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            )}
          </div>
          {cliente && (
            <div className="mt-2 p-2.5 bg-blue-50 rounded-lg text-xs sm:text-sm">
              <p className="text-gray-900">{cliente.nome}</p>
              <p className="text-gray-500">
                {documento(cliente.documento)} · {cliente.totalCompras} compra(s)
              </p>
            </div>
          )}
          {aviso && (
            <p className="mt-2 text-xs text-gray-500">
              {aviso}{' '}
              {aviso === 'Cliente não cadastrado.' && (
                <Link to="/clientes" className="text-blue-600 hover:underline">Cadastrar</Link>
              )}
            </p>
          )}
        </div>

        <button
          onClick={() => navigate('/pdv')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
        >
          <Plus size={18} className="sm:w-5 sm:h-5" />
          <span>Novo Pedido/Nota Fiscal</span>
        </button>
      </div>
    </div>
  );
}
