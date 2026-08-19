import {
  ArrowUpRight,
  BrainCircuit,
  Radar,
  ShieldCheck,
  Workflow,
  GitBranch,
  Fingerprint,
  ScanSearch,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { capabilities, fallbackArticles, pillars } from "@/config/site";
import { OrchestrationGraph } from "@/components/product/OrchestrationGraph";
import { RingMark } from "@/components/brand/RingMark";

const capabilityIcons = {
  Intelligence: BrainCircuit,
  Orchestration: Workflow,
  Resilience: ShieldCheck,
} as const;
const pillarIcons = {
  risk: Radar,
  intelligence: BrainCircuit,
  orchestration: Workflow,
  sovereignty: Fingerprint,
} as const;

export function PillarGrid() {
  return (
    <section className="dc-section" aria-labelledby="pillar-title">
      <div className="dc-shell">
        <div className="dc-section-heading">
          <div className="dc-kicker">Four operating pillars</div>
          <h2 id="pillar-title">A controlled path from signal to action.</h2>
          <p>
            Each layer has one job. The interface keeps those boundaries legible instead of hiding
            them behind generic automation claims.
          </p>
        </div>
        <div className="dc-pillar-grid">
          {pillars.map((pillar, index) => {
            const Icon = pillarIcons[pillar.id];
            return (
              <article key={pillar.id} className="dc-glass dc-elev-3 dc-pillar-card">
                <div className="dc-pillar-card__top">
                  <span>0{index + 1}</span>
                  <Icon size={19} strokeWidth={1.5} />
                </div>
                <h3>{pillar.title}</h3>
                <strong>{pillar.statement}</strong>
                <p>{pillar.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export function CapabilityGrid() {
  return (
    <section className="dc-section dc-section--tight" aria-labelledby="capabilities-title">
      <div className="dc-shell">
        <div className="dc-section-heading dc-section-heading--split">
          <div>
            <div className="dc-kicker">Operational surfaces</div>
            <h2 id="capabilities-title">Intelligence. Orchestration. Resilience.</h2>
          </div>
          <p>
            Three product views, all grounded in the same governed state rather than three
            disconnected dashboards.
          </p>
        </div>
        <div className="dc-capability-grid">
          {capabilities.map((capability) => {
            const Icon = capabilityIcons[capability.title];
            return (
              <Link
                to={capability.href}
                key={capability.title}
                className="dc-glass dc-elev-5 dc-capability-card"
              >
                <span className="dc-capability-card__icon">
                  <Icon size={22} strokeWidth={1.4} />
                </span>
                <span className="dc-kicker">{capability.eyebrow}</span>
                <h3>{capability.title}</h3>
                <p>{capability.body}</p>
                <span className="dc-card-link">
                  Explore surface <ArrowUpRight size={15} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function AdaptiveResponseStrip() {
  return (
    <section className="dc-section" aria-labelledby="response-title">
      <div className="dc-shell dc-response-strip dc-glass dc-elev-7">
        <div className="dc-response-strip__copy">
          <div className="dc-kicker">Adaptive Response Orchestration</div>
          <h2 id="response-title">Move quickly without making control invisible.</h2>
          <p>
            Route signals through context, policy, human approval and action while retaining the
            trace that explains how the response unfolded.
          </p>
          <div className="dc-response-strip__principles">
            <span>
              <GitBranch size={15} /> Explicit routing
            </span>
            <span>
              <ShieldCheck size={15} /> Human checkpoints
            </span>
            <span>
              <ScanSearch size={15} /> Observable trace
            </span>
          </div>
          <Link to="/orchestration" className="dc-button dc-button--outline">
            Explore orchestration
          </Link>
        </div>
        <OrchestrationGraph />
      </div>
    </section>
  );
}

export function InsightTeaser() {
  const article = fallbackArticles[0];
  if (!article) return null;
  return (
    <section className="dc-section dc-section--tight" aria-labelledby="insight-title">
      <div className="dc-shell dc-insight-teaser">
        <div className="dc-insight-teaser__visual dc-glass dc-elev-3" aria-hidden="true">
          <div className="dc-insight-teaser__grid" />
          <RingMark size={170} pulse />
          <span className="dc-insight-signal dc-insight-signal--one">01 · detect</span>
          <span className="dc-insight-signal dc-insight-signal--two">02 · correlate</span>
          <span className="dc-insight-signal dc-insight-signal--three">03 · route</span>
        </div>
        <div className="dc-insight-teaser__copy">
          <div className="dc-kicker">Latest insight</div>
          <h2 id="insight-title">{article.title}</h2>
          <p>{article.subtitle}</p>
          <div className="dc-meta-row">
            <span>{article.readTime} min read</span>
            <span>{article.author.role}</span>
          </div>
          <Link
            to="/insights/$slug"
            params={{ slug: article.slug }}
            className="dc-button dc-button--ghost"
          >
            Read the analysis <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function TrustSection() {
  return (
    <section className="dc-section dc-section--tight" aria-labelledby="trust-title">
      <div className="dc-shell dc-trust-surface">
        <div>
          <div className="dc-kicker">Designed for controlled operations</div>
          <h2 id="trust-title">No invented live state. No hidden authority.</h2>
        </div>
        <p>
          Product surfaces distinguish authoritative data from demo state, preserve source context
          and keep automation boundaries visible to operators.
        </p>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="dc-section dc-section--closing" aria-labelledby="closing-title">
      <div className="dc-shell dc-closing-cta dc-glass dc-elev-7">
        <RingMark size={86} />
        <div>
          <div className="dc-kicker">Daycostra Platform</div>
          <h2 id="closing-title">
            Build an operational view you can still explain under pressure.
          </h2>
        </div>
        <Link to="/contact" className="dc-button dc-button--primary">
          Request Platform Access
        </Link>
      </div>
    </section>
  );
}
