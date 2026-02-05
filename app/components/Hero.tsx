"use client";

import dynamic from "next/dynamic";
import Wave from "react-wavify";
import { useEffect, useState } from "react";

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
}

export default function Hero({
  title,
  subtitle,
  additionalContent,
  titleClassName = "",
  subtitleClassName = "",
  sectionClassName = "",
  contentClassName = "",
  waterEffect = false,
  showWave = false,
}: HeroProps) {
  const [wavePaused, setWavePaused] = useState(true);
  const [waveAmplitude, setWaveAmplitude] = useState(0);

  useEffect(() => {
    const delayMs = 1600;
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
      className={`relative bg-primary text-white pt-10 pb-20 overflow-hidden ${sectionClassName}`}
    >
      <div
        className={`relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-20 pt-25 ${contentClassName}`}
      >
        <div className="">
          <h1 className={`text-4xl md:text-6xl mb-6 font-normal font-kenao ${titleClassName}`}>
            {title}
          </h1>
          <h3 className={`mb-12 font-roboto-mono font-normal ${subtitleClassName}`}>{subtitle}</h3>

          {additionalContent}
        </div>
      </div>
      {showWave && (
        <div className="absolute left-0 right-0 -bottom-8 h-32 pointer-events-none">
          <Wave
            className="w-full h-full transform"
            fill="#F2F3F4"
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
