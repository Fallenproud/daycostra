import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { fallbackArticles, solutions } from "@/config/site";

const DEFAULT_BASE_URL = "https://daycostra.com";

function getBaseUrl() {
  const configured = process.env.SITE_URL || import.meta.env.VITE_SITE_URL || DEFAULT_BASE_URL;
  return configured.replace(/\/+$/, "");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const baseUrl = getBaseUrl();
        const staticEntries = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/platform", changefreq: "weekly", priority: "0.9" },
          { path: "/solutions", changefreq: "weekly", priority: "0.8" },
          { path: "/insights", changefreq: "weekly", priority: "0.8" },
          { path: "/about", changefreq: "monthly", priority: "0.6" },
          { path: "/contact", changefreq: "monthly", priority: "0.7" },
          { path: "/control-plane", changefreq: "weekly", priority: "0.7" },
          { path: "/intelligence", changefreq: "weekly", priority: "0.7" },
          { path: "/orchestration", changefreq: "weekly", priority: "0.7" },
        ];
        const entries = [
          ...staticEntries,
          ...solutions.map((solution) => ({ path: `/solutions/${solution.slug}`, changefreq: "monthly", priority: "0.6" })),
          ...fallbackArticles.map((article) => ({ path: `/insights/${article.slug}`, changefreq: "monthly", priority: "0.6" })),
        ];
        const urls = entries.map(
          (entry) =>
            `  <url>\n    <loc>${baseUrl}${entry.path}</loc>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`,
        );
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
