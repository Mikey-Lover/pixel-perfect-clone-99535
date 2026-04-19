export type StageType = "battle" | "arena" | "event" | "boss";

export interface Stage {
  id: number;
  name: string;
  location: string;
  type: StageType;
  description: string;
  reward: string;
  // percent positions on the map background
  x: number;
  y: number;
}

export const ROUTE: Stage[] = [
  {
    id: 1,
    name: "Despertar no Terminal",
    location: "Terminal / Bay Market",
    type: "battle",
    description: "Os primeiros sub-chefes urbanos surgem entre as barracas. Tutorial de combate.",
    reward: "200 Estrelas · Skin Iniciante",
    x: 12,
    y: 78,
  },
  {
    id: 2,
    name: "Beco do Néon",
    location: "Rua da Conceição",
    type: "battle",
    description: "Inimigos caricatos saídos das luzes. Rotação de equipe liberada.",
    reward: "350 Estrelas",
    x: 28,
    y: 62,
  },
  {
    id: 3,
    name: "Mini-Arena Mercado",
    location: "Mercado de Peixes",
    type: "arena",
    description: "PvP sazonal contra times rivais. Top 100 ganha pose dourada.",
    reward: "Pose Lendária",
    x: 42,
    y: 50,
  },
  {
    id: 4,
    name: "Festival do Pôr-do-Sol",
    location: "Praça Leoni Ramos",
    type: "event",
    description: "Evento por tempo limitado. Mini-jogo de ritmo libera buffs.",
    reward: "Selo de Evento",
    x: 56,
    y: 42,
  },
  {
    id: 5,
    name: "Ponte do Comando",
    location: "Ingá → Icaraí",
    type: "battle",
    description: "Onda final de capangas antes do confronto decisivo.",
    reward: "500 Estrelas",
    x: 70,
    y: 36,
  },
  {
    id: 6,
    name: "Mini-Arena Calçadão",
    location: "Praia de Icaraí",
    type: "arena",
    description: "Co-op 3v3 contra equipes de elite.",
    reward: "Skin Praiana",
    x: 80,
    y: 50,
  },
  {
    id: 7,
    name: "Chefe: Caranguejo Místico",
    location: "Canto do Rio",
    type: "boss",
    description: "Enfrente o guardião da baía. Recompensa de temporada.",
    reward: "Troféu Rota Sagrada",
    x: 90,
    y: 70,
  },
];

export const STAGE_META: Record<StageType, { label: string; color: string; ring: string }> = {
  battle: { label: "Batalha", color: "bg-sentai-red", ring: "ring-sentai-red/60" },
  arena: { label: "Mini-Arena", color: "bg-neon-cyan", ring: "ring-neon-cyan/60" },
  event: { label: "Evento", color: "bg-sentai-yellow", ring: "ring-sentai-yellow/60" },
  boss: { label: "Chefe", color: "bg-sentai-pink", ring: "ring-sentai-pink/60" },
};
