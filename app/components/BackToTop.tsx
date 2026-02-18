"use client";

import { useState } from "react";
import { useLenis } from "lenis/react";
import { Button } from "@heroui/react";
import { FaCaretUp } from "react-icons/fa";
import { usePathname } from "next/navigation";

export default function BackToTop() {
  const lenis = useLenis();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const isBlueHeroPage = pathname === "/form";

  useLenis(({ scroll }) => {
    setVisible(scroll > 300);
  });

  const handleClick = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
      return;
    }
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Button
      type="button"
      isIconOnly
      onPress={handleClick}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-50 rounded-full border text-xs font-mono uppercase tracking-[0.3em] shadow-lg transition-all duration-300 ease-out ${
        isBlueHeroPage
          ? "border-white/40 bg-white/95 text-primary hover:bg-white"
          : "border-primary/30 bg-primary/90 text-white hover:bg-primary"
      } ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
    >
      <FaCaretUp size={22} className="mb-1" />
    </Button>
  );
}
