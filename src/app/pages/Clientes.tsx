import {
  Search,
  Plus,
  Users,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Edit,
  Trash2,
} from "lucide-react";
import { useState } from "react";

interface Cliente {
  id: number;
  tipo: "PF" | "PJ";
  documento: string;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  uf: string;
  totalCompras: number;
  ultimaCompra: string;
  status: "ativo" | "inativo";
}

const clientesData: Cliente[] = [
  {
    id: 1,
    tipo: "PJ",
    documento: "12.345.678/0001-90",
    nome: "Transportadora Rápida Ltda",
    email: "contato@rapidaltda.com",
    telefone: "(11) 3456-7890",
    cidade: "São Paulo",
    uf: "SP",
    totalCompras: 15,
    ultimaCompra: "23/04/2026",
    status: "ativo",
  },
  {
    id: 2,
    tipo: "PJ",
    documento: "98.765.432/0001-11",
    nome: "Posto Central",
    email: "posto@central.com.br",
    telefone: "(11) 2345-6789",
    cidade: "Guarulhos",
    uf: "SP",
    totalCompras: 42,
    ultimaCompra: "23/04/2026",
    status: "ativo",
  },
  {
    id: 3,
    tipo: "PJ",
    documento: "45.678.901/0001-23",
    nome: "Retífica Souza Ltda",
    email: "retifica@souza.com",
    telefone: "(11) 4567-8901",
    cidade: "São Paulo",
    uf: "SP",
    totalCompras: 28,
    ultimaCompra: "23/04/2026",
    status: "ativo",
  },
  {
    id: 4,
    tipo: "PF",
    documento: "123.456.789-00",
    nome: "João Silva",
    email: "joao.silva@email.com",
    telefone: "(11) 98765-4321",
    cidade: "São Paulo",
    uf: "SP",
    totalCompras: 8,
    ultimaCompra: "22/04/2026",
    status: "ativo",
  },
  {
    id: 5,
    tipo: "PJ",
    documento: "23.456.789/0001-45",
    nome: "Auto Mecânica Silva",
    email: "mecanica@silva.com.br",
    telefone: "(11) 3789-0123",
    cidade: "Osasco",
    uf: "SP",
    totalCompras: 35,
    ultimaCompra: "23/04/2026",
    status: "ativo",
  },
  {
    id: 6,
    tipo: "PF",
    documento: "234.567.890-11",
    nome: "Maria Santos",
    email: "maria.santos@email.com",
    telefone: "(11) 97654-3210",
    cidade: "São Paulo",
    uf: "SP",
    totalCompras: 5,
    ultimaCompra: "21/04/2026",
    status: "ativo",
  },
  {
    id: 7,
    tipo: "PJ",
    documento: "34.567.890/0001-67",
    nome: "Oficina do João",
    email: "oficina@joao.com",
    telefone: "(11) 2890-1234",
    cidade: "Barueri",
    uf: "SP",
    totalCompras: 19,
    ultimaCompra: "22/04/2026",
    status: "ativo",
  },
  {
    id: 8,
    tipo: "PF",
    documento: "345.678.901-22",
    nome: "Pedro Oliveira",
    email: "pedro.oliveira@email.com",
    telefone: "(11) 96543-2109",
    cidade: "São Paulo",
    uf: "SP",
    totalCompras: 3,
    ultimaCompra: "20/04/2026",
    status: "inativo",
  },
];

export function Clientes() {
  const [filtroTipo, setFiltroTipo] = useState<
    "todos" | "PF" | "PJ"
  >("todos");
  const [busca, setBusca] = useState("");

  const clientesFiltrados = clientesData.filter((cliente) => {
    const matchTipo =
      filtroTipo === "todos" || cliente.tipo === filtroTipo;
    const matchBusca =
      busca === "" ||
      cliente.nome
        .toLowerCase()
        .includes(busca.toLowerCase()) ||
      cliente.documento.includes(busca) ||
      cliente.email.toLowerCase().includes(busca.toLowerCase());
    return matchTipo && matchBusca;
  });

  const totalPF = clientesData.filter(
    (c) => c.tipo === "PF",
  ).length;
  const totalPJ = clientesData.filter(
    (c) => c.tipo === "PJ",
  ).length;
  const totalAtivos = clientesData.filter(
    (c) => c.status === "ativo",
  ).length;

  const estatisticas = [
    {
      label: "Total de Clientes",
      valor: clientesData.length.toString(),
      icone: Users,
      cor: "blue",
    },
    {
      label: "Pessoa Física",
      valor: totalPF.toString(),
      icone: User,
      cor: "green",
    },
    {
      label: "Pessoa Jurídica",
      valor: totalPJ.toString(),
      icone: Building2,
      cor: "purple",
    },
    {
      label: "Clientes Ativos",
      valor: totalAtivos.toString(),
      icone: Users,
      cor: "orange",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl text-gray-900 mb-2">
          Gestão de Clientes
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Cadastro e gerenciamento de pessoas físicas e
          jurídicas
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {estatisticas.map((stat, index) => {
          const Icon = stat.icone;
          const corClasses = {
            blue: "bg-blue-100 text-blue-600",
            green: "bg-green-100 text-green-600",
            purple: "bg-purple-100 text-purple-600",
            orange: "bg-orange-100 text-orange-600",
          };

          return (
            <div
              key={index}
              className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-xl sm:text-2xl text-gray-900">
                    {stat.valor}
                  </p>
                </div>
                <div
                  className={`p-2 sm:p-3 rounded-lg ${corClasses[stat.cor as keyof typeof corClasses]}`}
                >
                  <Icon size={20} className="sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 sm:mb-6">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => setFiltroTipo("todos")}
              className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                filtroTipo === "todos"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFiltroTipo("PF")}
              className={`px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base ${
                filtroTipo === "PF"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <User size={16} />
              <span className="hidden sm:inline">
                Pessoa Física
              </span>
              <span className="sm:hidden">PF</span>
            </button>
            <button
              onClick={() => setFiltroTipo("PJ")}
              className={`px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base ${
                filtroTipo === "PJ"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Building2 size={16} />
              <span className="hidden sm:inline">
                Pessoa Jurídica
              </span>
              <span className="sm:hidden">PJ</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 sm:w-80">
              <input
                type="text"
                placeholder="Buscar por nome, documento ou email..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors whitespace-nowrap">
              <Plus size={18} />
              <span>Novo Cliente</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-600">
                  Tipo
                </th>
                <th className="text-left py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-600">
                  Documento
                </th>
                <th className="text-left py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-600">
                  Nome/Razão Social
                </th>
                <th className="text-left py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-600">
                  Contato
                </th>
                <th className="text-left py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-600">
                  Localização
                </th>
                <th className="text-center py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-600">
                  Compras
                </th>
                <th className="text-center py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-600">
                  Última Compra
                </th>
                <th className="text-center py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-600">
                  Status
                </th>
                <th className="text-center py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-600">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.map((cliente) => (
                <tr
                  key={cliente.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-2 sm:px-3">
                    {cliente.tipo === "PF" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-green-100 text-green-700">
                        <User size={12} />
                        PF
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-purple-100 text-purple-700">
                        <Building2 size={12} />
                        PJ
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-900">
                    {cliente.documento}
                  </td>
                  <td className="py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-900">
                    {cliente.nome}
                  </td>
                  <td className="py-3 px-2 sm:px-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                        <Mail size={12} />
                        <span className="truncate max-w-[180px]">
                          {cliente.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                        <Phone size={12} />
                        {cliente.telefone}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 sm:px-3">
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                      <MapPin size={12} />
                      {cliente.cidade}/{cliente.uf}
                    </div>
                  </td>
                  <td className="py-3 px-2 sm:px-3 text-center text-xs sm:text-sm text-gray-900">
                    {cliente.totalCompras}
                  </td>
                  <td className="py-3 px-2 sm:px-3 text-center text-xs sm:text-sm text-gray-600">
                    {cliente.ultimaCompra}
                  </td>
                  <td className="py-3 px-2 sm:px-3 text-center">
                    {cliente.status === "ativo" ? (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-700">
                        Ativo
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                        Inativo
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2 sm:px-3">
                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                      <button
                        className="p-1 sm:p-1.5 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                        title="Editar"
                      >
                        <Edit
                          size={14}
                          className="sm:w-4 sm:h-4"
                        />
                      </button>
                      <button
                        className="p-1 sm:p-1.5 hover:bg-red-50 text-red-600 rounded transition-colors"
                        title="Excluir"
                      >
                        <Trash2
                          size={14}
                          className="sm:w-4 sm:h-4"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {clientesFiltrados.length === 0 && (
          <div className="text-center py-12">
            <Users
              className="mx-auto text-gray-400 mb-4"
              size={48}
            />
            <p className="text-gray-600">
              Nenhum cliente encontrado
            </p>
          </div>
        )}
      </div>
    </div>
  );
}