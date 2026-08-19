export type PillarId = "risk" | "intelligence" | "orchestration" | "sovereignty";

export const mainNav = [
  { label: "Platform", href: "/platform" },
  { label: "Solutions", href: "/solutions" },
  { label: "Insights", href: "/insights" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const pillars = [
  {
    id: "risk" as const,
    title: "Real-time Risk Detection",
    shortTitle: "Risk Detection",
    statement: "Detect anomalies as they form.",
    body: "Surface meaningful changes early enough for operators to investigate and act without turning noise into certainty.",
  },
  {
    id: "intelligence" as const,
    title: "Unified Intelligence Layer",
    shortTitle: "Unified Intelligence",
    statement: "One view across feeds, sources, identities.",
    body: "Bring governed signals into a shared operational picture while preserving source context and traceability.",
  },
  {
    id: "orchestration" as const,
    title: "Adaptive Response Orchestration",
    shortTitle: "Adaptive Response",
    statement: "Cascade the right action — automated or human-in-the-loop.",
    body: "Coordinate response paths with explicit control points, observable state and room for human approval where it matters.",
  },
  {
    id: "sovereignty" as const,
    title: "Sovereign Data Control",
    shortTitle: "Sovereign Control",
    statement: "Boundaries stay intact, audit trail stays closed.",
    body: "Keep operational boundaries explicit so access, evidence and decision context remain governed throughout the workflow.",
  },
] as const;

export const capabilities = [
  {
    title: "Intelligence",
    eyebrow: "Sense + correlate",
    body: "Fuse governed signals into a coherent operational picture without hiding source lineage.",
    href: "/intelligence",
  },
  {
    title: "Orchestration",
    eyebrow: "Coordinate + approve",
    body: "Move from signal to controlled response through observable steps, policies and human checkpoints.",
    href: "/orchestration",
  },
  {
    title: "Resilience",
    eyebrow: "Contain + recover",
    body: "Maintain controlled operating posture as conditions change, without trading speed for accountability.",
    href: "/control-plane",
  },
] as const;

export type Solution = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  pillars: PillarId[];
  scenarios: string[];
};

export const solutions: Solution[] = [
  {
    slug: "capital-markets",
    title: "Capital Markets",
    eyebrow: "Rapid signal change",
    summary: "Coordinate detection, shared intelligence and controlled response when market conditions shift faster than manual handoffs.",
    pillars: ["risk", "intelligence", "orchestration"],
    scenarios: ["Anomaly triage", "Cross-source correlation", "Escalation and approval routing"],
  },
  {
    slug: "infrastructure",
    title: "Infrastructure",
    eyebrow: "Operational continuity",
    summary: "Build a governed view of infrastructure signals and route response without masking uncertainty or provenance.",
    pillars: ["risk", "intelligence", "orchestration", "sovereignty"],
    scenarios: ["Anomaly investigation", "Service-impact coordination", "Recovery playbooks"],
  },
  {
    slug: "government",
    title: "Government",
    eyebrow: "Controlled boundaries",
    summary: "Unify operational context while keeping data boundaries, permissions and audit requirements explicit.",
    pillars: ["intelligence", "sovereignty", "orchestration"],
    scenarios: ["Multi-source situational awareness", "Human-in-the-loop response", "Evidence-preserving handoffs"],
  },
  {
    slug: "enterprise",
    title: "Enterprise",
    eyebrow: "Cross-team coordination",
    summary: "Create a shared operational picture across teams and route accountable response as conditions change.",
    pillars: ["intelligence", "orchestration", "risk"],
    scenarios: ["Operational risk triage", "Team escalation", "Response traceability"],
  },
  {
    slug: "security",
    title: "Security",
    eyebrow: "Adaptive posture",
    summary: "Detect meaningful changes, preserve source context and coordinate controlled security response without fake certainty.",
    pillars: ["risk", "orchestration", "sovereignty"],
    scenarios: ["Signal prioritization", "Approval-gated action", "Audit-ready response"],
  },
  {
    slug: "integrations",
    title: "Integrations",
    eyebrow: "Governed connections",
    summary: "Connect sources and action surfaces through explicit boundaries rather than treating every integration as trusted by default.",
    pillars: ["intelligence", "sovereignty"],
    scenarios: ["Source onboarding", "Boundary-aware data flow", "Controlled action adapters"],
  },
];

export type InsightSection = { id: string; heading: string; paragraphs: string[] };
export type InsightArticle = {
  slug: string;
  title: string;
  subtitle: string;
  pillar: PillarId;
  publishedAt: string;
  readTime: number;
  author: { name: string; role: string };
  tags: string[];
  sections: InsightSection[];
};

export const fallbackArticles: InsightArticle[] = [
  {
    slug: "real-time-risk-spike-resolution",
    title: "From risk spike to controlled response",
    subtitle: "A practical model for moving from a fast-changing signal to an accountable operational decision.",
    pillar: "risk",
    publishedAt: "2026-08-16",
    readTime: 6,
    author: { name: "Daycostra", role: "Platform Engineering" },
    tags: ["risk", "operations", "orchestration"],
    sections: [
      {
        id: "signal",
        heading: "Start with the signal, not the conclusion",
        paragraphs: [
          "Real-time detection is useful only when the system preserves uncertainty. A spike should become a candidate for investigation, not an automatic declaration of cause.",
          "Daycostra's frontend language therefore separates detection, correlation and response instead of collapsing them into a single AI verdict.",
        ],
      },
      {
        id: "context",
        heading: "Build shared context",
        paragraphs: [
          "The intelligence layer gives operators one governed surface for related feeds, source context and identities. The objective is coordination without erasing where each piece of evidence came from.",
        ],
      },
      {
        id: "response",
        heading: "Route an accountable response",
        paragraphs: [
          "Response orchestration should make automation and human approval explicit. The fastest path is not always the safest path, so the operating model needs visible control points and traceable state.",
        ],
      },
    ],
  },
  {
    slug: "infrastructure-adaptive-response",
    title: "Adaptive response for infrastructure anomalies",
    subtitle: "How an operations team can keep continuity and auditability while conditions are changing.",
    pillar: "orchestration",
    publishedAt: "2026-08-16",
    readTime: 5,
    author: { name: "Daycostra", role: "Operations Research" },
    tags: ["infrastructure", "resilience", "response"],
    sections: [
      {
        id: "observe",
        heading: "Observe without overclaiming",
        paragraphs: [
          "A control surface should show authoritative health data when it exists and clearly label demo or static state when it does not. That distinction is part of operational resilience, not just interface polish.",
        ],
      },
      {
        id: "coordinate",
        heading: "Coordinate the next action",
        paragraphs: [
          "Once a signal has enough context, response paths can be routed through automation, human approval or a mixed sequence while the same operational state remains visible to the team.",
        ],
      },
    ],
  },
  {
    slug: "signal-to-decision-pipeline",
    title: "Designing the signal-to-decision pipeline",
    subtitle: "Why intelligence systems need explicit boundaries between source intake, correlation and execution.",
    pillar: "intelligence",
    publishedAt: "2026-08-16",
    readTime: 7,
    author: { name: "Daycostra", role: "Systems Design" },
    tags: ["intelligence", "architecture", "provenance"],
    sections: [
      {
        id: "layers",
        heading: "Keep the layers legible",
        paragraphs: [
          "The platform model separates data sources, intelligence, orchestration and action output. The visual architecture is not decorative; it mirrors the responsibility boundaries the product is intended to preserve.",
        ],
      },
      {
        id: "governance",
        heading: "Govern what crosses each boundary",
        paragraphs: [
          "Sovereign control means the platform should be able to explain what moved between layers, under which permissions, and with which source context intact.",
        ],
      },
    ],
  },
];

export function pillarById(id: PillarId) {
  return pillars.find((pillar) => pillar.id === id)!;
}
