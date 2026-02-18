"use client";

import Wave from "react-wavify";
import { useEffect, useState } from "react";
import Navigation from "./Navigation";

interface HeroProps {
  title?: string;
  subtitle?: string;
  additionalContent?: React.ReactNode;
  titleClassName?: string; // allows per-page font/style overrides for the main title
  subtitleClassName?: string; // allows per-page font/style overrides for the subtitle
  sectionClassName?: string; // allows per-page layout overrides for the section wrapper
  contentClassName?: string; // allows per-page layout overrides for the inner container
  waterEffect?: boolean;
  showWave?: boolean;
  animate?: boolean;
  delay?: boolean;
}

export default function Hero({
  title,
  subtitle,
  additionalContent,
  titleClassName = "hero-text",
  subtitleClassName = "text-xl hero-text",
  sectionClassName = "text-center",
  contentClassName = "text-center",
  showWave = true,
  animate = false,
  delay = false,
}: HeroProps) {
  const [wavePaused, setWavePaused] = useState(true);
  const [waveAmplitude, setWaveAmplitude] = useState(0);

  useEffect(() => {
    const delayMs = delay ? 1600 : 0;
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
  }, []);

  return (
    <section
      className={`relative bg-primary text-white pb-10 mb-40 items-center flex flex-col ${sectionClassName} ${
        animate ? "hero-animate" : "h-120"
      }`}
    >
      <div className="absolute inset-x-0 top-0 z-20 w-full">
        <Navigation delay={delay} />
      </div>
      <div
        className={`relative h-full pt-16 flex flex-col items-center justify-center z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-20 ${contentClassName}`}
      >
        <h1
          className={`text-5xl md:text-6xl mb-6 font-normal font-display ${titleClassName}`}
        >
          {title}
        </h1>
        <h3 className={`mb-12 font-mono font-normal ${subtitleClassName}`}>
          {subtitle}
        </h3>
        {additionalContent ? (
          <div className="hero-text">{additionalContent}</div>
        ) : null}
      </div>
      {showWave && (
        <div className="absolute left-0 right-0 top-full h-32 pointer-events-none">
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
        </div>
      )}
    </section>
  );
}
