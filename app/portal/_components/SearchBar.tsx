import Link from "next/link";

/**
 * Search field drawn like the site's buttons: one navy-bordered bar with the
 * submit button set inside it. Works without JavaScript (a plain GET form).
 */
export default function SearchBar({
  action,
  label,
  placeholder,
  defaultValue = "",
  hidden = {},
  clearHref,
}: {
  action: string;
  label: string;
  placeholder: string;
  defaultValue?: string;
  /** Other filters to keep when searching. */
  hidden?: Record<string, string | undefined>;
  /** Where "Clear" goes when a search is active. */
  clearHref?: string;
}) {
  return (
    <form
      action={action}
      role="search"
      className="flex h-12 items-stretch rounded-lg border-2 border-primary bg-white/70 transition-shadow focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(0,45,114,0.12)] sm:h-14"
    >
      {Object.entries(hidden).map(([name, value]) =>
        value ? <input key={name} type="hidden" name={name} value={value} /> : null,
      )}
      <svg
        viewBox="0 0 20 20"
        className="ml-4 h-[18px] w-[18px] shrink-0 self-center text-primary"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <circle cx="8.5" cy="8.5" r="5.75" />
        <path d="M13 13l4.5 4.5" strokeLinecap="round" />
      </svg>
      <label className="sr-only" htmlFor="portal-search">
        {label}
      </label>
      <input
        id="portal-search"
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent px-3 font-text text-base text-[#111] placeholder:font-mono placeholder:text-[11px] placeholder:uppercase placeholder:tracking-[0.18em] placeholder:text-[#111]/45 focus:outline-none sm:text-[17px] sm:placeholder:text-xs [&::-webkit-search-cancel-button]:hidden"
      />
      {defaultValue && clearHref && (
        <Link
          href={clearHref}
          className="self-center px-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/70 hover:text-primary"
        >
          Clear
        </Link>
      )}
      <button
        type="submit"
        className="m-1 cursor-pointer rounded-md bg-primary px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#003a92] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary sm:px-8 sm:text-xs"
      >
        Search
      </button>
    </form>
  );
}
