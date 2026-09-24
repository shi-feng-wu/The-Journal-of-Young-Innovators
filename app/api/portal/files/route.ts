import fs from "node:fs";
import path from "node:path";
import { ApiError, handle, requireApiEditor } from "@/lib/portal/auth";
import { MANUSCRIPT_DIR } from "@/lib/portal/db";

export const runtime = "nodejs";

/** Serves a filed attachment: ?path=<ref>/replies/<id>/<name> */
export const GET = handle(async (request: Request) => {
  await requireApiEditor(request);
  const rel = new URL(request.url).searchParams.get("path") ?? "";
  const file = path.resolve(MANUSCRIPT_DIR, rel);
  if (!file.startsWith(MANUSCRIPT_DIR + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    throw new ApiError(404, "File not found.");
  }
  return new Response(fs.readFileSync(file), {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(path.basename(file))}`,
      "Cache-Control": "private, no-store",
    },
  });
});
