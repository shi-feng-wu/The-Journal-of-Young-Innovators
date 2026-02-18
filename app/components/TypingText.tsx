"use client";

import { useEffect, useState } from "react";

type TypingTextProps = {
  text: string;
  speed?: number;
  className?: string;
  startDelay?: number;
  cursor?: boolean;
  cursorClassName?: string;
  loop?: boolean;
  pauseBeforeRestart?: number;
};

export default function TypingText({
  text,
  speed = 60,
  className,
  startDelay = 0,
  cursor = true,
  cursorClassName,
  loop = false,
  pauseBeforeRestart = 1200,
}: TypingTextProps) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let index = 0;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const startTyping = () => {
      intervalId = setInterval(() => {
        index += 1;
        setDisplayed(text.slice(0, index));

        if (index >= text.length) {
          if (intervalId) clearInterval(intervalId);

          if (loop) {
            timeoutId = setTimeout(() => {
              index = 0;
              setDisplayed("");
              startTyping();
            }, pauseBeforeRestart);
          }
        }
      }, speed);
    };

    timeoutId = setTimeout(startTyping, startDelay);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, speed, startDelay, loop, pauseBeforeRestart]);

  return (
    <span className={className}>
      {displayed}
      {cursor ? <span className={cursorClassName}>|</span> : null}
    </span>
  );
}
