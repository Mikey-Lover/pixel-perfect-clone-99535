import teamImage from "@/assets/sentai-team.png";

export const TopBar = ({ subtitle }: { subtitle: string }) => {
  return (
    <header className="sticky top-0 z-30 border-b border-border/50 bg-background/85 backdrop-blur-lg">
      <div className="mx-auto flex max-w-md items-center gap-3 px-4 py-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-primary/70 shadow-[0_0_18px_hsl(var(--primary)/0.6)]">
          <img src={teamImage} alt="Equipe Super Sentai" className="h-full w-full object-cover object-top scale-150" />
        </div>
        <div className="flex-1">
          <h1 className="font-display text-2xl leading-none text-foreground">
            SUPER <span className="text-primary text-glow-red">SENTAIS</span>
          </h1>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">{subtitle}</p>
        </div>
        <div className="rounded-md border border-secondary/40 bg-secondary/10 px-2 py-1 text-xs font-bold text-secondary">
          ⭐ 1.240
        </div>
      </div>
    </header>
  );
};
