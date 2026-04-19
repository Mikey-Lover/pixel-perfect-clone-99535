import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { BottomNav, type View } from "@/components/BottomNav";
import { RouteMapView } from "@/components/RouteMapView";
import { HeroesView } from "@/components/HeroesView";
import { BattleView } from "@/components/BattleView";

const SUBTITLES: Record<View, string> = {
  map: "Rota Sagrada · Niterói",
  heroes: "Equipe · Coleção",
  battle: "Combate · Turnos",
};

const Index = () => {
  const [view, setView] = useState<View>("map");

  return (
    <div className="relative min-h-screen pb-24">
      {/* Atmospheric background flourishes */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-32 top-2/3 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <TopBar subtitle={SUBTITLES[view]} />

      <main className="px-4">
        {view === "map" && <RouteMapView />}
        {view === "heroes" && <HeroesView />}
        {view === "battle" && <BattleView />}
      </main>

      <BottomNav view={view} onChange={setView} />
    </div>
  );
};

export default Index;
