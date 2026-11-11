import { FormEvent, useState } from "react";
import { Loader2 } from "lucide-react";
import { clientesService } from "../services";
import type { Cliente, ClienteInput, TipoPessoa } from "../types";
import { Campo, campoClasse } from "./Modal";
import { cep as formatarCep, errosPorCampo, mensagemErro, somenteDigitos } from "../lib/formato";

const UFS = "AC AL AM AP BA CE DF ES GO MA MG MS MT PA PB PE PI PR RJ RN RO RR RS SC SE SP TO".split(" ");

function vazio(): ClienteInput {
  return {
    tipo: "PJ", documento: "", nome: "", email: "", telefone: "", cidade: "", uf: "SP",
    cep: "", logradouro: "", numero: "", complemento: "", bairro: "", ativo: true,
  };
}

function deCliente(c: Cliente): ClienteInput {
  const { id: _id, totalCompras: _t, ultimaCompra: _u, ...resto } = c;
  return resto;
}

interface Props {
  cliente?: Cliente | null;
  /** Abre já com o foco no endereço (vindo do PDV quando a NF-e precisa dele). */
  focoEndereco?: boolean;
  onSalvo: (c: Cliente) => void;
  onCancelar: () => void;
}

/** Cadastro e edição de cliente, com o endereço usado no destinatário da NF-e. */
export function ClienteForm({ cliente, focoEndereco, onSalvo, onCancelar }: Props) {
  const [form, setForm] = useState<ClienteInput>(() => (cliente ? deCliente(cliente) : vazio()));
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [buscandoCep, setBuscandoCep] = useState(false);

  const set = <K extends keyof ClienteInput>(campo: K, valor: ClienteInput[K]) =>
    setForm((f) => ({ ...f, [campo]: valor }));

  // Preenche rua, bairro e cidade pelo CEP (ViaCEP). Sem internet, o usuário digita.
  const completarPorCep = async (valor: string) => {
    const digitos = somenteDigitos(valor);
    if (digitos.length !== 8) return;
    setBuscandoCep(true);
    try {
      const r = await fetch(`https://viacep.com.br/ws/${digitos}/json/`);
      const d = await r.json();
      if (!d.erro) {
        setForm((f) => ({
          ...f,
          logradouro: f.logradouro || d.logradouro || "",
          bairro: f.bairro || d.bairro || "",
          cidade: d.localidade || f.cidade,
          uf: d.uf || f.uf,
        }));
      }
    } catch {
      // sem acesso ao ViaCEP: segue com o preenchimento manual
    } finally {
      setBuscandoCep(false);
    }
  };

  const salvar = async (e: FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    setErros({});
    const dados: ClienteInput = {
      ...form,
      documento: somenteDigitos(form.documento),
      telefone: somenteDigitos(form.telefone),
      cep: somenteDigitos(form.cep),
    };
    try {
      const salvo = cliente
        ? await clientesService.atualizar(cliente.id, dados)
        : await clientesService.criar(dados);
      onSalvo(salvo);
    } catch (err) {
      setErro(mensagemErro(err));
      setErros(errosPorCampo(err));
    } finally {
      setSalvando(false);
    }
  };

  const tipos: TipoPessoa[] = ["PJ", "PF"];

  return (
    <form onSubmit={salvar} className="space-y-5">
      {erro && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{erro}</div>}

      <div className="flex gap-2">
        {tipos.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => set("tipo", t)}
            className={`px-4 py-2 rounded-lg text-sm ${
              form.tipo === t ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {t === "PJ" ? "Pessoa Jurídica" : "Pessoa Física"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Campo rotulo={form.tipo === "PJ" ? "CNPJ *" : "CPF *"} erro={erros.documento}>
          <input className={campoClasse} value={form.documento} onChange={(e) => set("documento", e.target.value)}
            placeholder={form.tipo === "PJ" ? "00.000.000/0000-00" : "000.000.000-00"} required />
        </Campo>
        <Campo rotulo={form.tipo === "PJ" ? "Razão social *" : "Nome *"} erro={erros.nome}>
          <input className={campoClasse} value={form.nome} onChange={(e) => set("nome", e.target.value)} required />
        </Campo>
        <Campo rotulo="E-mail" erro={erros.email}>
          <input type="email" className={campoClasse} value={form.email} onChange={(e) => set("email", e.target.value)} />
        </Campo>
        <Campo rotulo="Telefone" erro={erros.telefone}>
          <input className={campoClasse} value={form.telefone} onChange={(e) => set("telefone", e.target.value)} placeholder="(11) 99999-9999" />
        </Campo>
      </div>

      <fieldset className={`rounded-lg border p-4 ${focoEndereco ? "border-orange-300 bg-orange-50" : "border-gray-200"}`}>
        <legend className="px-1 text-sm text-gray-700">Endereço</legend>
        <p className="text-xs text-gray-500 mb-3">Usado como destinatário na NF-e. Sem ele a nota sai com "NAO INFORMADO".</p>
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
          <Campo rotulo="CEP" erro={erros.cep} className="sm:col-span-2">
            <div className="relative">
              <input className={campoClasse} value={formatarCep(form.cep)} autoFocus={focoEndereco}
                onChange={(e) => set("cep", e.target.value)} onBlur={(e) => completarPorCep(e.target.value)} placeholder="00000-000" />
              {buscandoCep && <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400" />}
            </div>
          </Campo>
          <Campo rotulo="Logradouro" erro={erros.logradouro} className="sm:col-span-4">
            <input className={campoClasse} value={form.logradouro} onChange={(e) => set("logradouro", e.target.value)} />
          </Campo>
          <Campo rotulo="Número" erro={erros.numero} className="sm:col-span-2">
            <input className={campoClasse} value={form.numero} onChange={(e) => set("numero", e.target.value)} />
          </Campo>
          <Campo rotulo="Complemento" erro={erros.complemento} className="sm:col-span-4">
            <input className={campoClasse} value={form.complemento} onChange={(e) => set("complemento", e.target.value)} />
          </Campo>
          <Campo rotulo="Bairro" erro={erros.bairro} className="sm:col-span-2">
            <input className={campoClasse} value={form.bairro} onChange={(e) => set("bairro", e.target.value)} />
          </Campo>
          <Campo rotulo="Cidade" erro={erros.cidade} className="sm:col-span-3">
            <input className={campoClasse} value={form.cidade} onChange={(e) => set("cidade", e.target.value)} />
          </Campo>
          <Campo rotulo="UF" erro={erros.uf} className="sm:col-span-1">
            <select className={campoClasse} value={form.uf} onChange={(e) => set("uf", e.target.value)}>
              <option value="">--</option>
              {UFS.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
            </select>
          </Campo>
        </div>
      </fieldset>

      {cliente && (
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={form.ativo} onChange={(e) => set("ativo", e.target.checked)} />
          Cliente ativo
        </label>
      )}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancelar} className="flex-1 px-4 py-2.5 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">
          Cancelar
        </button>
        <button type="submit" disabled={salvando}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 rounded-lg">
          {salvando && <Loader2 size={14} className="animate-spin" />}
          {cliente ? "Salvar alterações" : "Cadastrar cliente"}
        </button>
      </div>
    </form>
  );
}
