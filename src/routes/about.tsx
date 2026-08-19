import { createFileRoute, Link } from "@tanstack/react-router";
import { CircleDot, Layers3, Waves, Cable, ArrowRight } from "lucide-react";
import { pillars } from "@/config/site";
import { RingMark } from "@/components/brand/RingMark";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Daycostra" },
      { name: "description", content: "The operating principles and visual system behind Daycostra." },
    ],
  }),
});

const materials = [
  { title: "Obsidian", body: "Near-black engineered base material for calm, high-contrast operational surfaces.", icon: CircleDot },
  { title: "Scale", body: "Subtle overlapping structure used as environmental texture rather than foreground decoration.", icon: Layers3 },
  { title: "Violet Haze", body: "Controlled volumetric illumination for focus, hierarchy and active relationships.", icon: Waves },
  { title: "Integrated Wire", body: "Fine technical linework used to suggest governed connectivity and signal flow.", icon: Cable },
] as const;

function AboutPage() {
  return (
    <>
      <main className="dc-page">
      <section className="dc-route-hero dc-route-hero--detail">
        <div className="dc-shell dc-about-hero">
          <div>
            <div className="dc-kicker">About Daycostra</div>
            <h1>Control is a product property, not a marketing adjective.</h1>
            <p>
              Daycostra is being designed around a simple operating principle: intelligence is useful only when its sources, boundaries, decisions and actions remain understandable under pressure.
            </p>
            <Link to="/platform" className="dc-button dc-button--outline">Explore the platform <ArrowRight size={15} /></Link>
          </div>
          <div className="dc-about-hero__mark dc-glass dc-elev-7">
            <RingMark size={260} pulse />
          </div>
        </div>
      </section>

      <section className="dc-section dc-section--tight">
        <div className="dc-shell">
          <div className="dc-section-heading">
            <div className="dc-kicker">Product truth</div>
            <h2>Four published capabilities. No filler.</h2>
          </div>
          <div className="dc-pillar-grid">
            {pillars.map((pillar, index) => (
              <article className="dc-glass dc-elev-3 dc-pillar-card" key={pillar.id}>
                <div className="dc-pillar-card__top"><span>0{index + 1}</span><span>{pillar.shortTitle}</span></div>
                <h3>{pillar.statement}</h3>
                <p>{pillar.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dc-section dc-section--tight">
        <div className="dc-shell">
          <div className="dc-section-heading dc-section-heading--split">
            <div>
              <div className="dc-kicker">Material system</div>
              <h2>One visual language, built from four controlled materials.</h2>
            </div>
            <p>The visual system is procedural and reusable. Texture supports hierarchy; it never replaces information architecture.</p>
          </div>
          <div className="dc-material-grid">
            {materials.map((material) => {
              const Icon = material.icon;
              return (
                <article key={material.title} className={`dc-material-card dc-material-card--${material.title.toLowerCase().replace(" ", "-")}`}>
                  <Icon size={21} strokeWidth={1.4} />
                  <h3>{material.title}</h3>
                  <p>{material.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      </main>
      <SiteFooter />
    </>
  );
}
