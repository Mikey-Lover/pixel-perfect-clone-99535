import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { BottomNav, type View } from "@/components/BottomNav";
import { RouteMapView } from "@/components/RouteMapView";
import { HeroesView } from "@/components/HeroesView";
import { BattleView } from "@/components/BattleView";
import type { Stage } from "@/data/route";
import { useProgress } from "@/hooks/useProgress";

const SUBTITLES: Record<View, string> = {
  map: "Rota Sagrada · Niterói",
  heroes: "Equipe · Coleção",
  battle: "Combate · Turnos",
};

const Index = () => {
  const [view, setView] = useState<View>("map");
  const [activeStage, setActiveStage] = useState<Stage | null>(null);
  const [completed, setCompleted] = useState<Set<number>>(() => new Set());
  const { state: progress, claimStage } = useProgress();

  const handleStartStage = (stage: Stage) => {
    setActiveStage(stage);
    setView("battle");
  };

  const handleVictory = (stageId: number) => {
    setCompleted((prev) => {
      if (prev.has(stageId)) return prev;
      const next = new Set(prev);
      next.add(stageId);
      return next;
    });
    return claimStage(stageId);
  };

  const handleExitBattle = () => {
    setActiveStage(null);
    setView("map");
  };

  const handleNavChange = (next: View) => {
    if (next !== "battle") setActiveStage(null);
    setView(next);
  };

  return (
    <div className="relative min-h-screen pb-24">
      {/* Atmospheric background flourishes */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-32 top-2/3 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <TopBar
        subtitle={activeStage && view === "battle" ? `Fase ${activeStage.id} · ${activeStage.name}` : SUBTITLES[view]}
        stars={progress.stars}
      />

      <main className="px-4">
        {view === "map" && (
          <RouteMapView completed={completed} onStartStage={handleStartStage} />
        )}
        {view === "heroes" && <HeroesView heroes={progress.heroes} />}
        {view === "battle" && (
          <BattleView
            stage={activeStage}
            heroes={progress.heroes}
            onVictory={handleVictory}
            onExit={activeStage ? handleExitBattle : undefined}
          />
        )}
      </main>

      <BottomNav view={view} onChange={handleNavChange} />
    </div>
  );
};

export default Index;
