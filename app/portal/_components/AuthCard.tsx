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
    <div className="flex min-h-screen flex-col items-center justify-center bg-primary px-4 pb-24 pt-16 text-white">
      <img src="/logolight.png" alt="The Journal of Young Innovators" className="mb-8 h-12 w-auto" />
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
        Editor Portal
      </p>
      <h1 className="mt-2 text-center font-display text-4xl font-normal md:text-5xl">{title}</h1>
      {subtitle && (
        <p className="mt-3 max-w-[44ch] text-center font-text text-sm text-white/80">{subtitle}</p>
      )}
      <div className="mt-8 w-full max-w-sm">{children}</div>
    </div>
  );
}
