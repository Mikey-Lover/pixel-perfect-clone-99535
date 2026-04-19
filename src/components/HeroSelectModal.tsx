import { useState } from "react";
import { SENTAIS, type Sentai, type SentaiId } from "@/data/sentais";
import { cn } from "@/lib/utils";
import { Heart, Sword, Shield, Zap, Sparkles, Crown, Check } from "lucide-react";

const STAT_ICONS = { atk: Sword, def: Shield, spd: Zap, mag: Sparkles };

const gradientById: Record<SentaiId, string> = {
  rubro: "bg-gradient-rubro",
  dourado: "bg-gradient-dourado",
  esmeralda: "bg-gradient-esmeralda",
  onix: "bg-gradient-onix",
  rosa: "bg-gradient-rosa",
};
const glowById: Record<SentaiId, string> = {
  rubro: "shadow-[var(--glow-red)]",
  dourado: "shadow-[var(--glow-yellow)]",
  esmeralda: "shadow-[var(--glow-green)]",
  onix: "shadow-[var(--shadow-deep)]",
  rosa: "shadow-[var(--glow-pink)]",
};

interface Props {
  onConfirm: (id: SentaiId) => void;
}

export const HeroSelectModal = ({ onConfirm }: Props) => {
  const [picked, setPicked] = useState<SentaiId>(SENTAIS[0].id);
  const hero = SENTAIS.find((s) => s.id === picked) as Sentai;

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-background/95 backdrop-blur-md animate-slide-up"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hero-select-title"
    >
      {/* Header */}
      <div className="border-b border-border/50 px-5 pb-3 pt-6 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary">
          Escolha do Líder
        </p>
        <h2 id="hero-select-title" className="mt-1 font-display text-3xl leading-none">
          Quem comanda a <span className="text-primary text-glow-red">jornada</span>?
        </h2>
        <p className="mx-auto mt-2 max-w-xs text-xs text-muted-foreground">
          Esse Super Sentai será o herói principal da sua campanha — aparece no mapa, na barra
          superior e lidera os encontros.
        </p>
      </div>

      {/* Hero preview */}
      <div className="mx-auto w-full max-w-md flex-1 overflow-y-auto px-4 py-4">
        <article
          className={cn(
            "relative overflow-hidden rounded-3xl border border-border/60 transition-all",
            gradientById[hero.id],
            glowById[hero.id],
          )}
        >
          <div className="absolute inset-0 grid-bg opacity-25" />
          <div className="absolute -right-4 top-0 font-display text-[180px] leading-none text-background/15">
            {hero.id.charAt(0).toUpperCase()}
          </div>
          <div className="relative px-5 py-6">
            <div className="flex items-center gap-3">
              <span className="text-6xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] animate-float-y">
                {hero.pose}
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-background/70">
                  {hero.codename}
                </p>
                <h3 className="font-display text-3xl leading-none text-background">{hero.name}</h3>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-background/80">
                  {hero.role}
                </p>
              </div>
            </div>

            <p className="mt-3 text-sm leading-snug text-background/95">{hero.personality}</p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 rounded-lg bg-background/30 px-3 py-2 text-background backdrop-blur">
                <Heart className="h-4 w-4 fill-current" />
                <span className="text-xs font-bold tabular-nums">{hero.hp} HP</span>
              </div>
              {(Object.keys(hero.stats) as (keyof typeof hero.stats)[]).map((k) => {
                const Icon = STAT_ICONS[k];
                return (
                  <div
                    key={k}
                    className="flex items-center gap-2 rounded-lg bg-background/30 px-3 py-2 text-background backdrop-blur"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">{k}</span>
                    <span className="ml-auto text-xs font-bold tabular-nums">{hero.stats[k]}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 rounded-xl border border-background/30 bg-background/25 p-3 backdrop-blur">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-background/80">
                ⚡ Habilidade Especial
              </p>
              <p className="mt-1 font-display text-xl leading-tight text-background">
                {hero.skill.name}
              </p>
              <p className="text-[11px] text-background/85">{hero.skill.description}</p>
            </div>
          </div>
        </article>

        {/* Hero picker */}
        <div className="mt-5">
          <p className="mb-2 px-1 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
            Selecione o herói
          </p>
          <div className="grid grid-cols-5 gap-2">
            {SENTAIS.map((s) => {
              const isPicked = s.id === picked;
              return (
                <button
                  key={s.id}
                  onClick={() => setPicked(s.id)}
                  className={cn(
                    "group relative flex aspect-square flex-col items-center justify-center rounded-2xl border-2 transition-all active:scale-95",
                    gradientById[s.id],
                    isPicked
                      ? "border-foreground scale-105 " + glowById[s.id]
                      : "border-border/40 opacity-75 hover:opacity-100",
                  )}
                  aria-pressed={isPicked}
                  aria-label={`Selecionar ${s.name}`}
                >
                  <span className="text-3xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">{s.pose}</span>
                  {isPicked && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background ring-2 ring-background">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-border/50 bg-background/80 p-4 backdrop-blur">
        <button
          onClick={() => onConfirm(picked)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-rubro py-4 font-display text-2xl tracking-wider text-primary-foreground shadow-[var(--glow-red)] transition-transform active:scale-[0.98]"
        >
          <Crown className="h-6 w-6" />
          Liderar a Jornada
        </button>
        <p className="mt-2 text-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Você poderá trocar depois
        </p>
      </div>
    </div>
  );
};
