import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Clock3 } from "lucide-react";
import { insightRepository } from "@/lib/content";
import { pillarById, type InsightArticle } from "@/config/site";
import { RingMark } from "@/components/brand/RingMark";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const Route = createFileRoute("/insights/$slug")({
  loader: async ({ params }) => {
    const article = await insightRepository.getBySlug(params.slug);
    if (!article) throw notFound();
    return article;
  },
  head: ({ loaderData }) => loaderData
    ? {
        meta: [
          { title: `${loaderData.title} | Daycostra Insights` },
          { name: "description", content: loaderData.subtitle },
          { property: "og:type", content: "article" },
        ],
      }
    : {},
  component: InsightArticlePage,
});

function InsightArticlePage() {
  const article = Route.useLoaderData() as InsightArticle;
  const pillar = pillarById(article.pillar);

  return (
    <main className="dc-page">
      <article>
        <header className="dc-article-hero">
          <div className="dc-shell dc-article-hero__grid">
            <div>
              <Link to="/insights" className="dc-back-link"><ArrowLeft size={14} /> Insights</Link>
              <div className="dc-kicker">{pillar.shortTitle}</div>
              <h1>{article.title}</h1>
              <p>{article.subtitle}</p>
              <div className="dc-article-meta">
                <span>{article.author.name} · {article.author.role}</span>
                <span><Clock3 size={14} /> {article.readTime} min read</span>
                <span>{article.publishedAt}</span>
              </div>
            </div>
            <div className="dc-article-hero__visual dc-glass dc-elev-5">
              <RingMark size={210} pulse />
              <span>{pillar.statement}</span>
            </div>
          </div>
        </header>

        <section className="dc-section dc-section--tight">
          <div className="dc-shell dc-article-layout">
            <div className="dc-article-prose">
              {article.sections.map((section) => (
                <section id={section.id} key={section.id}>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </section>
              ))}
            </div>
            <aside className="dc-article-rail">
              <div className="dc-glass dc-elev-3">
                <div className="dc-kicker">On this page</div>
                <nav aria-label="Article table of contents">
                  {article.sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.heading}</a>)}
                </nav>
              </div>
              <div className="dc-article-tags">
                {article.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </aside>
          </div>
        </section>
      </article>
      <SiteFooter />
    </main>
  );
}
