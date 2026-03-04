import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PdfArticleViewer from "./PdfArticleViewer";
import {
  getArticleFromSlug,
  getArticleViewerStaticParams,
} from "@/lib/articlePdfViewer";

type PageProps = {
  params: Promise<{ article: string }>;
  searchParams?: Promise<{ from?: string | string[] }>;
};

export function generateStaticParams() {
  return getArticleViewerStaticParams();
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

  return {
    title: `${articleData.title} | JYI`,
    description: `Read ${articleData.title} on JYI.`,
    alternates: {
      canonical: `/issues/articles/${articleData.slug}`,
    },
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

  return (
    <PdfArticleViewer
      title={articleData.title}
      author={articleData.author}
      school={articleData.school}
      category={articleData.category}
      publishDate={articleData.publishDate}
      volume={articleData.volume}
      issueNumber={articleData.issueNumber}
      documentUrl={articleData.pdfPath}
      backFrom={from === "home" ? "home" : "issues"}
    />
  );
}
