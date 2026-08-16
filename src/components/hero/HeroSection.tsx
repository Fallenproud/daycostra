import { ArrowRight, Radar, Workflow, ShieldCheck, Network } from "lucide-react";
import { RingMark } from "@/components/brand/RingMark";
import { pillars } from "@/config/site";

const heroSignals = [
  { label: "Detect", icon: Radar },
  { label: "Understand", icon: Network },
  { label: "Orchestrate", icon: Workflow },
  { label: "Control", icon: ShieldCheck },
];

export function HeroSection() {
  return (
    <section className="dc-hero" aria-labelledby="home-hero-title">
      <div className="dc-shell dc-hero__grid">
        <div className="dc-hero__copy">
          <div className="dc-kicker">Sovereign intelligence · controlled response</div>
          <h1 id="home-hero-title">Control the unknown.</h1>
          <p className="dc-hero__lede">
            Detect meaningful change, unify operational context and orchestrate accountable response across unpredictable environments.
          </p>

          <div className="dc-hero__actions">
            <a href="/platform" className="dc-button dc-button--primary">
              Explore the Platform <ArrowRight size={16} />
            </a>
            <a href="/contact" className="dc-button dc-button--ghost">
              Talk to an Expert
            </a>
          </div>

          <div className="dc-hero__signals" aria-label="Daycostra operating model">
            {heroSignals.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="dc-hero-signal">
                  <Icon size={15} strokeWidth={1.5} />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="dc-hero__visual" aria-label="Daycostra system mark">
          <div className="dc-hero-orbit dc-hero-orbit--outer" aria-hidden="true" />
          <div className="dc-hero-orbit dc-hero-orbit--inner" aria-hidden="true" />
          <div className="dc-hero__mark-shell">
            <RingMark size={360} pulse />
          </div>
          <div className="dc-hero__annotation dc-hero__annotation--a">Signal context</div>
          <div className="dc-hero__annotation dc-hero__annotation--b">Policy boundary</div>
          <div className="dc-hero__annotation dc-hero__annotation--c">Response trace</div>
        </div>
      </div>

      <div className="dc-shell dc-hero__pillar-strip">
        {pillars.map((pillar, index) => (
          <a href="/platform" key={pillar.id} className="dc-pillar-mini">
            <span className="dc-pillar-mini__index">0{index + 1}</span>
            <span>
              <strong>{pillar.shortTitle}</strong>
              <small>{pillar.statement}</small>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
