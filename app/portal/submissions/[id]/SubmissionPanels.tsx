"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  PAYMENT_LABELS,
  PAYMENT_STATUSES,
  STATUS_LABELS,
  SUBMISSION_STATUSES,
  type PaymentStatus,
  type SubmissionStatus,
} from "@/lib/portal/constants";
import { EMAIL_TEMPLATES, type TemplateContext } from "@/lib/portal/templates";
import { BUTTON, INPUT, LABEL } from "../../_components/ui";

interface Props {
  submissionId: number;
  email: string;
  authorName: string;
  status: SubmissionStatus;
  paymentStatus: PaymentStatus;
  assignedEditorId: number | null;
  editors: Array<{ id: number; name: string }>;
  context: TemplateContext;
}

type Message = { kind: "ok" | "error"; text: string } | null;

async function send(url: string, init: RequestInit): Promise<string | null> {
  const response = await fetch(url, init).catch(() => null);
  if (response?.ok) return null;
  const payload = await response?.json().catch(() => null);
  return payload?.error ?? "Could not reach the server. Check your connection and try again.";
}

const patch = (id: number, body: object) =>
  send(`/api/portal/submissions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

function Flash({ message }: { message: Message }) {
  if (!message) return null;
  return (
    <p
      role={message.kind === "error" ? "alert" : "status"}
      className={`border-l-2 pl-3 font-text text-sm ${
        message.kind === "error" ? "border-[#9b2c2c] text-[#7a1f1f]" : "border-[#32965d] text-[#1d6b40]"
      }`}
    >
      {message.text}
    </p>
  );
}

// ---- Decisions and letters -----------------------------------------------

type Action = { template: string; when?: (p: Props) => boolean };

const DECISIONS: Action[] = [
  { template: "accept", when: (p) => !["accepted", "published"].includes(p.status) },
  { template: "accept-waived", when: (p) => !["accepted", "published"].includes(p.status) },
  { template: "revisions", when: (p) => ["received", "in_review", "revisions"].includes(p.status) },
  { template: "in-review", when: (p) => p.status === "received" },
  { template: "decline", when: (p) => !["rejected", "published", "withdrawn"].includes(p.status) },
];

const LETTERS: Action[] = [
  { template: "payment-reminder", when: (p) => p.paymentStatus === "due" },
  { template: "payment-received", when: (p) => p.paymentStatus === "paid" },
  { template: "published", when: (p) => p.status === "accepted" },
  { template: "blank" },
];

export function DecisionPanel(props: Props) {
  const router = useRouter();
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [applyStatus, setApplyStatus] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<Message>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const letterRef = useRef<HTMLFormElement>(null);

  const template = EMAIL_TEMPLATES.find((t) => t.id === templateId);
  const byId = (id: string) => EMAIL_TEMPLATES.find((t) => t.id === id)!;

  const open = (id: string) => {
    const t = byId(id);
    setTemplateId(id);
    setSubject(t.subject(props.context));
    setBody(t.body(props.context));
    setApplyStatus(true);
    setFiles([]);
    setMessage(null);
    requestAnimationFrame(() => {
      letterRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      letterRef.current?.querySelector("textarea")?.focus({ preventScroll: true });
    });
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!template) return;
    setBusy(true);
    setMessage(null);
    const form = new FormData();
    form.set("subject", subject);
    form.set("body", body);
    if (template.setsStatus && applyStatus) {
      form.set("setStatus", template.setsStatus);
      if (template.waivesFee) form.set("waiveFee", "true");
    }
    for (const file of files) form.append("attachments", file);
    const error = await send(`/api/portal/submissions/${props.submissionId}/email`, {
      method: "POST",
      body: form,
    });
    setBusy(false);
    if (error) {
      setMessage({ kind: "error", text: error });
      return;
    }
    setTemplateId(null);
    setMessage({ kind: "ok", text: `Sent “${subject}” to ${props.email}.` });
    router.refresh();
  };

  const decisions = DECISIONS.filter((a) => !a.when || a.when(props));
  const letters = LETTERS.filter((a) => !a.when || a.when(props));
  const hasPlaceholder = /\[[^\]]+\]/.test(body);
  const willChange = template?.setsStatus && template.setsStatus !== props.status;

  return (
    <div>
      {decisions.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {decisions.map((a) => {
            const t = byId(a.template);
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => open(t.id)}
                aria-pressed={templateId === t.id}
                className={`${t.id === "accept" ? BUTTON.primary : BUTTON.outline} ${templateId === t.id ? "!bg-primary !text-white" : ""}`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      )}
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
        <span className="font-text text-sm text-[#111]/55">Other letters:</span>
        {letters.map((a) => {
          const t = byId(a.template);
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => open(t.id)}
              aria-pressed={templateId === t.id}
              className={`${BUTTON.quiet} ${templateId === t.id ? "underline" : ""}`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {!template && message && (
        <div className="mt-6">
          <Flash message={message} />
        </div>
      )}

      {template && (
        <form ref={letterRef} onSubmit={submit} className="mt-8 scroll-mt-8">
          {/* The letter: a sheet of paper with a ruled header. */}
          <div className="border border-black/15 bg-white">
            <div className="grid grid-cols-[72px_minmax(0,1fr)] items-center border-b border-black/10 px-5 sm:px-8">
              <span className={LABEL}>To</span>
              <p className="truncate py-3.5 font-text text-[15px]">
                {props.authorName} <span className="text-[#111]/55">&lt;{props.email}&gt;</span>
              </p>
            </div>
            <label className="grid grid-cols-[72px_minmax(0,1fr)] items-center border-b border-black/10 px-5 sm:px-8">
              <span className={LABEL}>Subject</span>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full bg-transparent py-3.5 font-text text-[15px] font-semibold text-[#111] focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="sr-only">Message</span>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={17}
                required
                className="block w-full resize-y bg-transparent px-5 py-6 font-text text-base leading-[1.7] text-[#111] focus:outline-none sm:px-8"
              />
            </label>
            <div className="flex flex-wrap items-center gap-3 border-t border-black/10 px-5 py-3.5 sm:px-8">
              <button type="button" onClick={() => fileRef.current?.click()} className={BUTTON.quiet}>
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M10.5 4.5l-5 5a1.4 1.4 0 002 2l5.5-5.5a2.8 2.8 0 00-4-4L3.5 7.5a4.2 4.2 0 006 6l4-4" />
                </svg>
                Attach files
              </button>
              <input
                ref={fileRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => setFiles([...files, ...Array.from(e.target.files ?? [])])}
              />
              {files.map((f, i) => (
                <span key={`${f.name}-${i}`} className="inline-flex items-center gap-1.5 rounded-full bg-[#111]/[0.06] py-1 pr-1.5 pl-3 font-mono text-[11px]">
                  {f.name}
                  <button
                    type="button"
                    onClick={() => setFiles(files.filter((_, j) => j !== i))}
                    aria-label={`Remove ${f.name}`}
                    className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full hover:bg-[#111]/10"
                  >
                    ×
                  </button>
                </span>
              ))}
              {files.length === 0 && (
                <span className="font-text text-xs text-[#111]/45">Reviewer comments, proofs, up to 15 MB</span>
              )}
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {hasPlaceholder && (
              <p className="border-l-2 border-primary pl-3 font-text text-sm text-primary">
                Fill in the part in [square brackets] before sending.
              </p>
            )}
            {willChange && (
              <label className="flex cursor-pointer items-start gap-3 font-text text-[15px] text-[#111]/80">
                <input
                  type="checkbox"
                  checked={applyStatus}
                  onChange={(e) => setApplyStatus(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-[#002d72]"
                />
                <span>
                  Move the manuscript to <strong className="font-semibold">{STATUS_LABELS[template.setsStatus!]}</strong>
                  {template.waivesFee && " and waive the fee"}
                  {template.id === "accept" && props.paymentStatus === "not_due" && ", and mark the $65 fee as due"}{" "}
                  when this sends
                </span>
              </label>
            )}
            <Flash message={message} />
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button type="submit" disabled={busy} className={BUTTON.primary}>
                {busy ? "Sending…" : "Send letter"}
              </button>
              <button type="button" onClick={() => setTemplateId(null)} className={BUTTON.quiet}>
                Discard
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

// ---- The record column ---------------------------------------------------

export function RecordPanel(props: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<SubmissionStatus>(props.status);
  const [waive, setWaive] = useState(false);
  const [payment, setPayment] = useState<PaymentStatus>(props.paymentStatus);
  const [paymentNote, setPaymentNote] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<{ at: string; msg: Message } | null>(null);

  // After a refresh brings new saved values, start the form from them.
  const saved = `${props.status}|${props.paymentStatus}`;
  const [lastSaved, setLastSaved] = useState(saved);
  if (saved !== lastSaved) {
    setLastSaved(saved);
    setStatus(props.status);
    setPayment(props.paymentStatus);
    setWaive(false);
  }

  const act = async (key: string, body: object, done: string) => {
    setBusy(key);
    setMessage(null);
    const error = await patch(props.submissionId, body);
    setBusy(null);
    setMessage({ at: key, msg: error ? { kind: "error", text: error } : { kind: "ok", text: done } });
    if (!error) router.refresh();
    return !error;
  };
  const flashFor = (key: string) => (message?.at === key ? <Flash message={message.msg} /> : null);

  const block = "space-y-3 border-t border-black/30 pt-5 pb-7";

  return (
    <div>
      <div className={block}>
        <label className="block space-y-1.5">
          <span className={LABEL}>Stage</span>
          <select value={status} onChange={(e) => setStatus(e.target.value as SubmissionStatus)} className={INPUT}>
            {SUBMISSION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
        {status !== props.status && (
          <>
            {status === "accepted" && props.paymentStatus === "not_due" && (
              <label className="flex items-center gap-2 font-text text-sm text-[#111]/75">
                <input type="checkbox" checked={waive} onChange={(e) => setWaive(e.target.checked)} className="accent-[#002d72]" />
                Waive the publication fee
              </label>
            )}
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => act("status", { status, waiveFee: waive }, "Stage changed. The author was not emailed.")}
              className={`${BUTTON.outline} w-full`}
            >
              {busy === "status" ? "Saving…" : "Change quietly"}
            </button>
          </>
        )}
        {flashFor("status")}
      </div>

      <div className={block}>
        <label className="block space-y-1.5">
          <span className={LABEL}>Publication fee</span>
          <select value={payment} onChange={(e) => setPayment(e.target.value as PaymentStatus)} className={INPUT}>
            {PAYMENT_STATUSES.map((p) => (
              <option key={p} value={p}>
                {PAYMENT_LABELS[p]}
              </option>
            ))}
          </select>
        </label>
        {payment !== props.paymentStatus && (
          <>
            <input
              value={paymentNote}
              onChange={(e) => setPaymentNote(e.target.value)}
              placeholder={payment === "paid" ? "How it was paid, e.g. check" : "Reason (optional)"}
              className={INPUT}
            />
            <button
              type="button"
              disabled={busy !== null}
              onClick={async () => {
                if (await act("payment", { paymentStatus: payment, paymentNote }, "Fee updated.")) setPaymentNote("");
              }}
              className={`${BUTTON.outline} w-full`}
            >
              {busy === "payment" ? "Saving…" : "Save fee"}
            </button>
          </>
        )}
        {flashFor("payment")}
      </div>

      <div className={block}>
        <label className="block space-y-1.5">
          <span className={LABEL}>Handling editor</span>
          <select
            value={props.assignedEditorId ?? ""}
            disabled={busy !== null}
            onChange={(e) =>
              act("assign", { assignedEditorId: e.target.value ? Number(e.target.value) : null }, "Editor assigned.")
            }
            className={INPUT}
          >
            <option value="">No one yet</option>
            {props.editors.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </label>
        {flashFor("assign")}
      </div>

      <form
        className={block}
        onSubmit={async (e) => {
          e.preventDefault();
          if (note.trim() && (await act("note", { note }, "Note added to the history."))) setNote("");
        }}
      >
        <label className="block space-y-1.5">
          <span className={LABEL}>Note for editors</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Only editors see this"
            className={INPUT}
          />
        </label>
        {note.trim() && (
          <button type="submit" disabled={busy !== null} className={`${BUTTON.outline} w-full`}>
            {busy === "note" ? "Saving…" : "Add note"}
          </button>
        )}
        {flashFor("note")}
      </form>
    </div>
  );
}

/** Clears the "author replied" flag without writing back. */
export function HandledButton({ submissionId }: { submissionId: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          const failure = await patch(submissionId, { handled: true });
          setBusy(false);
          if (failure) setError(failure);
          else router.refresh();
        }}
        className={BUTTON.onNavy}
      >
        {busy ? "Saving…" : "Mark handled"}
      </button>
      {error && <p role="alert" className="font-text text-sm text-white">{error}</p>}
    </div>
  );
}
