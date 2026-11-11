// Formatação para a tela. O back manda valores crus (número, ISO 8601, documento sem máscara).

const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function dinheiro(valor: number | null | undefined): string {
  return moeda.format(valor ?? 0);
}

/** "2026-11-11T14:20:00Z" → "11/11/2026" (horário de Brasília). */
export function data(iso: string | null | undefined): string {
  if (!iso) return "-";
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00` : iso);
  return d.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

export function hora(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Data de hoje em yyyy-MM-dd no fuso de Brasília. */
export function hojeIso(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "America/Sao_Paulo" });
}

export function documento(doc: string | null | undefined): string {
  const d = (doc ?? "").replace(/\D/g, "");
  if (d.length === 11) return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  if (d.length === 14) return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  return doc ?? "";
}

export function telefone(tel: string | null | undefined): string {
  const d = (tel ?? "").replace(/\D/g, "");
  if (d.length === 11) return d.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  if (d.length === 10) return d.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  return tel ?? "";
}

export function ncm(valor: string | null | undefined): string {
  const d = (valor ?? "").replace(/\D/g, "");
  return d.length === 8 ? d.replace(/(\d{4})(\d{2})(\d{2})/, "$1.$2.$3") : valor ?? "";
}

export function cep(valor: string | null | undefined): string {
  const d = (valor ?? "").replace(/\D/g, "");
  return d.length === 8 ? d.replace(/(\d{5})(\d{3})/, "$1-$2") : valor ?? "";
}

export function somenteDigitos(valor: string): string {
  return valor.replace(/\D/g, "");
}

/** Mensagem legível de qualquer erro (ApiError traz a mensagem do back). */
export function mensagemErro(e: unknown, padrao = "Não foi possível concluir a operação."): string {
  return e instanceof Error && e.message ? e.message : padrao;
}

/** Salva um Blob como arquivo no navegador. */
export function baixarArquivo(blob: Blob, nome: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Erros por campo de um ApiError (400), como mapa campo → mensagem. */
export function errosPorCampo(e: unknown): Record<string, string> {
  const campos = (e as { campos?: { campo: string; message: string }[] })?.campos ?? [];
  return Object.fromEntries(campos.map((c) => [c.campo, c.message]));
}
