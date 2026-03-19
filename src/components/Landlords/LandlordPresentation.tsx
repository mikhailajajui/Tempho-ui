"use client";

import { useRef } from "react";
import clsx from "clsx";

import { defaultSlides } from "./constants";
import { HeroOverlay } from "./HeroOverlay";
import { VideoPlayer } from "./VideoPlayer";
import { useMobileDetect } from "./useMobileDetect";
import { useScrollPresentation } from "./useScrollPresentation";
import { useVideoPlayer } from "./useVideoPlayer";
import type { LandlordPresentationProps, PresentationSlide } from "./types";
import { GlobalSlide } from "./slides/GlobalSlide";
import { HeroSlide } from "./slides/HeroSlide";
import { PackageSlide } from "./slides/PackageSlide";
import { SlideWrapper } from "./slides/SlideWrapper";
import { SupportSlide } from "./slides/SupportSlide";
import { WorkflowSlide } from "./slides/WorkflowSlide";

function renderSlide(
  slide: PresentationSlide,
  index: number,
  isActive: boolean,
  ctaLabel: string,
  ctaHref: string,
) {
  const sharedProps = {
    slide,
    index,
    isActive,
    ctaLabel,
    ctaHref,
  };

  if (slide.isHero) {
    return <HeroSlide {...sharedProps} />;
  }

  if (slide.variant === "package") {
    return <PackageSlide {...sharedProps} />;
  }

  if (slide.variant === "global") {
    return <GlobalSlide {...sharedProps} />;
  }

  if (slide.variant === "support") {
    return <SupportSlide {...sharedProps} />;
  }

  if (slide.variant === "workflow") {
    return <WorkflowSlide {...sharedProps} />;
  }

  return null;
}

const defaultVideoSrc = {
  webm: "/hero-section/hero-video-720p.webm",
  mp4: "/hero-section/hero-video-720p.mp4",
};

export function LandlordPresentation({
  ctaLabel = "List Property",
  ctaHref = "/forms",
  videoSrc = defaultVideoSrc,
  videoPoster = "/hero-section/hero-video-poster.jpg",
  slides = defaultSlides,
}: LandlordPresentationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const isMobile = useMobileDetect();
  const { activeSlide, isVideoMinimized } = useScrollPresentation(
    containerRef,
    slideRefs,
  );
  const {
    videoRef,
    isPlaying,
    isMuted,
    showUnmutePrompt,
    hasInteracted,
    togglePlay,
    toggleMute,
    handleUnmuteClick,
  } = useVideoPlayer();

  const slideBackgrounds = {
    hero:
      "bg-[linear-gradient(180deg,#ffffff_0%,#fffdf8_42%,#fff9ec_100%)] pt-[max(5rem,10vh)]",
    package:
      "bg-[radial-gradient(circle_at_12%_18%,rgba(255,213,90,0.16),transparent_28%),linear-gradient(180deg,rgba(255,250,238,0.92)_0%,rgba(255,255,255,0.98)_44%,rgba(249,245,236,0.92)_100%)]",
    global:
      "bg-[radial-gradient(circle_at_16%_16%,rgba(255,213,90,0.18),transparent_24%),radial-gradient(circle_at_82%_18%,rgba(245,228,187,0.3),transparent_22%),linear-gradient(180deg,#fffdf9_0%,#fff8ee_44%,#ffffff_100%)]",
    support:
      "bg-[radial-gradient(circle_at_18%_24%,rgba(255,213,90,0.16),transparent_24%),radial-gradient(circle_at_82%_18%,rgba(245,228,187,0.38),transparent_18%),linear-gradient(180deg,#fffdf9_0%,#fff8ee_48%,#ffffff_100%)]",
    workflow:
      "bg-[radial-gradient(circle_at_18%_14%,rgba(255,213,90,0.18),transparent_24%),radial-gradient(circle_at_82%_18%,rgba(245,228,187,0.3),transparent_20%),linear-gradient(180deg,#fffdf9_0%,#fff8ee_44%,#ffffff_100%)]",
  };

  const defaultSlideSpacing =
    "min-h-screen px-20 py-20 max-[1280px]:px-[60px] max-[1100px]:pl-12 max-[1100px]:pr-[360px] max-[1024px]:min-h-[80vh] max-[1024px]:px-8 max-[1024px]:pb-20 max-[768px]:min-h-[75vh] max-[768px]:px-6 max-[768px]:pb-20 max-[480px]:min-h-[70vh] max-[480px]:px-4 max-[480px]:pt-12 max-[480px]:pb-[120px]";
  const pipReservedSpacing =
    "pr-[420px] max-[1280px]:pr-[400px] max-[1024px]:pr-8";
  const packageSlideSpacing =
    "justify-center pr-[88px] max-[1280px]:pr-[60px] max-[1100px]:pr-12 max-[1024px]:pr-8";
  const globalSlideSpacing =
    "justify-center pr-[72px] max-[1280px]:pr-[60px] max-[1100px]:pr-12 max-[1024px]:pr-8";
  const heroSlideSpacing =
    "min-h-screen px-20 py-[100px] max-[1280px]:px-[60px] max-[1280px]:py-20 max-[1024px]:min-h-[80vh] max-[1024px]:px-8 max-[1024px]:py-[60px] max-[1024px]:pb-[120px] max-[768px]:min-h-[75vh] max-[768px]:px-6 max-[768px]:py-[60px] max-[768px]:pb-[120px]";

  return (
    <div ref={containerRef} className="relative w-full bg-white">
      <VideoPlayer
        videoRef={videoRef}
        videoSrc={videoSrc}
        videoPoster={videoPoster}
        isMinimized={isVideoMinimized}
        isMobile={isMobile}
        isPlaying={isPlaying}
        isMuted={isMuted}
        hasInteracted={hasInteracted}
        onTogglePlay={togglePlay}
        onToggleMute={toggleMute}
      />

      <HeroOverlay
        isMinimized={isVideoMinimized}
        showUnmutePrompt={showUnmutePrompt}
        hasInteracted={hasInteracted}
        onUnmute={handleUnmuteClick}
      />

      <div className="h-[65dvh] w-full" />

      <div className="relative z-40 bg-white">
        {slides.map((slide, index) => {
          const isActive = activeSlide === index;
          const backgroundClassName = slide.isHero
            ? slideBackgrounds.hero
            : slide.variant === "package"
              ? slideBackgrounds.package
              : slide.variant === "global"
                ? slideBackgrounds.global
                : slide.variant === "support"
                  ? slideBackgrounds.support
                  : slideBackgrounds.workflow;

          return (
            <SlideWrapper
              key={slide.id}
              isActive={isActive}
              sectionRef={(node) => {
                slideRefs.current[index] = node;
              }}
              backgroundClassName={backgroundClassName}
              className={clsx(
                slide.isHero
                  ? heroSlideSpacing
                  : clsx(
                      defaultSlideSpacing,
                      slide.variant === "package"
                        ? packageSlideSpacing
                        : slide.variant === "global"
                          ? globalSlideSpacing
                          : pipReservedSpacing,
                    ),
                slide.isHero && "border-t border-transparent",
              )}
            >
              {renderSlide(slide, index, isActive, ctaLabel, ctaHref)}
            </SlideWrapper>
          );
        })}
      </div>
    </div>
  );
}
