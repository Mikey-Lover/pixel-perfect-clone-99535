import { useState } from "react";
import { ROUTE, STAGE_META, type Stage } from "@/data/route";
import routeMap from "@/assets/route-map.jpg";
import { cn } from "@/lib/utils";
import { Sparkles, Trophy, Swords, Users, Calendar, X } from "lucide-react";

const TYPE_ICON = { battle: Swords, arena: Users, event: Calendar, boss: Trophy } as const;

interface Props {
  completed: Set<number>;
  onStartStage: (stage: Stage) => void;
}

export const RouteMapView = ({ completed, onStartStage }: Props) => {
  const [selected, setSelected] = useState<Stage | null>(null);
  const current = (completed.size === 0 ? 0 : Math.max(...completed)) + 1;

  return (
    <section className="relative">
      {/* Map area */}
      <div className="relative mx-auto mt-4 max-w-md overflow-hidden rounded-2xl border border-border/60 panel">
        <div className="relative aspect-[3/4] w-full">
          <img
            src={routeMap}
            alt="Mapa da rota mística de Niterói"
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
          />
          {/* Atmosphere overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/85" />
          <div className="absolute inset-0 scanlines opacity-40 mix-blend-overlay" />

          {/* Path SVG */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
            aria-hidden
          >
            <defs>
              <linearGradient id="path-grad" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--sentai-red))" />
                <stop offset="50%" stopColor="hsl(var(--sentai-yellow))" />
                <stop offset="100%" stopColor="hsl(var(--sentai-pink))" />
              </linearGradient>
            </defs>
            <polyline
              points={ROUTE.map((s) => `${s.x},${s.y}`).join(" ")}
              fill="none"
              stroke="url(#path-grad)"
              strokeWidth="0.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1.4 1.4"
              opacity="0.85"
            />
          </svg>

          {/* Waypoints */}
          {ROUTE.map((stage, i) => {
            const Icon = TYPE_ICON[stage.type];
            const meta = STAGE_META[stage.type];
            const isDone = completed.has(stage.id);
            const isCurrent = stage.id === current;
            const isLocked = stage.id > current;

            return (
              <button
                key={stage.id}
                style={{ left: `${stage.x}%`, top: `${stage.y}%`, animationDelay: `${i * 80}ms` }}
                onClick={() => setSelected(stage)}
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 animate-slide-up",
                  "focus:outline-none focus:ring-2 focus:ring-primary rounded-full"
                )}
                aria-label={`${meta.label}: ${stage.name}`}
              >
                {/* pulse for current */}
                {isCurrent && (
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-0 -m-2 rounded-full animate-pulse-ring",
                      meta.color,
                      "opacity-60"
                    )}
                  />
                )}
                <span
                  className={cn(
                    "relative flex h-11 w-11 items-center justify-center rounded-full ring-2",
                    meta.color,
                    meta.ring,
                    isLocked && "grayscale opacity-50 ring-border",
                    "shadow-lg"
                  )}
                >
                  <Icon className={cn("h-5 w-5", stage.type === "event" ? "text-background" : "text-foreground")} />
                  {isDone && (
                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-sentai-green text-[9px] font-black text-background ring-2 ring-background">
                      ✓
                    </span>
                  )}
                </span>
                <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-background/85 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-foreground backdrop-blur">
                  {stage.id}. {stage.name.split(":")[0]}
                </span>
              </button>
            );
          })}

          {/* Compass / Title overlay */}
          <div className="absolute left-3 top-3 rounded-md border border-border/60 bg-background/70 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground backdrop-blur">
            Rota Sagrada · Niterói
          </div>
        </div>

        {/* Progress bar */}
        <div className="border-t border-border/60 bg-card/80 px-4 py-3">
          <div className="mb-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
            <span className="text-muted-foreground">Progresso da Temporada</span>
            <span className="text-secondary">
              {completed.size} / {ROUTE.length}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-rubro transition-all"
              style={{ width: `${(completed.size / ROUTE.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mx-auto mt-3 flex max-w-md flex-wrap gap-2 px-1">
        {(Object.keys(STAGE_META) as (keyof typeof STAGE_META)[]).map((k) => (
          <span
            key={k}
            className="flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground backdrop-blur"
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
              <div>
                <span
                  className={cn(
                    "inline-block rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-widest",
                    STAGE_META[selected.type].color,
                    selected.type === "event" ? "text-background" : "text-foreground"
                  )}
                >
                  {STAGE_META[selected.type].label}
                </span>
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
                Recompensa: {selected.reward}
              </span>
            </div>

            <button
              disabled={selected.id > current}
              onClick={() => {
                const s = selected;
                setSelected(null);
                onStartStage(s);
              }}
              className={cn(
                "mt-5 w-full rounded-xl py-4 font-display text-2xl tracking-wider transition-transform active:scale-[0.98]",
                selected.id > current
                  ? "cursor-not-allowed bg-muted text-muted-foreground"
                  : "bg-gradient-rubro text-primary-foreground shadow-[var(--glow-red)]"
              )}
            >
              {selected.id > current ? "🔒 Bloqueado" : completed.has(selected.id) ? "Refazer Fase" : "Iniciar Fase"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
