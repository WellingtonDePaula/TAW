"use client";

import { FormEvent, ReactNode, useEffect, useState } from "react";
import { ApiError, criarJogo, listarGeneros, mensagemDeErro } from "@/lib/api";
import { sairDaConta } from "@/lib/auth";
import type { Genero } from "@/lib/types";

type Campos = {
  nome: string;
  descricao: string;
  banner: string;
  preco_base: string;
  preco_ofertado: string;
  distribuidora: string;
  desenvolvedora: string;
  generos: number[];
};

type Erros = Record<string, string>;

const VAZIO: Campos = {
  nome: "",
  descricao: "",
  banner: "",
  preco_base: "",
  preco_ofertado: "",
  distribuidora: "",
  desenvolvedora: "",
  generos: [],
};

const estiloInput =
  "w-full rounded border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700";

// Aceita "59,90" ou "59.90" e devolve "59.90".
const normalizarPreco = (valor: string) => valor.trim().replace(",", ".");

function urlValida(valor: string) {
  try {
    const url = new URL(valor);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validar(campos: Campos): Erros {
  const erros: Erros = {};

  if (!campos.nome.trim()) erros.nome = "Informe o nome.";
  if (!campos.descricao.trim()) erros.descricao = "Informe a descrição.";
  if (!campos.distribuidora.trim()) erros.distribuidora = "Informe a distribuidora.";
  if (!campos.desenvolvedora.trim()) erros.desenvolvedora = "Informe a desenvolvedora.";
  if (!urlValida(campos.banner.trim())) erros.banner = "Informe uma URL http(s) válida.";
  if (campos.generos.length === 0) erros.generos = "Selecione ao menos um gênero.";

  const base = Number(normalizarPreco(campos.preco_base));
  if (!campos.preco_base.trim() || !(base > 0)) {
    erros.preco_base = "Informe um preço maior que zero.";
  }

  if (campos.preco_ofertado.trim()) {
    const ofertado = Number(normalizarPreco(campos.preco_ofertado));
    if (!(ofertado > 0)) {
      erros.preco_ofertado = "Informe um preço maior que zero.";
    } else if (base > 0 && ofertado >= base) {
      erros.preco_ofertado = "O preço ofertado deve ser menor que o preço base.";
    }
  }

  return erros;
}

function Campo({
  id,
  rotulo,
  erro,
  children,
}: {
  id: string;
  rotulo: string;
  erro?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">
        {rotulo}
      </label>
      {children}
      {erro && (
        <p id={`${id}-erro`} className="mt-1 text-sm text-red-600">
          {erro}
        </p>
      )}
    </div>
  );
}

export default function FormJogo({
  token,
  aoCriar,
}: {
  token: string;
  aoCriar: () => void;
}) {
  const [campos, setCampos] = useState<Campos>(VAZIO);
  const [erros, setErros] = useState<Erros>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [erroGeneros, setErroGeneros] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    listarGeneros()
      .then((lista) => {
        if (ativo) setGeneros(lista);
      })
      .catch((e) => {
        if (ativo) setErroGeneros(mensagemDeErro(e));
      });
    return () => {
      ativo = false;
    };
  }, []);

  function alterar<K extends keyof Campos>(campo: K, valor: Campos[K]) {
    setCampos((atual) => ({ ...atual, [campo]: valor }));
  }

  function alternarGenero(id: number) {
    alterar(
      "generos",
      campos.generos.includes(id)
        ? campos.generos.filter((item) => item !== id)
        : [...campos.generos, id],
    );
  }

  async function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (enviando) return;

    setSucesso(null);
    setErroGeral(null);
    const errosLocais = validar(campos);
    setErros(errosLocais);
    if (Object.keys(errosLocais).length > 0) return;

    setEnviando(true);
    try {
      const jogo = await criarJogo(token, {
        nome: campos.nome.trim(),
        descricao: campos.descricao.trim(),
        banner: campos.banner.trim(),
        preco_base: normalizarPreco(campos.preco_base),
        preco_ofertado: campos.preco_ofertado.trim()
          ? normalizarPreco(campos.preco_ofertado)
          : null,
        generos: campos.generos,
        distribuidora: campos.distribuidora.trim(),
        desenvolvedora: campos.desenvolvedora.trim(),
      });
      setCampos(VAZIO);
      setSucesso(`Jogo "${jogo.nome}" cadastrado com sucesso.`);
      aoCriar();
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        sairDaConta();
        setErroGeral("Sua sessão expirou. Entre novamente para cadastrar.");
      } else {
        setErroGeral(mensagemDeErro(e));
        if (e instanceof ApiError) setErros(e.campos);
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form
      onSubmit={aoEnviar}
      noValidate
      className="grid gap-4 rounded-lg border border-zinc-200 p-4 sm:grid-cols-2 dark:border-zinc-800"
    >
      <h2 className="text-lg font-semibold sm:col-span-2">Cadastrar jogo</h2>

      <Campo id="nome" rotulo="Nome" erro={erros.nome}>
        <input
          id="nome"
          className={estiloInput}
          value={campos.nome}
          onChange={(e) => alterar("nome", e.target.value)}
          maxLength={200}
        />
      </Campo>

      <Campo id="banner" rotulo="Banner (URL da imagem)" erro={erros.banner}>
        <input
          id="banner"
          className={estiloInput}
          value={campos.banner}
          onChange={(e) => alterar("banner", e.target.value)}
          placeholder="https://placehold.co/1200x500?text=Meu+Jogo"
        />
      </Campo>

      <Campo id="desenvolvedora" rotulo="Desenvolvedora" erro={erros.desenvolvedora}>
        <input
          id="desenvolvedora"
          className={estiloInput}
          value={campos.desenvolvedora}
          onChange={(e) => alterar("desenvolvedora", e.target.value)}
          maxLength={200}
        />
      </Campo>

      <Campo id="distribuidora" rotulo="Distribuidora" erro={erros.distribuidora}>
        <input
          id="distribuidora"
          className={estiloInput}
          value={campos.distribuidora}
          onChange={(e) => alterar("distribuidora", e.target.value)}
          maxLength={200}
        />
      </Campo>

      <Campo id="preco_base" rotulo="Preço base (R$)" erro={erros.preco_base}>
        <input
          id="preco_base"
          className={estiloInput}
          inputMode="decimal"
          value={campos.preco_base}
          onChange={(e) => alterar("preco_base", e.target.value)}
          placeholder="99,90"
        />
      </Campo>

      <Campo id="preco_ofertado" rotulo="Preço ofertado (R$, opcional)" erro={erros.preco_ofertado}>
        <input
          id="preco_ofertado"
          className={estiloInput}
          inputMode="decimal"
          value={campos.preco_ofertado}
          onChange={(e) => alterar("preco_ofertado", e.target.value)}
          placeholder="79,90"
        />
      </Campo>

      <div className="sm:col-span-2">
        <Campo id="descricao" rotulo="Descrição" erro={erros.descricao}>
          <textarea
            id="descricao"
            className={estiloInput}
            rows={3}
            value={campos.descricao}
            onChange={(e) => alterar("descricao", e.target.value)}
          />
        </Campo>
      </div>

      <fieldset className="sm:col-span-2">
        <legend className="mb-1 text-sm font-medium">Gêneros</legend>
        {erroGeneros ? (
          <p className="text-sm text-red-600">{erroGeneros}</p>
        ) : generos.length === 0 ? (
          <p className="text-sm text-zinc-500">Carregando gêneros...</p>
        ) : (
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {generos.map((genero) => (
              <label key={genero.id} className="flex items-center gap-1.5 text-sm">
                <input
                  type="checkbox"
                  checked={campos.generos.includes(genero.id)}
                  onChange={() => alternarGenero(genero.id)}
                />
                {genero.nome}
              </label>
            ))}
          </div>
        )}
        {erros.generos && <p className="mt-1 text-sm text-red-600">{erros.generos}</p>}
      </fieldset>

      <div className="flex flex-col gap-2 sm:col-span-2">
        {erroGeral && (
          <p role="alert" className="text-sm text-red-600">
            {erroGeral}
          </p>
        )}
        {sucesso && (
          <p role="status" className="text-sm text-green-600">
            {sucesso}
          </p>
        )}
        <button
          type="submit"
          disabled={enviando}
          className="self-start rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {enviando ? "Salvando..." : "Cadastrar"}
        </button>
      </div>
    </form>
  );
}