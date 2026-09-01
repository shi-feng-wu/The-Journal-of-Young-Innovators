"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { parseArticleDate } from "@/lib/articles";
import { useState } from "react";

const PdfClientViewer = dynamic(() => import("./PdfClientViewer"), {
  ssr: false,
  loading: () => (
    <p className="font-mono text-sm text-[#111]/70">Loading PDF viewer…</p>
  ),
});

const FULL_DATE = { month: "long", day: "numeric", year: "numeric" } as const;

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

type AbstractAndLicenseProps = {
  idPrefix: string;
  abstract: string;
  author: string;
  year: number | "";
  topDivider?: boolean;
};

/** Rendered twice: inside the sidebar card at lg, and below the viewer under it. */
function AbstractAndLicense({
  idPrefix,
  abstract,
  author,
  year,
  topDivider = false,
}: AbstractAndLicenseProps) {
  return (
    <>
      <section
        className={
          topDivider ? "mt-6 border-t border-black/10 pt-4" : undefined
        }
        aria-labelledby={`${idPrefix}-abstract-heading`}
      >
        <h2
          id={`${idPrefix}-abstract-heading`}
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#111]/70"
        >
          Abstract
        </h2>
        <p className="mt-2 font-text text-[15px] leading-relaxed text-[#111]/80">
          {abstract}
        </p>
      </section>

      <section
        className="mt-6 border-t border-black/10 pt-4"
        aria-labelledby={`${idPrefix}-license-heading`}
      >
        <h2
          id={`${idPrefix}-license-heading`}
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#111]/70"
        >
          License
        </h2>
        <p className="mt-2 font-text text-xs leading-relaxed text-[#111]/75">
          © {year} <span className="font-medium">{author}</span>. This article
          is published open access under a{" "}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="license noopener noreferrer"
            className="underline underline-offset-2 hover:text-[#111]"
          >
            Creative Commons Attribution 4.0 International License (CC BY 4.0)
          </a>
          .
        </p>
      </section>
    </>
  );
}

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

  const articleDate = parseArticleDate(publishDate);
  const formattedDate = articleDate.toLocaleDateString("en-US", FULL_DATE);
  const publishYear = articleDate.getFullYear() || "";
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
    <div className="min-h-screen bg-background pb-32 lg:pb-20">
      <nav
        aria-label="Breadcrumb"
        className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-14 pt-6"
      >
        <ol className="flex flex-wrap items-center gap-x-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#111]/60">
          <li className="shrink-0">
            <Link href="/" className="hover:text-[#111] transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-[#111]/40 shrink-0">
            ›
          </li>
          <li className="shrink-0">
            <Link
              href="/issues"
              className="hover:text-[#111] transition-colors"
            >
              Issues
            </Link>
          </li>
          <li aria-hidden="true" className="text-[#111]/40 shrink-0">
            ›
          </li>
          <li
            className="text-[#111]/80 min-w-0 line-clamp-1"
            aria-current="page"
          >
            {title}
          </li>
        </ol>
      </nav>
      <div className="max-w-[1400px] pt-6 mx-auto px-4 sm:px-6 lg:px-14 flex flex-col lg:grid lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-8">
        <aside className="lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto overscroll-contain rounded-lg border border-black/20 bg-white p-5">
          <h1 className="font-display text-2xl text-balance">{title}</h1>

          <div className="mt-4 font-mono text-xs text-[#111]/70">
            <p>{author}</p>
            {school ? <p className="mt-0.5">{school}</p> : null}
            <p className="mt-0.5">{formattedDate}</p>
            <p className="mt-0.5 uppercase">{category}</p>
            <p className="mt-0.5 uppercase">
              Volume {volume}, Issue {issueNumber}
            </p>
            <p className="mt-0.5">
              <a
                href={`https://doi.org/${doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-[#111]"
              >
                https://doi.org/{doi}
              </a>
            </p>
          </div>

          <div className="mt-5 grid max-w-[340px] grid-cols-2 gap-2 lg:max-w-none">
            <a
              href={documentUrl}
              download
              className="cursor-pointer inline-flex items-center justify-center rounded-md border border-[#111] px-3 py-2 font-mono text-xs uppercase tracking-[0.18em] hover:bg-[#111] hover:text-white transition-colors"
            >
              Download
            </a>
            <button
              type="button"
              onClick={handleCopyCitation}
              className="cursor-pointer inline-flex items-center justify-center rounded-md border border-[#111] px-3 py-2 font-mono text-xs uppercase tracking-[0.18em] hover:bg-[#111] hover:text-white transition-colors"
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

          <div className="hidden lg:block">
            <AbstractAndLicense
              idPrefix="aside"
              abstract={abstract}
              author={author}
              year={publishYear}
              topDivider
            />
          </div>
        </aside>

        <div className="mt-6 lg:mt-0">
          <PdfClientViewer documentUrl={documentUrl} />
        </div>

        <div className="mt-6 rounded-lg border border-black/20 bg-white p-5 lg:hidden">
          <AbstractAndLicense
            idPrefix="mobile"
            abstract={abstract}
            author={author}
            year={publishYear}
          />
        </div>
      </div>
    </div>
  );
}
