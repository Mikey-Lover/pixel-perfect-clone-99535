import { useEffect, useMemo, useRef, useState } from "react";
import { SENTAIS, type Sentai, type SentaiId } from "@/data/sentais";
import enemySlime from "@/assets/enemy-thug.png";
import bossKaiju from "@/assets/boss-kaiju.png";
import { cn } from "@/lib/utils";
import { Heart, Sword, Sparkles, Trophy, RotateCcw, Map as MapIcon, Star } from "lucide-react";
import type { Stage, StageEnemy } from "@/data/route";
import { heroBoost, type HeroProgress } from "@/data/rewards";
import { LootModal } from "@/components/LootModal";
import type { ClaimResult } from "@/hooks/useProgress";

interface Enemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  atk: number;
  sprite: string;
  isBoss?: boolean;
}

interface Combatant extends Sentai {
  curHp: number;
  level: number;
  atkBonus: number;
}

type LogEntry = { id: number; text: string; tone: "ally" | "enemy" | "info" | "win" };

const colorClass: Record<string, string> = {
  rubro: "from-sentai-red to-orange-600",
  dourado: "from-sentai-yellow to-amber-500",
  esmeralda: "from-sentai-green to-teal-500",
  onix: "from-zinc-700 to-zinc-900",
  rosa: "from-sentai-pink to-fuchsia-500",
};

// Default free-play wave when there's no stage selected
const DEFAULT_ENEMIES: StageEnemy[] = [
  { id: "free-a", name: "Slime do Beco", hp: 40, atk: 10 },
  { id: "free-b", name: "Slime Rosado", hp: 35, atk: 8 },
];

const toEnemies = (list: StageEnemy[]): Enemy[] =>
  list.map((e) => ({
    ...e,
    maxHp: e.hp,
    sprite: e.isBoss ? bossKaiju : enemySlime,
  }));

interface Props {
  stage?: Stage | null;
  heroes?: Record<SentaiId, HeroProgress>;
  onVictory?: (stageId: number) => ClaimResult;
  onExit?: () => void;
}

const buildTeam = (heroes?: Record<SentaiId, HeroProgress>): Combatant[] =>
  SENTAIS.map((s) => {
    const level = heroes?.[s.id]?.level ?? 1;
    const { hpBonus, atkBonus } = heroBoost(level);
    const maxHp = s.hp + hpBonus;
    return { ...s, hp: maxHp, curHp: maxHp, level, atkBonus };
  });

export const BattleView = ({ stage, heroes, onVictory, onExit }: Props) => {
  const initialEnemies = useMemo(
    () => toEnemies(stage?.enemies ?? DEFAULT_ENEMIES),
    [stage?.id]
  );

  const [team, setTeam] = useState<Combatant[]>(() => buildTeam(heroes));
  const [enemies, setEnemies] = useState<Enemy[]>(initialEnemies);
  const [activeIdx, setActiveIdx] = useState(0);
  const [targetId, setTargetId] = useState<string | null>(initialEnemies[0]?.id ?? null);
  const [log, setLog] = useState<LogEntry[]>([
    {
      id: 0,
      text: stage
        ? `Fase ${stage.id} · ${stage.name}. Os Sentais se posicionam!`
        : "A rota desperta. Os Sentais se posicionam!",
      tone: "info",
    },
  ]);
  const [hitId, setHitId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [outcome, setOutcome] = useState<"win" | "lose" | null>(null);
  const [loot, setLoot] = useState<ClaimResult | null>(null);
  const victoryReportedRef = useRef(false);
  const logRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(1);

  // Reset whole battle when the selected stage changes
  useEffect(() => {
    const fresh = toEnemies(stage?.enemies ?? DEFAULT_ENEMIES);
    setTeam(SENTAIS.map((s) => ({ ...s, curHp: s.hp })));
    setEnemies(fresh);
    setActiveIdx(0);
    setTargetId(fresh[0]?.id ?? null);
    setLog([
      {
        id: 0,
        text: stage
          ? `Fase ${stage.id} · ${stage.name}. Os Sentais se posicionam!`
          : "A rota desperta. Os Sentais se posicionam!",
        tone: "info",
      },
    ]);
    setOutcome(null);
    setBusy(false);
    victoryReportedRef.current = false;
    idRef.current = 1;
  }, [stage?.id]);

  const aliveEnemies = useMemo(() => enemies.filter((e) => e.hp > 0), [enemies]);
  const active = team[activeIdx];

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [log]);

  useEffect(() => {
    if (!targetId || !enemies.find((e) => e.id === targetId && e.hp > 0)) {
      setTargetId(aliveEnemies[0]?.id ?? null);
    }
  }, [enemies, targetId, aliveEnemies]);

  const pushLog = (text: string, tone: LogEntry["tone"] = "info") =>
    setLog((l) => [...l, { id: idRef.current++, text, tone }]);

  const flash = (id: string) => {
    setHitId(id);
    window.setTimeout(() => setHitId(null), 450);
  };

  const advanceTurn = (newTeam: Combatant[], newEnemies: Enemy[]) => {
    if (newEnemies.every((e) => e.hp <= 0)) {
      pushLog(
        stage
          ? `🏆 Fase concluída! Recompensa: ${stage.reward}`
          : "🏆 ROTA COMPLETA! Troféu Rota Sagrada conquistado!",
        "win"
      );
      setOutcome("win");
      setBusy(false);
      if (stage && !victoryReportedRef.current) {
        victoryReportedRef.current = true;
        onVictory?.(stage.id);
      }
      return;
    }

    let nextIdx = activeIdx;
    for (let i = 1; i <= newTeam.length; i++) {
      const candidate = (activeIdx + i) % newTeam.length;
      if (newTeam[candidate].curHp > 0) {
        nextIdx = candidate;
        break;
      }
    }

    const wasLastAlly =
      newTeam.slice(activeIdx + 1).every((t) => t.curHp <= 0) || nextIdx <= activeIdx;

    if (wasLastAlly) {
      window.setTimeout(() => enemyPhase(newTeam, newEnemies, nextIdx), 600);
    } else {
      setActiveIdx(nextIdx);
      setBusy(false);
    }
  };

  const enemyPhase = (curTeam: Combatant[], curEnemies: Enemy[], nextAllyIdx: number) => {
    let workingTeam = [...curTeam];
    const liveEnemies = curEnemies.filter((e) => e.hp > 0);
    let i = 0;

    const step = () => {
      if (i >= liveEnemies.length) {
        if (workingTeam.every((t) => t.curHp <= 0)) {
          pushLog("💀 Equipe derrotada... a rota guarda seus segredos.", "info");
          setOutcome("lose");
          setBusy(false);
          return;
        }
        let idx = nextAllyIdx;
        if (workingTeam[idx].curHp <= 0) {
          idx = workingTeam.findIndex((t) => t.curHp > 0);
        }
        setActiveIdx(idx);
        setBusy(false);
        return;
      }
      const e = liveEnemies[i];
      const aliveAllies = workingTeam.map((t, idx) => ({ t, idx })).filter((x) => x.t.curHp > 0);
      const tgt = aliveAllies[Math.floor(Math.random() * aliveAllies.length)];
      const dmg = Math.max(4, e.atk + Math.floor(Math.random() * 6) - 2 - Math.floor(tgt.t.stats.def / 12));
      workingTeam = workingTeam.map((t, idx) =>
        idx === tgt.idx ? { ...t, curHp: Math.max(0, t.curHp - dmg) } : t
      );
      flash(`ally-${tgt.t.id}`);
      pushLog(`${e.name} ataca ${tgt.t.name} causando ${dmg} de dano.`, "enemy");
      setTeam(workingTeam);
      i++;
      window.setTimeout(step, 700);
    };

    step();
  };

  const doAttack = (kind: "basic" | "skill") => {
    if (busy || outcome) return;
    if (!active || active.curHp <= 0) return;

    setBusy(true);

    if (kind === "skill" && active.skill.type === "heal") {
      const heal = active.skill.damage;
      const newTeam = team.map((t) =>
        t.curHp > 0 ? { ...t, curHp: Math.min(t.hp, t.curHp + heal) } : t
      );
      setTeam(newTeam);
      pushLog(`✨ ${active.name} usa ${active.skill.name}! Equipe recupera ${heal} HP.`, "ally");
      advanceTurn(newTeam, enemies);
      return;
    }

    if (!targetId) {
      setBusy(false);
      return;
    }

    const tgt = enemies.find((e) => e.id === targetId);
    if (!tgt || tgt.hp <= 0) {
      setBusy(false);
      return;
    }

    const base = kind === "skill" ? active.skill.damage : Math.floor(active.stats.atk / 4) + 8;
    const variance = Math.floor(Math.random() * 6);
    const crit = Math.random() < 0.18;
    const dmg = (base + variance) * (crit ? 2 : 1);

    const newEnemies = enemies.map((e) =>
      e.id === targetId ? { ...e, hp: Math.max(0, e.hp - dmg) } : e
    );
    setEnemies(newEnemies);
    flash(`enemy-${tgt.id}`);
    pushLog(
      kind === "skill"
        ? `⚡ ${active.name} libera ${active.skill.name} em ${tgt.name}! ${dmg} de dano${crit ? " CRÍTICO!" : ""}`
        : `${active.name} ataca ${tgt.name} (${dmg} dmg${crit ? " CRIT!" : ""})`,
      "ally"
    );

    advanceTurn(team, newEnemies);
  };

  const reset = () => {
    const fresh = toEnemies(stage?.enemies ?? DEFAULT_ENEMIES);
    setTeam(SENTAIS.map((s) => ({ ...s, curHp: s.hp })));
    setEnemies(fresh);
    setActiveIdx(0);
    setTargetId(fresh[0]?.id ?? null);
    setLog([{ id: 0, text: "Nova tentativa. Os Sentais se reagrupam!", tone: "info" }]);
    setOutcome(null);
    victoryReportedRef.current = false;
    idRef.current = 1;
  };

  return (
    <section className="mx-auto max-w-md py-4">
      <div className="mb-3 flex items-end justify-between px-1">
        <div>
          <h2 className="font-display text-3xl leading-none">
            {stage ? (
              <>
                Fase <span className="text-primary text-glow-red">{stage.id}</span>
              </>
            ) : (
              <>
                Combate <span className="text-primary text-glow-red">Livre</span>
              </>
            )}
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
            {stage ? `${stage.name} · ${stage.location}` : "Treino · Rota Mística"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onExit && (
            <button
              onClick={onExit}
              className="flex items-center gap-1 rounded-md border border-border/60 bg-card/60 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              <MapIcon className="h-3 w-3" /> Mapa
            </button>
          )}
          <button
            onClick={reset}
            className="flex items-center gap-1 rounded-md border border-border/60 bg-card/60 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border/60 panel">
        <div className="relative h-64 bg-gradient-bay">
          <div className="absolute inset-0 grid-bg opacity-40" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/90 to-transparent" />
          <div className="absolute inset-0 scanlines opacity-30" />

          <div className="absolute inset-0 flex items-end justify-around px-4 pb-6">
            {enemies.map((e) => {
              const dead = e.hp <= 0;
              const selected = e.id === targetId && !dead;
              return (
                <button
                  key={e.id}
                  onClick={() => !dead && setTargetId(e.id)}
                  disabled={dead}
                  className={cn(
                    "group relative flex flex-col items-center transition-all",
                    dead && "pointer-events-none opacity-20 grayscale",
                    e.isBoss ? "w-40" : "w-20"
                  )}
                >
                  <div
                    className={cn(
                      "relative mb-1 w-full",
                      hitId === `enemy-${e.id}` && "animate-shake animate-flash",
                      "animate-float-y"
                    )}
                  >
                    <img
                      src={e.sprite}
                      alt={e.name}
                      className={cn("mx-auto drop-shadow-[0_8px_18px_rgba(0,0,0,0.6)]", e.isBoss ? "h-32" : "h-20")}
                      loading="lazy"
                    />
                    {selected && (
                      <span
                        aria-hidden
                        className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-black text-primary text-glow-red animate-pulse"
                      >
                        ▼
                      </span>
                    )}
                  </div>
                  <div className="w-full">
                    <div className="mb-0.5 flex items-center justify-between">
                      <span className="truncate text-[9px] font-bold uppercase tracking-wider text-foreground">
                        {e.name}
                      </span>
                      <span className="text-[9px] tabular-nums text-muted-foreground">
                        {e.hp}/{e.maxHp}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-background/80">
                      <div
                        className={cn(
                          "h-full transition-all",
                          e.isBoss ? "bg-gradient-rosa" : "bg-gradient-rubro"
                        )}
                        style={{ width: `${(e.hp / e.maxHp) * 100}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div
          ref={logRef}
          className="h-24 overflow-y-auto border-t border-border/60 bg-background/70 px-4 py-2 text-xs"
        >
          {log.map((l) => (
            <p
              key={l.id}
              className={cn(
                "leading-snug",
                l.tone === "ally" && "text-secondary",
                l.tone === "enemy" && "text-primary",
                l.tone === "win" && "font-bold text-sentai-green text-glow-cyan",
                l.tone === "info" && "text-muted-foreground"
              )}
            >
              {l.text}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-5 gap-2">
        {team.map((t, idx) => {
          const isActive = idx === activeIdx && t.curHp > 0 && !outcome;
          const dead = t.curHp <= 0;
          return (
            <div
              key={t.id}
              className={cn(
                "relative overflow-hidden rounded-xl border p-1.5 text-center transition-all",
                "bg-gradient-to-b",
                colorClass[t.id],
                isActive ? "border-foreground/80 ring-2 ring-foreground/80 scale-105 shadow-lg" : "border-border/40",
                dead && "opacity-30 grayscale",
                hitId === `ally-${t.id}` && "animate-shake"
              )}
            >
              <div className="text-2xl leading-none">{t.pose}</div>
              <p className="mt-0.5 truncate text-[8px] font-black uppercase tracking-wider text-background">
                {t.id}
              </p>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-background/60">
                <div
                  className="h-full bg-foreground/90"
                  style={{ width: `${(t.curHp / t.hp) * 100}%` }}
                />
              </div>
              <p className="mt-0.5 text-[8px] font-bold tabular-nums text-background">
                {t.curHp}/{t.hp}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-3 panel p-3">
        {active && active.curHp > 0 && !outcome ? (
          <>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Vez de
              </p>
              <p className="font-display text-xl leading-none">{active.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => doAttack("basic")}
                disabled={busy}
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-muted/60 py-3 font-display text-lg transition-transform active:scale-95 disabled:opacity-50"
              >
                <Sword className="h-4 w-4" /> Ataque
              </button>
              <button
                onClick={() => doAttack("skill")}
                disabled={busy}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl py-3 font-display text-lg text-background transition-transform active:scale-95 disabled:opacity-50",
                  "bg-gradient-to-r",
                  colorClass[active.id]
                )}
                style={{ boxShadow: `0 0 24px hsl(${active.hex} / 0.55)` }}
              >
                {active.skill.type === "heal" ? <Heart className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                {active.skill.name.split(" ")[0]}
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {active.skill.type === "heal"
                ? `Cura ${active.skill.damage} HP da equipe`
                : `Toque em um inimigo para mirar`}
            </p>
          </>
        ) : outcome ? (
          <div className="py-3 text-center">
            {outcome === "win" ? (
              <>
                <Trophy className="mx-auto h-10 w-10 text-secondary text-glow-gold" />
                <h3 className="mt-2 font-display text-3xl text-secondary text-glow-gold">VITÓRIA!</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {stage ? `Recompensa: ${stage.reward}` : "Troféu Rota Sagrada conquistado"}
                </p>
              </>
            ) : (
              <>
                <h3 className="font-display text-3xl text-primary text-glow-red">DERROTA</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Tente novamente, herói.
                </p>
              </>
            )}
            <div className="mt-3 flex items-center justify-center gap-2">
              <button
                onClick={reset}
                className="rounded-xl bg-gradient-rubro px-5 py-2.5 font-display text-lg text-primary-foreground shadow-[var(--glow-red)]"
              >
                {outcome === "win" ? "Refazer" : "Tentar de Novo"}
              </button>
              {onExit && (
                <button
                  onClick={onExit}
                  className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-card/60 px-4 py-2.5 font-display text-lg text-foreground hover:bg-card"
                >
                  <MapIcon className="h-4 w-4" /> Mapa
                </button>
              )}
            </div>
          </div>
        ) : (
          <p className="py-4 text-center text-sm text-muted-foreground">Processando turno...</p>
        )}
      </div>
    </section>
  );
};
