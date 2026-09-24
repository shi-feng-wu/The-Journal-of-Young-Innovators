// Presentational pieces shared by portal pages (server and client safe).

import {
  PAYMENT_LABELS,
  STATUS_LABELS,
  type PaymentStatus,
  type SubmissionStatus,
} from "@/lib/portal/constants";

export const LABEL =
  "font-mono text-[11px] uppercase tracking-[0.16em] text-black/55";

export const LABEL_ON_NAVY =
  "font-mono text-xs uppercase tracking-[0.16em] text-white/70";

export const PANEL = "rounded-lg bg-[#F4EFEB] text-black";

export const INPUT =
  "w-full rounded-md border border-black/15 bg-white px-3 py-2 font-text text-base sm:text-sm text-black placeholder:text-black/35 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50";

export const INPUT_ON_NAVY =
  "w-full rounded-md bg-[#F4EFEB] px-3 py-2.5 font-text text-base sm:text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-white/60";

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border-2 px-4 py-2 font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40";

export const BUTTON = {
  /** Navy fill, for the main action on a cream panel. */
  primary: `${BUTTON_BASE} border-primary bg-primary text-white hover:bg-[#003a92] hover:border-[#003a92]`,
  /** Navy outline on cream. */
  ghost: `${BUTTON_BASE} border-primary text-primary hover:bg-primary hover:text-white`,
  /** White outline on navy. */
  onNavy: `${BUTTON_BASE} border-white text-white hover:bg-white hover:text-primary`,
  /** Quiet destructive action. */
  danger: `${BUTTON_BASE} border-[#9b2c2c] text-[#9b2c2c] hover:bg-[#9b2c2c] hover:text-white`,
};

const BADGE =
  "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em]";

const STATUS_STYLES: Record<SubmissionStatus, string> = {
  received: "bg-primary/10 text-primary ring-1 ring-inset ring-primary/30",
  in_review: "bg-[#68ace5]/25 text-[#0b3f73]",
  revisions: "bg-[#f2c14e]/35 text-[#6b4a00]",
  accepted: "bg-[#32965d]/20 text-[#1d5e39]",
  published: "bg-primary text-white",
  rejected: "bg-black/10 text-black/60",
  withdrawn: "bg-black/5 text-black/45",
};

const PAYMENT_STYLES: Record<PaymentStatus, string> = {
  not_due: "text-black/40 ring-1 ring-inset ring-black/15",
  due: "bg-[#f2c14e]/35 text-[#6b4a00]",
  paid: "bg-[#32965d] text-white",
  waived: "bg-[#68ace5]/25 text-[#0b3f73]",
  refunded: "bg-[#9b2c2c]/15 text-[#7a1f1f]",
};

export function StatusBadge({ status }: { status: SubmissionStatus }) {
  return <span className={`${BADGE} ${STATUS_STYLES[status]}`}>{STATUS_LABELS[status]}</span>;
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  return <span className={`${BADGE} ${PAYMENT_STYLES[status]}`}>{PAYMENT_LABELS[status]}</span>;
}

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
  }).format(cents / 100);

export function PageTitle({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className={LABEL_ON_NAVY}>{eyebrow}</p>}
        <h1 className="mt-1 font-display text-4xl font-normal text-white md:text-5xl">
          {title}
        </h1>
      </div>
      {children}
    </div>
  );
}
