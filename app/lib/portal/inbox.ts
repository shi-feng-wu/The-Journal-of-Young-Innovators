// Inbox sync: reads new mail in the editor inbox and files author replies
// under their manuscripts. Matching is rule-based, strongest rule first:
//   1. a JYI reference in the subject
//   2. the same Zoho thread as mail already filed under a manuscript
//   3. the sender is the author of exactly one open manuscript (or of one
//      whose title the subject names)
// Anything else from a person lands in the portal's Inbox list for an editor
// to link or dismiss. Automated mail and the journal's own mail are skipped.

import fs from "node:fs";
import path from "node:path";
import { DATA_DIR, MANUSCRIPT_DIR, all, get, logEvent, now, run, transaction, updateSubmission, type Submission } from "./db";
import { EDITOR_INBOX } from "./mailer";
import { receivedLine } from "./wording";
import * as zoho from "./zoho";

const INBOX_FILES_DIR = path.join(DATA_DIR, "inbox");
const REF_PATTERN = /JYI-\d{4}-\d{4}/i;
const CLOSED = ["rejected", "withdrawn", "published"];

const IGNORED_SENDER = /(^|[.+_-])(no-?reply|do-?not-?reply|notifications?|mailer-daemon|postmaster|bounces?)([.+_-]|@)/i;
const IGNORED_DOMAINS = ["stripe.com", "zoho.com", "zohoaccounts.com", "zohocorp.com", "crossref.org", "google.com", "microsoft.com"];
const AUTO_REPLY_SUBJECT = /^(automatic reply|auto(matic)?[- ]?reply|out of (the )?office|undeliverable|delivery status notification)/i;

export interface InboundMail {
  id: number;
  zoho_message_id: string;
  zoho_folder_id: string;
  thread_id: string | null;
  from_address: string;
  from_name: string | null;
  subject: string;
  body: string;
  attachments: string | null;
  received_at: string;
  submission_id: number | null;
  match_reason: string | null;
  state: "matched" | "unmatched" | "dismissed";
  created_at: string;
}

export interface StoredAttachment {
  name: string;
  /** Relative to MANUSCRIPT_DIR once filed, or to the inbox dir while unmatched. */
  path: string;
  size: number;
}

// ---- Text ------------------------------------------------------------------

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", apos: "'", nbsp: " " };

function htmlToText(html: string): string {
  return html
    .replace(/<(style|script|head)[\s\S]*?<\/\1>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|tr|h\d|blockquote)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&(#\d+|#x[0-9a-f]+|\w+);/gi, (m, e: string) => {
      if (e.startsWith("#x")) return String.fromCodePoint(parseInt(e.slice(2), 16));
      if (e.startsWith("#")) return ENTITIES[e] ?? String.fromCodePoint(Number(e.slice(1)));
      return ENTITIES[e.toLowerCase()] ?? m;
    });
}

const tidy = (s: string) =>
  s
    .split("\n")
    .map((line) => line.replace(/\s+$/, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 20_000);

/**
 * Mail HTML to plain text, with the quoted earlier conversation cut off.
 * A forward with nothing added keeps the forwarded message, since that is
 * the whole email.
 */
export function mailText(html: string): string {
  let s = htmlToText(
    html
      // Quoted history: Zoho, Gmail, Outlook and Apple Mail markers.
      .replace(/<blockquote[\s\S]*$/i, "")
      .replace(/<div[^>]*(zmail_extra|gmail_quote|divRplyFwdMsg|OutlookMessageHeader)[\s\S]*$/i, ""),
  );
  // Plain-text quote headers that survive as text.
  const cut = s.search(/^\s*(On .{5,200} wrote:|-{2,} ?Original Message ?-{2,}|From: .+<.+@.+>|=+ ?Forwarded message ?=+)\s*$/im);
  if (cut >= 0) s = s.slice(0, cut);
  const own = tidy(s);
  return own || forwardedText(html) || tidy(htmlToText(html));
}

/** Everything inside the first <blockquote> that starts after `from`. */
function firstBlockquote(html: string, from: number): string | null {
  const open = /<blockquote\b[^>]*>/gi;
  open.lastIndex = from;
  const start = open.exec(html);
  if (!start) return null;
  const tags = /<(\/?)blockquote\b[^>]*>/gi;
  tags.lastIndex = start.index + start[0].length;
  let depth = 1;
  for (let t = tags.exec(html); t; t = tags.exec(html)) {
    depth += t[1] ? -1 : 1;
    if (depth === 0) return html.slice(start.index + start[0].length, t.index);
  }
  return null;
}

/**
 * A bare forward, reduced to one level: the forwarded message's sender,
 * date and subject, then its own text without the history quoted inside it.
 */
function forwardedText(html: string): string | null {
  const marker = html.search(/Forwarded message|Begin forwarded message|-{3,} ?Original Message/i);
  if (marker < 0) return null;
  const inner = firstBlockquote(html, marker);
  if (inner === null) return null;
  const header = htmlToText(html.slice(marker, html.indexOf("<blockquote", marker)))
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^(From|Date|Sent|Subject):/i.test(line));
  const body = mailText(inner);
  return tidy(["Forwarded message", ...header, "", body].join("\n"));
}

// ---- Matching --------------------------------------------------------------

function skipReason(msg: zoho.ZohoMessage): string | null {
  const from = msg.fromAddress.toLowerCase();
  const own = [EDITOR_INBOX, process.env.SUBMISSION_FROM ?? "", process.env.SMTP_USER ?? ""]
    .map((a) => (a.match(/<([^>]+)>/)?.[1] ?? a).trim().toLowerCase())
    .filter(Boolean);
  if (own.includes(from) || from.endsWith("@young-innovator.org")) return "own";
  if (IGNORED_SENDER.test(from)) return "automated";
  if (IGNORED_DOMAINS.some((d) => from.endsWith(`@${d}`) || from.endsWith(`.${d}`))) return "automated";
  if (AUTO_REPLY_SUBJECT.test(msg.subject.trim())) return "auto-reply";
  return null;
}

const words = (s: string) =>
  new Set(
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3),
  );

function match(msg: zoho.ZohoMessage): { submission: Submission; reason: string } | null {
  const ref = msg.subject.match(REF_PATTERN)?.[0]?.toUpperCase();
  if (ref) {
    const byRef = get<Submission>("SELECT * FROM submissions WHERE ref = :ref", { ref });
    if (byRef) return { submission: byRef, reason: "reference" };
  }

  if (msg.threadId) {
    const byThread = get<Submission>(
      `SELECT submissions.* FROM inbound_mail JOIN submissions ON submissions.id = inbound_mail.submission_id
        WHERE inbound_mail.thread_id = :thread AND inbound_mail.state = 'matched'
        ORDER BY inbound_mail.received_at DESC LIMIT 1`,
      { thread: msg.threadId },
    );
    if (byThread) return { submission: byThread, reason: "thread" };
  }

  const candidates = all<Submission>(
    `SELECT DISTINCT submissions.* FROM submissions
       LEFT JOIN submission_emails ON submission_emails.submission_id = submissions.id
      WHERE submissions.email = :from COLLATE NOCASE OR submission_emails.email = :from COLLATE NOCASE`,
    { from: msg.fromAddress },
  );
  if (candidates.length === 1) return { submission: candidates[0], reason: "sender" };
  const open = candidates.filter((c) => !CLOSED.includes(c.status));
  if (open.length === 1) return { submission: open[0], reason: "sender" };

  // Several manuscripts from this address: accept only a clear title match.
  const subjectWords = words(msg.subject);
  const scored = (open.length ? open : candidates)
    .map((c) => ({ c, score: [...words(c.title)].filter((w) => subjectWords.has(w)).length }))
    .sort((a, b) => b.score - a.score);
  if (scored.length && scored[0].score >= 3 && (scored.length === 1 || scored[1].score < scored[0].score)) {
    return { submission: scored[0].c, reason: "sender and title" };
  }
  return null;
}

// ---- Filing ----------------------------------------------------------------

const safeName = (name: string) =>
  path.basename(name).replace(/[^\w.\- ()]/g, "_").slice(-120) || "attachment";

const isManuscript = (name: string) => /\.(docx?|pdf)$/i.test(name);

/** Files a mail's attachments and history entry under a submission. */
function fileUnder(mail: InboundMail, submission: Submission, attachments: StoredAttachment[], fromDir: string | null) {
  const dir = path.join(submission.ref, "replies", mail.zoho_message_id);
  fs.mkdirSync(path.join(MANUSCRIPT_DIR, dir), { recursive: true });
  const filed = attachments.map((a) => {
    const target = path.join(dir, path.basename(a.path));
    if (fromDir) fs.renameSync(path.join(fromDir, a.path), path.join(MANUSCRIPT_DIR, target));
    return { ...a, path: target };
  });

  const revised = filed.find((a) => /\.docx?$/i.test(a.name)) ?? filed.find((a) => isManuscript(a.name));
  transaction(() => {
    run(
      `UPDATE inbound_mail SET submission_id = :sid, state = 'matched', attachments = :att WHERE id = :id`,
      { sid: submission.id, att: JSON.stringify(filed), id: mail.id },
    );
    logEvent(
      submission.id,
      null,
      "reply",
      receivedLine(mail.from_address, mail.from_name, submission.email, mail.subject, !!revised),
      { from: mail.from_address, subject: mail.subject, body: mail.body, attachments: filed, receivedAt: mail.received_at },
    );
    // The history entry is dated when the mail arrived.
    run(
      `UPDATE events SET created_at = :at WHERE id = (SELECT MAX(id) FROM events WHERE submission_id = :sid)`,
      { at: mail.received_at, sid: submission.id },
    );
    if (revised) updateSubmission(submission.id, { manuscript_file: revised.path, manuscript_name: revised.name });
    if (!submission.attention_since) updateSubmission(submission.id, { attention_since: mail.received_at });
    if (mail.from_address.toLowerCase() !== submission.email.toLowerCase()) {
      run("INSERT OR IGNORE INTO submission_emails (submission_id, email) VALUES (:sid, :email)", {
        sid: submission.id,
        email: mail.from_address,
      });
    }
  });
}

// ---- Sync ------------------------------------------------------------------

const cursorKey = "inbox_cursor";

export function getCursor(): string | null {
  return get<{ value: string }>("SELECT value FROM sync_state WHERE key = :k", { k: cursorKey })?.value ?? null;
}

export function setCursor(iso: string) {
  run("INSERT INTO sync_state (key, value) VALUES (:k, :v) ON CONFLICT(key) DO UPDATE SET value = :v", {
    k: cursorKey,
    v: iso,
  });
}

export interface SyncResult {
  checked: number;
  matched: number;
  unmatched: number;
  skipped: number;
}

/**
 * Reads Inbox mail newer than the cursor. On the very first run there is no
 * cursor; pass `since` to choose where to start (otherwise it starts now and
 * only future mail is read).
 */
export async function syncInbox(opts: { since?: string } = {}): Promise<SyncResult> {
  if (!zoho.zohoConfigured()) throw new Error("Zoho API credentials are not set.");
  let cursor = getCursor();
  if (!cursor) {
    cursor = opts.since ?? now();
    setCursor(cursor);
  }
  const cursorMs = Date.parse(cursor);

  const inbox = (await zoho.listFolders()).find((f) => f.folderType === "Inbox" && f.folderName === "Inbox");
  if (!inbox) throw new Error("Could not find the Inbox folder.");

  // Collect everything newer than the cursor, then process oldest first so
  // thread matches can build on earlier mail in the same run.
  const fresh: zoho.ZohoMessage[] = [];
  for (let start = 1; start < 2000; start += 100) {
    const page = await zoho.listMessages(inbox.folderId, start, 100);
    const newer = page.filter((m) => Number(m.receivedTime) > cursorMs);
    fresh.push(...newer);
    if (page.length < 100 || newer.length < page.length) break;
  }
  fresh.sort((a, b) => Number(a.receivedTime) - Number(b.receivedTime));

  const result: SyncResult = { checked: fresh.length, matched: 0, unmatched: 0, skipped: 0 };
  for (const msg of fresh) {
    const receivedAt = new Date(Number(msg.receivedTime)).toISOString();
    const already = get("SELECT id FROM inbound_mail WHERE zoho_message_id = :id", { id: msg.messageId });
    if (already || skipReason(msg)) {
      result.skipped += 1;
      setCursor(receivedAt);
      continue;
    }

    const body = mailText(await zoho.messageContent(msg.folderId, msg.messageId));
    const tempDir = path.join(INBOX_FILES_DIR, msg.messageId);
    const attachments: StoredAttachment[] = [];
    if (msg.hasAttachment === "1") {
      for (const a of await zoho.attachmentInfo(msg.folderId, msg.messageId)) {
        const data = await zoho.downloadAttachment(msg.folderId, msg.messageId, a.attachmentId);
        fs.mkdirSync(tempDir, { recursive: true });
        const name = safeName(a.attachmentName);
        fs.writeFileSync(path.join(tempDir, name), data);
        attachments.push({ name: a.attachmentName, path: name, size: data.length });
      }
    }

    const found = match(msg);
    const { lastInsertRowid } = run(
      `INSERT INTO inbound_mail
         (zoho_message_id, zoho_folder_id, thread_id, from_address, from_name, subject, body,
          attachments, received_at, match_reason, state, created_at)
       VALUES (:mid, :fid, :thread, :from, :name, :subject, :body, :att, :at, :reason, 'unmatched', :now)`,
      {
        mid: msg.messageId,
        fid: msg.folderId,
        thread: msg.threadId ?? null,
        from: msg.fromAddress,
        name: msg.sender ?? null,
        subject: msg.subject,
        body,
        att: JSON.stringify(attachments),
        at: receivedAt,
        reason: found?.reason ?? null,
        now: now(),
      },
    );
    const mail = get<InboundMail>("SELECT * FROM inbound_mail WHERE id = :id", { id: Number(lastInsertRowid) })!;
    if (found) {
      fileUnder(mail, found.submission, attachments, tempDir);
      fs.rmSync(tempDir, { recursive: true, force: true });
      result.matched += 1;
    } else {
      result.unmatched += 1;
    }
    setCursor(receivedAt);
  }
  run("INSERT INTO sync_state (key, value) VALUES ('inbox_last_run', :v) ON CONFLICT(key) DO UPDATE SET value = :v", {
    v: now(),
  });
  return result;
}

// ---- Editor actions on unmatched mail -------------------------------------

export function linkMail(mailId: number, submission: Submission, editorId: number) {
  const mail = get<InboundMail>("SELECT * FROM inbound_mail WHERE id = :id AND state != 'matched'", { id: mailId });
  if (!mail) throw new Error("That email is already filed.");
  const attachments = JSON.parse(mail.attachments ?? "[]") as StoredAttachment[];
  const tempDir = path.join(INBOX_FILES_DIR, mail.zoho_message_id);
  run("UPDATE inbound_mail SET match_reason = 'linked by an editor' WHERE id = :id", { id: mail.id });
  fileUnder(mail, submission, attachments, fs.existsSync(tempDir) ? tempDir : null);
  fs.rmSync(tempDir, { recursive: true, force: true });
  run(
    `UPDATE events SET editor_id = :editor WHERE id = (SELECT MAX(id) FROM events WHERE submission_id = :sid)`,
    { editor: editorId, sid: submission.id },
  );
}

export function dismissMail(mailId: number) {
  const mail = get<InboundMail>("SELECT * FROM inbound_mail WHERE id = :id", { id: mailId });
  if (!mail || mail.state === "matched") return;
  run("UPDATE inbound_mail SET state = 'dismissed' WHERE id = :id", { id: mailId });
  fs.rmSync(path.join(INBOX_FILES_DIR, mail.zoho_message_id), { recursive: true, force: true });
}

export function inboxFilePath(mail: InboundMail, name: string): string | null {
  const p = path.resolve(INBOX_FILES_DIR, mail.zoho_message_id, name);
  return p.startsWith(INBOX_FILES_DIR + path.sep) && fs.existsSync(p) ? p : null;
}
