"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { FaCaretUp } from "react-icons/fa";
import { usePathname } from "next/navigation";

export default function BackToTop() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const isBlueHeroPage = pathname === "/form";

  useEffect(() => {
    const update = () => setVisible(window.scrollY > 300);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Button
      type="button"
      isIconOnly
      onPress={handleClick}
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-6 right-6 z-50 rounded-full border shadow-lg transition-all duration-300 ease-out ${
        isBlueHeroPage
          ? "border-white/40 bg-white/95 text-primary hover:bg-white"
          : "border-primary/30 bg-primary/90 text-white hover:bg-primary"
      } ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2 pointer-events-none"
      }`}
    >
      <FaCaretUp size={22} className="mb-1" />
    </Button>
  );
}
