"use client";

import type { ReactNode, RefCallback } from "react";
import clsx from "clsx";
import { motion } from "motion/react";

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
    <motion.section
      ref={sectionRef}
      className={clsx(
        "relative flex items-center overflow-hidden bg-white",
        backgroundClassName,
        className,
      )}
      initial={{ opacity: 0.65 }}
      animate={{ opacity: isActive ? 1 : 0.72 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      data-active={isActive ? "true" : "false"}
    >
      {children}
    </motion.section>
  );
}
