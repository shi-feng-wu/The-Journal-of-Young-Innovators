"use client";

import {
  memo,
  type MutableRefObject,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  VariableSizeList as List,
  type ListChildComponentProps,
  type ListOnItemsRenderedProps,
  type VariableSizeList,
} from "react-window";
import {
  FaChevronLeft,
  FaChevronRight,
  FaDownload,
  FaMinus,
  FaPlus,
  FaRotateLeft,
} from "react-icons/fa6";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type PdfClientViewerProps = {
  documentUrl: string;
};

type ThumbnailPagePreviewProps = {
  pageNumber: number;
  placeholderHeight: number;
};

const THUMB_WIDTH = 115;
const THUMB_GAP = 10;
const THUMB_FIRST_ROW_PAD = 2;
const DEFAULT_PAGE_WIDTH_FACTOR = 0.75;

type ThumbnailRailProps = {
  documentUrl: string;
  numPages: number;
  isReady: boolean;
  thumbListSize: { width: number; height: number };
  getThumbHeight: (index: number) => number;
  thumbListRef: RefObject<VariableSizeList | null>;
  goToPageRef: MutableRefObject<(page: number) => void>;
  activeThumbPageRef: MutableRefObject<number>;
  thumbButtonRefs: MutableRefObject<Record<number, HTMLButtonElement | null>>;
  onThumbLoadError: (message: string) => void;
  onThumbItemsRendered: (range: {
    startIndex: number;
    stopIndex: number;
  }) => void;
};

const setThumbnailButtonActiveState = (
  button: HTMLButtonElement,
  isActive: boolean,
) => {
  button.className = isActive
    ? "cursor-pointer opacity-100 ring-1 ring-white"
    : "cursor-pointer opacity-85 ring-0 hover:opacity-100";

  button.disabled = isActive;

  if (isActive) {
    button.setAttribute("aria-current", "page");
  } else {
    button.removeAttribute("aria-current");
  }
};

const ThumbnailPagePreview = memo(function ThumbnailPagePreview({
  pageNumber,
  placeholderHeight,
}: ThumbnailPagePreviewProps) {
  return (
    <Page
      pageNumber={pageNumber}
      width={THUMB_WIDTH}
      renderAnnotationLayer={false}
      renderTextLayer={false}
      loading={
        <div
          className="flex items-center justify-center border border-black/20 bg-white/90 font-mono text-[10px] text-black/70"
          style={{ width: THUMB_WIDTH, height: placeholderHeight }}
        >
          {pageNumber}
        </div>
      }
    />
  );
});

const ThumbnailRail = memo(function ThumbnailRail({
  documentUrl,
  numPages,
  isReady,
  thumbListSize,
  getThumbHeight,
  thumbListRef,
  goToPageRef,
  activeThumbPageRef,
  thumbButtonRefs,
  onThumbLoadError,
  onThumbItemsRendered,
}: ThumbnailRailProps) {
  const thumbRowRenderer = useCallback(
    ({ index, style }: ListChildComponentProps) => {
      const pageNumber = index + 1;
      const topPad = index === 0 ? THUMB_FIRST_ROW_PAD : 0;
      const placeholderHeight = Math.max(
        80,
        getThumbHeight(index) - THUMB_GAP - topPad,
      );

      return (
        <div
          style={style}
          className={`flex items-start justify-center ${
            topPad ? "pt-[2px]" : "pt-0"
          }`}
        >
          <div className="relative">
            <button
              type="button"
              ref={(node) => {
                thumbButtonRefs.current[pageNumber] = node;

                if (!node) return;
                setThumbnailButtonActiveState(
                  node,
                  pageNumber === activeThumbPageRef.current,
                );
              }}
              onClick={() => goToPageRef.current(pageNumber)}
              aria-label={`Go to page ${pageNumber}`}
            >
              <ThumbnailPagePreview
                pageNumber={pageNumber}
                placeholderHeight={placeholderHeight}
              />
            </button>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-1 top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/80 font-mono text-[9px] leading-none text-white"
            >
              {pageNumber}
            </span>
          </div>
        </div>
      );
    },
    [activeThumbPageRef, getThumbHeight, goToPageRef, thumbButtonRefs],
  );

  return (
    <Document
      file={documentUrl}
      onLoadError={(error) => {
        onThumbLoadError(error.message || "Unable to load PDF.");
      }}
      loading={<p className="px-1 font-mono text-[10px]">Loading…</p>}
    >
      {isReady && thumbListSize.width > 0 && thumbListSize.height > 0 ? (
        <List
          ref={thumbListRef}
          width={thumbListSize.width}
          height={thumbListSize.height}
          itemCount={numPages}
          itemSize={getThumbHeight}
          estimatedItemSize={158}
          overscanCount={8}
          onItemsRendered={({ visibleStartIndex, visibleStopIndex }) => {
            onThumbItemsRendered({
              startIndex: visibleStartIndex,
              stopIndex: visibleStopIndex,
            });
          }}
        >
          {thumbRowRenderer}
        </List>
      ) : null}
    </Document>
  );
});

export default function PdfClientViewer({ documentUrl }: PdfClientViewerProps) {
  const [pdf, setPdf] = useState<pdfjs.PDFDocumentProxy | null>(null);
  const [pageViewports, setPageViewports] = useState<
    pdfjs.PageViewport[] | null
  >(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [isPageInputFocused, setIsPageInputFocused] = useState(false);
  const [scale, setScale] = useState(1);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [listSize, setListSize] = useState({ width: 0, height: 0 });
  const [thumbListSize, setThumbListSize] = useState({ width: 0, height: 0 });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const thumbContainerRef = useRef<HTMLDivElement | null>(null);
  const pageInputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<VariableSizeList | null>(null);
  const thumbListRef = useRef<VariableSizeList | null>(null);
  const previousPageRef = useRef(1);
  const activeThumbPageRef = useRef(1);
  const thumbButtonRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const thumbVisibleRangeRef = useRef({ startIndex: 0, stopIndex: -1 });
  const goToPageRef = useRef<(page: number) => void>(() => undefined);

  const numPages = pdf?.numPages ?? 0;
  const pageBaseWidth = Math.max(
    320,
    Math.round((listSize.width - 32) * DEFAULT_PAGE_WIDTH_FACTOR),
  );
  const pageRenderWidth = Math.max(220, Math.round(pageBaseWidth * scale));

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const update = () => {
      setListSize({ width: node.clientWidth, height: node.clientHeight });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const node = thumbContainerRef.current;
    if (!node) return;

    const update = () => {
      setThumbListSize({ width: node.clientWidth, height: node.clientHeight });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const node = thumbContainerRef.current;
    if (!node) return;

    const applyHiddenScrollbarClass = () => {
      const scroller = node.querySelector(
        'div[style*="overflow: auto"], div[style*="overflow:auto"]',
      ) as HTMLDivElement | null;

      if (!scroller) return;
      scroller.classList.add("hide-scrollbar");
    };

    applyHiddenScrollbarClass();
    const rafId = window.requestAnimationFrame(applyHiddenScrollbarClass);

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [numPages, pageViewports, thumbListSize.height, thumbListSize.width]);

  useEffect(() => {
    setPageViewports(null);
    if (!pdf) return;

    let cancelled = false;

    (async () => {
      const viewports = await Promise.all(
        Array.from({ length: pdf.numPages }, async (_, index) => {
          const page = await pdf.getPage(index + 1);
          return page.getViewport({ scale: 1 });
        }),
      );

      if (!cancelled) {
        setPageViewports(viewports);
        listRef.current?.resetAfterIndex(0, true);
      }
    })().catch(() => {
      if (!cancelled) {
        setLoadError("Unable to read PDF pages.");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [pdf]);

  useEffect(() => {
    listRef.current?.resetAfterIndex(0, true);
    thumbListRef.current?.resetAfterIndex(0, true);
  }, [pageRenderWidth, pageViewports]);

  const goToPage = (page: number) => {
    if (!numPages || !pageViewports) return;

    const nextPage = Math.min(Math.max(page, 1), numPages);
    if (nextPage === currentPage) return;

    setCurrentPage(nextPage);
    listRef.current?.scrollToItem(nextPage - 1, "start");
  };

  useEffect(() => {
    goToPageRef.current = goToPage;
  }, [goToPage]);

  useEffect(() => {
    if (!isPageInputFocused) {
      setPageInput(String(currentPage));
    }
  }, [currentPage, isPageInputFocused]);

  const handlePageInputChange = useCallback(
    (value: string) => {
      const digitsOnly = value.replace(/\D/g, "");
      setPageInput(digitsOnly);

      if (!digitsOnly) return;

      const nextPage = Number.parseInt(digitsOnly, 10);
      if (Number.isNaN(nextPage)) return;

      const upperBound = numPages || 1;
      const clampedPage = Math.min(Math.max(nextPage, 1), upperBound);

      if (String(clampedPage) !== digitsOnly) {
        setPageInput(String(clampedPage));
      }

      goToPage(clampedPage);
    },
    [goToPage, numPages],
  );

  const handlePageInputBlur = useCallback(() => {
    setIsPageInputFocused(false);
    if (!pageInput) {
      setPageInput(String(currentPage));
    }
  }, [currentPage, pageInput]);

  const zoomOut = () =>
    setScale((prev) => Math.max(0.6, +(prev - 0.1).toFixed(1)));
  const zoomIn = () =>
    setScale((prev) => Math.min(2.4, +(prev + 0.1).toFixed(1)));

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        goToPage(currentPage - 1);
      } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        goToPage(currentPage + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, numPages, pageViewports]);

  const getPageHeight = useCallback(
    (index: number) => {
      const viewport = pageViewports?.[index];
      if (!viewport) return Math.round(pageRenderWidth * 1.45) + 16;

      const ratio = viewport.height / viewport.width;
      return Math.round(pageRenderWidth * ratio) + 16;
    },
    [pageRenderWidth, pageViewports],
  );

  const rowRenderer = useCallback(
    ({ index, style }: ListChildComponentProps) => {
      const pageNumber = index + 1;
      const placeholderHeight = Math.max(420, getPageHeight(index) - 16);

      return (
        <div style={style} className="flex justify-center py-2">
          <Page
            className="border-b border-black/50"
            pageNumber={pageNumber}
            width={pageRenderWidth}
            renderAnnotationLayer
            renderTextLayer
            loading={
              <div
                className="flex items-center justify-center rounded border border-black/20 bg-black/5 font-mono text-xs uppercase tracking-[0.12em] text-black/60"
                style={{ width: pageRenderWidth, height: placeholderHeight }}
              >
                Page {pageNumber}
              </div>
            }
          />
        </div>
      );
    },
    [getPageHeight, pageRenderWidth],
  );

  const getThumbHeight = useCallback(
    (index: number) => {
      const viewport = pageViewports?.[index];
      if (!viewport) return 158;

      const width = THUMB_WIDTH;
      const ratio = viewport.height / viewport.width;
      const topPad = index === 0 ? THUMB_FIRST_ROW_PAD : 0;
      return Math.round(width * ratio) + THUMB_GAP + topPad;
    },
    [pageViewports],
  );

  const getThumbItemOffset = useCallback(
    (index: number) => {
      let offset = -1;
      for (let i = 0; i < index; i += 1) {
        offset += getThumbHeight(i);
      }
      return offset;
    },
    [getThumbHeight],
  );

  const onItemsRendered = useCallback(
    ({ visibleStartIndex }: ListOnItemsRenderedProps) => {
      const nextPage = visibleStartIndex + 1;
      if (nextPage !== currentPage) {
        setCurrentPage(nextPage);
      }
    },
    [currentPage],
  );

  const syncThumbnailRail = useCallback(
    (page: number, direction: "up" | "down") => {
      const index = page - 1;
      const { startIndex, stopIndex } = thumbVisibleRangeRef.current;

      const isVisible = index >= startIndex && index <= stopIndex;
      if (isVisible) return;

      const itemOffset = getThumbItemOffset(index);
      const topPad = index === 0 ? THUMB_FIRST_ROW_PAD : 0;
      const itemContentHeight = Math.max(
        0,
        getThumbHeight(index) - THUMB_GAP - topPad,
      );

      const targetOffset =
        direction === "up"
          ? itemOffset + itemContentHeight - thumbListSize.height
          : itemOffset;

      const thumbScroller = thumbListRef.current as {
        scrollTo?: (offset: number) => void;
        scrollToItem: (
          index: number,
          align?: "auto" | "smart" | "center" | "start" | "end",
        ) => void;
      } | null;

      if (thumbScroller?.scrollTo) {
        thumbScroller.scrollTo(Math.max(0, targetOffset));
        return;
      }

      thumbScroller?.scrollToItem(index, direction === "up" ? "end" : "start");
    },
    [getThumbHeight, getThumbItemOffset, thumbListSize.height],
  );

  const handleThumbLoadError = useCallback((message: string) => {
    setLoadError(message);
  }, []);

  const handleThumbItemsRendered = useCallback(
    ({ startIndex, stopIndex }: { startIndex: number; stopIndex: number }) => {
      thumbVisibleRangeRef.current = {
        startIndex,
        stopIndex,
      };
    },
    [],
  );

  const syncActiveThumbnailButton = useCallback((nextPage: number) => {
    const previousActivePage = activeThumbPageRef.current;
    if (previousActivePage === nextPage) return;

    const previousButton = thumbButtonRefs.current[previousActivePage];
    if (previousButton) {
      setThumbnailButtonActiveState(previousButton, false);
    }

    const nextButton = thumbButtonRefs.current[nextPage];
    if (nextButton) {
      setThumbnailButtonActiveState(nextButton, true);
    }

    activeThumbPageRef.current = nextPage;
  }, []);

  useEffect(() => {
    if (!numPages) return;

    syncActiveThumbnailButton(currentPage);

    const previousPage = previousPageRef.current;
    const direction: "up" | "down" = currentPage < previousPage ? "up" : "down";

    syncThumbnailRail(currentPage, direction);
    previousPageRef.current = currentPage;
  }, [currentPage, numPages, syncActiveThumbnailButton, syncThumbnailRail]);

  if (loadError) {
    return <div className="font-mono text-sm text-red-600">{loadError}</div>;
  }

  return (
    <div className="flex h-[90vh] w-full flex-col overflow-hidden rounded-lg border bg-white">
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-2 border-b border-black bg-primary px-3 py-2 text-white">
        <button
          type="button"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded border border-white/70 p-0 font-mono text-[11px] uppercase tracking-[0.12em] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <FaChevronLeft />
        </button>

        <div className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.12em]">
          <input
            ref={pageInputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={pageInput}
            onChange={(event) => {
              handlePageInputChange(event.target.value);
            }}
            onFocus={() => setIsPageInputFocused(true)}
            onBlur={handlePageInputBlur}
            onMouseDown={(event) => {
              event.preventDefault();
              const input = pageInputRef.current;
              if (!input) return;

              input.focus();
              requestAnimationFrame(() => {
                input.select();
              });
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                pageInputRef.current?.blur();
              }
            }}
            className="h-8 w-12 rounded border border-white/70 bg-transparent px-1 text-center text-[11px] text-white outline-none placeholder:text-white/60"
            aria-label="Page number"
          />
          <span>/ {numPages || 1}</span>
        </div>

        <button
          type="button"
          onClick={() => goToPage(currentPage + 1)}
          disabled={!numPages || currentPage >= numPages}
          className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded border border-white/70 p-0 font-mono text-[11px] uppercase tracking-[0.12em] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <FaChevronRight />
        </button>

        <div className="mx-1 h-5 w-px bg-white/40" aria-hidden />

        <button
          type="button"
          onClick={zoomOut}
          className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded border border-white/70 p-0 font-mono text-[11px] uppercase tracking-[0.12em]"
          aria-label="Zoom out"
        >
          <FaMinus />
        </button>
        <span className="font-mono text-[11px] uppercase tracking-[0.12em]">
          {Math.round(scale * 100)}%
        </span>
        <button
          type="button"
          onClick={zoomIn}
          className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded border border-white/70 p-0 font-mono text-[11px] uppercase tracking-[0.12em]"
          aria-label="Zoom in"
        >
          <FaPlus />
        </button>
        <button
          type="button"
          onClick={() => setScale(1)}
          className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded border border-white/70 p-0 font-mono text-[11px] uppercase tracking-[0.12em]"
          aria-label="Reset zoom"
        >
          <FaRotateLeft />
        </button>

        <a
          href={documentUrl}
          download
          className="ml-auto cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded border border-white/70 p-0 font-mono text-[11px] uppercase tracking-[0.12em]"
          aria-label="Download PDF"
        >
          <FaDownload />
        </a>
      </div>

      <div
        className="min-h-0 flex-1 overflow-hidden"
        data-lenis-prevent
        data-lenis-prevent-wheel
        data-lenis-prevent-touch
        onWheelCapture={(event) => event.stopPropagation()}
      >
        <div className="flex h-full min-h-0">
          <div ref={containerRef} className="min-h-0 flex-1 overflow-hidden">
            <Document
              file={documentUrl}
              onLoadSuccess={(nextPdf) => {
                setPdf(nextPdf);
                setCurrentPage((prev) => Math.min(prev, nextPdf.numPages));
                setLoadError(null);
              }}
              onLoadError={(error) => {
                setLoadError(error.message || "Unable to load PDF.");
              }}
              loading={<p className="p-4 font-mono text-sm">Loading PDF...</p>}
            >
              {pdf &&
              pageViewports &&
              listSize.width > 0 &&
              listSize.height > 0 ? (
                <List
                  ref={listRef}
                  width={listSize.width}
                  height={listSize.height}
                  itemCount={pdf.numPages}
                  itemSize={getPageHeight}
                  estimatedItemSize={Math.round(pageRenderWidth * 1.45) + 16}
                  overscanCount={3}
                  onItemsRendered={onItemsRendered}
                >
                  {rowRenderer}
                </List>
              ) : null}
            </Document>
          </div>

          <aside className="hidden min-h-0 w-40 shrink-0 overflow-hidden border-l border-black bg-primary p-4 pt-3 md:block">
            <div
              ref={thumbContainerRef}
              className="hide-scrollbar h-full min-h-0"
            >
              <ThumbnailRail
                documentUrl={documentUrl}
                numPages={pdf?.numPages ?? 0}
                isReady={Boolean(pdf && pageViewports)}
                thumbListSize={thumbListSize}
                getThumbHeight={getThumbHeight}
                thumbListRef={thumbListRef}
                goToPageRef={goToPageRef}
                activeThumbPageRef={activeThumbPageRef}
                thumbButtonRefs={thumbButtonRefs}
                onThumbLoadError={handleThumbLoadError}
                onThumbItemsRendered={handleThumbItemsRendered}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
