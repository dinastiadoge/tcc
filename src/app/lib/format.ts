type Vazio = string | number | null | undefined;

const soDigitos = (valor: Vazio): string =>
  valor === null || valor === undefined ? "" : String(valor).replace(/\D/g, "");

const dois = (n: number): string => String(n).padStart(2, "0");

/** CPF (11 dígitos) ou CNPJ (14 dígitos); outros tamanhos voltam só com os dígitos. */
export function formatarDocumento(cpfCnpj: Vazio): string {
  const d = soDigitos(cpfCnpj);
  if (d.length === 11) {
    return d.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  }
  if (d.length === 14) {
    return d.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  }
  return d;
}

/** Fixo (10 dígitos) ou celular (11 dígitos); outros tamanhos voltam só com os dígitos. */
export function formatarTelefone(telefone: Vazio): string {
  const d = soDigitos(telefone);
  if (d.length === 10) {
    return d.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
  }
  if (d.length === 11) {
    return d.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  }
  return d;
}

/** NCM de 8 dígitos (`87083010` → `8708.30.10`); outros tamanhos voltam só com os dígitos. */
export function formatarNcm(ncm: Vazio): string {
  const d = soDigitos(ncm);
  if (d.length === 8) {
    return d.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1.$2.$3");
  }
  return d;
}

/** `1250` → `R$ 1.250,00`. */
export function formatarMoeda(valor: number | null | undefined): string {
  if (typeof valor !== "number" || !Number.isFinite(valor)) return "";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
    .format(valor)
    .replace(/ /g, " ");
}

const SOMENTE_DATA = /^(\d{4})-(\d{2})-(\d{2})$/;

function paraData(iso: string): Date | null {
  const data = new Date(iso);
  return Number.isNaN(data.getTime()) ? null : data;
}

/** ISO 8601 → `dd/MM/yyyy`. Data sem hora não passa por `Date`, para o fuso não mudar o dia. */
export function formatarData(iso: string | null | undefined): string {
  if (!iso) return "";
  const texto = iso.trim();
  const somenteData = SOMENTE_DATA.exec(texto);
  if (somenteData) return `${somenteData[3]}/${somenteData[2]}/${somenteData[1]}`;
  const data = paraData(texto);
  if (!data) return "";
  return `${dois(data.getDate())}/${dois(data.getMonth() + 1)}/${data.getFullYear()}`;
}

/** ISO 8601 → `HH:mm` no horário local. Data sem hora retorna `""`. */
export function formatarHora(iso: string | null | undefined): string {
  if (!iso) return "";
  const texto = iso.trim();
  if (SOMENTE_DATA.test(texto)) return "";
  const data = paraData(texto);
  if (!data) return "";
  return `${dois(data.getHours())}:${dois(data.getMinutes())}`;
}

/** Número da nota/faixa com zeros à esquerda (`123` → `000123`). */
export function formatarNumeroNota(
  numero: string | number | null | undefined,
  tamanho = 6,
): string {
  const d = soDigitos(numero);
  return d ? d.padStart(tamanho, "0") : "";
}
