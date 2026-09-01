"use client";

import { useEffect, useState, type ComponentType } from "react";
import Navigation from "./Navigation";

type WaveComponent = ComponentType<{
  className?: string;
  fill?: string;
  paused?: boolean;
  options?: {
    height?: number;
    amplitude?: number;
    speed?: number;
    points?: number;
  };
}>;

interface HeroProps {
  title?: string;
  subtitle?: string;
  additionalContent?: React.ReactNode;
  /** "cover": the full-height hero with the wave (home page).
      "masthead": the compact left-aligned running-head band (default). */
  variant?: "cover" | "masthead";
  titleClassName?: string; // per-page font/style overrides for the main title
  sectionClassName?: string; // per-page layout overrides for the section wrapper
  contentClassName?: string; // per-page layout overrides for the inner container
  delay?: boolean;
}

export default function Hero({
  title,
  subtitle,
  additionalContent,
  variant = "masthead",
  titleClassName = "hero-text",
  sectionClassName = "",
  contentClassName = "",
  delay = false,
}: HeroProps) {
  const isCover = variant === "cover";
  const [Wave, setWave] = useState<WaveComponent | null>(null);
  const [wavePaused, setWavePaused] = useState(true);
  const [waveAmplitude, setWaveAmplitude] = useState(0);
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  useEffect(() => {
    if (!isCover) return;
    let mounted = true;
    import("react-wavify").then((mod) => {
      if (mounted) setWave(() => mod.default as WaveComponent);
    });
    return () => {
      mounted = false;
    };
  }, [isCover]);

  useEffect(() => {
    if (!Wave) return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setShowPlaceholder(false));
    });
    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, [Wave]);

  useEffect(() => {
    if (!Wave) return;
    const delayMs = delay ? 600 : 0;
    const durationMs = 1600;
    const targetAmplitude = 28;
    let rafId: number;

    const timerId = window.setTimeout(() => {
      setWavePaused(false);
      const start = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - start) / durationMs, 1);
        setWaveAmplitude(targetAmplitude * progress);
        if (progress < 1) {
          rafId = requestAnimationFrame(tick);
        }
      };

      rafId = requestAnimationFrame(tick);
    }, delayMs);

    return () => {
      window.clearTimeout(timerId);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [Wave, delay]);

  if (!isCover) {
    // Running-head masthead: the cover keeps the wave; interior pages get a
    // flat band with a left-aligned title and standfirst.
    return (
      <section className={`bg-primary text-white ${sectionClassName}`}>
        <Navigation />
        <div className="border-t border-white/15">
          <div
            className={`max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-20 pt-6 pb-8 lg:pt-8 lg:pb-10 flex flex-col gap-2.5 text-left ${contentClassName}`}
          >
            {title ? (
              <h1
                className={`font-display font-normal text-4xl lg:text-[44px] leading-[1.1] ${titleClassName}`}
              >
                {title}
              </h1>
            ) : null}
            {subtitle ? (
              <p className="font-text text-base lg:text-[17px] leading-normal text-white/85 max-w-[640px]">
                {subtitle}
              </p>
            ) : null}
            {additionalContent ? (
              <div className="w-full">{additionalContent}</div>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`relative bg-primary text-white flex flex-col mb-40 h-auto min-h-[480px] md:min-h-[560px] ${sectionClassName}`}
    >
      <div className="relative z-20 w-full">
        <Navigation />
      </div>
      {/* Cover composition: the title block anchors bottom-left above the
          wave, like a print cover's title plate. */}
      <div
        className={`relative w-full flex-1 flex flex-col justify-end items-start text-left z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-20 pb-10 lg:pb-12 gap-3.5 lg:gap-5 ${contentClassName}`}
      >
        {subtitle ? (
          <p className="hero-text font-mono font-medium text-[11px] uppercase tracking-[0.3em] lg:text-[13px] lg:tracking-[0.35em] text-white/85">
            {subtitle}
          </p>
        ) : null}
        {title ? (
          <h1
            className={`font-normal font-display text-[40px] leading-[1.06] md:text-6xl md:leading-[1.04] xl:text-[80px] xl:leading-[1.02] ${titleClassName}`}
          >
            {title}
          </h1>
        ) : null}
        {additionalContent ? (
          <div className="hero-text w-full">{additionalContent}</div>
        ) : null}
      </div>
      <div className="absolute left-0 right-0 top-full h-32 pointer-events-none">
        {showPlaceholder && (
          <div
            className="absolute inset-x-0 top-0 bg-[#002d72]"
            style={{ height: "calc(100% - 20px)" }}
          />
        )}
        {Wave && (
          <Wave
            className="w-full h-full transform -scale-y-100"
            fill="#002d72"
            paused={wavePaused}
            options={{
              height: 20,
              amplitude: waveAmplitude,
              speed: 0.1,
              points: 4,
            }}
          />
        )}
      </div>
    </section>
  );
}
