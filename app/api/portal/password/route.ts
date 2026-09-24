import { isAllowedOrigin } from "@/lib/origins";
import {
  consumePasswordToken,
  handle,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  startSession,
} from "@/lib/portal/auth";

export const runtime = "nodejs";

export const POST = handle(async (request: Request) => {
  if (!isAllowedOrigin(request.headers.get("origin"))) {
    return Response.json({ error: "Request origin not allowed." }, { status: 403 });
  }
  const { token, password } = (await request.json().catch(() => ({}))) as {
    token?: string;
    password?: string;
  };
  if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
    return Response.json(
      { error: `Use at least ${MIN_PASSWORD_LENGTH} characters.` },
      { status: 400 },
    );
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return Response.json({ error: `Use at most ${MAX_PASSWORD_LENGTH} characters.` }, { status: 400 });
  }
  const editor = typeof token === "string" && token ? consumePasswordToken(token, password) : null;
  if (!editor) {
    return Response.json(
      { error: "This link has expired or was already used. Ask an admin for a new one." },
      { status: 400 },
    );
  }
  await startSession(editor.id);
  return Response.json({ ok: true });
});
