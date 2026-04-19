import { useEffect } from "react";
import { Sparkles, Star, ArrowUp, Map as MapIcon, RotateCcw, X } from "lucide-react";
import type { ClaimResult } from "@/hooks/useProgress";
import { SENTAIS } from "@/data/sentais";
import { cn } from "@/lib/utils";

const RARITY_STYLES: Record<string, string> = {
  Comum: "from-zinc-500 to-zinc-700 text-foreground",
  Raro: "from-sentai-green to-teal-500 text-background",
  Épico: "from-accent to-fuchsia-500 text-background",
  Lendário: "from-sentai-yellow to-orange-500 text-background",
};

interface Props {
  result: ClaimResult;
  stageName: string;
  onClose: () => void;
  onContinue?: () => void;
  onReplay?: () => void;
}

export const LootModal = ({ result, stageName, onClose, onContinue, onReplay }: Props) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const unlock = result.unlock && result.unlockNew ? result.unlock : undefined;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 px-4 py-8 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-secondary/40 panel animate-slide-up"
        style={{ boxShadow: "var(--shadow-deep), var(--glow-yellow)" }}
      >
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-secondary/30 via-accent/20 to-primary/30 px-5 pb-4 pt-6">
          <div className="absolute inset-0 grid-bg opacity-40" />
          <div className="absolute inset-0 scanlines opacity-30" />
          <button
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full bg-background/40 p-1.5 text-foreground/80 hover:bg-background/70"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
          <p className="relative text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">
            Recompensa de Fase
          </p>
          <h2 className="relative mt-1 font-display text-4xl leading-none text-foreground">
            VITÓRIA!
          </h2>
          <p className="relative mt-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {stageName}
          </p>
          {result.alreadyClaimed && (
            <span className="relative mt-2 inline-block rounded-full border border-border/60 bg-background/60 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              Refazer · Recompensa reduzida
            </span>
          )}
        </div>

        <div className="space-y-4 p-5">
          {/* Stars + XP */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-secondary/40 bg-secondary/10 p-3 text-center">
              <Star className="mx-auto h-6 w-6 fill-secondary text-secondary" />
              <p className="mt-1 font-display text-3xl text-secondary text-glow-gold">
                +{result.stars}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Estrelas
              </p>
            </div>
            <div className="rounded-2xl border border-neon-cyan/40 bg-neon-cyan/10 p-3 text-center">
              <Sparkles className="mx-auto h-6 w-6 text-neon-cyan" />
              <p className="mt-1 font-display text-3xl text-neon-cyan text-glow-cyan">
                +{result.xpPerHero}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                XP / Herói
              </p>
            </div>
          </div>

          {/* Skin unlock */}
          {unlock && (
            <div
              className={cn(
                "relative overflow-hidden rounded-2xl bg-gradient-to-br p-4",
                RARITY_STYLES[unlock.rarity]
              )}
            >
              <div className="absolute inset-0 scanlines opacity-30" />
              <div className="relative flex items-center gap-3">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-background/40 text-4xl ring-2 ring-foreground/40 backdrop-blur">
                  {unlock.poseEmoji}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-80">
                    Novo Desbloqueio · {unlock.rarity}
                  </p>
                  <h3 className="font-display text-xl leading-tight">{unlock.skinName}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-90">
                    para {SENTAIS.find((s) => s.id === unlock.sentaiId)?.name}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Level ups */}
          {result.levelUps.length > 0 && (
            <div className="rounded-2xl border border-accent/40 bg-accent/10 p-3">
              <div className="mb-2 flex items-center gap-1.5">
                <ArrowUp className="h-3.5 w-3.5 text-accent" />
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-accent">
                  Level Up
                </p>
              </div>
              <div className="space-y-1">
                {result.levelUps.map((lu) => {
                  const hero = SENTAIS.find((s) => s.id === lu.sentaiId);
                  if (!hero) return null;
                  return (
                    <div
                      key={lu.sentaiId}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="flex items-center gap-2 font-bold">
                        <span className="text-base">{hero.pose}</span>
                        {hero.name}
                      </span>
                      <span className="font-display text-base text-accent text-glow-pink">
                        Lv {lu.fromLevel} → {lu.toLevel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            {onReplay && (
              <button
                onClick={onReplay}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border/60 bg-card/60 px-3 py-3 font-display text-base text-foreground hover:bg-card"
              >
                <RotateCcw className="h-4 w-4" /> Refazer
              </button>
            )}
            <button
              onClick={onContinue ?? onClose}
              className="flex flex-[1.4] items-center justify-center gap-1.5 rounded-xl bg-gradient-rubro px-3 py-3 font-display text-lg text-primary-foreground shadow-[var(--glow-red)]"
            >
              <MapIcon className="h-4 w-4" /> Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
