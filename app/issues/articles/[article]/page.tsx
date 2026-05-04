import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PdfArticleViewer from "./PdfArticleViewer";
import {
  getArticleFromSlug,
  getArticleViewerStaticParams,
} from "@/lib/articlePdfViewer";
import type { SiteArticle } from "@/lib/articles";

const SITE_URL = "https://young-innovator.org";

type PageProps = {
  params: Promise<{ article: string }>;
  searchParams?: Promise<{ from?: string | string[] }>;
};

export function generateStaticParams() {
  return getArticleViewerStaticParams();
}

function splitAuthors(author: string): string[] {
  return author
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);
}

function formatScholarDate(publishDate: string): string {
  const d = new Date(publishDate);
  if (Number.isNaN(d.getTime())) return publishDate;
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { article } = await params;
  const articleData = getArticleFromSlug(article);

  if (!articleData) {
    return {
      title: "Article",
      alternates: {
        canonical: "/issues",
      },
    };
  }

  const authors = splitAuthors(articleData.author);
  const canonical = `/issues/articles/${articleData.slug}`;
  const ogImage = articleData.image ?? "/og-image.png";
  const pdfUrl = `${SITE_URL}${articleData.pdfPath}`;

  return {
    title: `${articleData.title} | JYI`,
    description: articleData.abstract,
    authors: authors.map((name) => ({ name })),
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      url: `${SITE_URL}${canonical}`,
      title: articleData.title,
      description: articleData.abstract,
      siteName: "The Journal of Young Innovators",
      publishedTime: articleData.publishDate,
      authors,
      images: [
        {
          url: ogImage,
          alt: articleData.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: articleData.title,
      description: articleData.abstract,
      images: [ogImage],
    },
    other: {
      citation_title: articleData.title,
      citation_author: authors,
      citation_publication_date: formatScholarDate(articleData.publishDate),
      citation_journal_title: "The Journal of Young Innovators",
      citation_issn: "3070-8885",
      citation_volume: String(articleData.volume),
      citation_issue: String(articleData.issueNumber),
      citation_pdf_url: pdfUrl,
      citation_abstract_html_url: `${SITE_URL}${canonical}`,
    },
  };
}

function buildArticleJsonLd(articleData: SiteArticle) {
  const authors = splitAuthors(articleData.author);
  const canonical = `${SITE_URL}/issues/articles/${articleData.slug}`;
  const ogImage = articleData.image
    ? `${SITE_URL}${articleData.image}`
    : `${SITE_URL}/og-image.png`;

  return {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: articleData.title,
    name: articleData.title,
    abstract: articleData.abstract,
    description: articleData.abstract,
    datePublished: articleData.publishDate,
    inLanguage: "en",
    url: canonical,
    mainEntityOfPage: canonical,
    image: ogImage,
    author: authors.map((name) => ({
      "@type": "Person",
      name,
      ...(articleData.school ? { affiliation: articleData.school } : {}),
    })),
    isPartOf: {
      "@type": "PublicationIssue",
      issueNumber: articleData.issueNumber,
      isPartOf: {
        "@type": "PublicationVolume",
        volumeNumber: articleData.volume,
        isPartOf: {
          "@type": "Periodical",
          name: "The Journal of Young Innovators",
          issn: "3070-8885",
          url: SITE_URL,
        },
      },
    },
    publisher: {
      "@type": "Organization",
      name: "The Journal of Young Innovators",
      url: SITE_URL,
    },
    encoding: {
      "@type": "MediaObject",
      contentUrl: `${SITE_URL}${articleData.pdfPath}`,
      encodingFormat: "application/pdf",
    },
    articleSection: articleData.category,
  };
}

function buildBreadcrumbJsonLd(articleData: SiteArticle) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Issues",
        item: `${SITE_URL}/issues`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: articleData.title,
        item: `${SITE_URL}/issues/articles/${articleData.slug}`,
      },
    ],
  };
}

export default async function ArticlePage({ params, searchParams }: PageProps) {
  const { article } = await params;
  const resolvedSearchParams = await searchParams;
  const fromValue = resolvedSearchParams?.from;
  const from = Array.isArray(fromValue) ? fromValue[0] : fromValue;
  const articleData = getArticleFromSlug(article);

  if (!articleData) {
    notFound();
  }

  const jsonLd = buildArticleJsonLd(articleData);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(articleData);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PdfArticleViewer
        title={articleData.title}
        author={articleData.author}
        school={articleData.school}
        category={articleData.category}
        publishDate={articleData.publishDate}
        volume={articleData.volume}
        issueNumber={articleData.issueNumber}
        abstract={articleData.abstract}
        documentUrl={articleData.pdfPath}
        backFrom={from === "home" ? "home" : "issues"}
      />
    </>
  );
}
