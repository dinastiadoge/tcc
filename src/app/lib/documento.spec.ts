import { describe, expect, it } from 'vitest';
import {
  mascararDocumento,
  tipoDocumentoPorDigitos,
  validarCnpj,
  validarCpf,
  validarDocumento,
} from './documento';

describe('documento', () => {
  it('tipoDocumentoPorDigitos: 11 = cpf, 14 = cnpj, resto = null', () => {
    expect(tipoDocumentoPorDigitos('529.982.247-25')).toBe('cpf');
    expect(tipoDocumentoPorDigitos('11.222.333/0001-81')).toBe('cnpj');
    expect(tipoDocumentoPorDigitos('123')).toBeNull();
    expect(tipoDocumentoPorDigitos('')).toBeNull();
    expect(tipoDocumentoPorDigitos(null)).toBeNull();
  });

  it('mascararDocumento: aplica CPF até 11 dígitos e CNPJ a partir de 12', () => {
    expect(mascararDocumento('5299')).toBe('529.9');
    expect(mascararDocumento('52998224725')).toBe('529.982.247-25');
    expect(mascararDocumento('112223330001')).toBe('11.222.333/0001');
    expect(mascararDocumento('11222333000181')).toBe('11.222.333/0001-81');
    expect(mascararDocumento('11.222.333/0001-81999')).toBe('11.222.333/0001-81');
    expect(mascararDocumento('abc')).toBe('');
  });

  it('validarCpf confere os dígitos verificadores', () => {
    expect(validarCpf('529.982.247-25')).toBe(true);
    expect(validarCpf('52998224726')).toBe(false);
    expect(validarCpf('111.111.111-11')).toBe(false);
    expect(validarCpf('123')).toBe(false);
  });

  it('validarCnpj confere os dígitos verificadores', () => {
    expect(validarCnpj('11.222.333/0001-81')).toBe(true);
    expect(validarCnpj('11222333000180')).toBe(false);
    expect(validarCnpj('00000000000000')).toBe(false);
  });

  it('validarDocumento escolhe a regra pelo tamanho', () => {
    expect(validarDocumento('529.982.247-25')).toBe(true);
    expect(validarDocumento('11.222.333/0001-81')).toBe(true);
    expect(validarDocumento('5299822472')).toBe(false);
  });
});
