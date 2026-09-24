import { isAllowedOrigin } from "@/lib/origins";
import {
  clearFailedLogins,
  handle,
  loginThrottled,
  MAX_PASSWORD_LENGTH,
  recordFailedLogin,
  startSession,
  verifyPasswordOrDummy,
} from "@/lib/portal/auth";
import { get, type Editor } from "@/lib/portal/db";

export const runtime = "nodejs";

export const POST = handle(async (request: Request) => {
  if (!isAllowedOrigin(request.headers.get("origin"))) {
    return Response.json({ error: "Request origin not allowed." }, { status: 403 });
  }
  const { email, password } = (await request.json().catch(() => ({}))) as {
    email?: string;
    password?: string;
  };
  // Caddy replaces any client-sent X-Forwarded-For, and the app only listens
  // on localhost, so this is the real client address.
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const emailKey = typeof email === "string" ? email : "";

  if (loginThrottled(ip, emailKey)) {
    return Response.json(
      { error: "Too many attempts. Wait 15 minutes and try again." },
      { status: 429 },
    );
  }

  const valid =
    typeof email === "string" &&
    typeof password === "string" &&
    email.length <= 320 &&
    password.length > 0 &&
    password.length <= MAX_PASSWORD_LENGTH;
  const editor = valid
    ? get<Editor>("SELECT * FROM editors WHERE email = :email AND disabled = 0", { email: email.trim() })
    : undefined;

  if (!valid || !verifyPasswordOrDummy(password, editor?.password_hash) || !editor) {
    recordFailedLogin(ip, emailKey);
    return Response.json(
      { error: "That email and password do not match an editor account." },
      { status: 401 },
    );
  }

  clearFailedLogins(ip, emailKey);
  await startSession(editor.id);
  return Response.json({ ok: true });
});
