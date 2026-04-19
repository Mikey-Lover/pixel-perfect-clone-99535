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
  1: {
    stars: 200,
    xpPerHero: 40,
    unlock: { sentaiId: "rubro", skinName: "Skin Iniciante Rubra", poseEmoji: "🔥", rarity: "Comum" },
  },
  2: {
    stars: 350,
    xpPerHero: 60,
    unlock: { sentaiId: "esmeralda", skinName: "Manto da Mata Néon", poseEmoji: "🌪️", rarity: "Raro" },
  },
  3: {
    stars: 500,
    xpPerHero: 90,
    unlock: { sentaiId: "dourado", skinName: "Pose Lendária Dourada", poseEmoji: "✨", rarity: "Lendário" },
  },
  4: {
    stars: 400,
    xpPerHero: 75,
    unlock: { sentaiId: "rosa", skinName: "Selo do Pôr-do-Sol", poseEmoji: "🌅", rarity: "Épico" },
  },
  5: {
    stars: 600,
    xpPerHero: 100,
    unlock: { sentaiId: "onix", skinName: "Comando da Ponte", poseEmoji: "🌉", rarity: "Épico" },
  },
  6: {
    stars: 700,
    xpPerHero: 120,
    unlock: { sentaiId: "rosa", skinName: "Skin Praiana Encantada", poseEmoji: "🏖️", rarity: "Raro" },
  },
  7: {
    stars: 1500,
    xpPerHero: 250,
    unlock: { sentaiId: "rubro", skinName: "Troféu Rota Sagrada", poseEmoji: "🏆", rarity: "Lendário" },
  },
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
