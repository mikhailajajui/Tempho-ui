"use client";

import clsx from "clsx";
import { useScrollSnap } from "./ScrollSnapContainer";

type NavigationDotsProps = {
  labels?: string[];
  show?: boolean;
};

export function NavigationDots({ labels = [], show = true }: NavigationDotsProps) {
  const { activeIndex, totalSections, scrollToSection } = useScrollSnap();

  if (!show || totalSections === 0) return null;

  return (
    <nav
      className={clsx(
        "fixed right-6 top-1/2 z-[60] flex -translate-y-1/2 flex-col gap-3",
        "max-[768px]:bottom-3 max-[768px]:left-3 max-[768px]:right-auto max-[768px]:top-auto",
        "max-[768px]:translate-x-0 max-[768px]:translate-y-0 max-[768px]:flex-col max-[768px]:gap-2"
      )}
      aria-label="Section navigation"
    >
      {Array.from({ length: totalSections }, (_, i) => (
        <button
          key={i}
          onClick={() => scrollToSection(i)}
          className={clsx(
            "group relative h-3 w-3 rounded-full border-2 transition-all duration-300",
            activeIndex === i
              ? "scale-125 border-[#ffd55a] bg-[#ffd55a]"
              : "border-slate-300 bg-white hover:border-[#ffd55a] hover:bg-[#ffd55a]/20"
          )}
          aria-label={labels[i] || `Section ${i + 1}`}
          aria-current={activeIndex === i ? "true" : undefined}
        >
          {labels[i] && (
            <span
              className={clsx(
                "absolute left-full ml-3 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-xs text-white",
                "opacity-0 transition-opacity group-hover:opacity-100",
                "max-[768px]:left-full max-[768px]:ml-3"
              )}
            >
              {labels[i]}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
}
