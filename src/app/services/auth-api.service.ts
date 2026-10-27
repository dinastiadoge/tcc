import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import type { LoginResponse, Usuario } from '../types';
import { ApiError, request } from './http';
import { getToken } from './tokenStorage';

// Login local sem back-end: ativo só em desenvolvimento (`environment.mockAuth`).
const USAR_MOCK = environment.mockAuth;

const MOCK_EMAIL = 'admin@autopecas.com';
const MOCK_SENHA = 'admin123';
const MOCK_TOKEN = 'mock-token';
const MOCK_USUARIO: Usuario = { id: 'mock-usuario-1', nome: 'Administrador', email: MOCK_EMAIL };

if (USAR_MOCK) {
  console.warn(
    `[auth] Login mock ativo (${MOCK_EMAIL} / ${MOCK_SENHA}). Use mockAuth: false em environment.development.ts para usar a API.`,
  );
}

/** Chamadas de autenticação à API (o estado da sessão fica em core/auth.service.ts). */
@Injectable({ providedIn: 'root' })
export class AuthApiService {
  async login(email: string, senha: string): Promise<LoginResponse> {
    if (USAR_MOCK) {
      if (email.trim().toLowerCase() === MOCK_EMAIL && senha === MOCK_SENHA) {
        return { token: MOCK_TOKEN, usuario: MOCK_USUARIO };
      }
      throw new ApiError(401, 'E-mail ou senha incorretos.');
    }
    return request<LoginResponse>('/auth/login', { method: 'POST', body: { email, senha } });
  }

  async me(): Promise<Usuario> {
    if (USAR_MOCK && getToken() === MOCK_TOKEN) return MOCK_USUARIO;
    return request<Usuario>('/auth/me');
  }
}
