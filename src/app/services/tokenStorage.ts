// O token vive SOMENTE em sessionStorage (some ao fechar a aba).
// Nunca gravar em localStorage. O acesso é protegido porque o storage pode
// estar indisponível (modo privado, dados de site bloqueados).

const CHAVE = "wc_token";

export function getToken(): string | null {
  try {
    return sessionStorage.getItem(CHAVE);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  try {
    sessionStorage.setItem(CHAVE, token);
  } catch {
    // sem storage: a sessão dura só até recarregar a página
  }
}

export function clearToken(): void {
  try {
    sessionStorage.removeItem(CHAVE);
  } catch {
    // nada a limpar
  }
}
