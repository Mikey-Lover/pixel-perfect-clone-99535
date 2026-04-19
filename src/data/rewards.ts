import type { SentaiId } from "./sentais";

export interface StageReward {
  stars: number;
  xpPerHero: number;
  unlock?: {
    sentaiId: SentaiId;
    skinName: string;
    poseEmoji: string;
    rarity: "Comum" | "Raro" | "Épico" | "Lendário";
  };
}

export const STAGE_REWARDS: Record<number, StageReward> = {
  // SETOR I · TERMINAL
  1: { stars: 200, xpPerHero: 40, unlock: { sentaiId: "rubro", skinName: "Skin Iniciante Rubra", poseEmoji: "🔥", rarity: "Comum" } },
  2: { stars: 350, xpPerHero: 60, unlock: { sentaiId: "esmeralda", skinName: "Manto da Mata Néon", poseEmoji: "🌪️", rarity: "Raro" } },
  3: { stars: 400, xpPerHero: 70 },
  4: { stars: 450, xpPerHero: 85, unlock: { sentaiId: "onix", skinName: "Selo do Cais", poseEmoji: "🐙", rarity: "Raro" } },

  // SETOR II · MERCADO
  5: { stars: 500, xpPerHero: 90, unlock: { sentaiId: "dourado", skinName: "Pose Lendária Dourada", poseEmoji: "✨", rarity: "Lendário" } },
  6: { stars: 400, xpPerHero: 75, unlock: { sentaiId: "rosa", skinName: "Selo do Pôr-do-Sol", poseEmoji: "🌅", rarity: "Épico" } },
  7: { stars: 500, xpPerHero: 95, unlock: { sentaiId: "esmeralda", skinName: "Selo Heroico", poseEmoji: "🛡️", rarity: "Raro" } },
  8: { stars: 600, xpPerHero: 110 },
  9: { stars: 700, xpPerHero: 130, unlock: { sentaiId: "rosa", skinName: "Coroa Prateada", poseEmoji: "👑", rarity: "Épico" } },

  // SETOR III · PONTE
  10: { stars: 550, xpPerHero: 100 },
  11: { stars: 650, xpPerHero: 120 },
  12: { stars: 700, xpPerHero: 130, unlock: { sentaiId: "onix", skinName: "Comando da Ponte", poseEmoji: "🌉", rarity: "Épico" } },
  13: { stars: 900, xpPerHero: 160, unlock: { sentaiId: "dourado", skinName: "Brasão Fênix", poseEmoji: "🦅", rarity: "Lendário" } },

  // SETOR IV · ORLA
  14: { stars: 700, xpPerHero: 130, unlock: { sentaiId: "rosa", skinName: "Skin Praiana Encantada", poseEmoji: "🏖️", rarity: "Raro" } },
  15: { stars: 850, xpPerHero: 150, unlock: { sentaiId: "esmeralda", skinName: "Selo da Maré", poseEmoji: "🌊", rarity: "Épico" } },
  16: { stars: 950, xpPerHero: 170 },
  17: { stars: 1100, xpPerHero: 200, unlock: { sentaiId: "onix", skinName: "Guardião da Baía", poseEmoji: "🦀", rarity: "Épico" } },
  18: { stars: 1500, xpPerHero: 250, unlock: { sentaiId: "rubro", skinName: "Troféu Rota Sagrada", poseEmoji: "🏆", rarity: "Lendário" } },
};

// Level curve: XP needed for next level
export const xpForNextLevel = (level: number) => 100 + (level - 1) * 60;

export interface HeroProgress {
  level: number;
  xp: number;
  skins: string[];
}

export const heroBoost = (level: number) => ({
  hpBonus: (level - 1) * 12,
  atkBonus: (level - 1) * 4,
});
