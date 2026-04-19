import { useState } from "react";
import { ROUTE, SECTORS, STAGE_META, type Stage, type SectorId } from "@/data/route";
import { SENTAIS, type SentaiId } from "@/data/sentais";
import { SENTAI_IMAGES } from "@/data/sentai-images";
import routeMap from "@/assets/route-map.jpg";
import { cn } from "@/lib/utils";
import { Sparkles, X, Lock, Check, Crown } from "lucide-react";

interface Props {
  completed: Set<number>;
  onStartStage: (stage: Stage) => void;
  selectedHeroId: SentaiId | null;
}

const heroGradient: Record<SentaiId, string> = {
  rubro: "bg-gradient-rubro",
  dourado: "bg-gradient-dourado",
  esmeralda: "bg-gradient-esmeralda",
  onix: "bg-gradient-onix",
  rosa: "bg-gradient-rosa",
};

export const RouteMapView = ({ completed, onStartStage, selectedHeroId }: Props) => {
  const [selected, setSelected] = useState<Stage | null>(null);
  const currentId = (completed.size === 0 ? 0 : Math.max(...completed)) + 1;
  const currentStage = ROUTE.find((s) => s.id === currentId) ?? ROUTE[ROUTE.length - 1];
  const hero = selectedHeroId ? SENTAIS.find((s) => s.id === selectedHeroId) : null;

  const sectorCompletion = (sectorId: SectorId) => {
    const stages = ROUTE.filter((s) => s.sectorId === sectorId);
    const done = stages.filter((s) => completed.has(s.id)).length;
    return { done, total: stages.length };
  };

  const activeSector = currentStage.sectorId;

  return (
    <section className="relative space-y-4 py-3">
      {/* Campaign header with hero */}
      {hero && (
        <div className="mx-auto max-w-md overflow-hidden rounded-2xl border border-border/60 panel">
          <div className={cn("relative px-4 py-3", heroGradient[hero.id])}>
            <div className="absolute inset-0 grid-bg opacity-25" />
            <div className="relative flex items-center gap-3">
              <div className="relative h-16 w-12 shrink-0">
                <img
                  src={SENTAI_IMAGES[hero.id]}
                  alt={`${hero.name}`}
                  className="absolute inset-x-0 bottom-0 h-[140%] w-full object-contain object-bottom drop-shadow-[0_3px_8px_rgba(0,0,0,0.6)] animate-float-y"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-background/80">
                  Líder da Jornada
                </p>
                <h2 className="font-display text-xl leading-none text-background truncate">
                  {hero.name}
                </h2>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-background/85 truncate">
                  Próx · Fase {currentStage.id} · {currentStage.name}
                </p>
              </div>
              <Crown className="h-5 w-5 text-background/90" />
            </div>
          </div>
        </div>
      )}

      {/* Map */}
      <div className="relative mx-auto max-w-md overflow-hidden rounded-2xl border border-border/60 panel">
        <div className="relative aspect-[3/4] w-full">
          <img
            src={routeMap}
            alt="Mapa da rota mística de Niterói"
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/85" />
          <div className="absolute inset-0 scanlines opacity-40 mix-blend-overlay" />

          {/* Path */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
            <defs>
              <linearGradient id="path-grad" x1="0" x2="1" y1="1" y2="0">
                <stop offset="0%" stopColor="hsl(var(--sentai-red))" />
                <stop offset="33%" stopColor="hsl(var(--sentai-yellow))" />
                <stop offset="66%" stopColor="hsl(var(--neon-violet))" />
                <stop offset="100%" stopColor="hsl(var(--sentai-pink))" />
              </linearGradient>
            </defs>
            <polyline
              points={ROUTE.map((s) => `${s.x},${s.y}`).join(" ")}
              fill="none"
              stroke="url(#path-grad)"
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1.2 1.2"
              opacity="0.85"
            />
          </svg>

          {/* Waypoints */}
          {ROUTE.map((stage, i) => {
            const meta = STAGE_META[stage.type];
            const isDone = completed.has(stage.id);
            const isCurrent = stage.id === currentId;
            const isLocked = stage.id > currentId;
            const isBoss = stage.type === "boss";

            return (
              <button
                key={stage.id}
                style={{ left: `${stage.x}%`, top: `${stage.y}%`, animationDelay: `${i * 50}ms` }}
                onClick={() => setSelected(stage)}
                className="absolute -translate-x-1/2 -translate-y-1/2 animate-slide-up rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label={`${meta.label}: ${stage.name}`}
              >
                {isCurrent && (
                  <span aria-hidden className={cn("absolute inset-0 -m-2 rounded-full animate-pulse-ring", meta.color, "opacity-60")} />
                )}
                <span
                  className={cn(
                    "relative flex items-center justify-center rounded-full ring-2 shadow-lg",
                    isBoss ? "h-12 w-12" : "h-9 w-9",
                    meta.color,
                    meta.ring,
                    isLocked && "grayscale opacity-40 ring-border",
                    isDone && "ring-sentai-green/80",
                  )}
                >
                  <span className={cn("drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]", isBoss ? "text-2xl" : "text-base")}>
                    {meta.icon}
                  </span>
                  {isDone && (
                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-sentai-green text-background ring-2 ring-background">
                      <Check className="h-2.5 w-2.5" strokeWidth={4} />
                    </span>
                  )}
                  {isLocked && (
                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-muted text-foreground ring-2 ring-background">
                      <Lock className="h-2 w-2" strokeWidth={3} />
                    </span>
                  )}
                </span>
                <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-background/85 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-foreground backdrop-blur">
                  {stage.id}
                </span>
              </button>
            );
          })}

          {/* Hero avatar at current checkpoint */}
          {hero && (
            <div
              style={{ left: `${currentStage.x}%`, top: `${currentStage.y}%` }}
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-[140%] animate-float-y"
              aria-hidden
            >
              <div className="relative">
                <div className={cn("relative flex h-14 w-14 items-end justify-center overflow-hidden rounded-full ring-2 ring-foreground shadow-[0_8px_24px_rgba(0,0,0,0.6)]", heroGradient[hero.id])}>
                  <img
                    src={SENTAI_IMAGES[hero.id]}
                    alt=""
                    aria-hidden
                    className="h-[155%] w-auto object-contain object-bottom drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
                  />
                </div>
                <div className="absolute left-1/2 top-full -translate-x-1/2 mt-0.5">
                  <div className="h-0 w-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-foreground/90" />
                </div>
              </div>
            </div>
          )}

          {/* Sector label */}
          <div className="absolute left-3 top-3 rounded-md border border-border/60 bg-background/75 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground backdrop-blur">
            Rota Sagrada · 18 fases
          </div>
        </div>

        {/* Progress bar */}
        <div className="border-t border-border/60 bg-card/80 px-4 py-3">
          <div className="mb-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
            <span className="text-muted-foreground">Progresso da Temporada</span>
            <span className="text-secondary tabular-nums">{completed.size} / {ROUTE.length}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-rubro transition-all"
              style={{ width: `${(completed.size / ROUTE.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sectors */}
      <div className="mx-auto max-w-md space-y-2 px-1">
        <h3 className="px-1 font-display text-2xl leading-none">Setores da Campanha</h3>
        <div className="grid grid-cols-2 gap-2">
          {SECTORS.map((sec) => {
            const { done, total } = sectorCompletion(sec.id);
            const pct = (done / total) * 100;
            const isActive = sec.id === activeSector;
            return (
              <div
                key={sec.id}
                className={cn(
                  "relative overflow-hidden rounded-xl border bg-card/70 p-3 backdrop-blur",
                  isActive ? "border-foreground/50 shadow-[var(--shadow-card)]" : "border-border/60",
                )}
              >
                {isActive && (
                  <span className="absolute right-2 top-2 rounded-full bg-foreground px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-background">
                    Aqui
                  </span>
                )}
                <p className={cn("text-[9px] font-black uppercase tracking-[0.25em]", sec.textClass)}>
                  {sec.name}
                </p>
                <p className="mt-0.5 font-display text-base leading-none text-foreground">
                  {sec.subtitle}
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className={cn("h-full rounded-full transition-all", sec.accentClass)} style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground tabular-nums">
                  {done} / {total}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mx-auto flex max-w-md flex-wrap gap-1.5 px-1">
        {(Object.keys(STAGE_META) as (keyof typeof STAGE_META)[]).map((k) => (
          <span
            key={k}
            className="flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground backdrop-blur"
          >
            <span className={cn("h-2 w-2 rounded-full", STAGE_META[k].color)} />
            {STAGE_META[k].label}
          </span>
        ))}
      </div>

      {/* Stage Sheet */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 backdrop-blur-sm animate-slide-up"
          onClick={() => setSelected(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-3xl border border-border/60 bg-card p-5 pb-8 panel"
          >
            <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-muted" />
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-foreground",
                      STAGE_META[selected.type].color,
                    )}
                  >
                    <span>{STAGE_META[selected.type].icon}</span>
                    {STAGE_META[selected.type].label}
                  </span>
                  <span className="rounded-full border border-border/60 bg-muted/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Fase {selected.id}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-3xl leading-none">{selected.name}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {selected.location}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-foreground/90">{selected.description}</p>

            <div className="mt-4 flex items-center gap-2 rounded-xl border border-secondary/40 bg-secondary/10 px-3 py-2">
              <Sparkles className="h-4 w-4 text-secondary" />
              <span className="text-xs font-bold uppercase tracking-widest text-secondary">
                {selected.reward}
              </span>
            </div>

            <button
              disabled={selected.id > currentId}
              onClick={() => {
                const s = selected;
                setSelected(null);
                onStartStage(s);
              }}
              className={cn(
                "mt-5 w-full rounded-xl py-4 font-display text-2xl tracking-wider transition-transform active:scale-[0.98]",
                selected.id > currentId
                  ? "cursor-not-allowed bg-muted text-muted-foreground"
                  : "bg-gradient-rubro text-primary-foreground shadow-[var(--glow-red)]",
              )}
            >
              {selected.id > currentId
                ? "🔒 Bloqueado"
                : completed.has(selected.id)
                  ? "Refazer Fase"
                  : "Iniciar Fase"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
