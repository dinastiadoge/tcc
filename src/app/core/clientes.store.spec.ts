import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ClientesStore } from './clientes.store';

describe('ClientesStore', () => {
  let store: ClientesStore;

  beforeEach(() => {
    TestBed.resetTestingModule();
    store = TestBed.inject(ClientesStore);
  });

  it('acha cliente pelo documento ignorando a máscara', () => {
    expect(store.buscarPorDocumento('12345678000190')?.nome).toBe('Transportadora Rápida Ltda');
    expect(store.buscarPorDocumento('123.456.789-00')?.nome).toBe('João Silva');
    expect(store.buscarPorDocumento('52998224725')).toBeUndefined();
  });

  it('adicionar cadastra na hora e passa a ser encontrado (Q8)', () => {
    const total = store.clientes().length;
    const novo = store.adicionar({
      tipo: 'PF',
      documento: '52998224725',
      nome: 'Ana Paula Ribeiro',
      email: '',
      telefone: '11987654321',
      cidade: '',
      uf: 'SP',
    });

    expect(store.clientes().length).toBe(total + 1);
    expect(novo.documento).toBe('529.982.247-25');
    expect(novo.telefone).toBe('(11) 98765-4321');
    expect(novo.status).toBe('ativo');
    expect(store.buscarPorDocumento('529.982.247-25')?.id).toBe(novo.id);
  });
});
