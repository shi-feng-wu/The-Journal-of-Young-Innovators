import fs from "node:fs";
import path from "node:path";
import { DatabaseSync, type SQLInputValue } from "node:sqlite";
import type {
  EventType,
  PaymentStatus,
  SubmissionStatus,
} from "./constants";
import { SUBMITTED } from "./wording";

// Everything the portal stores (the SQLite file and uploaded manuscripts)
// lives under one directory outside git. On the server, set PORTAL_DATA_DIR
// to a path outside the checkout so deploys never touch it.
export const DATA_DIR = path.resolve(
  process.env.PORTAL_DATA_DIR ?? path.join(process.cwd(), "data"),
);
export const MANUSCRIPT_DIR = path.join(DATA_DIR, "manuscripts");

const MIGRATIONS: string[] = [
  `
  CREATE TABLE editors (
    id INTEGER PRIMARY KEY,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    name TEXT NOT NULL,
    password_hash TEXT,
    is_admin INTEGER NOT NULL DEFAULT 0,
    disabled INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    last_login_at TEXT
  );
  CREATE TABLE sessions (
    token_hash TEXT PRIMARY KEY,
    editor_id INTEGER NOT NULL REFERENCES editors(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL
  );
  CREATE TABLE password_tokens (
    token_hash TEXT PRIMARY KEY,
    editor_id INTEGER NOT NULL REFERENCES editors(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    used_at TEXT
  );
  CREATE TABLE submissions (
    id INTEGER PRIMARY KEY,
    ref TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL DEFAULT '',
    last_name TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    school TEXT NOT NULL DEFAULT '',
    grade_level TEXT NOT NULL DEFAULT '',
    title TEXT NOT NULL,
    submission_type TEXT NOT NULL DEFAULT '',
    manuscript_file TEXT,
    manuscript_name TEXT,
    status TEXT NOT NULL DEFAULT 'received',
    payment_status TEXT NOT NULL DEFAULT 'not_due',
    assigned_editor_id INTEGER REFERENCES editors(id) ON DELETE SET NULL,
    source TEXT NOT NULL DEFAULT 'form',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE INDEX submissions_email ON submissions(email COLLATE NOCASE);
  CREATE INDEX submissions_status ON submissions(status);
  CREATE TABLE events (
    id INTEGER PRIMARY KEY,
    submission_id INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    editor_id INTEGER REFERENCES editors(id) ON DELETE SET NULL,
    type TEXT NOT NULL,
    summary TEXT NOT NULL,
    data TEXT,
    created_at TEXT NOT NULL
  );
  CREATE INDEX events_submission ON events(submission_id, created_at);
  CREATE TABLE payments (
    id INTEGER PRIMARY KEY,
    stripe_session_id TEXT NOT NULL UNIQUE,
    payment_intent_id TEXT,
    submission_id INTEGER REFERENCES submissions(id) ON DELETE SET NULL,
    client_reference_id TEXT,
    email TEXT,
    payer_name TEXT,
    article_title TEXT,
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL,
    status TEXT NOT NULL,
    paid_at TEXT NOT NULL,
    refunded_at TEXT,
    created_at TEXT NOT NULL
  );
  CREATE INDEX payments_intent ON payments(payment_intent_id);
  `,
  `
  ALTER TABLE submissions ADD COLUMN attention_since TEXT;
  CREATE TABLE submission_emails (
    submission_id INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    email TEXT NOT NULL COLLATE NOCASE,
    PRIMARY KEY (submission_id, email)
  );
  CREATE TABLE inbound_mail (
    id INTEGER PRIMARY KEY,
    zoho_message_id TEXT NOT NULL UNIQUE,
    zoho_folder_id TEXT NOT NULL,
    thread_id TEXT,
    from_address TEXT NOT NULL,
    from_name TEXT,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    attachments TEXT,
    received_at TEXT NOT NULL,
    submission_id INTEGER REFERENCES submissions(id) ON DELETE SET NULL,
    match_reason TEXT,
    state TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE INDEX inbound_mail_state ON inbound_mail(state, received_at);
  CREATE TABLE sync_state (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
  `,
];

function openDatabase(): DatabaseSync {
  fs.mkdirSync(MANUSCRIPT_DIR, { recursive: true });
  const db = new DatabaseSync(path.join(DATA_DIR, "portal.db"));
  // busy_timeout lets the inbox sync (a separate process) share the file.
  db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");
  const { user_version } = db.prepare("PRAGMA user_version").get() as {
    user_version: number;
  };
  for (let v = user_version; v < MIGRATIONS.length; v++) {
    db.exec("BEGIN");
    try {
      db.exec(MIGRATIONS[v]);
      db.exec(`PRAGMA user_version = ${v + 1}`);
      db.exec("COMMIT");
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }
  return db;
}

// One connection per process; the global survives dev-server reloads.
const globalForDb = globalThis as unknown as { portalDb?: DatabaseSync };

export function getDb(): DatabaseSync {
  if (!globalForDb.portalDb) globalForDb.portalDb = openDatabase();
  return globalForDb.portalDb;
}

export function transaction<T>(fn: () => T): T {
  const db = getDb();
  db.exec("BEGIN IMMEDIATE");
  try {
    const result = fn();
    db.exec("COMMIT");
    return result;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export const now = () => new Date().toISOString();

type Params = Record<string, SQLInputValue>;

// node:sqlite returns null-prototype rows, which React will not pass to
// client components; spread them into plain objects.
export function all<T>(sql: string, params: Params = {}): T[] {
  return getDb()
    .prepare(sql)
    .all(params)
    .map((row) => ({ ...row }) as T);
}

export function get<T>(sql: string, params: Params = {}): T | undefined {
  const row = getDb().prepare(sql).get(params);
  return row ? ({ ...row } as T) : undefined;
}

export function run(sql: string, params: Params = {}) {
  return getDb().prepare(sql).run(params);
}

// ---- Row types -----------------------------------------------------------

export interface Editor {
  id: number;
  email: string;
  name: string;
  password_hash: string | null;
  is_admin: number;
  disabled: number;
  created_at: string;
  last_login_at: string | null;
}

export interface Submission {
  id: number;
  ref: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  school: string;
  grade_level: string;
  title: string;
  submission_type: string;
  manuscript_file: string | null;
  manuscript_name: string | null;
  status: SubmissionStatus;
  payment_status: PaymentStatus;
  assigned_editor_id: number | null;
  source: string;
  /** Set when an author wrote in and no editor has responded yet. */
  attention_since: string | null;
  created_at: string;
  updated_at: string;
}

export interface PortalEvent {
  id: number;
  submission_id: number;
  editor_id: number | null;
  editor_name: string | null;
  type: EventType;
  summary: string;
  data: string | null;
  created_at: string;
}

export interface Payment {
  id: number;
  stripe_session_id: string;
  payment_intent_id: string | null;
  submission_id: number | null;
  client_reference_id: string | null;
  email: string | null;
  payer_name: string | null;
  article_title: string | null;
  amount: number;
  currency: string;
  status: "paid" | "refunded";
  paid_at: string;
  refunded_at: string | null;
  created_at: string;
}

// ---- Submissions ---------------------------------------------------------

export function logEvent(
  submissionId: number,
  editorId: number | null,
  type: EventType,
  summary: string,
  data?: unknown,
) {
  run(
    `INSERT INTO events (submission_id, editor_id, type, summary, data, created_at)
     VALUES (:submissionId, :editorId, :type, :summary, :data, :createdAt)`,
    {
      submissionId,
      editorId,
      type,
      summary,
      data: data === undefined ? null : JSON.stringify(data),
      createdAt: now(),
    },
  );
}

function nextRef(year: number): string {
  const prefix = `JYI-${year}-`;
  const row = get<{ ref: string }>(
    "SELECT ref FROM submissions WHERE ref LIKE :pattern ORDER BY ref DESC LIMIT 1",
    { pattern: `${prefix}%` },
  );
  const last = row ? Number(row.ref.slice(prefix.length)) : 0;
  return `${prefix}${String(last + 1).padStart(4, "0")}`;
}

export interface NewSubmission {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  school: string;
  gradeLevel: string;
  title: string;
  submissionType: string;
  source?: string;
  createdAt?: string;
}

export function createSubmission(input: NewSubmission): Submission {
  return transaction(() => {
    const createdAt = input.createdAt ?? now();
    const ref = nextRef(new Date(createdAt).getUTCFullYear());
    const { lastInsertRowid } = run(
      `INSERT INTO submissions
         (ref, first_name, last_name, email, phone, school, grade_level, title,
          submission_type, source, created_at, updated_at)
       VALUES
         (:ref, :firstName, :lastName, :email, :phone, :school, :gradeLevel,
          :title, :submissionType, :source, :createdAt, :createdAt)`,
      {
        ref,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        school: input.school,
        gradeLevel: input.gradeLevel,
        title: input.title,
        submissionType: input.submissionType,
        source: input.source ?? "form",
        createdAt,
      },
    );
    const id = Number(lastInsertRowid);
    logEvent(id, null, "created", SUBMITTED);
    return getSubmission(id)!;
  });
}

export function getSubmission(id: number): Submission | undefined {
  return get<Submission>("SELECT * FROM submissions WHERE id = :id", { id });
}

export function getSubmissionByRef(ref: string): Submission | undefined {
  return get<Submission>("SELECT * FROM submissions WHERE ref = :ref", {
    ref,
  });
}

export function updateSubmission(
  id: number,
  fields: Partial<
    Pick<
      Submission,
      | "status"
      | "payment_status"
      | "assigned_editor_id"
      | "manuscript_file"
      | "manuscript_name"
      | "attention_since"
    >
  >,
) {
  const entries = Object.entries(fields).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return;
  const sets = entries.map(([k]) => `${k} = :${k}`).join(", ");
  run(`UPDATE submissions SET ${sets}, updated_at = :updatedAt WHERE id = :id`, {
    ...(Object.fromEntries(entries) as Params),
    updatedAt: now(),
    id,
  });
}

export function listEvents(submissionId: number): PortalEvent[] {
  return all<PortalEvent>(
    `SELECT events.*, editors.name AS editor_name
       FROM events LEFT JOIN editors ON editors.id = events.editor_id
      WHERE submission_id = :submissionId
      ORDER BY events.created_at DESC, events.id DESC`,
    { submissionId },
  );
}
