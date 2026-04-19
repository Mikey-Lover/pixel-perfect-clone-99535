import { Map, Users, Swords } from "lucide-react";
import { cn } from "@/lib/utils";

export type View = "map" | "heroes" | "battle";

interface Props {
  view: View;
  onChange: (v: View) => void;
}

const items: { id: View; label: string; icon: typeof Map }[] = [
  { id: "map", label: "Rota", icon: Map },
  { id: "heroes", label: "Heróis", icon: Users },
  { id: "battle", label: "Combate", icon: Swords },
];

export const BottomNav = ({ view, onChange }: Props) => {
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-background/85 backdrop-blur-lg"
    >
      <ul className="mx-auto grid max-w-md grid-cols-3">
        {items.map(({ id, label, icon: Icon }) => {
          const active = view === id;
          return (
            <li key={id}>
              <button
                onClick={() => onChange(id)}
                className={cn(
                  "relative flex w-full flex-col items-center gap-1 py-3 text-xs font-semibold uppercase tracking-widest transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
                aria-current={active ? "page" : undefined}
              >
                {active && (
                  <span
                    aria-hidden
                    className="absolute -top-px left-1/2 h-0.5 w-10 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]"
                  />
                )}
                <Icon className={cn("h-5 w-5", active && "drop-shadow-[0_0_6px_hsl(var(--primary))]")} />
                <span>{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
