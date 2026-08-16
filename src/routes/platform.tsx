import { createFileRoute } from "@tanstack/react-router";
import { BrainCircuit, Workflow, ShieldCheck, ArrowRight } from "lucide-react";
import { PlatformStack } from "@/components/product/PlatformStack";
import { OrchestrationGraph } from "@/components/product/OrchestrationGraph";
import { RingMark } from "@/components/brand/RingMark";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const Route = createFileRoute("/platform")({
  component: PlatformPage,
  head: () => ({
    meta: [
      { title: "Daycostra Platform — Intelligence, Orchestration, Control" },
      {
        name: "description",
        content:
          "Built for sovereign intelligence and orchestrated response across unpredictable environments.",
      },
    ],
  }),
});

const editorialRows = [
  {
    title: "Intelligence",
    eyebrow: "Unified Intelligence Layer",
    body: "Advanced signal fusion and contextual assessment across governed sources. The interface preserves where each signal came from instead of flattening evidence into one opaque result.",
    href: "/intelligence",
    icon: BrainCircuit,
    visual: "mark" as const,
  },
  {
    title: "Orchestration",
    eyebrow: "Adaptive Response",
    body: "Coordinate automated and human-in-the-loop response paths through explicit stages, visible approval points and traceable state.",
    href: "/orchestration",
    icon: Workflow,
    visual: "graph" as const,
  },
  {
    title: "Resilience",
    eyebrow: "Sovereign Control",
    body: "Maintain a controlled operating posture as conditions change, with boundaries, evidence and decision context kept visible to operators.",
    href: "/control-plane",
    icon: ShieldCheck,
    visual: "shield" as const,
  },
] as const;

function PlatformPage() {
  return (
    <main className="dc-page dc-page--platform">
      <section className="dc-platform-hero" aria-labelledby="platform-title">
        <div className="dc-shell dc-platform-hero__inner">
          <div className="dc-kicker">Daycostra architecture</div>
          <h1 id="platform-title">THE DAYCOSTRA PLATFORM</h1>
          <p>Built for sovereign intelligence and orchestrated response across unpredictable environments.</p>
          <PlatformStack />
        </div>
      </section>

      <section className="dc-platform-editorial" aria-label="Platform capabilities">
        <div className="dc-shell">
          {editorialRows.map((row, index) => {
            const Icon = row.icon;
            return (
              <article key={row.title} className={`dc-editorial-row ${index % 2 ? "dc-editorial-row--reverse" : ""}`}>
                <div className="dc-editorial-row__visual dc-glass dc-elev-3">
                  {row.visual === "mark" && <RingMark size={170} pulse />}
                  {row.visual === "graph" && <OrchestrationGraph className="dc-graph-shell--embedded" />}
                  {row.visual === "shield" && (
                    <div className="dc-shield-visual" aria-hidden="true">
                      <ShieldCheck size={78} strokeWidth={1.1} />
                      <span className="dc-shield-visual__orbit" />
                      <span className="dc-shield-visual__orbit dc-shield-visual__orbit--two" />
                    </div>
                  )}
                </div>
                <div className="dc-editorial-row__copy">
                  <div className="dc-kicker">{row.eyebrow}</div>
                  <h2>{row.title}</h2>
                  <p>{row.body}</p>
                  <a href={row.href} className="dc-card-link">
                    Learn more <ArrowRight size={15} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="dc-section dc-section--closing">
        <div className="dc-shell dc-platform-access">
          <div>
            <div className="dc-kicker">Platform access</div>
            <h2>Bring controlled intelligence into the operating loop.</h2>
          </div>
          <a href="/contact?intent=request-access" className="dc-button dc-button--primary">
            Request Platform Access <ArrowRight size={16} />
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
