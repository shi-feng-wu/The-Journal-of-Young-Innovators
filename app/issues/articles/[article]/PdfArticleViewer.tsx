"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { parseArticleDate } from "@/lib/articles";
import { useState } from "react";

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
  abstract: string;
  doi: string;
  firstPage: number;
  lastPage: number;
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
  abstract,
  doi,
  firstPage,
  lastPage,
}: PdfArticleViewerProps) {
  const [citeStatus, setCiteStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  const formattedDate = parseArticleDate(publishDate).toLocaleDateString();
  const citationText = `${author}. "${title}." The Journal of Young Innovators, Volume ${volume}, Issue ${issueNumber}, pp. ${firstPage}–${lastPage}, ${formattedDate}. https://doi.org/${doi}`;

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
      <nav
        aria-label="Breadcrumb"
        className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-14 pt-6"
      >
        <ol className="flex flex-wrap items-center gap-x-2 font-mono text-[11px] uppercase tracking-[0.2em] text-black/60">
          <li className="shrink-0">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-black/40 shrink-0">
            ›
          </li>
          <li className="shrink-0">
            <Link href="/issues" className="hover:text-black transition-colors">
              Issues
            </Link>
          </li>
          <li aria-hidden="true" className="text-black/40 shrink-0">
            ›
          </li>
          <li
            className="text-black/80 min-w-0 break-words"
            aria-current="page"
          >
            {title}
          </li>
        </ol>
      </nav>
      <div className="max-w-[1400px] pt-6 mx-auto px-4 sm:px-6 lg:px-14 lg:grid lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-8">
        <aside className="lg:sticky lg:self-start rounded-lg border bg-white p-5">
          <h1 className="font-display text-2xl text-balance">{title}</h1>

          <div className="mt-4 font-mono text-xs uppercase text-black/70">
            <p>{author}</p>
            <p className="mt-0.5">{formattedDate}</p>
            {school ? <p className="mt-0.5">{school}</p> : null}
            <p className="mt-0.5">{category}</p>
            <p className="mt-0.5">
              Volume {volume}, Issue {issueNumber}
            </p>
            <p className="mt-0.5 normal-case">
              <a
                href={`https://doi.org/${doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-black"
              >
                https://doi.org/{doi}
              </a>
            </p>
          </div>

          <section
            className="mt-5 border-t pt-4"
            aria-labelledby="abstract-heading"
          >
            <h2
              id="abstract-heading"
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/70"
            >
              Abstract
            </h2>
            <p className="mt-2 font-serif text-sm leading-relaxed text-black/80">
              {abstract}
            </p>
          </section>

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

          <section
            className="mt-7 border-t pt-4"
            aria-labelledby="license-heading"
          >
            <h2
              id="license-heading"
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/70"
            >
              License
            </h2>
            <p className="mt-2 font-serif text-xs leading-relaxed text-black/75">
              © {parseArticleDate(publishDate).getFullYear() || ""}{" "}
              <span className="font-medium">{author}</span>. This article is
              published open access under a{" "}
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="license noopener noreferrer"
                className="underline underline-offset-2 hover:text-black"
              >
                Creative Commons Attribution 4.0 International License (CC BY
                4.0)
              </a>
              .
            </p>
          </section>
        </aside>

        <div className="mt-6 lg:mt-0">
          <PdfClientViewer documentUrl={documentUrl} />
        </div>
      </div>
    </div>
  );
}
