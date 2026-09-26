export type TipoDocumentoPessoa = 'cpf' | 'cnpj';

const soDigitos = (valor: string | null | undefined): string => (valor ?? '').replace(/\D/g, '');

/** 11 dígitos = CPF, 14 = CNPJ; qualquer outro tamanho ainda não é um documento completo. */
export function tipoDocumentoPorDigitos(valor: string | null | undefined): TipoDocumentoPessoa | null {
  const tamanho = soDigitos(valor).length;
  if (tamanho === 11) return 'cpf';
  if (tamanho === 14) return 'cnpj';
  return null;
}

/** Máscara progressiva: até 11 dígitos vira CPF, a partir de 12 vira CNPJ (limita em 14). */
export function mascararDocumento(valor: string | null | undefined): string {
  const d = soDigitos(valor).slice(0, 14);
  if (d.length <= 11) {
    return d
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
  }
  return d
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4')
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5');
}

function todosIguais(digitos: string): boolean {
  return /^(\d)\1+$/.test(digitos);
}

function digitoVerificador(digitos: string, pesos: number[]): number {
  const soma = pesos.reduce((acc, peso, i) => acc + Number(digitos[i]) * peso, 0);
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

export function validarCpf(valor: string | null | undefined): boolean {
  const d = soDigitos(valor);
  if (d.length !== 11 || todosIguais(d)) return false;
  const primeiro = digitoVerificador(d, [10, 9, 8, 7, 6, 5, 4, 3, 2]);
  const segundo = digitoVerificador(d, [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);
  return primeiro === Number(d[9]) && segundo === Number(d[10]);
}

export function validarCnpj(valor: string | null | undefined): boolean {
  const d = soDigitos(valor);
  if (d.length !== 14 || todosIguais(d)) return false;
  const primeiro = digitoVerificador(d, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const segundo = digitoVerificador(d, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return primeiro === Number(d[12]) && segundo === Number(d[13]);
}

/** Valida CPF ou CNPJ conforme o número de dígitos; `false` se ainda incompleto. */
export function validarDocumento(valor: string | null | undefined): boolean {
  const tipo = tipoDocumentoPorDigitos(valor);
  if (tipo === 'cpf') return validarCpf(valor);
  if (tipo === 'cnpj') return validarCnpj(valor);
  return false;
}
