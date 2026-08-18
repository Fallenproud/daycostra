import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, BookOpen, DatabaseZap } from "lucide-react";
import { insightRepository } from "@/lib/content";
import { pillarById } from "@/config/site";
import { RingMark } from "@/components/brand/RingMark";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const Route = createFileRoute("/insights")({
  loader: () => insightRepository.list(),
  component: InsightsPage,
  head: () => ({
    meta: [
      { title: "Daycostra Insights" },
      { name: "description", content: "Research and operating notes on risk, intelligence, orchestration and sovereign control." },
    ],
  }),
});

function InsightsPage() {
  const articles = Route.useLoaderData();
  const configDetected = insightRepository.sanityConfigPresent;

  return (
    <main className="dc-page">
      <section className="dc-route-hero">
        <div className="dc-shell dc-route-hero__inner">
          <div className="dc-kicker">Insights</div>
          <h1>Operating intelligence without hiding the hard parts.</h1>
          <p>Notes on signal quality, response design, provenance and the control boundaries that make automation accountable.</p>
          <div className="dc-content-source">
            {configDetected ? <DatabaseZap size={14} /> : <BookOpen size={14} />}
            {configDetected
              ? "Sanity environment detected · CMS client not connected · local editorial source active"
              : "Typed local editorial source · Sanity selected, not connected"}
          </div>
        </div>
      </section>

      <section className="dc-section dc-section--tight">
        <div className="dc-shell dc-insights-grid">
          {articles.map((article, index) => (
            <Link to="/insights/$slug" params={{ slug: article.slug }} key={article.slug} className={`dc-insight-card dc-glass dc-elev-${index === 0 ? "7" : "3"}`}>
              <div className="dc-insight-card__visual" aria-hidden="true">
                <RingMark size={index === 0 ? 155 : 96} pulse={index === 0} />
                <span>{pillarById(article.pillar).shortTitle}</span>
              </div>
              <div className="dc-insight-card__body">
                <div className="dc-kicker">{article.readTime} min read · {article.author.role}</div>
                <h2>{article.title}</h2>
                <p>{article.subtitle}</p>
                <span className="dc-card-link">Read insight <ArrowUpRight size={15} /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
