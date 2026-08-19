import { fallbackArticles, type InsightArticle } from "@/config/site";

export type ContentSource = "local";

export type InsightRepository = {
  source: ContentSource;
  cmsConnected: boolean;
  sanityConfigPresent: boolean;
  list: () => Promise<InsightArticle[]>;
  getBySlug: (slug: string) => Promise<InsightArticle | null>;
};

const sanityConfigPresent = Boolean(
  import.meta.env.VITE_SANITY_PROJECT_ID && import.meta.env.VITE_SANITY_DATASET,
);

/**
 * Local typed content is the only active source in this branch.
 * Sanity remains the selected CMS, but environment configuration alone does not
 * imply that a client/query implementation exists or that CMS reads are live.
 */
export const insightRepository: InsightRepository = {
  source: "local",
  cmsConnected: false,
  sanityConfigPresent,
  async list() {
    return [...fallbackArticles];
  },
  async getBySlug(slug) {
    return fallbackArticles.find((article) => article.slug === slug) ?? null;
  },
};
