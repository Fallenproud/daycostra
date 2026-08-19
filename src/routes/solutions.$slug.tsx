import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { solutions, pillarById, type Solution } from "@/config/site";
import { PlatformStack } from "@/components/product/PlatformStack";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const Route = createFileRoute("/solutions/$slug")({
  loader: ({ params }) => {
    const solution = solutions.find((item) => item.slug === params.slug);
    if (!solution) throw notFound();
    return solution;
  },
  component: SolutionDetailPage,
});

function SolutionDetailPage() {
  const solution = Route.useLoaderData() as Solution;

  return (
    <main className="dc-page">
      <section className="dc-route-hero dc-route-hero--detail">
        <div className="dc-shell dc-solution-detail-hero">
          <div>
            <Link to="/solutions" className="dc-back-link"><ArrowLeft size={14} /> Solutions</Link>
            <div className="dc-kicker">{solution.eyebrow}</div>
            <h1>{solution.title}</h1>
            <p>{solution.summary}</p>
            <Link to="/contact" className="dc-button dc-button--primary">Discuss this use case <ArrowRight size={15} /></Link>
          </div>
          <div className="dc-solution-detail-hero__stack dc-glass dc-elev-5">
            <PlatformStack compact />
          </div>
        </div>
      </section>

      <section className="dc-section dc-section--tight">
        <div className="dc-shell dc-solution-detail-grid">
          <div>
            <div className="dc-kicker">Relevant platform pillars</div>
            <h2>Capabilities mapped to the operating problem.</h2>
          </div>
          <div className="dc-solution-detail-pillars">
            {solution.pillars.map((id) => {
              const pillar = pillarById(id);
              return (
                <article key={id} className="dc-glass dc-elev-3">
                  <span>{pillar.shortTitle}</span>
                  <h3>{pillar.statement}</h3>
                  <p>{pillar.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="dc-section dc-section--tight">
        <div className="dc-shell dc-scenario-panel dc-glass dc-elev-5">
          <div>
            <div className="dc-kicker">Scenario focus</div>
            <h2>Where the platform model applies.</h2>
          </div>
          <div className="dc-scenario-list">
            {solution.scenarios.map((scenario) => (
              <div key={scenario}><CheckCircle2 size={17} /> {scenario}</div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
