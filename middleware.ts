import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const allowedOriginsProd = new Set([
  "https://young-innovator.org",
  "https://www.young-innovator.org",
  "https://young-innovator.com",
  "https://www.young-innovator.com",
]);

const allowedOriginsDev = new Set([
  ...allowedOriginsProd,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

function isAllowedOrigin(origin: string | null): boolean {
  const allowed =
    process.env.NODE_ENV === "production"
      ? allowedOriginsProd
      : allowedOriginsDev;
  return !!origin && allowed.has(origin);
}

export function middleware(req: NextRequest) {
  const userAgent = req.headers.get("user-agent") ?? "";
  if (/\bRCE-Injector\b/i.test(userAgent)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const pathname = req.nextUrl.pathname;

  // Block common secret paths that scanners probe for.
  if (
    pathname === "/.aws/credentials" ||
    pathname.startsWith("/.git") ||
    pathname === "/.env" ||
    pathname.startsWith("/.well-known/security.txt")
  ) {
    return new NextResponse("Not found", { status: 404 });
  }

  const nextAction = req.headers.get("next-action");
  // Hard block Server Actions. This site should not accept Next.js Server Actions from the public internet.
  if (nextAction) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
