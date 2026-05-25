"use client";

import { useState } from "react";

const getRandomRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const cars = [
  { name: "Octane", tier: "Comum", color: "#777777", emoji: "🚗" },
  { name: "Dominus", tier: "Raro", color: "#00D4FF", emoji: "🏎️" },
  { name: "Fennec", tier: "Épico", color: "#FF00AA", emoji: "🚀" },
  { name: "Breakout", tier: "Incomum", color: "#00FF88", emoji: "🔥" },
];

const ranks = [
  { name: "Bronze", color: "#CD7F32", min: 0, max: 300 },
  { name: "Prata", color: "#C0C0C0", min: 301, max: 600 },
  { name: "Ouro", color: "#FFD700", min: 601, max: 900 },
  { name: "Platina", color: "#00CFDD", min: 901, max: 1200 },
  { name: "Diamante", color: "#4FC3F7", min: 1201, max: 1500 },
  { name: "Champion", color: "#9C27B0", min: 1501, max: 1800 },
  { name: "Grand Champion", color: "#F44336", min: 1801, max: 2100 },
  { name: "Supersonic Legend", color: "#FF6B35", min: 2101, max: 2400 },
];

const tips = [
  "Use boost com sabedoria — não desperdice em linha reta.",
  "Rotação é a chave: sempre cubra sua meta quando seus companheiros atacam.",
  "Pratique aerials no modo treinamento livre.",
  "Leia o jogo: antecipe onde a bola vai estar, não onde ela está.",
  "Comunique com seus aliados usando o chat rápido.",
  "Mantenha a calma — o tilt é o maior inimigo do progresso.",
  "Estude os jogadores profissionais e imite seus movimentos.",
  "Seja respeitoso no chat público, você pode ser banido e perder acesso ao jogo.",
  "Participe de torneios e eventos para testar suas habilidades e ganhar prêmios.",
  "Atualize-se com as últimas novidades e atualizações do jogo.",
];

function HeroSection() {
  const [selectedCar, setSelectedCar] = useState(cars[0]);
  const [mmr, setMmr] = useState(1000);
  const [tipIndex, setTipIndex] = useState(0);

  const currentRank = ranks.find((r) => mmr >= r.min && mmr <= r.max) || ranks[0];

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", width: "100%" }}>
      <h2 className="sr-only">Site interativo sobre Rocket League</h2>

      {/* Seção de carros */}
      <div style={{ marginBottom: "2rem" }}>
        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Escolha seu carro
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
          {cars.map((car) => (
            <button
              key={car.name}
              onClick={() => setSelectedCar(car)}
              style={{
                background: selectedCar.name === car.name ? "var(--color-background-secondary)" : "var(--color-background-primary)",
                border: selectedCar.name === car.name
                  ? `2px solid ${car.color}`
                  : "0.5px solid var(--color-border-tertiary)",
                borderRadius: "var(--border-radius-lg)",
                padding: "14px 10px",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 6 }}>{car.emoji}</div>
              <div style={{ fontWeight: 500, fontSize: 14, color: "var(--color-text-primary)" }}>{car.name}</div>
              <div style={{
                marginTop: 6, display: "inline-block",
                fontSize: 11, padding: "2px 8px",
                borderRadius: 99, background: "var(--color-background-secondary)",
                color: "var(--color-text-secondary)"
              }}>
                {car.tier}
              </div>
            </button>
          ))}
        </div>
        {selectedCar && (
          <div style={{
            marginTop: 12, padding: "12px 16px",
            background: "var(--color-background-secondary)",
            borderRadius: "var(--border-radius-md)",
            borderLeft: `3px solid ${selectedCar.color}`,
            fontSize: 14, color: "var(--color-text-primary)"
          }}>
            Você escolheu o <strong style={{ color: selectedCar.color }}>{selectedCar.name}</strong> — um dos carros mais populares do Rocket League!
          </div>
        )}
      </div>

      {/* Calculadora de rank */}
      <div style={{
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--border-radius-lg)",
        padding: "1.25rem",
        marginBottom: "2rem"
      }}>
        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Descubra seu rank pelo MMR
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 13, color: "var(--color-text-secondary)", minWidth: 32 }}>0</span>
          <input
            type="range" min={0} max={2400} step={50} value={mmr}
            onChange={(e) => setMmr(Number(e.target.value))}
            style={{ flex: 1 }}
          />
          <span style={{ fontSize: 13, color: "var(--color-text-secondary)", minWidth: 36, textAlign: "right" }}>2400</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: currentRank.color + "22",
            border: `2px solid ${currentRank.color}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, flexShrink: 0
          }}>🏅</div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 500, color: currentRank.color }}>{currentRank.name}</div>
            <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{mmr} MMR</div>
          </div>
        </div>
        <div style={{ marginTop: 16, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {ranks.map((r) => (
            <div key={r.name} style={{
              height: 6, flex: 1, minWidth: 20,
              borderRadius: 3,
              background: mmr >= r.min ? r.color : "var(--color-border-tertiary)",
              transition: "background 0.3s"
            }} title={r.name} />
          ))}
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: "var(--color-text-secondary)" }}>
          Progresso até o próximo rank: {Math.round(((mmr - currentRank.min) / (currentRank.max - currentRank.min)) * 100)}%
        </div>
      </div>

      {/* Dicas */}
      <div style={{
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--border-radius-lg)",
        padding: "1.25rem",
        marginBottom: "2rem"
      }}>
        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Dica do dia
        </p>
        <p style={{ fontSize: 15, color: "var(--color-text-primary)", lineHeight: 1.6, margin: 0 }}>
          💡 {tips[tipIndex]}
        </p>
        <button
          onClick={() => setTipIndex(getRandomRange(0, tips.length - 1))}
          style={{ marginTop: 12 }}
        >
          Próxima dica →
        </button>
      </div>

      {/* Stats fictícios */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
        {[
          { label: "Jogadores ativos", value: "1B+" },
          { label: "Partidas por dia", value: "~12M" },
          { label: "Países", value: "150+" },
          { label: "Torneios RLCS", value: "200+" },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: "var(--color-background-secondary)",
            borderRadius: "var(--border-radius-md)",
            padding: "1rem",
            textAlign: "center"
          }}>
            <div style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)" }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HeroSection;