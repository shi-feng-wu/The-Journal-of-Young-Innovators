import { endSession, handle } from "@/lib/portal/auth";

export const runtime = "nodejs";

export const POST = handle(async () => {
  await endSession();
  return Response.json({ ok: true });
});
