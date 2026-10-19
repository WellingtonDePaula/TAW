"use client";

import Link from "next/link";
import { sairDaConta, useToken } from "@/lib/auth";

export default function Cabecalho() {
  const token = useToken();

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-semibold">
          Catálogo de Jogos
        </Link>
        {token ? (
          <button
            type="button"
            onClick={sairDaConta}
            className="rounded border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            Sair
          </button>
        ) : (
          <Link
            href="/login"
            className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Entrar
          </Link>
        )}
      </div>
    </header>
  );
}