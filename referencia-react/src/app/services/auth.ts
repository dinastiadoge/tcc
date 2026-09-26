import type { LoginResponse, Usuario } from "../types";
import { ApiError, request } from "./http";
import { getToken } from "./tokenStorage";

// Login local sem back-end: ativo só em `vite` (dev); `VITE_MOCK_AUTH=false` desliga.
const USAR_MOCK = import.meta.env.DEV && import.meta.env.VITE_MOCK_AUTH !== "false";

const MOCK_EMAIL = "admin@autopecas.com";
const MOCK_SENHA = "admin123";
const MOCK_TOKEN = "mock-token";
const MOCK_USUARIO: Usuario = { id: 1, nome: "Administrador", email: MOCK_EMAIL };

if (USAR_MOCK) {
  console.warn(`[auth] Login mock ativo (${MOCK_EMAIL} / ${MOCK_SENHA}). Use VITE_MOCK_AUTH=false para usar a API.`);
}

export const authService = {
  login: async (email: string, senha: string): Promise<LoginResponse> => {
    if (USAR_MOCK) {
      if (email.trim().toLowerCase() === MOCK_EMAIL && senha === MOCK_SENHA) {
        return { token: MOCK_TOKEN, usuario: MOCK_USUARIO };
      }
      throw new ApiError(401, "E-mail ou senha incorretos.");
    }
    return request<LoginResponse>("/auth/login", { method: "POST", body: { email, senha } });
  },

  me: async (): Promise<Usuario> => {
    if (USAR_MOCK && getToken() === MOCK_TOKEN) return MOCK_USUARIO;
    return request<Usuario>("/auth/me");
  },
};
