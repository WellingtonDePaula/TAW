"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CardJogo from "@/components/CardJogo";
import FormJogo from "@/components/FormJogo";
import { listarJogos, mensagemDeErro } from "@/lib/api";
import { useToken } from "@/lib/auth";
import type { Jogo } from "@/lib/types";

export default function Home() {
  const token = useToken();
  const [jogos, setJogos] = useState<Jogo[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  // Ao cadastrar um jogo, aumentamos "versao" para recarregar a lista.
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    let ativo = true;
    listarJogos()
      .then((lista) => {
        if (!ativo) return;
        setJogos(lista);
        setErro(null);
      })
      .catch((e) => {
        if (ativo) setErro(mensagemDeErro(e));
      });
    return () => {
      ativo = false;
    };
  }, [versao]);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 space-y-8 px-4 py-8">
      {token ? (
        <FormJogo token={token} aoCriar={() => setVersao((v) => v + 1)} />
      ) : (
        <p className="rounded-lg border border-zinc-200 p-4 text-sm dark:border-zinc-800">
          Para cadastrar jogos você precisa{" "}
          <Link href="/login" className="font-medium text-blue-600 underline">
            entrar
          </Link>
          .
        </p>
      )}

      <section aria-labelledby="titulo-lista">
        <h1 id="titulo-lista" className="mb-4 text-2xl font-semibold">
          Jogos cadastrados
        </h1>
        {erro ? (
          <p role="alert" className="text-red-600">
            {erro}
          </p>
        ) : jogos === null ? (
          <p className="text-zinc-500">Carregando jogos...</p>
        ) : jogos.length === 0 ? (
          <p className="text-zinc-500">Nenhum jogo cadastrado ainda.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jogos.map((jogo) => (
              <CardJogo key={jogo.id} jogo={jogo} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}