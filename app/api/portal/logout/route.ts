import { isAllowedOrigin } from "@/lib/origins";
import { endSession, handle } from "@/lib/portal/auth";

export const runtime = "nodejs";

export const POST = handle(async (request: Request) => {
  if (!isAllowedOrigin(request.headers.get("origin"))) {
    return Response.json({ error: "Request origin not allowed." }, { status: 403 });
  }
  await endSession();
  return Response.json({ ok: true });
});
