export type StageType =
  | "battle"
  | "arena"
  | "event"
  | "boss"
  | "wave"
  | "survival"
  | "miniboss"
  | "objective";

export interface StageEnemy {
  id: string;
  name: string;
  hp: number;
  atk: number;
  isBoss?: boolean;
  tier?: "comum" | "elite" | "miniboss" | "boss";
}

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
  enemies: StageEnemy[];
  sectorId: SectorId;
}

export type SectorId = "terminal" | "mercado" | "ponte" | "orla";

export interface Sector {
  id: SectorId;
  index: number;
  name: string;
  subtitle: string;
  colorVar: string; // CSS HSL var name
  accentClass: string; // tailwind bg utility
  textClass: string; // tailwind text utility
  ringClass: string;
}

export const SECTORS: Sector[] = [
  {
    id: "terminal",
    index: 1,
    name: "Setor I · Terminal",
    subtitle: "Despertar urbano",
    colorVar: "--sentai-red",
    accentClass: "bg-sentai-red",
    textClass: "text-sentai-red",
    ringClass: "ring-sentai-red/60",
  },
  {
    id: "mercado",
    index: 2,
    name: "Setor II · Mercado",
    subtitle: "Becos e arenas",
    colorVar: "--sentai-yellow",
    accentClass: "bg-sentai-yellow",
    textClass: "text-sentai-yellow",
    ringClass: "ring-sentai-yellow/60",
  },
  {
    id: "ponte",
    index: 3,
    name: "Setor III · Ponte",
    subtitle: "Travessia decisiva",
    colorVar: "--neon-violet",
    accentClass: "bg-neon-violet",
    textClass: "text-neon-violet",
    ringClass: "ring-neon-violet/60",
  },
  {
    id: "orla",
    index: 4,
    name: "Setor IV · Orla",
    subtitle: "Confronto final",
    colorVar: "--sentai-pink",
    accentClass: "bg-sentai-pink",
    textClass: "text-sentai-pink",
    ringClass: "ring-sentai-pink/60",
  },
];

export const SECTOR_BY_ID: Record<SectorId, Sector> = SECTORS.reduce(
  (acc, s) => ({ ...acc, [s.id]: s }),
  {} as Record<SectorId, Sector>,
);

export const ROUTE: Stage[] = [
  // ============ SETOR I · TERMINAL ============
  {
    id: 1,
    sectorId: "terminal",
    name: "Despertar no Terminal",
    location: "Terminal / Bay Market",
    type: "battle",
    description: "Os primeiros sub-chefes urbanos surgem entre as barracas. Tutorial de combate.",
    reward: "200 ⭐ · Skin Iniciante",
    x: 10, y: 88,
    enemies: [
      { id: "s1-a", name: "Capanga do Terminal", hp: 38, atk: 9, tier: "comum" },
      { id: "s1-b", name: "Punguista Néon", hp: 32, atk: 8, tier: "comum" },
    ],
  },
  {
    id: 2,
    sectorId: "terminal",
    name: "Beco do Néon",
    location: "Rua da Conceição",
    type: "battle",
    description: "Inimigos caricatos saídos das luzes. Rotação de equipe liberada.",
    reward: "350 ⭐",
    x: 22, y: 80,
    enemies: [
      { id: "s2-a", name: "Slime do Beco", hp: 48, atk: 11, tier: "comum" },
      { id: "s2-b", name: "Slime Rosado", hp: 42, atk: 10, tier: "comum" },
      { id: "s2-c", name: "Marginal Faísca", hp: 50, atk: 12, tier: "elite" },
    ],
  },
  {
    id: 3,
    sectorId: "terminal",
    name: "Onda do Píer",
    location: "Cais da Baía",
    type: "wave",
    description: "Três ondas crescentes de capangas. Mantenha a equipe viva até o fim.",
    reward: "400 ⭐",
    x: 32, y: 72,
    enemies: [
      { id: "s3-a", name: "Marujo Rebelde", hp: 36, atk: 10, tier: "comum" },
      { id: "s3-b", name: "Marujo Rebelde", hp: 36, atk: 10, tier: "comum" },
      { id: "s3-c", name: "Capitão Pirata", hp: 90, atk: 14, tier: "elite" },
    ],
  },
  {
    id: 4,
    sectorId: "terminal",
    name: "Mini-Boss: Polvo do Cais",
    location: "Doca Norte",
    type: "miniboss",
    description: "Tentáculos elásticos e contra-ataque. Precisa de foco coordenado.",
    reward: "Selo do Cais · 450 ⭐",
    x: 44, y: 64,
    enemies: [
      { id: "s4-boss", name: "Polvo do Cais", hp: 180, atk: 17, tier: "miniboss", isBoss: true },
      { id: "s4-add", name: "Tentáculo", hp: 30, atk: 7, tier: "comum" },
    ],
  },

  // ============ SETOR II · MERCADO ============
  {
    id: 5,
    sectorId: "mercado",
    name: "Mini-Arena Mercado",
    location: "Mercado de Peixes",
    type: "arena",
    description: "PvP sazonal contra times rivais. Top 100 ganha pose dourada.",
    reward: "Pose Lendária",
    x: 56, y: 58,
    enemies: [
      { id: "s5-a", name: "Rival Atum", hp: 70, atk: 14, tier: "elite" },
      { id: "s5-b", name: "Rival Polvo", hp: 65, atk: 13, tier: "elite" },
      { id: "s5-c", name: "Rival Sardinha", hp: 55, atk: 12, tier: "comum" },
    ],
  },
  {
    id: 6,
    sectorId: "mercado",
    name: "Festival do Pôr-do-Sol",
    location: "Praça Leoni Ramos",
    type: "event",
    description: "Evento por tempo limitado. Mini-jogo de ritmo libera buffs.",
    reward: "Selo de Evento · 400 ⭐",
    x: 66, y: 50,
    enemies: [
      { id: "s6-a", name: "Mascote Gigante", hp: 90, atk: 13, tier: "elite" },
      { id: "s6-b", name: "Folião Frenético", hp: 60, atk: 15, tier: "comum" },
    ],
  },
  {
    id: 7,
    sectorId: "mercado",
    name: "Objetivo: Resgate Civil",
    location: "Galeria Subterrânea",
    type: "objective",
    description: "Derrote o líder rapidamente — se ele cair, a missão é cumprida.",
    reward: "Selo Heroico · 500 ⭐",
    x: 74, y: 42,
    enemies: [
      { id: "s7-a", name: "Sequestrador Chefe", hp: 140, atk: 16, tier: "elite" },
      { id: "s7-b", name: "Asseclas", hp: 45, atk: 9, tier: "comum" },
      { id: "s7-c", name: "Asseclas", hp: 45, atk: 9, tier: "comum" },
    ],
  },
  {
    id: 8,
    sectorId: "mercado",
    name: "Sobrevivência da Feira",
    location: "Largo da Feira",
    type: "survival",
    description: "Aguente cinco turnos contra inimigos infinitos.",
    reward: "600 ⭐",
    x: 80, y: 34,
    enemies: [
      { id: "s8-a", name: "Feirante Furioso", hp: 55, atk: 12, tier: "comum" },
      { id: "s8-b", name: "Carregador", hp: 60, atk: 11, tier: "comum" },
      { id: "s8-c", name: "Açougueiro Sombrio", hp: 80, atk: 15, tier: "elite" },
    ],
  },
  {
    id: 9,
    sectorId: "mercado",
    name: "Mini-Boss: Rainha das Sardinhas",
    location: "Cais do Mercado",
    type: "miniboss",
    description: "Convoca cardumes mágicos. Foco no chefe é vital.",
    reward: "Coroa Prateada · 700 ⭐",
    x: 86, y: 26,
    enemies: [
      { id: "s9-boss", name: "Rainha das Sardinhas", hp: 220, atk: 18, tier: "miniboss", isBoss: true },
      { id: "s9-add", name: "Cardume", hp: 25, atk: 6, tier: "comum" },
      { id: "s9-add2", name: "Cardume", hp: 25, atk: 6, tier: "comum" },
    ],
  },

  // ============ SETOR III · PONTE ============
  {
    id: 10,
    sectorId: "ponte",
    name: "Sentinelas da Ponte",
    location: "Acesso Ingá",
    type: "battle",
    description: "Sentinelas em formação. Quebre a linha para avançar.",
    reward: "550 ⭐",
    x: 80, y: 18,
    enemies: [
      { id: "s10-a", name: "Sentinela", hp: 75, atk: 14, tier: "comum" },
      { id: "s10-b", name: "Sentinela", hp: 75, atk: 14, tier: "comum" },
      { id: "s10-c", name: "Sentinela Elite", hp: 100, atk: 16, tier: "elite" },
    ],
  },
  {
    id: 11,
    sectorId: "ponte",
    name: "Onda dos Cabos",
    location: "Vão Central",
    type: "wave",
    description: "Drones lançados pelos cabos da ponte em duas ondas.",
    reward: "650 ⭐",
    x: 70, y: 14,
    enemies: [
      { id: "s11-a", name: "Drone Vespa", hp: 40, atk: 13, tier: "comum" },
      { id: "s11-b", name: "Drone Vespa", hp: 40, atk: 13, tier: "comum" },
      { id: "s11-c", name: "Drone Comando", hp: 110, atk: 17, tier: "elite" },
    ],
  },
  {
    id: 12,
    sectorId: "ponte",
    name: "Ponte do Comando",
    location: "Centro da Ponte",
    type: "battle",
    description: "Onda final de capangas antes do confronto decisivo.",
    reward: "700 ⭐",
    x: 58, y: 12,
    enemies: [
      { id: "s12-a", name: "Capitão da Ponte", hp: 130, atk: 17, tier: "elite" },
      { id: "s12-b", name: "Sentinela", hp: 80, atk: 14, tier: "comum" },
      { id: "s12-c", name: "Sentinela", hp: 80, atk: 14, tier: "comum" },
    ],
  },
  {
    id: 13,
    sectorId: "ponte",
    name: "Mini-Boss: General Fênix",
    location: "Pilar Sul",
    type: "miniboss",
    description: "Renasce uma vez ao morrer. Prepare-se para o segundo round.",
    reward: "Brasão Fênix · 900 ⭐",
    x: 46, y: 16,
    enemies: [
      { id: "s13-boss", name: "General Fênix", hp: 260, atk: 20, tier: "miniboss", isBoss: true },
    ],
  },

  // ============ SETOR IV · ORLA ============
  {
    id: 14,
    sectorId: "orla",
    name: "Mini-Arena Calçadão",
    location: "Praia de Icaraí",
    type: "arena",
    description: "Co-op 3v3 contra equipes de elite.",
    reward: "Skin Praiana",
    x: 36, y: 24,
    enemies: [
      { id: "s14-a", name: "Surfista Sombrio", hp: 110, atk: 17, tier: "elite" },
      { id: "s14-b", name: "Vendedor Furacão", hp: 95, atk: 16, tier: "elite" },
      { id: "s14-c", name: "Salva-vidas Rival", hp: 120, atk: 15, tier: "elite" },
    ],
  },
  {
    id: 15,
    sectorId: "orla",
    name: "Objetivo: Sirene Mística",
    location: "Pedra do Índio",
    type: "objective",
    description: "Silencie a sirene em até 6 turnos antes que ela encante a equipe.",
    reward: "Selo da Maré · 850 ⭐",
    x: 28, y: 32,
    enemies: [
      { id: "s15-a", name: "Sirene Mística", hp: 200, atk: 19, tier: "elite" },
      { id: "s15-b", name: "Eco da Sirene", hp: 50, atk: 11, tier: "comum" },
    ],
  },
  {
    id: 16,
    sectorId: "orla",
    name: "Sobrevivência da Maré",
    location: "Enseada de São Francisco",
    type: "survival",
    description: "A maré sobe a cada turno. Resista enquanto puder.",
    reward: "950 ⭐",
    x: 22, y: 42,
    enemies: [
      { id: "s16-a", name: "Tubarão Espectral", hp: 130, atk: 18, tier: "elite" },
      { id: "s16-b", name: "Sucuri da Baía", hp: 110, atk: 16, tier: "elite" },
      { id: "s16-c", name: "Lula Abissal", hp: 150, atk: 19, tier: "elite" },
    ],
  },
  {
    id: 17,
    sectorId: "orla",
    name: "Guardiões do Canto",
    location: "Canto do Rio",
    type: "battle",
    description: "Os escolhidos da baía protegem o caminho do chefe final.",
    reward: "1100 ⭐",
    x: 18, y: 54,
    enemies: [
      { id: "s17-a", name: "Guardião Coral", hp: 160, atk: 19, tier: "elite" },
      { id: "s17-b", name: "Guardião Pérola", hp: 160, atk: 19, tier: "elite" },
    ],
  },
  {
    id: 18,
    sectorId: "orla",
    name: "Chefe: Caranguejo Místico",
    location: "Ponta do Canto do Rio",
    type: "boss",
    description: "Enfrente o guardião supremo da baía. Recompensa de temporada.",
    reward: "🏆 Troféu Rota Sagrada · 1500 ⭐",
    x: 14, y: 66,
    enemies: [
      { id: "s18-add1", name: "Caranguejo Menor", hp: 70, atk: 12, tier: "comum" },
      { id: "s18-add2", name: "Caranguejo Menor", hp: 70, atk: 12, tier: "comum" },
      { id: "s18-boss", name: "Caranguejo Místico", hp: 360, atk: 24, tier: "boss", isBoss: true },
    ],
  },
];

export const STAGE_META: Record<
  StageType,
  { label: string; color: string; ring: string; icon: string }
> = {
  battle: { label: "Batalha", color: "bg-sentai-red", ring: "ring-sentai-red/60", icon: "⚔️" },
  arena: { label: "Mini-Arena", color: "bg-neon-cyan", ring: "ring-neon-cyan/60", icon: "🏟️" },
  event: { label: "Evento", color: "bg-sentai-yellow", ring: "ring-sentai-yellow/60", icon: "🎉" },
  boss: { label: "Chefe", color: "bg-sentai-pink", ring: "ring-sentai-pink/60", icon: "👑" },
  wave: { label: "Ondas", color: "bg-sentai-green", ring: "ring-sentai-green/60", icon: "🌊" },
  survival: { label: "Sobrevivência", color: "bg-neon-violet", ring: "ring-neon-violet/60", icon: "⏳" },
  miniboss: { label: "Mini-Chefe", color: "bg-neon-gold", ring: "ring-neon-gold/60", icon: "💀" },
  objective: { label: "Objetivo", color: "bg-neon-cyan", ring: "ring-neon-cyan/60", icon: "🎯" },
};

export const stagesBySector = (sectorId: SectorId) => ROUTE.filter((s) => s.sectorId === sectorId);
