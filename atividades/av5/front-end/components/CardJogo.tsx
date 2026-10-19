"use client";

import { useState } from "react";
import type { Jogo } from "@/lib/types";

const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function CardJogo({ jogo }: { jogo: Jogo }) {
  const [imagemFalhou, setImagemFalhou] = useState(false);
  const emOferta = jogo.preco_ofertado !== null;

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
      {imagemFalhou ? (
        <div className="flex h-40 items-center justify-center bg-zinc-200 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          Imagem indisponível
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={jogo.banner}
          alt={`Banner do jogo ${jogo.nome}`}
          className="h-40 w-full object-cover"
          onError={() => setImagemFalhou(true)}
        />
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="text-lg font-semibold">{jogo.nome}</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {jogo.desenvolvedora} · {jogo.distribuidora}
        </p>
        <ul className="flex flex-wrap gap-1.5">
          {jogo.generos.map((genero) => (
            <li
              key={genero.id}
              className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs dark:bg-zinc-800"
            >
              {genero.nome}
            </li>
          ))}
        </ul>
        <p className="line-clamp-3 whitespace-pre-line text-sm">{jogo.descricao}</p>
        <p className="mt-auto pt-2">
          {emOferta ? (
            <>
              <span className="mr-2 text-sm text-zinc-500 line-through">
                {moeda.format(Number(jogo.preco_base))}
              </span>
              <span className="text-lg font-bold text-green-600">
                {moeda.format(Number(jogo.preco_ofertado))}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold">{moeda.format(Number(jogo.preco_base))}</span>
          )}
        </p>
      </div>
    </article>
  );
}