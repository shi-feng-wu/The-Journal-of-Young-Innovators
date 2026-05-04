import type { MetadataRoute } from "next";
import { SITE_ARTICLES } from "@/lib/articles";

const SITE_URL = "https://young-innovator.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: Array<{
    path: string;
    priority?: number;
    changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
  }> = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/about", priority: 0.8, changeFrequency: "yearly" },
    { path: "/issues", priority: 0.9, changeFrequency: "monthly" },
    { path: "/form", priority: 0.85, changeFrequency: "yearly" },
    { path: "/submission", priority: 0.7, changeFrequency: "yearly" },
    { path: "/faq", priority: 0.6, changeFrequency: "yearly" },
    { path: "/editorial-team", priority: 0.6, changeFrequency: "monthly" },
    { path: "/scholarly-event", priority: 0.6, changeFrequency: "monthly" },
    { path: "/partners", priority: 0.5, changeFrequency: "yearly" },
    { path: "/donate", priority: 0.4, changeFrequency: "yearly" },
    { path: "/contact", priority: 0.4, changeFrequency: "yearly" },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map(
    ({ path, priority, changeFrequency }) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency,
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
