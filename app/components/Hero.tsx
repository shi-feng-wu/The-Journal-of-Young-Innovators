interface HeroProps {
  title?: string;
  subtitle?: string;
  additionalContent?: React.ReactNode;
  titleClassName?: string; // allows per-page font/style overrides for the main title
  subtitleClassName?: string; // allows per-page font/style overrides for the subtitle
}

export default function Hero({
  title,
  subtitle,
  additionalContent,
  titleClassName = "",
  subtitleClassName = "",
}: HeroProps) {
  return (
    <section className="bg-primary text-white pb-20 pt-30 font-kenao">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-20 py-20">
        <div className="">
          <h1 className={`text-4xl md:text-6xl mb-6 ${titleClassName}`}>
            {title}
          </h1>
          <h3 className={`mb-12 ${subtitleClassName}`}>{subtitle}</h3>

          {additionalContent}
        </div>
      </div>
    </section>
  );
}
