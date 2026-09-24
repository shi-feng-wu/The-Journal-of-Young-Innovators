// Presentational pieces shared by portal pages (server and client safe).
// Everything here borrows from the public site: the masthead band, the
// Issues table-of-contents rows, the mono metadata column, SiteButton.

import {
  PAYMENT_LABELS,
  STATUS_LABELS,
  type PaymentStatus,
  type SubmissionStatus,
} from "@/lib/portal/constants";

/** Mono metadata, as in the right-hand column of the Issues list. */
export const META =
  "font-mono text-[11px] uppercase leading-relaxed tracking-[0.18em] text-[#111]/65";

/** Form label on cream. */
export const LABEL =
  "block font-mono text-[10px] uppercase tracking-[0.22em] text-[#111]/60";

export const RULE = "border-t border-black/30";

export const INPUT =
  "w-full rounded-md border border-black/20 bg-white/70 px-3 py-2.5 font-text text-base sm:text-[15px] text-[#111] placeholder:text-[#111]/35 transition-colors focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/15 disabled:opacity-50";

export const INPUT_ON_NAVY =
  "w-full rounded-md bg-[#F4EFEB] px-3 py-3 font-text text-base sm:text-[15px] text-[#111] placeholder:text-[#111]/40 focus:outline-none focus:ring-2 focus:ring-white/70";

const BUTTON_BASE =
  "inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg border-2 px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary focus-visible:ring-offset-[#F4EFEB]";

export const BUTTON = {
  /** Filled navy: the one main action in a section. */
  primary: `${BUTTON_BASE} border-primary bg-primary text-white hover:bg-transparent hover:text-primary`,
  /** SiteButton's default: navy outline that fills on hover. */
  outline: `${BUTTON_BASE} border-primary text-primary hover:bg-primary hover:text-white`,
  /** SiteButton's whiteHover variant, for navy grounds. */
  onNavy: `${BUTTON_BASE} border-white text-white hover:bg-white hover:text-primary focus-visible:ring-white focus-visible:ring-offset-primary`,
  /** Plain text action. */
  quiet:
    "inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-primary underline-offset-4 hover:underline cursor-pointer disabled:opacity-35 disabled:no-underline",
};

// ---- The editorial pipeline ---------------------------------------------

/** The stages a manuscript moves through, in order. */
export const STAGES: SubmissionStatus[] = [
  "received",
  "in_review",
  "revisions",
  "accepted",
  "published",
];

export const STAGE_NAMES: Record<SubmissionStatus, string> = {
  ...STATUS_LABELS,
  revisions: "Revisions",
};

/**
 * A five-step track showing how far a manuscript has come. Declined and
 * withdrawn manuscripts leave the track, so it greys out.
 */
export function StageTrack({
  status,
  onNavy = false,
  showLabel = true,
}: {
  status: SubmissionStatus;
  onNavy?: boolean;
  showLabel?: boolean;
}) {
  const index = STAGES.indexOf(status);
  const off = index === -1;
  const filled = onNavy ? "bg-white" : "bg-primary";
  const empty = onNavy ? "bg-white/25" : "bg-[#111]/15";
  return (
    <span className="inline-flex items-center gap-3">
      <span className="flex gap-1" aria-hidden>
        {STAGES.map((stage, i) => (
          <span
            key={stage}
            className={`h-[3px] w-4 rounded-full ${
              off ? empty : i <= index ? (status === "published" && !onNavy ? "bg-[#32965d]" : filled) : empty
            }`}
          />
        ))}
      </span>
      {showLabel && (
        <span
          className={`font-mono text-[11px] uppercase tracking-[0.18em] ${
            onNavy ? "text-white/85" : off ? "text-[#111]/45 line-through decoration-1" : "text-[#111]/80"
          }`}
        >
          {STATUS_LABELS[status]}
        </span>
      )}
    </span>
  );
}

const FEE_MARK: Record<PaymentStatus, string> = {
  not_due: "border border-[#111]/30",
  due: "border-[1.5px] border-primary",
  paid: "bg-[#32965d]",
  waived: "bg-[#68ace5]",
  refunded: "border border-[#111]/40 bg-[repeating-linear-gradient(135deg,transparent_0_2px,rgba(17,17,17,.4)_2px_3px)]",
};

const FEE_TEXT: Record<PaymentStatus, string> = {
  not_due: "text-[#111]/45",
  due: "text-primary",
  paid: "text-[#1d6b40]",
  waived: "text-[#2a6698]",
  refunded: "text-[#111]/55",
};

export function FeeMark({ status }: { status: PaymentStatus }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-2 w-2 shrink-0 rounded-full ${FEE_MARK[status]}`} aria-hidden />
      <span className={`font-mono text-[11px] uppercase tracking-[0.18em] ${FEE_TEXT[status]}`}>
        {status === "due" ? "Fee due" : status === "not_due" ? "No fee yet" : `Fee ${PAYMENT_LABELS[status].toLowerCase()}`}
      </span>
    </span>
  );
}

// ---- Page furniture -----------------------------------------------------

/** The running-head masthead used on every interior page of the site. */
export function Masthead({
  title,
  subtitle,
  above,
  children,
}: {
  title: string;
  subtitle?: React.ReactNode;
  above?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-primary text-white">
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2.5 px-4 pt-6 pb-8 sm:px-6 lg:px-20 lg:pt-8 lg:pb-10">
          {above}
          <h1 className="max-w-[28ch] font-display text-4xl font-normal leading-[1.1] text-balance lg:text-[44px]">
            {title}
          </h1>
          {subtitle && (
            <p className="max-w-[640px] font-text text-base leading-normal text-pretty text-white/85 lg:text-[17px]">
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}

/** A ruled section with a serif heading, as on the Submission page. */
export function Section({
  id,
  title,
  aside,
  children,
  className = "",
}: {
  id: string;
  title: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section aria-labelledby={id} className={`${RULE} pt-7 pb-10 lg:pt-8 ${className}`}>
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
        <h2 id={id} className="font-display text-[28px] font-normal leading-tight text-[#111] lg:text-[32px]">
          {title}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

// ---- Formatting ---------------------------------------------------------

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "America/New_York",
});

const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/New_York",
});

export const formatDate = (iso: string) => dateFormat.format(new Date(iso));
export const formatDateTime = (iso: string) => dateTimeFormat.format(new Date(iso));

export const formatMoney = (cents: number, currency = "usd") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
