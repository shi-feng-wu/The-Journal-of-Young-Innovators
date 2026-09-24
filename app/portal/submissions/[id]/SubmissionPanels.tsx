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
import { BUTTON, INPUT, LABEL, PANEL } from "../../_components/ui";

interface Props {
  submissionId: number;
  email: string;
  status: SubmissionStatus;
  paymentStatus: PaymentStatus;
  assignedEditorId: number | null;
  editors: Array<{ id: number; name: string }>;
  context: TemplateContext;
}

async function send(url: string, init: RequestInit): Promise<string | null> {
  const response = await fetch(url, init).catch(() => null);
  if (response?.ok) return null;
  const payload = await response?.json().catch(() => null);
  return payload?.error ?? "Could not reach the server. Try again.";
}

const patch = (id: number, body: object) =>
  send(`/api/portal/submissions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

function Flash({ message }: { message: { kind: "ok" | "error"; text: string } | null }) {
  if (!message) return null;
  return (
    <p
      role={message.kind === "error" ? "alert" : "status"}
      className={`rounded-md px-3 py-2 font-text text-sm ${
        message.kind === "error" ? "bg-[#9b2c2c]/10 text-[#7a1f1f]" : "bg-[#32965d]/15 text-[#1d5e39]"
      }`}
    >
      {message.text}
    </p>
  );
}

// ---- Decisions and email -------------------------------------------------

const QUICK: Array<{ template: string; primary?: boolean; when?: (p: Props) => boolean }> = [
  { template: "in-review", when: (p) => p.status === "received" },
  { template: "revisions", when: (p) => ["received", "in_review", "revisions"].includes(p.status) },
  { template: "accept", primary: true, when: (p) => !["accepted", "published"].includes(p.status) },
  { template: "accept-waived", when: (p) => !["accepted", "published"].includes(p.status) },
  { template: "decline", when: (p) => !["rejected", "published"].includes(p.status) },
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
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);

  const template = EMAIL_TEMPLATES.find((t) => t.id === templateId);

  const open = (id: string) => {
    const t = EMAIL_TEMPLATES.find((x) => x.id === id)!;
    setTemplateId(id);
    setSubject(t.subject(props.context));
    setBody(t.body(props.context));
    setApplyStatus(true);
    setMessage(null);
    if (fileRef.current) fileRef.current.value = "";
    requestAnimationFrame(() =>
      composerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
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
    for (const file of Array.from(fileRef.current?.files ?? [])) {
      form.append("attachments", file);
    }
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
    setMessage({ kind: "ok", text: `Email sent to ${props.email}.` });
    router.refresh();
  };

  const quick = QUICK.filter((q) => !q.when || q.when(props));

  return (
    <section className={`${PANEL} p-5 sm:p-6`} aria-labelledby="decision-heading">
      <h2 id="decision-heading" className="font-display text-2xl font-normal">
        Decide and email
      </h2>
      <p className="mt-1 font-text text-sm text-black/60">
        Pick an action to open a prefilled email. You can edit it before sending, and the status
        changes only when the email goes out.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {quick.map((q) => {
          const t = EMAIL_TEMPLATES.find((x) => x.id === q.template)!;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => open(t.id)}
              className={q.primary ? BUTTON.primary : BUTTON.ghost}
              aria-pressed={templateId === t.id}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {!template && message && <div className="mt-4"><Flash message={message} /></div>}

      {template && (
        <div ref={composerRef} className="mt-6 scroll-mt-6 border-t border-black/10 pt-6">
          <form onSubmit={submit} className="space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-xl font-normal">{template.label}</h3>
              <p className="font-mono text-xs text-black/55">To: {props.email}</p>
            </div>
            <label className="block space-y-1">
              <span className={LABEL}>Subject</span>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} className={INPUT} required />
            </label>
            <label className="block space-y-1">
              <span className={LABEL}>Message</span>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={16}
                className={`${INPUT} font-text leading-relaxed`}
                required
              />
            </label>
            {body.includes("[") && body.includes("]") && (
              <p className="font-text text-sm text-[#6b4a00]">
                The message still has a [bracketed] placeholder. Replace it before sending.
              </p>
            )}
            <label className="block space-y-1">
              <span className={LABEL}>Attachments (optional, 15 MB total)</span>
              <input ref={fileRef} type="file" multiple className="block w-full font-text text-sm text-black/70 file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:font-mono file:text-xs file:uppercase file:tracking-[0.12em] file:text-white" />
            </label>
            {template.setsStatus && template.setsStatus !== props.status && (
              <label className="flex items-start gap-2 font-text text-sm text-black/75">
                <input
                  type="checkbox"
                  checked={applyStatus}
                  onChange={(e) => setApplyStatus(e.target.checked)}
                  className="mt-1 accent-primary"
                />
                <span>
                  Also change the status to <strong>{STATUS_LABELS[template.setsStatus]}</strong>
                  {template.waivesFee && " and mark the fee as waived"}
                  {template.id === "accept" && " (the $65 fee becomes due)"}
                </span>
              </label>
            )}
            <Flash message={message} />
            <div className="flex flex-wrap gap-2">
              <button type="submit" disabled={busy} className={BUTTON.primary}>
                {busy ? "Sending..." : "Send email"}
              </button>
              <button type="button" onClick={() => setTemplateId(null)} className={BUTTON.ghost}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

// ---- Record keeping ------------------------------------------------------

export function RecordPanel(props: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<SubmissionStatus>(props.status);
  const [waive, setWaive] = useState(false);
  const [payment, setPayment] = useState<PaymentStatus>(props.paymentStatus);
  const [paymentNote, setPaymentNote] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

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
    setMessage(error ? { kind: "error", text: error } : { kind: "ok", text: done });
    if (!error) router.refresh();
    return !error;
  };

  return (
    <section className={`${PANEL} space-y-6 p-5`} aria-label="Record">
      <div className="space-y-2">
        <label className="block space-y-1">
          <span className={LABEL}>Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as SubmissionStatus)}
            className={INPUT}
          >
            {SUBMISSION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
        {status === "accepted" && props.status !== "accepted" && props.paymentStatus === "not_due" && (
          <label className="flex items-center gap-2 font-text text-sm text-black/75">
            <input type="checkbox" checked={waive} onChange={(e) => setWaive(e.target.checked)} className="accent-primary" />
            Waive the publication fee
          </label>
        )}
        <button
          type="button"
          disabled={status === props.status || busy !== null}
          onClick={() => act("status", { status, waiveFee: waive }, "Status updated. No email was sent.")}
          className={`${BUTTON.ghost} w-full`}
        >
          {busy === "status" ? "Saving..." : "Change status without email"}
        </button>
      </div>

      <div className="space-y-2 border-t border-black/10 pt-5">
        <label className="block space-y-1">
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
          <input
            value={paymentNote}
            onChange={(e) => setPaymentNote(e.target.value)}
            placeholder={payment === "paid" ? "How was it paid? (e.g. check, Zelle)" : "Reason (optional)"}
            className={INPUT}
          />
        )}
        <button
          type="button"
          disabled={payment === props.paymentStatus || busy !== null}
          onClick={async () => {
            if (await act("payment", { paymentStatus: payment, paymentNote }, "Fee status updated.")) {
              setPaymentNote("");
            }
          }}
          className={`${BUTTON.ghost} w-full`}
        >
          {busy === "payment" ? "Saving..." : "Update fee status"}
        </button>
        <p className="font-text text-xs text-black/50">
          Card payments through the Stripe link are recorded automatically.
        </p>
      </div>

      <div className="space-y-2 border-t border-black/10 pt-5">
        <label className="block space-y-1">
          <span className={LABEL}>Handling editor</span>
          <select
            value={props.assignedEditorId ?? ""}
            disabled={busy !== null}
            onChange={(e) =>
              act(
                "assign",
                { assignedEditorId: e.target.value ? Number(e.target.value) : null },
                "Handling editor updated.",
              )
            }
            className={INPUT}
          >
            <option value="">Unassigned</option>
            {props.editors.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <form
        className="space-y-2 border-t border-black/10 pt-5"
        onSubmit={async (e) => {
          e.preventDefault();
          if (note.trim() && (await act("note", { note }, "Note added."))) setNote("");
        }}
      >
        <label className="block space-y-1">
          <span className={LABEL}>Internal note</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Visible to editors only"
            className={INPUT}
          />
        </label>
        <button type="submit" disabled={!note.trim() || busy !== null} className={`${BUTTON.ghost} w-full`}>
          {busy === "note" ? "Saving..." : "Add note"}
        </button>
      </form>

      <Flash message={message} />
    </section>
  );
}
