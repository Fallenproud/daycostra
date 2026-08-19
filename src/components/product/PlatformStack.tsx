import { type CSSProperties } from "react";
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
  return (
    <div className={cn("dc-platform-stack", compact && "dc-platform-stack--compact")}>
      <div className="dc-platform-stack__ambient" aria-hidden="true" />
      <div className="dc-platform-stack__layers">
        {layers.map((layer, index) => {
          const Icon = layer.icon;
          return (
            <div
              key={layer.id}
              className="dc-platform-slab"
              style={{ "--stack-index": index } as CSSProperties}
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
