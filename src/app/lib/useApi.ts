import { useCallback, useEffect, useRef, useState } from "react";
import { mensagemErro } from "./formato";

/**
 * Carrega dados da API ao montar a tela (e quando `deps` mudam). `recarregar` busca de novo
 * sem limpar a lista atual, para a tabela não piscar.
 */
export function useApi<T>(buscar: () => Promise<T>, deps: unknown[] = []) {
  const [dados, setDados] = useState<T | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const buscarRef = useRef(buscar);
  buscarRef.current = buscar;

  const recarregar = useCallback(async () => {
    try {
      const r = await buscarRef.current();
      setDados(r);
      setErro(null);
    } catch (e) {
      setErro(mensagemErro(e, "Não foi possível carregar os dados."));
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    setCarregando(true);
    recarregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { dados, setDados, carregando, erro, recarregar };
}

/** Chama `fn` a cada `ms` enquanto `ativo` for verdadeiro (ex.: nota em processamento). */
export function useIntervalo(fn: () => void, ms: number, ativo: boolean) {
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(() => {
    if (!ativo) return;
    const id = setInterval(() => ref.current(), ms);
    return () => clearInterval(id);
  }, [ms, ativo]);
}
