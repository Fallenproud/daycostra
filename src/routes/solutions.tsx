import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Landmark, ServerCog, Building2, Shield, PlugZap, BriefcaseBusiness } from "lucide-react";
import { solutions, pillarById } from "@/config/site";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const Route = createFileRoute("/solutions")({
  component: SolutionsPage,
  head: () => ({
    meta: [
      { title: "Daycostra Solutions" },
      {
        name: "description",
        content: "Operational use cases for controlled risk detection, intelligence, orchestration and sovereign data boundaries.",
      },
    ],
  }),
});

const icons = [Landmark, ServerCog, Building2, BriefcaseBusiness, Shield, PlugZap];

function SolutionsPage() {
  return (
    <main className="dc-page">
      <section className="dc-route-hero">
        <div className="dc-shell dc-route-hero__inner">
          <div className="dc-kicker">Solutions</div>
          <h1>Operational control across different environments.</h1>
          <p>
            The scenarios change. The platform principles do not: detect meaningful change, preserve context, orchestrate accountable response and keep boundaries explicit.
          </p>
        </div>
      </section>

      <section className="dc-section dc-section--tight">
        <div className="dc-shell dc-solution-grid">
          {solutions.map((solution, index) => {
            const Icon = icons[index];
            return (
              <Link to="/solutions/$slug" params={{ slug: solution.slug }} key={solution.slug} className="dc-glass dc-elev-5 dc-solution-card">
                <div className="dc-solution-card__top">
                  <span className="dc-solution-card__icon"><Icon size={21} strokeWidth={1.4} /></span>
                  <ArrowUpRight size={17} />
                </div>
                <div className="dc-kicker">{solution.eyebrow}</div>
                <h2>{solution.title}</h2>
                <p>{solution.summary}</p>
                <div className="dc-solution-card__pillars">
                  {solution.pillars.map((pillar) => (
                    <span key={pillar}>{pillarById(pillar).shortTitle}</span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
