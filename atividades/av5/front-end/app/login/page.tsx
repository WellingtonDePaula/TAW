"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { entrar, mensagemDeErro } from "@/lib/api";
import { salvarToken } from "@/lib/auth";

const estiloInput =
  "w-full rounded border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700";

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (enviando) return;

    setErro(null);
    setEnviando(true);
    try {
      const { token } = await entrar(login, senha);
      salvarToken(token);
      router.push("/");
    } catch (e) {
      setErro(mensagemDeErro(e));
      setEnviando(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-sm flex-1 px-4 py-12">
      <h1 className="mb-6 text-2xl font-semibold">Entrar</h1>
      <form onSubmit={aoEnviar} className="flex flex-col gap-4">
        <div>
          <label htmlFor="login" className="mb-1 block text-sm font-medium">
            Login
          </label>
          <input
            id="login"
            className={estiloInput}
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div>
          <label htmlFor="senha" className="mb-1 block text-sm font-medium">
            Senha
          </label>
          <input
            id="senha"
            type="password"
            className={estiloInput}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        {erro && (
          <p role="alert" className="text-sm text-red-600">
            {erro}
          </p>
        )}
        <button
          type="submit"
          disabled={enviando}
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}