"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/portal", label: "Submissions", match: (p: string) => p === "/portal" || p.startsWith("/portal/submissions") },
  { href: "/portal/authors", label: "Authors", match: (p: string) => p.startsWith("/portal/authors") },
  { href: "/portal/payments", label: "Payments", match: (p: string) => p.startsWith("/portal/payments") },
];

const EDITORS_LINK = {
  href: "/portal/editors",
  label: "Editors",
  match: (p: string) => p.startsWith("/portal/editors"),
};

// Same bar as the public site's Navigation: logo left, mono links, navy.
export default function PortalNav({ editorName, isAdmin }: { editorName: string; isAdmin: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const links = isAdmin ? [...LINKS, EDITORS_LINK] : LINKS;

  const signOut = async () => {
    setSigningOut(true);
    await fetch("/api/portal/logout", { method: "POST" }).catch(() => null);
    router.replace("/portal/login");
    router.refresh();
  };

  return (
    <header className="bg-primary font-mono font-semibold text-white">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 sm:px-6 lg:px-20">
        <Link href="/portal" className="-ml-2 flex shrink-0 items-center gap-3 rounded-md px-2 py-1" aria-label="Editor portal home">
          <img src="/logolight.png" alt="" className="h-10 w-auto" />
          <span className="hidden border-l border-white/25 pl-3 font-display text-lg font-normal leading-none tracking-normal sm:inline">
            Editor Portal
          </span>
        </Link>
        <nav aria-label="Portal" className="hide-scrollbar ml-auto flex items-center gap-1 overflow-x-auto md:ml-8">
          {links.map((link) => {
            const active = link.match(pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`whitespace-nowrap rounded-md px-2.5 py-2 text-[13px] transition-colors ${
                  active ? "bg-white text-primary" : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden items-center gap-4 text-xs md:ml-auto md:flex">
          <span className="font-normal text-white/65">{editorName}</span>
          <button
            type="button"
            onClick={signOut}
            disabled={signingOut}
            className="cursor-pointer rounded-md px-2.5 py-2 text-[13px] text-white/75 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            Sign out
          </button>
        </div>
      </div>
      {/* Small screens: sign out sits under the bar. */}
      <div className="flex items-center justify-between border-t border-white/15 px-4 py-1.5 text-[11px] md:hidden">
        <span className="font-normal text-white/65">{editorName}</span>
        <button type="button" onClick={signOut} disabled={signingOut} className="cursor-pointer py-1 text-white/80">
          Sign out
        </button>
      </div>
    </header>
  );
}
