import { ApiError, handle, requireApiEditor } from "@/lib/portal/auth";
import { syncInbox } from "@/lib/portal/inbox";
import { zohoConfigured } from "@/lib/portal/zoho";

export const runtime = "nodejs";

export const POST = handle(async (request: Request) => {
  await requireApiEditor(request);
  if (!zohoConfigured()) throw new ApiError(400, "The inbox connection is not set up on this server.");
  try {
    return Response.json(await syncInbox());
  } catch (error) {
    console.error("[portal] inbox sync failed", error);
    throw new ApiError(502, error instanceof Error ? error.message : "Inbox sync failed.");
  }
});
