"use client";

import { useEffect, useRef, type ReactNode } from "react";
import clsx from "clsx";
import { useScrollSnap } from "./ScrollSnapContainer";

type ScrollSnapSectionProps = {
  index: number;
  children: ReactNode;
  className?: string;
  background?: string;
};

export function ScrollSnapSection({
  index,
  children,
  className,
  background,
}: ScrollSnapSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { activeIndex, registerSection, unregisterSection } = useScrollSnap();
  const isActive = activeIndex === index;

  useEffect(() => {
    const element = ref.current;
    if (element) {
      registerSection(index, element);
      return () => unregisterSection(index);
    }
  }, [index, registerSection, unregisterSection]);

  return (
    <section
      ref={ref}
      className={clsx(
        "relative flex min-h-dvh w-full items-center",
        "transition-opacity duration-300 ease-out",
        isActive ? "opacity-100" : "opacity-80",
        background,
        className
      )}
      style={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}
      data-section-index={index}
      data-active={isActive}
    >
      {children}
    </section>
  );
}
