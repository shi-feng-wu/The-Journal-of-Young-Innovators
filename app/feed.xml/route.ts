import { SITE_ARTICLES } from "@/lib/articles";

const SITE_URL = "https://young-innovator.org";
const FEED_TITLE = "The Journal of Young Innovators";
const FEED_DESCRIPTION =
  "Peer-reviewed journal of high school and college student research across disciplines — business, science, humanities, healthcare, policy, and AI.";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(date: string) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return new Date().toUTCString();
  return d.toUTCString();
}

export const dynamic = "force-static";

export function GET() {
  const sorted = [...SITE_ARTICLES].sort(
    (a, b) =>
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
  );

  const lastBuild = sorted[0]
    ? toRfc822(sorted[0].publishDate)
    : new Date().toUTCString();

  const items = sorted
    .map((article) => {
      const url = `${SITE_URL}/issues/articles/${article.slug}`;
      const authors = article.author
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);
      const categoryTag = `<category>${escapeXml(article.category)}</category>`;
      const authorTags = authors
        .map((name) => `<dc:creator>${escapeXml(name)}</dc:creator>`)
        .join("");
      const enclosure = article.image
        ? `<enclosure url="${escapeXml(`${SITE_URL}${article.image}`)}" type="image/webp" />`
        : "";
      return `<item>
<title>${escapeXml(article.title)}</title>
<link>${escapeXml(url)}</link>
<guid isPermaLink="true">${escapeXml(url)}</guid>
<pubDate>${toRfc822(article.publishDate)}</pubDate>
${authorTags}${categoryTag}
<description>${escapeXml(article.abstract)}</description>
${enclosure}
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
<title>${escapeXml(FEED_TITLE)}</title>
<link>${SITE_URL}</link>
<atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
<description>${escapeXml(FEED_DESCRIPTION)}</description>
<language>en</language>
<lastBuildDate>${lastBuild}</lastBuildDate>
${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
