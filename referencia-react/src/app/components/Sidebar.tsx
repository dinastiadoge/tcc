import {
  Home,
  ShoppingCart,
  Package,
  FileText,
  Users,
  X,
  LogOut,
  XCircle,
  Archive,
  RotateCcw,
  PackagePlus,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [fiscalAberto, setFiscalAberto] = useState(
    location.pathname.startsWith("/fiscal") ||
      location.pathname.startsWith("/cancelamento") ||
      location.pathname.startsWith("/inutilizacao") ||
      location.pathname.startsWith("/devolucao") ||
      location.pathname.startsWith("/entrada"),
  );

  const menuPrincipal = [
    { icon: Home, label: "Início", path: "/" },
    { icon: ShoppingCart, label: "PDV / Vendas", path: "/pdv" },
    { icon: Users, label: "Clientes", path: "/clientes" },
    { icon: Package, label: "Estoque", path: "/estoque" },
  ];

  const menuFiscal = [
    { icon: FileText, label: "Painel Fiscal", path: "/fiscal" },
    { icon: XCircle, label: "Cancelamento", path: "/cancelamento" },
    { icon: Archive, label: "Inutilização", path: "/inutilizacao" },
    { icon: RotateCcw, label: "Nota de Devolução", path: "/devolucao" },
    { icon: PackagePlus, label: "Nota de Entrada", path: "/entrada" },
  ];

  const isFiscalActive = menuFiscal.some((i) => location.pathname === i.path);

  const handleLogout = () => {
    logout();
    navigate("/login");
    onClose();
  };

  const navLink = (path: string, Icon: React.ElementType, label: string, sub = false) => {
    const isActive = location.pathname === path;
    return (
      <li key={path}>
        <Link
          to={path}
          onClick={onClose}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
            sub ? "pl-8" : ""
          } ${
            isActive
              ? "bg-blue-600 text-white"
              : "text-gray-300 hover:bg-white/5 hover:text-white"
          }`}
        >
          <Icon size={sub ? 16 : 20} />
          <span className={sub ? "text-sm" : ""}>{label}</span>
        </Link>
      </li>
    );
  };

  return (
    <>
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed md:static top-0 left-0 h-screen w-64 bg-[#1a1d29] text-white z-50 flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="md:hidden absolute top-4 right-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Fechar menu"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl text-white">WC Autopeças</h1>
          <p className="text-sm text-gray-400 mt-1">Sistema de Gestão</p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuPrincipal.map(({ icon: Icon, label, path }) =>
              navLink(path, Icon, label),
            )}

            {/* Seção Fiscal com submenu */}
            <li>
              <button
                onClick={() => setFiscalAberto(!fiscalAberto)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-left ${
                  isFiscalActive
                    ? "bg-blue-600/20 text-blue-300"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <FileText size={20} />
                <span className="flex-1">Fiscal</span>
                {fiscalAberto ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>

              {fiscalAberto && (
                <ul className="mt-1 space-y-1">
                  {menuFiscal.map(({ icon: Icon, label, path }) =>
                    navLink(path, Icon, label, true),
                  )}
                </ul>
              )}
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-medium">
                {user?.nome?.slice(0, 2).toUpperCase() ?? "AD"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{user?.nome ?? "Admin"}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email ?? ""}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            Sair do sistema
          </button>
        </div>
      </aside>
    </>
  );
}
