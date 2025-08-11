"use client";

import { ReactNode, useEffect, useState } from "react";

export interface ContentSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
  id?: string;
  noPadding?: boolean;
}

export interface TableOfContentsSection {
  id: string;
  title: string;
}

export interface TableOfContentsProps {
  sections: TableOfContentsSection[];
  title?: string;
  stickyPosition?: string;
  className?: string;
}

export function ContentSection({
  title,
  children,
  className = "",
  id,
  noPadding = false,
}: ContentSectionProps) {
  const sectionId =
    id ||
    title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
      .replace(/-+/g, "-") // Replace multiple consecutive dashes with single dash
      .replace(/^-|-$/g, ""); // Remove leading/trailing dashes

  return (
    <section
      id={sectionId}
      className={`pb-10 ${noPadding ? "" : "pt-10"} ${className}`}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-20">
        <h2 className="text-2xl md:text-4xl mb-6">{title}</h2>
        <div className="space-y-8 [&_p]:text-sm [&_p]:md:text-md [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:text-sm [&_ul]:md:text-md">
          {children}
        </div>
      </div>
    </section>
  );
}

export function TableOfContents({
  sections,
  title = "Table of Contents",
  stickyPosition = "top-[30%]",
  className = "",
}: TableOfContentsProps) {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Get all currently intersecting entries
        const intersectingEntries = entries.filter(
          (entry) => entry.isIntersecting
        );

        if (intersectingEntries.length > 0) {
          // Sort by their position in the document (top to bottom)
          intersectingEntries.sort((a, b) => {
            const aRect = a.target.getBoundingClientRect();
            const bRect = b.target.getBoundingClientRect();
            return aRect.top - bRect.top;
          });

          // Get the first (topmost) intersecting section
          const topSection = intersectingEntries[0];
          setActiveSection(topSection.target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.pageYOffset;
      const viewportHeight = window.innerHeight;
      // Scroll to position where element will be 20% from top (matching rootMargin)
      const scrollToPosition = absoluteElementTop - viewportHeight * 0.2;

      window.scrollTo({
        top: scrollToPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={`sticky ${stickyPosition} rounded-lg ${className}`}>
      <h3 className="text-2xl text-black mb-4">{title}</h3>
      <nav className="space-y-2">
        {sections.map(({ id, title }) => (
          <button
            key={id}
            onClick={() => scrollToSection(id)}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
              activeSection === id
                ? "bg-primary text-white"
                : "text-gray hover:bg-gray-100"
            }`}
          >
            {title}
          </button>
        ))}
      </nav>
    </div>
  );
}
