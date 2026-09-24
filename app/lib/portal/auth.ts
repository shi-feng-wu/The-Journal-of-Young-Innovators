import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isAllowedOrigin } from "../origins";
import { get, now, run, type Editor } from "./db";

export const SESSION_COOKIE = "jyi_portal";
const SESSION_DAYS = 14;
const INVITE_HOURS = 72;
export const MIN_PASSWORD_LENGTH = 10;

// ---- Passwords -----------------------------------------------------------

const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 64 };

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const key = crypto.scryptSync(password, salt, SCRYPT.keylen, {
    N: SCRYPT.N,
    r: SCRYPT.r,
    p: SCRYPT.p,
  });
  return [
    "scrypt",
    SCRYPT.N,
    SCRYPT.r,
    SCRYPT.p,
    salt.toString("base64"),
    key.toString("base64"),
  ].join("$");
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, N, r, p, salt, key] = stored.split("$");
  if (scheme !== "scrypt") return false;
  const expected = Buffer.from(key, "base64");
  const actual = crypto.scryptSync(
    password,
    Buffer.from(salt, "base64"),
    expected.length,
    { N: Number(N), r: Number(r), p: Number(p) },
  );
  return crypto.timingSafeEqual(actual, expected);
}

// ---- Tokens --------------------------------------------------------------

const sha256 = (value: string) =>
  crypto.createHash("sha256").update(value).digest("hex");

const newToken = () => crypto.randomBytes(32).toString("base64url");

const hoursFromNow = (hours: number) =>
  new Date(Date.now() + hours * 3600_000).toISOString();

// ---- Sessions ------------------------------------------------------------

export async function startSession(editorId: number) {
  const token = newToken();
  run(
    `INSERT INTO sessions (token_hash, editor_id, created_at, expires_at)
     VALUES (:tokenHash, :editorId, :createdAt, :expiresAt)`,
    {
      tokenHash: sha256(token),
      editorId,
      createdAt: now(),
      expiresAt: hoursFromNow(SESSION_DAYS * 24),
    },
  );
  run("UPDATE editors SET last_login_at = :now WHERE id = :editorId", {
    now: now(),
    editorId,
  });
  run("DELETE FROM sessions WHERE expires_at < :now", { now: now() });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 3600,
  });
}

export async function endSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    run("DELETE FROM sessions WHERE token_hash = :tokenHash", {
      tokenHash: sha256(token),
    });
  }
  jar.delete(SESSION_COOKIE);
}

export async function getCurrentEditor(): Promise<Editor | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const editor = get<Editor>(
    `SELECT editors.* FROM sessions
       JOIN editors ON editors.id = sessions.editor_id
      WHERE sessions.token_hash = :tokenHash
        AND sessions.expires_at > :now
        AND editors.disabled = 0`,
    { tokenHash: sha256(token), now: now() },
  );
  return editor ?? null;
}

/** For portal pages: the signed-in editor, or a redirect to the login page. */
export async function requirePageEditor(
  opts: { admin?: boolean } = {},
): Promise<Editor> {
  const editor = await getCurrentEditor();
  if (!editor) redirect("/portal/login");
  if (opts.admin && !editor.is_admin) redirect("/portal");
  return editor;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/**
 * For portal API routes. Mutating requests must come from one of the site's
 * own origins; together with the SameSite cookie this blocks cross-site
 * request forgery.
 */
export async function requireApiEditor(
  request: Request,
  opts: { admin?: boolean } = {},
): Promise<Editor> {
  if (request.method !== "GET" && request.method !== "HEAD") {
    if (!isAllowedOrigin(request.headers.get("origin"))) {
      throw new ApiError(403, "Request origin not allowed.");
    }
  }
  const editor = await getCurrentEditor();
  if (!editor) throw new ApiError(401, "Sign in again to continue.");
  if (opts.admin && !editor.is_admin) {
    throw new ApiError(403, "Only admins can do that.");
  }
  return editor;
}

/** Wraps a route handler so ApiErrors become JSON responses. */
export function handle<A extends unknown[]>(
  fn: (...args: A) => Promise<Response>,
) {
  return async (...args: A): Promise<Response> => {
    try {
      return await fn(...args);
    } catch (error) {
      if (error instanceof ApiError) {
        return Response.json({ error: error.message }, { status: error.status });
      }
      console.error("[portal]", error);
      return Response.json(
        { error: "Something went wrong. Try again." },
        { status: 500 },
      );
    }
  };
}

// ---- Invites and password resets ----------------------------------------

/** Returns a single-use token for /portal/set-password. */
export function createPasswordToken(editorId: number): string {
  const token = newToken();
  run(
    `INSERT INTO password_tokens (token_hash, editor_id, created_at, expires_at)
     VALUES (:tokenHash, :editorId, :createdAt, :expiresAt)`,
    {
      tokenHash: sha256(token),
      editorId,
      createdAt: now(),
      expiresAt: hoursFromNow(INVITE_HOURS),
    },
  );
  return token;
}

export function findPasswordToken(token: string): Editor | undefined {
  return get<Editor>(
    `SELECT editors.* FROM password_tokens
       JOIN editors ON editors.id = password_tokens.editor_id
      WHERE password_tokens.token_hash = :tokenHash
        AND password_tokens.used_at IS NULL
        AND password_tokens.expires_at > :now
        AND editors.disabled = 0`,
    { tokenHash: sha256(token), now: now() },
  );
}

export function consumePasswordToken(token: string, password: string) {
  const editor = findPasswordToken(token);
  if (!editor) return null;
  run("UPDATE password_tokens SET used_at = :now WHERE token_hash = :tokenHash", {
    now: now(),
    tokenHash: sha256(token),
  });
  run("UPDATE editors SET password_hash = :hash WHERE id = :id", {
    hash: hashPassword(password),
    id: editor.id,
  });
  // A new password signs out every other session.
  run("DELETE FROM sessions WHERE editor_id = :id", { id: editor.id });
  return editor;
}

// ---- Login throttling ----------------------------------------------------

const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60_000;

export function loginThrottled(key: string): boolean {
  const entry = attempts.get(key);
  return !!entry && entry.resetAt > Date.now() && entry.count >= MAX_ATTEMPTS;
}

export function recordFailedLogin(key: string) {
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < Date.now()) {
    attempts.set(key, { count: 1, resetAt: Date.now() + WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

export function clearFailedLogins(key: string) {
  attempts.delete(key);
}
