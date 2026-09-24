import { ApiError, handle, requireApiEditor } from "@/lib/portal/auth";
import { stripeSyncEnabled, syncFromStripe } from "@/lib/portal/payments";

export const runtime = "nodejs";

export const POST = handle(async (request: Request) => {
  await requireApiEditor(request);
  if (!stripeSyncEnabled()) {
    throw new ApiError(400, "Stripe sync is not set up on this server.");
  }
  try {
    return Response.json(await syncFromStripe());
  } catch (error) {
    console.error("[portal] stripe sync failed", error);
    throw new ApiError(502, error instanceof Error ? error.message : "Stripe sync failed.");
  }
});
