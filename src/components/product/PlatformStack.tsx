import { useState, type CSSProperties } from "react";
import { Database, BrainCircuit, Workflow, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const layers = [
  {
    id: "sources",
    label: "Data Sources",
    detail: "Governed inputs and source context",
    icon: Database,
  },
  {
    id: "intelligence",
    label: "Intelligence Layer",
    detail: "Correlation, context and shared operational view",
    icon: BrainCircuit,
  },
  {
    id: "orchestration",
    label: "Orchestration Engine",
    detail: "Controlled response paths and approval points",
    icon: Workflow,
  },
  {
    id: "response",
    label: "Response & Action Output",
    detail: "Governed execution with visible state",
    icon: ShieldCheck,
  },
] as const;

export function PlatformStack({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className={cn("dc-platform-stack", compact && "dc-platform-stack--compact")}>
      <div className="dc-platform-stack__ambient" aria-hidden="true" />
      <div className="dc-platform-stack__layers" onMouseLeave={() => setActive(null)}>
        {layers.map((layer, index) => {
          const Icon = layer.icon;
          const isActive = active === layer.id;
          const isDimmed = active !== null && !isActive;
          return (
            <button
              type="button"
              key={layer.id}
              className={cn(
                "dc-platform-slab",
                isActive && "is-active",
                isDimmed && "is-dimmed",
              )}
              style={{ "--stack-index": index } as CSSProperties}
              onMouseEnter={() => setActive(layer.id)}
              onFocus={() => setActive(layer.id)}
              onBlur={() => setActive(null)}
              aria-label={`${layer.label}: ${layer.detail}`}
            >
              <span className="dc-platform-slab__wire" aria-hidden="true" />
              <span className="dc-platform-slab__content">
                <span className="dc-platform-slab__icon">
                  <Icon size={18} strokeWidth={1.5} />
                </span>
                <span>
                  <strong>{layer.label}</strong>
                  <small>{layer.detail}</small>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
