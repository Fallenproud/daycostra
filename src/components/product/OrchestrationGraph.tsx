import { cn } from "@/lib/utils";

const nodes = [
  { id: "source", x: 55, y: 90, label: "Signal" },
  { id: "intel", x: 190, y: 45, label: "Context" },
  { id: "policy", x: 190, y: 135, label: "Policy" },
  { id: "route", x: 330, y: 90, label: "Route" },
  { id: "human", x: 465, y: 45, label: "Approve" },
  { id: "action", x: 465, y: 135, label: "Action" },
  { id: "trace", x: 600, y: 90, label: "Trace" },
] as const;

const edges = [
  ["source", "intel"],
  ["source", "policy"],
  ["intel", "route"],
  ["policy", "route"],
  ["route", "human"],
  ["route", "action"],
  ["human", "trace"],
  ["action", "trace"],
] as const;

function point(id: string) {
  return nodes.find((node) => node.id === id)!;
}

export function OrchestrationGraph({ className }: { className?: string }) {
  return (
    <div className={cn("dc-graph-shell", className)}>
      <div className="dc-demo-label">Demo topology</div>
      <svg viewBox="0 0 660 180" role="img" aria-labelledby="orchestration-graph-title">
        <title id="orchestration-graph-title">
          Example orchestration topology showing signal, context, policy, routing, approval, action and trace.
        </title>
        <defs>
          <linearGradient id="dc-edge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#4b4e56" />
            <stop offset="0.5" stopColor="#8b4cf3" />
            <stop offset="1" stopColor="#a5a7ad" />
          </linearGradient>
          <radialGradient id="dc-node" cx="45%" cy="35%" r="70%">
            <stop offset="0" stopColor="#6a2be2" stopOpacity="0.36" />
            <stop offset="1" stopColor="#101116" stopOpacity="0.96" />
          </radialGradient>
        </defs>

        <g className="dc-graph-edges">
          {edges.map(([from, to]) => {
            const a = point(from);
            const b = point(to);
            const mid = (a.x + b.x) / 2;
            const d = `M ${a.x + 34} ${a.y} C ${mid} ${a.y}, ${mid} ${b.y}, ${b.x - 34} ${b.y}`;
            return <path key={`${from}-${to}`} d={d} fill="none" stroke="url(#dc-edge)" strokeWidth="1.5" />;
          })}
        </g>

        {nodes.map((node) => (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`} className="dc-graph-node">
            <circle r="28" fill="url(#dc-node)" stroke="rgba(165,167,173,.45)" />
            <circle r="22" fill="none" stroke="rgba(106,43,226,.36)" strokeDasharray="2 5" />
            <text y="4" textAnchor="middle" fill="#f7f4ef" fontSize="10" fontFamily="ui-monospace, monospace">
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
