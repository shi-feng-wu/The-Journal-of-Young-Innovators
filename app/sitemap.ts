import type { MetadataRoute } from "next";

const SITE_URL = "https://young-innovator.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: Array<{ path: string; priority?: number }> = [
    { path: "/", priority: 1 },
    { path: "/about", priority: 0.8 },
    { path: "/issues", priority: 0.9 },
    { path: "/submission", priority: 0.7 },
    { path: "/faq", priority: 0.6 },
    { path: "/editorial-team", priority: 0.6 },
    { path: "/scholarly-event", priority: 0.6 },
    { path: "/partners", priority: 0.5 },
    { path: "/donate", priority: 0.4 },
    { path: "/contact", priority: 0.4 },
  ];

  return routes.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority,
  }));
}
