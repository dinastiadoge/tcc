import type { LoginResponse, Usuario } from "../types";
import { request } from "./http";

export const authService = {
  login: (email: string, senha: string) =>
    request<LoginResponse>("/auth/login", { method: "POST", body: { email, senha } }),

  me: () => request<Usuario>("/auth/me"),
};
