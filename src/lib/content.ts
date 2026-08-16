import { fallbackArticles, type InsightArticle } from "@/config/site";

export type ContentSource = "local" | "sanity-ready";

export type InsightRepository = {
  source: ContentSource;
  cmsConfigured: boolean;
  list: () => Promise<InsightArticle[]>;
  getBySlug: (slug: string) => Promise<InsightArticle | null>;
};

const hasSanityConfig = Boolean(
  import.meta.env.VITE_SANITY_PROJECT_ID && import.meta.env.VITE_SANITY_DATASET,
);

/**
 * The public frontend is intentionally operational without CMS credentials.
 * Sanity is the selected CMS, but until an authenticated/read client is wired,
 * local typed content remains the truthful source rather than simulating a live CMS.
 */
export const insightRepository: InsightRepository = {
  source: hasSanityConfig ? "sanity-ready" : "local",
  cmsConfigured: hasSanityConfig,
  async list() {
    return fallbackArticles;
  },
  async getBySlug(slug) {
    return fallbackArticles.find((article) => article.slug === slug) ?? null;
  },
};
