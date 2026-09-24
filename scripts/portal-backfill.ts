// Imports submissions that arrived before the portal existed.
//
//   pnpm portal:backfill --file submissions.json [--files manuscripts-dir] [--dry-run]
//
// The JSON file is an array of records:
//   { tag, firstName, lastName, email, phone, school, gradeLevel, title,
//     submissionType, submittedAt (ISO), status, paymentStatus,
//     history: [{ at (ISO), type: "status"|"email"|"note"|"payment", summary }] }
// With --files, the manuscript for a record is the first file in <dir>/<tag>/.
//
// Records are imported oldest first so references follow submission order.
// A record whose email and title already exist is skipped, so the script
// can be re-run safely. Run it on the server as the deploy user, from the
// app directory, so it writes to the same database as the site.

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
  history?: Array<{ at: string; type: string; summary: string }>;
}

const EVENT_TYPES = new Set(["status", "email", "note", "payment"]);

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
    ...(r.history ?? []).map((h) => !EVENT_TYPES.has(h.type) && `unknown event type ${h.type}`),
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

let imported = 0;
let skipped = 0;
for (const r of records) {
  const existing = get<{ ref: string }>(
    "SELECT ref FROM submissions WHERE email = :email COLLATE NOCASE AND title = :title COLLATE NOCASE",
    { email: r.email, title: r.title },
  );
  const file = manuscriptFor(r.tag);
  if (existing) {
    console.log(`skip  ${existing.ref}  ${r.title.slice(0, 60)}`);
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

  const history = [...(r.history ?? [])].sort((a, b) => a.at.localeCompare(b.at));
  const lastActivity = history.at(-1)?.at ?? r.submittedAt;

  transaction(() => {
    // The created event is dated when the author submitted, not today.
    run(
      `UPDATE events SET created_at = :at, summary = :summary
        WHERE submission_id = :id AND type = 'created'`,
      {
        id: submission.id,
        at: r.submittedAt,
        summary: "Submitted through the website form (imported from the editor inbox)",
      },
    );
    for (const h of history) {
      run(
        `INSERT INTO events (submission_id, editor_id, type, summary, data, created_at)
         VALUES (:id, NULL, :type, :summary, NULL, :at)`,
        { id: submission.id, type: h.type, summary: h.summary, at: h.at },
      );
    }
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
