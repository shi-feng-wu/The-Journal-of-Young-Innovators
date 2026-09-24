import Link from "next/link";

/** Sign-in screens: the site's navy ground, the logo, one short form. */
export default function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-primary text-white">
      <header className="mx-auto flex h-16 w-full max-w-[1400px] items-center px-4 sm:px-6 lg:px-20">
        <Link href="/" className="-ml-2 rounded-md px-2 py-1" aria-label="The Journal of Young Innovators home">
          <img src="/logolight.png" alt="" className="h-10 w-auto" />
        </Link>
      </header>
      <div className="flex flex-1 items-center border-t border-white/15 px-4 pt-12 pb-32 sm:px-6">
        <div className="mx-auto w-full max-w-[400px]">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/70">Editor Portal</p>
          <h1 className="mt-3 font-display text-[44px] font-normal leading-[1.05] lg:text-[56px]">{title}</h1>
          {subtitle && <p className="mt-4 font-text text-base leading-relaxed text-pretty text-white/80">{subtitle}</p>}
          <div className="mt-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
