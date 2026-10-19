"use client";

import { useEffect, useState } from "react";
import CardJogo from "@/components/CardJogo";
import { listarJogos, mensagemDeErro } from "@/lib/api";
import type { Jogo } from "@/lib/types";

export default function Home() {
  const [jogos, setJogos] = useState<Jogo[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    listarJogos()
      .then((lista) => {
        if (ativo) setJogos(lista);
      })
      .catch((e) => {
        if (ativo) setErro(mensagemDeErro(e));
      });
    return () => {
      ativo = false;
    };
  }, []);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 space-y-8 px-4 py-8">
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