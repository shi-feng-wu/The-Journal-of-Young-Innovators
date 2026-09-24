// Imports submissions that arrived before the portal existed.
//
//   pnpm portal:backfill --file submissions.json [--files manuscripts-dir] [--dry-run]
//
// The JSON file is an array of records:
//   { tag, firstName, lastName, email, phone, school, gradeLevel, title,
//     submissionType, submittedAt (ISO), status, paymentStatus,
//     mail: [{ direction: "in"|"out", from, fromName?, to, subject, at (ISO),
//              html, attachments?: [file names] }] }
// History is built only from the literal emails plus fixed wording (see
// app/lib/portal/wording.ts); the import never writes free-text summaries.
// With --files, the manuscript for a record is the first file in <dir>/<tag>/.
//
// Records are imported oldest first so references follow submission order.
// A record whose email and title already exist is skipped, so the script can
// be re-run safely; --replace-history rebuilds the history of such records
// from the file instead. Run it on the server as the deploy user, from the app
// directory, so it writes to the same database as the site.

import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";

try {
  process.loadEnvFile(".env.local");
} catch {
  // No .env.local; fall back to the default data directory.
}

const { values } = parseArgs({
  options: {
    file: { type: "string" },
    files: { type: "string" },
    "dry-run": { type: "boolean", default: false },
    "replace-history": { type: "boolean", default: false },
  },
});

if (!values.file) {
  console.error("Usage: pnpm portal:backfill --file submissions.json [--files dir] [--dry-run]");
  process.exit(1);
}

const { DATA_DIR, MANUSCRIPT_DIR, createSubmission, get, run, transaction } = await import(
  "../app/lib/portal/db.ts"
);
const { PAYMENT_STATUSES, SUBMISSION_STATUSES } = await import("../app/lib/portal/constants.ts");
const { SUBMITTED, sentLine, receivedLine, importedStatusLine, importedFeeLine } = await import(
  "../app/lib/portal/wording.ts"
);
const { mailText } = await import("../app/lib/portal/inbox.ts");

interface Record {
  tag: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  school?: string;
  gradeLevel?: string;
  title: string;
  submissionType?: string;
  submittedAt: string;
  status: string;
  paymentStatus?: string;
  mail?: Array<{
    direction: "in" | "out";
    from: string;
    fromName?: string;
    to: string;
    subject: string;
    at: string;
    html: string;
    attachments?: string[];
  }>;
}

const records = (JSON.parse(fs.readFileSync(values.file, "utf8")) as Record[]).sort((a, b) =>
  a.submittedAt.localeCompare(b.submittedAt),
);

// Validate everything before writing anything.
for (const r of records) {
  const problems = [
    !r.email && "missing email",
    !r.title && "missing title",
    Number.isNaN(Date.parse(r.submittedAt)) && "bad submittedAt",
    !SUBMISSION_STATUSES.includes(r.status as never) && `unknown status ${r.status}`,
    r.paymentStatus && !PAYMENT_STATUSES.includes(r.paymentStatus as never) && `unknown payment ${r.paymentStatus}`,
    ...(r.mail ?? []).map((m) => !["in", "out"].includes(m.direction) && `bad mail direction ${m.direction}`),
    "history" in r && "free-text history is not accepted; use mail",
  ].filter(Boolean);
  if (problems.length) {
    console.error(`${r.tag}: ${problems.join(", ")}`);
    process.exit(1);
  }
}

function manuscriptFor(tag: string) {
  if (!values.files) return null;
  const dir = path.join(values.files, tag);
  if (!fs.existsSync(dir)) return null;
  const name = fs.readdirSync(dir).find((f) => /\.(docx?|pdf)$/i.test(f));
  return name ? { name, source: path.join(dir, name) } : null;
}

const safeName = (name: string) =>
  path.basename(name).replace(/[^\w.\- ()]/g, "_").slice(-120) || "manuscript.docx";

function addEvent(id: number, type: string, summary: string, at: string, data?: unknown) {
  run(
    `INSERT INTO events (submission_id, editor_id, type, summary, data, created_at)
     VALUES (:id, NULL, :type, :summary, :data, :at)`,
    { id, type, summary, at, data: data === undefined ? null : JSON.stringify(data) },
  );
}

/** History from the literal emails, plus fixed lines for what the import set. */
function writeHistory(id: number, r: Record) {
  addEvent(id, "created", SUBMITTED, r.submittedAt);
  const mail = [...(r.mail ?? [])].sort((a, b) => a.at.localeCompare(b.at));
  for (const m of mail) {
    const body = mailText(m.html);
    const attachments = m.attachments ?? [];
    if (m.direction === "out") {
      addEvent(id, "email", sentLine(m.to, r.email, m.subject), m.at, { to: m.to, subject: m.subject, body, attachments });
    } else {
      const withManuscript = attachments.some((a) => /\.(docx?|pdf)$/i.test(a));
      addEvent(id, "reply", receivedLine(m.from, m.fromName ?? null, r.email, m.subject, withManuscript), m.at, {
        from: m.from,
        subject: m.subject,
        body,
        attachments,
      });
    }
  }
  const last = mail.at(-1)?.at ?? r.submittedAt;
  if (r.status !== "received") addEvent(id, "status", importedStatusLine(r.status as never), last);
  if (r.paymentStatus && r.paymentStatus !== "not_due") {
    addEvent(id, "payment", importedFeeLine(r.paymentStatus as never), last);
  }
}

let imported = 0;
let skipped = 0;
for (const r of records) {
  const existing = get<{ ref: string }>(
    "SELECT ref FROM submissions WHERE email = :email COLLATE NOCASE AND title = :title COLLATE NOCASE",
    { email: r.email, title: r.title },
  );
  const file = manuscriptFor(r.tag);
  if (existing) {
    if (values["replace-history"] && !values["dry-run"]) {
      const sub = get<{ id: number }>("SELECT id FROM submissions WHERE ref = :ref", { ref: existing.ref })!;
      transaction(() => {
        run("DELETE FROM events WHERE submission_id = :id", { id: sub.id });
        writeHistory(sub.id, r);
      });
      console.log(`rebuilt history  ${existing.ref}  ${r.title.slice(0, 60)}`);
    } else {
      console.log(`skip  ${existing.ref}  ${r.title.slice(0, 60)}`);
    }
    skipped += 1;
    continue;
  }
  if (values["dry-run"]) {
    console.log(`would import  ${r.status.padEnd(9)} ${file ? "file" : "no file"}  ${r.title.slice(0, 60)}`);
    continue;
  }

  const submission = createSubmission({
    firstName: r.firstName,
    lastName: r.lastName,
    email: r.email,
    phone: r.phone ?? "",
    school: r.school ?? "",
    gradeLevel: r.gradeLevel ?? "",
    title: r.title,
    submissionType: r.submissionType ?? "",
    source: "backfill",
    createdAt: r.submittedAt,
  });

  let manuscript: { file: string; name: string } | null = null;
  if (file) {
    const relative = path.join(submission.ref, safeName(file.name));
    fs.mkdirSync(path.join(MANUSCRIPT_DIR, submission.ref), { recursive: true });
    fs.copyFileSync(file.source, path.join(MANUSCRIPT_DIR, relative));
    manuscript = { file: relative, name: file.name };
  }

  const lastActivity = [...(r.mail ?? [])].map((m) => m.at).sort().at(-1) ?? r.submittedAt;

  transaction(() => {
    run("DELETE FROM events WHERE submission_id = :id", { id: submission.id });
    writeHistory(submission.id, r);
    run(
      `UPDATE submissions
          SET status = :status, payment_status = :payment,
              manuscript_file = :file, manuscript_name = :name, updated_at = :updated
        WHERE id = :id`,
      {
        id: submission.id,
        status: r.status,
        payment: r.paymentStatus ?? "not_due",
        file: manuscript?.file ?? null,
        name: manuscript?.name ?? null,
        updated: lastActivity,
      },
    );
  });

  console.log(`import ${submission.ref}  ${r.status.padEnd(9)} ${manuscript ? "file" : "NO FILE"}  ${r.title.slice(0, 60)}`);
  imported += 1;
}

console.log(`\n${imported} imported, ${skipped} already present. Database: ${DATA_DIR}/portal.db`);
