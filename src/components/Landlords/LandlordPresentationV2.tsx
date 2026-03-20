"use client";

import { type ReactNode, useState, useCallback } from "react";
import { ScrollSnapContainer, useScrollSnap } from "./ScrollSnapContainer";
import { ScrollSnapSection } from "./ScrollSnapSection";
import { NavigationDots } from "./NavigationDots";
import { VideoHeroSection } from "./VideoHeroSection";
import { HeroSlide } from "./slides/HeroSlide";
import { PackageSlide } from "./slides/PackageSlide";
import { GlobalSlide } from "./slides/GlobalSlide";
import { SupportSlide } from "./slides/SupportSlide";
import { WorkflowSlide } from "./slides/WorkflowSlide";
import { defaultSlides } from "./constants";
import type { LandlordPresentationProps, PresentationSlide } from "./types";

const slideBackgrounds = {
  hero: "bg-gradient-to-b from-white via-[#fffdf8] to-[#fff9ec]",
  package: "bg-[radial-gradient(circle_at_12%_18%,rgba(255,213,90,0.16),transparent_28%),linear-gradient(180deg,rgba(255,250,238,0.92)_0%,rgba(255,255,255,0.98)_44%,rgba(249,245,236,0.92)_100%)]",
  global: "bg-[radial-gradient(circle_at_16%_16%,rgba(255,213,90,0.18),transparent_24%),linear-gradient(180deg,#fffdf9_0%,#fff8ee_44%,#ffffff_100%)]",
  support: "bg-[radial-gradient(circle_at_18%_24%,rgba(255,213,90,0.16),transparent_24%),linear-gradient(180deg,#fffdf9_0%,#fff8ee_48%,#ffffff_100%)]",
  workflow: "bg-[radial-gradient(circle_at_18%_14%,rgba(255,213,90,0.18),transparent_24%),linear-gradient(180deg,#fffdf9_0%,#fff8ee_44%,#ffffff_100%)]",
};

function getSlideBackground(slide: PresentationSlide) {
  if (slide.isHero) return slideBackgrounds.hero;
  return slideBackgrounds[slide.variant as keyof typeof slideBackgrounds] || slideBackgrounds.hero;
}

function renderSlideContent(
  slide: PresentationSlide,
  index: number,
  isActive: boolean,
  ctaLabel: string,
  ctaHref: string,
  extra?: { videoReady?: boolean }
) {
  const props = { slide, index, isActive, ctaLabel, ctaHref };

  if (slide.isHero) return <HeroSlide {...props} />;
  if (slide.variant === "package") return <PackageSlide {...props} />;
  if (slide.variant === "global") return <GlobalSlide {...props} eagerGlobe={extra?.videoReady} />;
  if (slide.variant === "support") return <SupportSlide {...props} />;
  if (slide.variant === "workflow") return <WorkflowSlide {...props} />;
  return null;
}

const defaultVideoSrc = {
  webm: "/hero-section/hero-video-720p.webm",
  mp4: "/hero-section/hero-video-720p.mp4",
};

/** Renders a slide with correct isActive from scroll context */
function ActiveSlide({
  slide,
  sectionIndex,
  slideIndex,
  ctaLabel,
  ctaHref,
  videoReady,
}: {
  slide: PresentationSlide;
  sectionIndex: number;
  slideIndex: number;
  ctaLabel: string;
  ctaHref: string;
  videoReady?: boolean;
}) {
  const { activeIndex } = useScrollSnap();
  const isActive = activeIndex === sectionIndex;

  return (
    <div className="mx-auto w-full max-w-7xl">
      {renderSlideContent(slide, slideIndex, isActive, ctaLabel, ctaHref, { videoReady })}
    </div>
  );
}

export function LandlordPresentationV2({
  ctaLabel = "List Property",
  ctaHref = "/forms",
  videoSrc = defaultVideoSrc,
  videoPoster = "/hero-section/hero-video-poster.jpg",
  slides = defaultSlides,
  children,
}: LandlordPresentationProps & { children?: ReactNode }) {
  const [videoReady, setVideoReady] = useState(false);
  const handleVideoReady = useCallback(() => setVideoReady(true), []);

  const sectionLabels = slides.map(
    (s) => s.headline?.split("\n")[0] || s.id
  );

  return (
    <ScrollSnapContainer className="relative">
      {/* Fixed video player */}
      <VideoHeroSection videoSrc={videoSrc} videoPoster={videoPoster} onVideoReady={handleVideoReady} />

      {/* Navigation dots */}
      <NavigationDots labels={sectionLabels} />

      {/* Video spacer - first snap point */}
      <ScrollSnapSection
        index={0}
        className="pointer-events-none"
        background="bg-transparent"
      >
        <div className="h-full w-full" />
      </ScrollSnapSection>

      {/* Content sections */}
      {slides.map((slide, index) => {
        const sectionIndex = index + 1;
        return (
          <ScrollSnapSection
            key={slide.id}
            index={sectionIndex}
            background={getSlideBackground(slide)}
            className="px-8 py-20 md:px-12 lg:px-20"
          >
            <ActiveSlide
              slide={slide}
              sectionIndex={sectionIndex}
              slideIndex={index}
              ctaLabel={ctaLabel}
              ctaHref={ctaHref}
              videoReady={videoReady}
            />
          </ScrollSnapSection>
        );
      })}

      {/* Additional page sections passed as children */}
      {children}
    </ScrollSnapContainer>
  );
}
