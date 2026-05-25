import HeroSection from "./components/HeroSection";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 dark:bg-black font-sans">

      {/* Header */}
      <header className="w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚀</span>
            <span className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
              Rocket<span className="text-orange-500">League</span> Hub
            </span>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <a href="#sobre" className="hover:text-orange-500 transition-colors">Sobre</a>
            <a href="#ranks" className="hover:text-orange-500 transition-colors">Ranks</a>
            <a href="#dicas" className="hover:text-orange-500 transition-colors">Dicas</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="w-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-orange-400 text-sm font-semibold uppercase tracking-widest mb-4">
            O melhor jogo de futebol com carros do mundo
          </p>
          <h1 className="text-5xl sm:text-6xl font-black leading-tight mb-6">
            Rocket League
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed">
            Domina a arena, sobe no rank e torna-te lenda. Explora carros, descobre o teu rank e fica com as melhores dicas.
          </p>
        </div>
      </section>

      {/* Conteúdo principal com o componente */}
      <main id="sobre" className="w-full max-w-4xl mx-auto px-6 py-16">

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
            🏎️ Explore o universo do Rocket League
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed max-w-2xl">
            Escolhe o teu carro favorito, descobre em que rank estás pelo teu MMR e aprende dicas para subir na classificação.
          </p>
        </div>

        <HeroSection />

        {/* Sobre o jogo */}
        <section id="sobre" className="mt-20">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
            Sobre o jogo
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                emoji: "⚽",
                title: "Futebol com carros",
                desc: "Desenvolvido pela Psyonix, Rocket League combina futebol e corrida numa arena competitiva única. Disponível gratuitamente desde 2020.",
              },
              {
                emoji: "🏆",
                title: "Cena competitiva",
                desc: "A Rocket League Championship Series (RLCS) é o maior torneio mundial, com premiações milionárias e times profissionais de todo o mundo.",
              },
              {
                emoji: "🎮",
                title: "Cross-platform",
                desc: "Disponível no PC, PlayStation, Xbox e Nintendo Switch com suporte a cross-play — joga contra qualquer pessoa em qualquer plataforma.",
              },
              {
                emoji: "🛠️",
                title: "Customização total",
                desc: "Personaliza o teu carro com centenas de itens: rodas, decals, boosts, antenas, chapéus e muito mais.",
              },
              {
                emoji: "📈",
                title: "Estatísticas em tempo real",
                desc: "Acompanha o desempenho dos jogadores e equipes em tempo real, com dados detalhados sobre partidas, rankings e desempenho.",
              },
              {
                emoji: "🌍",
                title: "Mundo em constante evolução",
                desc: "Rocket League é um jogo em constante atualização, com novos carros, mapas e modos de jogo adicionados regularmente.",
              },
              {
                emoji: "🎉",
                title: "Eventos e torneios",
                desc: "Participa de eventos especiais e torneios regulares com prêmios incríveis e a chance de provar o teu talento contra os melhores jogadores.",
              }
            ].map((card) => (
              <div
                key={card.title}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6"
              >
                <div className="text-3xl mb-3">{card.emoji}</div>
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">{card.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 py-8 mt-auto">
        <div className="max-w-4xl mx-auto px-6 text-center text-sm text-zinc-400">
          🚀 Rocket League Hub — Feito com Next.js · Não afiliado à Psyonix ou Epic Games
        </div>
      </footer>
    </div>
  );
}
