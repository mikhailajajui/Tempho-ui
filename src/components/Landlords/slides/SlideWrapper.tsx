"use client";

import type { ReactNode, RefCallback } from "react";
import clsx from "clsx";

type SlideWrapperProps = {
  children: ReactNode;
  className?: string;
  backgroundClassName?: string;
  isActive: boolean;
  sectionRef?: RefCallback<HTMLElement>;
};

export function SlideWrapper({
  children,
  className,
  backgroundClassName,
  isActive,
  sectionRef,
}: SlideWrapperProps) {
  return (
    <section
      ref={sectionRef}
      className={clsx(
        "relative flex items-center overflow-hidden bg-white",
        "transition-opacity duration-[350ms] ease-out",
        isActive ? "opacity-100" : "opacity-[0.72]",
        backgroundClassName,
        className,
      )}
      data-active={isActive ? "true" : "false"}
    >
      {children}
    </section>
  );
}
