"use client";

import type { RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

type ContainerRef = RefObject<HTMLDivElement | null>;
type SlideRef = HTMLElement | null;

// Phases: -1 = video hero, 0+ = slide index
const VIDEO_PHASE = -1;

export function useScrollPresentation(
  containerRef: ContainerRef,
  slideRefs: RefObject<SlideRef[]>,
) {
  const [isVideoMinimized, setIsVideoMinimized] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const currentPhase = useRef(VIDEO_PHASE);
  const isScrolling = useRef(false);
  const touchStartY = useRef(0);
  const lastWheelTime = useRef(0);

  const getTotalPhases = useCallback(() => {
    return slideRefs.current.length;
  }, [slideRefs]);

  const scrollToPhase = useCallback((phase: number) => {
    const slides = slideRefs.current;
    const totalSlides = slides.length;

    // Clamp phase to valid range
    const targetPhase = Math.max(VIDEO_PHASE, Math.min(phase, totalSlides - 1));

    if (targetPhase === currentPhase.current) return;

    isScrolling.current = true;
    currentPhase.current = targetPhase;

    // Video hero phase
    if (targetPhase === VIDEO_PHASE) {
      setIsVideoMinimized(false);
      setActiveSlide(0);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Slide phases
      setIsVideoMinimized(true);
      setActiveSlide(targetPhase);

      const targetSlide = slides[targetPhase];
      if (targetSlide) {
        targetSlide.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    // Reset scrolling lock after animation
    setTimeout(() => {
      isScrolling.current = false;
    }, 800);
  }, [slideRefs]);

  const handleScrollIntent = useCallback((direction: "up" | "down") => {
    if (isScrolling.current) return;

    const nextPhase = direction === "down"
      ? currentPhase.current + 1
      : currentPhase.current - 1;

    scrollToPhase(nextPhase);
  }, [scrollToPhase]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Wheel event handler with debounce
    const onWheel = (e: WheelEvent) => {
      const now = Date.now();
      const timeSinceLastWheel = now - lastWheelTime.current;

      // Debounce rapid wheel events (trackpad momentum, etc.)
      if (timeSinceLastWheel < 100) return;
      lastWheelTime.current = now;

      // Only handle significant scroll deltas
      if (Math.abs(e.deltaY) < 30) return;

      e.preventDefault();
      handleScrollIntent(e.deltaY > 0 ? "down" : "up");
    };

    // Touch event handlers for mobile
    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (isScrolling.current) return;

      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY.current - touchEndY;

      // Require minimum swipe distance
      if (Math.abs(deltaY) < 50) return;

      handleScrollIntent(deltaY > 0 ? "down" : "up");
    };

    // Keyboard navigation
    const onKeyDown = (e: KeyboardEvent) => {
      if (isScrolling.current) return;

      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        handleScrollIntent("down");
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        handleScrollIntent("up");
      }
    };

    // Use capture phase and prevent default for wheel
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [containerRef, handleScrollIntent, getTotalPhases]);

  return { activeSlide, isVideoMinimized, scrollToPhase };
}
