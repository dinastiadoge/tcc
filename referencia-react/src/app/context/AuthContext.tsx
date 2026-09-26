import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authService, clearToken, definirAoNaoAutorizado, getToken, setToken } from "../services";
import type { Usuario } from "../types";

interface AuthContextType {
  isAuthenticated: boolean;
  carregando: boolean;
  user: Usuario | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  // Há token salvo? Então a sessão precisa ser validada em /auth/me antes de renderizar.
  const [carregando, setCarregando] = useState(() => getToken() !== null);

  useEffect(() => {
    // Versões anteriores guardavam o usuário em localStorage; remove o resíduo.
    try {
      localStorage.removeItem("wc_user");
    } catch {
      // storage indisponível
    }

    definirAoNaoAutorizado(() => setUser(null));

    if (getToken() === null) return;
    let ativo = true;
    authService
      .me()
      .then((u) => ativo && setUser(u))
      .catch(() => {
        clearToken();
        if (ativo) setUser(null);
      })
      .finally(() => ativo && setCarregando(false));

    return () => {
      ativo = false;
      definirAoNaoAutorizado(null);
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { token, usuario } = await authService.login(email, password);
      setToken(token);
      setUser(usuario);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: user !== null, carregando, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
