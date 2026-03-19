"use client";

import type { RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

type ContainerRef = RefObject<HTMLDivElement | null>;
type SlideRef = HTMLElement | null;

export function useScrollPresentation(
  containerRef: ContainerRef,
  slideRefs: RefObject<SlideRef[]>,
) {
  const [isVideoMinimized, setIsVideoMinimized] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const minimizedRef = useRef(false);
  const activeSlideRef = useRef(0);
  const rafId = useRef(0);

  const update = useCallback(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const triggerPoint = window.innerHeight * 0.6;
    const scrolled = -rect.top;

    const nextMinimized = scrolled > triggerPoint;
    if (nextMinimized !== minimizedRef.current) {
      minimizedRef.current = nextMinimized;
      setIsVideoMinimized(nextMinimized);
    }

    const viewportCenter = window.innerHeight * 0.5;
    let closestIndex = 0;
    let closestDistance = Infinity;

    const slides = slideRefs.current;
    for (let i = 0; i < slides.length; i++) {
      const node = slides[i];
      if (!node) continue;

      const slideRect = node.getBoundingClientRect();
      const distance = Math.abs(
        slideRect.top + slideRect.height / 2 - viewportCenter,
      );

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    }

    if (closestIndex !== activeSlideRef.current) {
      activeSlideRef.current = closestIndex;
      setActiveSlide(closestIndex);
    }
  }, [containerRef, slideRefs]);

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [update]);

  return { activeSlide, isVideoMinimized };
}
