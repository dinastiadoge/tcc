import { clearToken, getToken } from "./tokenStorage";

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "/api";

export interface CampoErro {
  campo: string;
  message: string;
}

export class ApiError extends Error {
  status: number;
  /** Erros de validação por campo (400), quando o back manda. */
  campos: CampoErro[];
  constructor(status: number, message: string, campos: CampoErro[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.campos = campos;
  }
}

type Query = Record<string, string | number | boolean | null | undefined>;

interface Opcoes {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  query?: Query;
  body?: unknown; // objeto vira JSON; FormData é enviado como multipart
}

let aoNaoAutorizado: (() => void) | null = null;

/** Registrado pelo AuthProvider: chamado quando a API responde 401 com sessão ativa. */
export function definirAoNaoAutorizado(fn: (() => void) | null) {
  aoNaoAutorizado = fn;
}

function montarUrl(path: string, query?: Query): string {
  const url = `${API_URL.replace(/\/$/, "")}${path}`;
  if (!query) return url;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined && v !== null && v !== "") params.set(k, String(v));
  }
  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
}

async function enviar(path: string, { method = "GET", query, body }: Opcoes): Promise<Response> {
  const headers: Record<string, string> = { Accept: "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload: BodyInit | undefined;
  if (body instanceof FormData) {
    payload = body; // o navegador define o Content-Type com o boundary
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  let res: Response;
  try {
    res = await fetch(montarUrl(path, query), { method, headers, body: payload });
  } catch {
    throw new ApiError(0, "Não foi possível conectar ao servidor.");
  }

  if (!res.ok) {
    if (res.status === 401 && token) {
      clearToken();
      aoNaoAutorizado?.();
    }
    let mensagem = `Erro ${res.status}`;
    let campos: CampoErro[] = [];
    try {
      const dados = await res.json();
      if (typeof dados?.message === "string") mensagem = dados.message;
      if (Array.isArray(dados?.campos)) campos = dados.campos;
    } catch {
      // resposta sem JSON: mantém a mensagem padrão
    }
    throw new ApiError(res.status, mensagem, campos);
  }
  return res;
}

/** Requisição JSON. Respostas 204 retornam `undefined`. */
export async function request<T>(path: string, opcoes: Opcoes = {}): Promise<T> {
  const res = await enviar(path, opcoes);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** Requisição que devolve arquivo (XML, PDF, relatório). */
export async function requestBlob(path: string, opcoes: Opcoes = {}): Promise<Blob> {
  const res = await enviar(path, opcoes);
  return res.blob();
}
