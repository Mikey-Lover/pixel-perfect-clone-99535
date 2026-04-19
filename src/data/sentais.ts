export type SentaiId = "rubro" | "dourado" | "esmeralda" | "onix" | "rosa";

export interface Sentai {
  id: SentaiId;
  name: string;
  codename: string;
  color: string; // tailwind sentai-* token
  hex: string; // for inline glows
  role: string;
  personality: string;
  stats: { atk: number; def: number; spd: number; mag: number };
  hp: number;
  skill: { name: string; description: string; damage: number; type: "atk" | "heal" | "buff" };
  pose: string; // emoji-as-pose accent
}

export const SENTAIS: Sentai[] = [
  {
    id: "rubro",
    name: "Sentai Rubro",
    codename: "Líder Carmesim",
    color: "sentai-red",
    hex: "354 86% 54%",
    role: "Líder · Dano & Comando",
    personality: "Carismático, destemido e teatral. Encara cada batalha como um espetáculo.",
    stats: { atk: 92, def: 70, spd: 75, mag: 60 },
    hp: 120,
    skill: { name: "Lâmina do Crepúsculo", description: "Corte flamejante que rasga a guarda inimiga.", damage: 38, type: "atk" },
    pose: "⚔️",
  },
  {
    id: "dourado",
    name: "Sentai Dourado",
    codename: "Raio Âmbar",
    color: "sentai-yellow",
    hex: "44 96% 56%",
    role: "Velocidade · Combos",
    personality: "Ágil, espirituoso e competitivo. Sempre o primeiro a atacar.",
    stats: { atk: 78, def: 55, spd: 98, mag: 70 },
    hp: 95,
    skill: { name: "Tempestade Dourada", description: "Cinco golpes consecutivos em velocidade luminosa.", damage: 32, type: "atk" },
    pose: "⚡",
  },
  {
    id: "esmeralda",
    name: "Sentai Esmeralda",
    codename: "Sombra Verde",
    color: "sentai-green",
    hex: "152 72% 46%",
    role: "Controle · Técnica",
    personality: "Estratégico, observador e preciso. Lê o campo antes de agir.",
    stats: { atk: 70, def: 80, spd: 82, mag: 88 },
    hp: 105,
    skill: { name: "Selo da Mata", description: "Imobiliza o alvo em raízes místicas e drena energia.", damage: 28, type: "atk" },
    pose: "🌿",
  },
  {
    id: "onix",
    name: "Sentai Ônix",
    codename: "Muralha Negra",
    color: "sentai-black",
    hex: "230 20% 14%",
    role: "Defesa · Contra-ataque",
    personality: "Frio, elegante e intimidador. Absorve qualquer impacto sem piscar.",
    stats: { atk: 85, def: 96, spd: 50, mag: 55 },
    hp: 145,
    skill: { name: "Eclipse Total", description: "Bloqueia o próximo ataque e devolve em dobro.", damage: 42, type: "atk" },
    pose: "🛡️",
  },
  {
    id: "rosa",
    name: "Sentai Rosa",
    codename: "Brilho Encantado",
    color: "sentai-pink",
    hex: "330 90% 62%",
    role: "Cura · Buffs",
    personality: "Charmosa, afiada e decisiva. Cura o corpo e quebra o ego inimigo.",
    stats: { atk: 60, def: 65, spd: 80, mag: 95 },
    hp: 100,
    skill: { name: "Pulso Encantado", description: "Restaura HP da equipe com brilho mágico.", damage: 40, type: "heal" },
    pose: "💖",
  },
];
