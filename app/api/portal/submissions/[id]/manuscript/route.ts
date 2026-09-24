import fs from "node:fs";
import path from "node:path";
import { ApiError, handle, requireApiEditor } from "@/lib/portal/auth";
import { getSubmission, MANUSCRIPT_DIR } from "@/lib/portal/db";

export const runtime = "nodejs";

const CONTENT_TYPES: Record<string, string> = {
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".doc": "application/msword",
  ".pdf": "application/pdf",
};

export const GET = handle(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    await requireApiEditor(request);
    const submission = getSubmission(Number((await params).id));
    if (!submission?.manuscript_file) {
      throw new ApiError(404, "No manuscript file is stored for this submission.");
    }
    const filePath = path.resolve(MANUSCRIPT_DIR, submission.manuscript_file);
    if (!filePath.startsWith(MANUSCRIPT_DIR + path.sep) || !fs.existsSync(filePath)) {
      throw new ApiError(404, "The manuscript file is missing.");
    }
    const name = submission.manuscript_name ?? path.basename(filePath);
    const asciiName = name.replace(/[^\x20-\x7e]/g, "_").replace(/"/g, "'");
    return new Response(fs.readFileSync(filePath), {
      headers: {
        "Content-Type": CONTENT_TYPES[path.extname(name).toLowerCase()] ?? "application/octet-stream",
        "Content-Disposition": `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(name)}`,
        "Cache-Control": "private, no-store",
      },
    });
  },
);
