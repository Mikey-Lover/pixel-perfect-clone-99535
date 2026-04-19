import { useCallback, useEffect, useState } from "react";
import { SENTAIS, type SentaiId } from "@/data/sentais";
import { STAGE_REWARDS, xpForNextLevel, type HeroProgress } from "@/data/rewards";

const KEY = "sentais-progress-v1";

export interface ProgressState {
  stars: number;
  heroes: Record<SentaiId, HeroProgress>;
  claimedStages: number[];
}

const defaultState = (): ProgressState => ({
  stars: 0,
  heroes: SENTAIS.reduce((acc, s) => {
    acc[s.id] = { level: 1, xp: 0, skins: [] };
    return acc;
  }, {} as Record<SentaiId, HeroProgress>),
  claimedStages: [],
});

const load = (): ProgressState => {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as ProgressState;
    // Merge to ensure all heroes exist (forward compat)
    const base = defaultState();
    return {
      stars: parsed.stars ?? 0,
      heroes: { ...base.heroes, ...(parsed.heroes ?? {}) },
      claimedStages: parsed.claimedStages ?? [],
    };
  } catch {
    return defaultState();
  }
};

export interface LevelUpInfo {
  sentaiId: SentaiId;
  fromLevel: number;
  toLevel: number;
}

export interface ClaimResult {
  alreadyClaimed: boolean;
  stars: number;
  xpPerHero: number;
  unlock?: ReturnType<() => typeof STAGE_REWARDS[number]["unlock"]>;
  levelUps: LevelUpInfo[];
  unlockNew: boolean;
}

export const useProgress = () => {
  const [state, setState] = useState<ProgressState>(load);

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const claimStage = useCallback((stageId: number): ClaimResult => {
    const reward = STAGE_REWARDS[stageId];
    if (!reward) {
      return { alreadyClaimed: false, stars: 0, xpPerHero: 0, levelUps: [], unlockNew: false };
    }

    let result: ClaimResult = {
      alreadyClaimed: false,
      stars: reward.stars,
      xpPerHero: reward.xpPerHero,
      unlock: reward.unlock,
      levelUps: [],
      unlockNew: false,
    };

    setState((prev) => {
      const alreadyClaimed = prev.claimedStages.includes(stageId);
      // Repeat clears: half stars, no skin re-unlock, reduced XP
      const starsGained = alreadyClaimed ? Math.floor(reward.stars / 2) : reward.stars;
      const xpGained = alreadyClaimed ? Math.floor(reward.xpPerHero / 2) : reward.xpPerHero;

      const nextHeroes = { ...prev.heroes };
      const levelUps: LevelUpInfo[] = [];
      for (const s of SENTAIS) {
        const h = nextHeroes[s.id];
        let level = h.level;
        let xp = h.xp + xpGained;
        const startLevel = level;
        while (xp >= xpForNextLevel(level) && level < 50) {
          xp -= xpForNextLevel(level);
          level += 1;
        }
        if (level > startLevel) {
          levelUps.push({ sentaiId: s.id, fromLevel: startLevel, toLevel: level });
        }
        nextHeroes[s.id] = { ...h, level, xp };
      }

      let unlockNew = false;
      if (!alreadyClaimed && reward.unlock) {
        const target = nextHeroes[reward.unlock.sentaiId];
        if (!target.skins.includes(reward.unlock.skinName)) {
          nextHeroes[reward.unlock.sentaiId] = {
            ...target,
            skins: [...target.skins, reward.unlock.skinName],
          };
          unlockNew = true;
        }
      }

      result = {
        alreadyClaimed,
        stars: starsGained,
        xpPerHero: xpGained,
        unlock: reward.unlock,
        levelUps,
        unlockNew,
      };

      return {
        stars: prev.stars + starsGained,
        heroes: nextHeroes,
        claimedStages: alreadyClaimed ? prev.claimedStages : [...prev.claimedStages, stageId],
      };
    });

    return result;
  }, []);

  const reset = useCallback(() => setState(defaultState()), []);

  return { state, claimStage, reset };
};
