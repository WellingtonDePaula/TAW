"use client";

import { useSyncExternalStore } from "react";

const CHAVE = "av5_token";
const ouvintes = new Set<() => void>();

function avisar() {
  ouvintes.forEach((ouvinte) => ouvinte());
}

function assinar(ouvinte: () => void) {
  ouvintes.add(ouvinte);
  window.addEventListener("storage", ouvinte);
  return () => {
    ouvintes.delete(ouvinte);
    window.removeEventListener("storage", ouvinte);
  };
}

export function salvarToken(token: string) {
  localStorage.setItem(CHAVE, token);
  avisar();
}

export function sairDaConta() {
  localStorage.removeItem(CHAVE);
  avisar();
}

// Retorna o token (usuário logado) ou null (visitante).
export function useToken() {
  return useSyncExternalStore(
    assinar,
    () => localStorage.getItem(CHAVE),
    () => null,
  );
}