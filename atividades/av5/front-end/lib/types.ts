export type Genero = {
  id: number;
  nome: string;
};

export type Jogo = {
  id: number;
  nome: string;
  descricao: string;
  banner: string;
  preco_base: string;
  preco_ofertado: string | null;
  generos: Genero[];
  distribuidora: string;
  desenvolvedora: string;
};

// Corpo enviado ao criar um jogo: generos é uma lista de IDs.
export type NovoJogo = {
  nome: string;
  descricao: string;
  banner: string;
  preco_base: string;
  preco_ofertado: string | null;
  generos: number[];
  distribuidora: string;
  desenvolvedora: string;
};