import type { Genero, Jogo, NovoJogo } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:5000";

export class ApiError extends Error {
  status: number;
  campos: Record<string, string>;

  constructor(mensagem: string, status: number, campos: Record<string, string> = {}) {
    super(mensagem);
    this.status = status;
    this.campos = campos;
  }
}

type Opcoes = {
  metodo?: string;
  corpo?: unknown;
  token?: string | null;
};

async function requisicao<T>(caminho: string, opcoes: Opcoes = {}): Promise<T> {
  let resposta: Response;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      method: opcoes.metodo ?? "GET",
      headers: {
        ...(opcoes.corpo !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(opcoes.token ? { Authorization: `Bearer ${opcoes.token}` } : {}),
      },
      body: opcoes.corpo !== undefined ? JSON.stringify(opcoes.corpo) : undefined,
      cache: "no-store",
    });
  } catch {
    throw new ApiError("Não foi possível conectar à API. O back-end está rodando?", 0);
  }

  const json = await resposta.json().catch(() => null);
  if (!resposta.ok) {
    throw new ApiError(
      json?.erro?.mensagem ?? "Erro inesperado.",
      resposta.status,
      json?.erro?.campos ?? {},
    );
  }
  return json.dados as T;
}

export const listarJogos = () => requisicao<Jogo[]>("/jogos");

export const listarGeneros = () => requisicao<Genero[]>("/generos");

export const entrar = (login: string, senha: string) =>
  requisicao<{ token: string }>("/login", { metodo: "POST", corpo: { login, senha } });

export const criarJogo = (token: string, jogo: NovoJogo) =>
  requisicao<Jogo>("/jogos", { metodo: "POST", corpo: jogo, token });

export function mensagemDeErro(erro: unknown) {
  return erro instanceof Error ? erro.message : "Erro inesperado.";
}