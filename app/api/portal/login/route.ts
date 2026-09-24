import { isAllowedOrigin } from "@/lib/origins";
import {
  clearFailedLogins,
  handle,
  loginThrottled,
  recordFailedLogin,
  startSession,
  verifyPassword,
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
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const key = `${ip}|${(email ?? "").toLowerCase()}`;

  if (loginThrottled(key)) {
    return Response.json(
      { error: "Too many attempts. Wait 15 minutes and try again." },
      { status: 429 },
    );
  }

  const editor =
    email && password
      ? get<Editor>(
          "SELECT * FROM editors WHERE email = :email AND disabled = 0",
          { email: email.trim() },
        )
      : undefined;

  if (!editor?.password_hash || !verifyPassword(password!, editor.password_hash)) {
    recordFailedLogin(key);
    return Response.json(
      { error: "That email and password do not match an editor account." },
      { status: 401 },
    );
  }

  clearFailedLogins(key);
  await startSession(editor.id);
  return Response.json({ ok: true });
});
