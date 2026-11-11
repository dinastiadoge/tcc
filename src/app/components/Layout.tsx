import { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router";
import { Toaster } from "sonner";
import { Sidebar } from "./Sidebar";
import { MobileHeader } from "./MobileHeader";
import { useAuth } from "../context/AuthContext";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, carregando } = useAuth();

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [sidebarOpen]);

  if (carregando) {
    return null; // validando a sessão em /auth/me
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
          <Outlet />
        </main>
        <Toaster richColors position="top-right" />
      </div>
    </div>
  );
}
