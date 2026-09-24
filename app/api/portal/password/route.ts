import { isAllowedOrigin } from "@/lib/origins";
import {
  consumePasswordToken,
  handle,
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
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    return Response.json(
      { error: `Use at least ${MIN_PASSWORD_LENGTH} characters.` },
      { status: 400 },
    );
  }
  const editor = token ? consumePasswordToken(token, password) : null;
  if (!editor) {
    return Response.json(
      { error: "This link has expired or was already used. Ask an admin for a new one." },
      { status: 400 },
    );
  }
  await startSession(editor.id);
  return Response.json({ ok: true });
});
