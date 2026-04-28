import type { MetadataRoute } from "next";
import { SITE_ARTICLES } from "@/lib/articles";

const SITE_URL = "https://young-innovator.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: Array<{ path: string; priority?: number }> = [
    { path: "/", priority: 1 },
    { path: "/about", priority: 0.8 },
    { path: "/issues", priority: 0.9 },
    { path: "/form", priority: 0.85 },
    { path: "/submission", priority: 0.7 },
    { path: "/faq", priority: 0.6 },
    { path: "/editorial-team", priority: 0.6 },
    { path: "/scholarly-event", priority: 0.6 },
    { path: "/partners", priority: 0.5 },
    { path: "/donate", priority: 0.4 },
    { path: "/contact", priority: 0.4 },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map(
    ({ path, priority }) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority,
    }),
  );

  const articleEntries: MetadataRoute.Sitemap = SITE_ARTICLES.map(
    (article) => ({
      url: `${SITE_URL}/issues/articles/${article.slug}`,
      lastModified: new Date(article.publishDate),
      changeFrequency: "yearly",
      priority: 0.8,
    }),
  );

  return [...staticEntries, ...articleEntries];
}
