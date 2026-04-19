import { SENTAIS, type Sentai, type SentaiId } from "@/data/sentais";
import { cn } from "@/lib/utils";
import { Heart, Sword, Shield, Zap, Sparkles, Star } from "lucide-react";
import { heroBoost, xpForNextLevel, type HeroProgress } from "@/data/rewards";

const STAT_ICONS = { atk: Sword, def: Shield, spd: Zap, mag: Sparkles };
const STAT_LABELS = { atk: "ATK", def: "DEF", spd: "SPD", mag: "MAG" };

const StatBar = ({ value, color }: { value: number; color: string }) => (
  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
    <div
      className={cn("h-full rounded-full", color)}
      style={{ width: `${Math.min(100, value)}%`, boxShadow: `0 0 8px currentColor` }}
    />
  </div>
);

const HeroCard = ({
  sentai,
  idx,
  progress,
}: {
  sentai: Sentai;
  idx: number;
  progress?: HeroProgress;
}) => {
  const gradientClass: Record<string, string> = {
    rubro: "bg-gradient-rubro",
    dourado: "bg-gradient-dourado",
    esmeralda: "bg-gradient-esmeralda",
    onix: "bg-gradient-onix",
    rosa: "bg-gradient-rosa",
  };
  const barClass: Record<string, string> = {
    rubro: "bg-sentai-red",
    dourado: "bg-sentai-yellow",
    esmeralda: "bg-sentai-green",
    onix: "bg-foreground",
    rosa: "bg-sentai-pink",
  };

  const level = progress?.level ?? 1;
  const xp = progress?.xp ?? 0;
  const skins = progress?.skins ?? [];
  const { hpBonus, atkBonus } = heroBoost(level);
  const maxHp = sentai.hp + hpBonus;
  const xpNeed = xpForNextLevel(level);

  return (
    <article
      style={{ animationDelay: `${idx * 90}ms` }}
      className="group relative overflow-hidden rounded-2xl border border-border/60 panel animate-slide-up"
    >
      {/* Color band */}
      <div className={cn("relative h-32 overflow-hidden", gradientClass[sentai.id])}>
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute -right-4 -top-2 font-display text-[160px] leading-none text-background/15">
          {sentai.id.charAt(0).toUpperCase()}
        </div>
        {/* Pose emblem */}
        <div className="absolute bottom-2 left-4 flex items-end gap-2">
          <span
            aria-hidden
            className="text-5xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] animate-float-y"
            style={{ animationDelay: `${idx * 0.2}s` }}
          >
            {sentai.pose}
          </span>
          <div className="pb-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-background/70">
              {sentai.codename}
            </p>
            <h3 className="font-display text-2xl leading-none text-background">{sentai.name}</h3>
          </div>
        </div>
        {/* Level badge */}
        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full border border-background/40 bg-background/70 px-2 py-1 backdrop-blur">
          <Star className="h-3 w-3 fill-secondary text-secondary" />
          <span className="font-display text-base leading-none text-foreground">Lv {level}</span>
        </div>
        {/* Scanlines */}
        <div className="absolute inset-0 scanlines opacity-50 mix-blend-overlay" />
      </div>

      <div className="space-y-4 p-4">
        {/* XP bar */}
        <div>
          <div className="mb-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <span>XP Próx. Nível</span>
            <span className="tabular-nums text-foreground">
              {xp} / {xpNeed}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-gradient-to-r from-secondary to-accent"
              style={{ width: `${Math.min(100, (xp / xpNeed) * 100)}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="rounded-md border border-border/60 bg-muted/50 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {sentai.role}
          </span>
          <div className="flex items-center gap-1 text-xs font-bold text-sentai-red">
            <Heart className="h-3.5 w-3.5 fill-current" />
            <span>{maxHp} HP</span>
            {hpBonus > 0 && (
              <span className="text-[10px] font-bold text-sentai-green">+{hpBonus}</span>
            )}
          </div>
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground">{sentai.personality}</p>

        {/* Stats */}
        <div className="space-y-1.5">
          {(Object.keys(sentai.stats) as (keyof typeof sentai.stats)[]).map((k) => {
            const Icon = STAT_ICONS[k];
            const bonus = k === "atk" ? atkBonus : 0;
            const value = sentai.stats[k] + bonus;
            return (
              <div key={k} className="flex items-center gap-2">
                <Icon className="h-3 w-3 text-muted-foreground" />
                <span className="w-7 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {STAT_LABELS[k]}
                </span>
                <StatBar value={value} color={barClass[sentai.id]} />
                <span className="w-12 text-right text-[10px] font-bold tabular-nums text-foreground">
                  {value}
                  {bonus > 0 && (
                    <span className="ml-0.5 text-sentai-green">+{bonus}</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>

        {/* Skill */}
        <div className="rounded-xl border border-border/60 bg-background/60 p-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-secondary">
              ⚡ Habilidade
            </span>
            <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-bold uppercase", barClass[sentai.id], "text-background")}>
              {sentai.skill.type === "heal" ? `+${sentai.skill.damage} HP` : `${sentai.skill.damage + atkBonus} DMG`}
            </span>
          </div>
          <p className="font-display text-lg leading-tight">{sentai.skill.name}</p>
          <p className="mt-1 text-xs text-muted-foreground">{sentai.skill.description}</p>
        </div>

        {/* Skins */}
        <div>
          <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">
            Skins · {skins.length}
          </p>
          {skins.length === 0 ? (
            <p className="text-[11px] italic text-muted-foreground/70">
              Nenhuma skin desbloqueada ainda. Vença fases para coletar.
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {skins.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-secondary/40 bg-secondary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-secondary"
                >
                  ⭐ {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

interface Props {
  heroes?: Record<SentaiId, HeroProgress>;
}

export const HeroesView = ({ heroes }: Props) => {
  return (
    <section className="mx-auto max-w-md space-y-4 py-4">
      <div className="px-1">
        <h2 className="font-display text-4xl leading-none">
          Galeria de <span className="text-accent text-glow-pink">Heróis</span>
        </h2>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          Coleção · Temporada 1 · 5/5
        </p>
      </div>
      <div className="space-y-4">
        {SENTAIS.map((s, i) => (
          <HeroCard key={s.id} sentai={s} idx={i} progress={heroes?.[s.id]} />
        ))}
      </div>
    </section>
  );
};
