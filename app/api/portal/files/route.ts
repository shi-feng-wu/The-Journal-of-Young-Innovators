import fs from "node:fs";
import path from "node:path";
import { ApiError, handle, requireApiEditor } from "@/lib/portal/auth";
import { MANUSCRIPT_DIR } from "@/lib/portal/db";

export const runtime = "nodejs";

const TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".doc": "application/msword",
};

// Types a browser can show safely in place; everything else downloads.
const INLINE = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".pdf"]);

/** Serves a stored email attachment: ?path=<ref>/<...>/<name> */
export const GET = handle(async (request: Request) => {
  await requireApiEditor(request);
  const rel = new URL(request.url).searchParams.get("path") ?? "";
  const file = path.resolve(MANUSCRIPT_DIR, rel);
  if (!file.startsWith(MANUSCRIPT_DIR + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    throw new ApiError(404, "File not found.");
  }
  const ext = path.extname(file).toLowerCase();
  const name = encodeURIComponent(path.basename(file));
  return new Response(fs.readFileSync(file), {
    headers: {
      "Content-Type": TYPES[ext] ?? "application/octet-stream",
      "Content-Disposition": `${INLINE.has(ext) ? "inline" : "attachment"}; filename*=UTF-8''${name}`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
});
