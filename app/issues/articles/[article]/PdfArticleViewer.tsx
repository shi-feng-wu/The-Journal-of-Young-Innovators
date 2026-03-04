"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Hero from "@/components/Hero";

const PdfClientViewer = dynamic(() => import("./PdfClientViewer"), {
  ssr: false,
  loading: () => (
    <p className="font-mono text-sm text-black/70">Loading PDF viewer…</p>
  ),
});

type PdfArticleViewerProps = {
  title: string;
  documentUrl: string;
  author: string;
  school?: string;
  category: string;
  publishDate: string;
  volume: number;
  issueNumber: number;
};

export default function PdfArticleViewer({
  title,
  documentUrl,
  author,
  school,
  category,
  publishDate,
  volume,
  issueNumber,
}: PdfArticleViewerProps) {
  const searchParams = useSearchParams();
  const [citeStatus, setCiteStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  const from = searchParams.get("from");
  const isFromHome = from === "home";
  const backHref = isFromHome ? "/" : "/issues";
  const backLabel = isFromHome ? "Back to Home" : "Back to Issues";

  const formattedDate = new Date(publishDate).toLocaleDateString();
  const citationText = `${author}. "${title}." The Journal of Young Innovators, Volume ${volume}, Issue ${issueNumber}, ${formattedDate}.`;

  const handleCopyCitation = async () => {
    try {
      await navigator.clipboard.writeText(citationText);
      setCiteStatus("copied");
      window.setTimeout(() => setCiteStatus("idle"), 2500);
    } catch {
      setCiteStatus("error");
      window.setTimeout(() => setCiteStatus("idle"), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] pt-10 mx-auto px-4 sm:px-6 lg:px-14 lg:grid lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-8">
        <aside className="lg:sticky lg:self-start rounded-lg border bg-white p-5">
          <Link
            href={backHref}
            aria-label={backLabel}
            className="text-xs font-mono uppercase tracking-[0.2em] text-black/70 hover:text-black"
          >
            {`← ${backLabel}`}
          </Link>

          <h1 className="font-display text-2xl text-balance mt-3">{title}</h1>

          <div className="mt-4 font-mono text-xs uppercase text-black/70">
            <p>{author}</p>
            <p className="mt-0.5">{formattedDate}</p>
            {school ? <p className="mt-0.5">{school}</p> : null}
            <p className="mt-0.5">{category}</p>
            <p className="mt-0.5">
              Volume {volume}, Issue {issueNumber}
            </p>
          </div>

          <div className="mt-7 flex flex-col gap-2">
            <a
              href={documentUrl}
              download
              className="cursor-pointer inline-flex items-center justify-center rounded-md border border-black px-3 py-2 font-mono text-xs uppercase tracking-[0.18em] hover:bg-black hover:text-white transition-colors"
            >
              Download
            </a>
            <button
              type="button"
              onClick={handleCopyCitation}
              className="cursor-pointer inline-flex items-center justify-center rounded-md border border-black px-3 py-2 font-mono text-xs uppercase tracking-[0.18em] hover:bg-black hover:text-white transition-colors"
            >
              <span className="relative inline-grid place-items-center">
                <span
                  className={`col-start-1 row-start-1 font-mono text-[11px] uppercase transition-opacity duration-300 ${
                    citeStatus === "copied" ? "opacity-100" : "opacity-0"
                  }`}
                >
                  Copied!
                </span>
                <span
                  className={`col-start-1 row-start-1 font-mono text-[11px] uppercase transition-opacity duration-300 ${
                    citeStatus === "copied" ? "opacity-0" : "opacity-100"
                  }`}
                >
                  Cite
                </span>
              </span>
            </button>
          </div>
        </aside>

        <div className="mt-6 lg:mt-0">
          <PdfClientViewer documentUrl={documentUrl} />
        </div>
      </div>
    </div>
  );
}
