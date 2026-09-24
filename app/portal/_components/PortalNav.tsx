"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/portal", label: "Submissions", match: ["/portal", "/portal/submissions"] },
  { href: "/portal/authors", label: "Authors", match: ["/portal/authors"] },
  { href: "/portal/payments", label: "Payments", match: ["/portal/payments"] },
];

export default function PortalNav({
  editorName,
  isAdmin,
}: {
  editorName: string;
  isAdmin: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const links = isAdmin
    ? [...LINKS, { href: "/portal/editors", label: "Editors", match: ["/portal/editors"] }]
    : LINKS;

  const isActive = (match: string[]) =>
    match.some((m) =>
      m === "/portal" ? pathname === "/portal" : pathname.startsWith(m),
    );

  const signOut = async () => {
    setSigningOut(true);
    await fetch("/api/portal/logout", { method: "POST" }).catch(() => null);
    router.replace("/portal/login");
    router.refresh();
  };

  return (
    <header className="border-b border-white/15">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6 lg:px-20">
        <Link href="/portal" className="flex items-center gap-3 py-1">
          <img src="/logolight.png" alt="" className="h-9 w-auto" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
            Editor Portal
          </span>
        </Link>
        <nav
          aria-label="Portal"
          className="order-3 -mx-2 flex w-full gap-1 overflow-x-auto sm:order-none sm:w-auto"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.match) ? "page" : undefined}
              className={`whitespace-nowrap rounded-md px-3 py-2 font-mono text-[13px] font-semibold transition-colors ${
                isActive(link.match)
                  ? "bg-white text-primary"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3 font-mono text-xs text-white/70">
          <span className="hidden md:inline">{editorName}</span>
          <button
            type="button"
            onClick={signOut}
            disabled={signingOut}
            className="rounded-md px-2 py-1.5 uppercase tracking-[0.16em] text-white underline-offset-4 hover:underline cursor-pointer disabled:opacity-50"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
