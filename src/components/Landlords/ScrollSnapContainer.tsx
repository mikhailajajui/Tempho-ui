"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ScrollSnapContextValue = {
  activeIndex: number;
  totalSections: number;
  scrollToSection: (index: number) => void;
  registerSection: (index: number, element: HTMLElement) => void;
  unregisterSection: (index: number) => void;
};

const ScrollSnapContext = createContext<ScrollSnapContextValue | null>(null);

export function useScrollSnap() {
  const context = useContext(ScrollSnapContext);
  if (!context) {
    throw new Error("useScrollSnap must be used within ScrollSnapContainer");
  }
  return context;
}

type ScrollSnapContainerProps = {
  children: ReactNode;
  onActiveChange?: (index: number) => void;
  className?: string;
};

export function ScrollSnapContainer({
  children,
  onActiveChange,
  className,
}: ScrollSnapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<Map<number, HTMLElement>>(new Map());
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalSections, setTotalSections] = useState(0);

  const registerSection = useCallback((index: number, element: HTMLElement) => {
    sectionsRef.current.set(index, element);
    setTotalSections(sectionsRef.current.size);
  }, []);

  const unregisterSection = useCallback((index: number) => {
    sectionsRef.current.delete(index);
    setTotalSections(sectionsRef.current.size);
  }, []);

  const scrollToSection = useCallback((index: number) => {
    const section = sectionsRef.current.get(index);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Detect active section using IntersectionObserver
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  const onActiveChangeRef = useRef(onActiveChange);
  onActiveChangeRef.current = onActiveChange;

  useEffect(() => {
    const sections = sectionsRef.current;
    if (sections.size === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const index = Array.from(sections.entries()).find(
              ([, el]) => el === entry.target
            )?.[0];
            if (index !== undefined && index !== activeIndexRef.current) {
              setActiveIndex(index);
              onActiveChangeRef.current?.(index);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [totalSections]);

  return (
    <ScrollSnapContext.Provider
      value={{
        activeIndex,
        totalSections,
        scrollToSection,
        registerSection,
        unregisterSection,
      }}
    >
      <div
        ref={containerRef}
        className={className}
        style={{
          height: "100dvh",
          overflowY: "auto",
          scrollSnapType: "y mandatory",
          scrollBehavior: "smooth",
        }}
      >
        {children}
      </div>
    </ScrollSnapContext.Provider>
  );
}
