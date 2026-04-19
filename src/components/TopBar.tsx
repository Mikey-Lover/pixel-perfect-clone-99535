import { SENTAIS, type SentaiId } from "@/data/sentais";
import { SENTAI_IMAGES } from "@/data/sentai-images";
import { cn } from "@/lib/utils";

const gradientById: Record<SentaiId, string> = {
  rubro: "bg-gradient-rubro",
  dourado: "bg-gradient-dourado",
  esmeralda: "bg-gradient-esmeralda",
  onix: "bg-gradient-onix",
  rosa: "bg-gradient-rosa",
};
const ringById: Record<SentaiId, string> = {
  rubro: "ring-sentai-red/80 shadow-[var(--glow-red)]",
  dourado: "ring-sentai-yellow/80 shadow-[var(--glow-yellow)]",
  esmeralda: "ring-sentai-green/80 shadow-[var(--glow-green)]",
  onix: "ring-foreground/40 shadow-[var(--shadow-deep)]",
  rosa: "ring-sentai-pink/80 shadow-[var(--glow-pink)]",
};

interface Props {
  subtitle: string;
  stars?: number;
  heroId?: SentaiId | null;
  onAvatarClick?: () => void;
}

export const TopBar = ({ subtitle, stars = 0, heroId, onAvatarClick }: Props) => {
  const formatted = stars.toLocaleString("pt-BR");
  const hero = heroId ? SENTAIS.find((s) => s.id === heroId) : null;

  return (
    <header className="sticky top-0 z-30 border-b border-border/50 bg-background/85 backdrop-blur-lg">
      <div className="mx-auto flex max-w-md items-center gap-3 px-4 py-3">
        <button
          onClick={onAvatarClick}
          className={cn(
            "relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl ring-2 transition-transform active:scale-95",
            hero ? gradientById[hero.id] : "bg-muted",
            hero ? ringById[hero.id] : "ring-border",
          )}
          aria-label={hero ? `Trocar líder (atual: ${hero.name})` : "Escolher líder"}
        >
          <div className="absolute inset-0 grid-bg opacity-25" />
          {hero ? (
            <img
              src={SENTAI_IMAGES[hero.id]}
              alt=""
              aria-hidden
              className="relative h-[150%] w-auto object-contain object-bottom drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
            />
          ) : (
            <span className="relative text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">★</span>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h1 className="font-display text-xl leading-none text-foreground">
            SUPER <span className="text-primary text-glow-red">SENTAIS</span>
          </h1>
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {hero ? `Líder: ${hero.codename}` : subtitle}
          </p>
        </div>

        <div
          className="flex items-center gap-1 rounded-lg border border-secondary/40 bg-secondary/10 px-2.5 py-1.5 text-xs font-bold tabular-nums text-secondary"
          aria-label={`${formatted} estrelas`}
        >
          <span aria-hidden>⭐</span>
          <span>{formatted}</span>
        </div>
      </div>
    </header>
  );
};
