"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./LandlordHeroSection.module.css";

type TrustStat = {
  value: string;
  label: string;
};

type PresentationSlide = {
  id: string;
  headline: string;
  subheadline?: string;
  isHero?: boolean;
  showCta?: boolean;
  trustStats?: TrustStat[];
};

type LandlordHeroSectionProps = {
  ctaLabel?: string;
  ctaHref?: string;
  videoSrc?: string;
  videoPoster?: string;
  slides?: PresentationSlide[];
};

const heroVisualMessages = [
  {
    title: "Tenant profile verified",
    detail: "Identity and screening complete",
    className: "heroVisualNoteTop",
  },
  {
    title: "Rent protection active",
    detail: "Coverage confirmed for this listing",
    className: "heroVisualNoteRight",
  },
  {
    title: "Listing ready to publish",
    detail: "Photos, terms, and checks approved",
    className: "heroVisualNoteBottom",
  },
] as const;

function renderHeroHeadline(headline: string) {
  const lines = headline.split("\n");

  return lines.map((line, index) => {
    const trimmedLine = line.trim();
    const parts = trimmedLine.match(/^(.*?)(\s+[^\s]+[.!?]?)$/);

    if (!parts) {
      return (
        <span
          key={`${trimmedLine}-${index}`}
          className={styles.heroHeadlineLine}
          style={{ animationDelay: `${index * 0.14}s` }}
        >
          {trimmedLine}
        </span>
      );
    }

    const [, leadText, highlightText] = parts;

    return (
      <span
        key={`${trimmedLine}-${index}`}
        className={styles.heroHeadlineLine}
        style={{ animationDelay: `${index * 0.14}s` }}
      >
        {leadText}
        <span className={styles.heroHeadlineHighlight}>{highlightText}</span>
      </span>
    );
  });
}

const defaultSlides: PresentationSlide[] = [
  {
    id: "intro",
    headline: "List Your Property. Find Quality Tenants.",
    subheadline: "Guaranteed Rent Insurance",
    isHero: true,
    showCta: true,
    trustStats: [
      { value: "10,000+", label: "Landlords trust us" },
      { value: "95%", label: "Vacancy fill rate" },
      { value: "48h", label: "Average listing time" },
    ],
  },
  {
    id: "feature-1",
    headline: "AI-Powered Tenant Matching",
    subheadline: "Our intelligent system finds tenants that match your property requirements perfectly.",
  },
  {
    id: "feature-2",
    headline: "Guaranteed Rent Protection",
    subheadline: "Never worry about missed payments. We ensure your rent arrives on time, every time.",
  },
  {
    id: "feature-3",
    headline: "Hassle-Free Management",
    subheadline: "From listings to lease signing, we handle everything so you can focus on what matters.",
  },
  {
    id: "cta",
    headline: "Ready to Get Started?",
    subheadline: "Join thousands of landlords who trust Tempho with their properties.",
    showCta: true,
  },
];

export function LandlordHeroSection({
  ctaLabel = "Sign up today!",
  ctaHref = "/forms",
  videoSrc = "/hero-section/hero-video.mp4",
  videoPoster,
  slides = defaultSlides,
}: LandlordHeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoMinimized, setIsVideoMinimized] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showUnmutePrompt, setShowUnmutePrompt] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile/tablet for bottom-bar vs corner video placement
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
    checkMobile(); // run on mount
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Attempt autoplay with sound, fallback to muted if blocked
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const attemptAutoplay = async () => {
      try {
        video.muted = false;
        await video.play();
        setIsPlaying(true);
        setIsMuted(false);
      } catch {
        try {
          video.muted = true;
          await video.play();
          setIsPlaying(true);
          setIsMuted(true);
          setShowUnmutePrompt(true);
        } catch {
          setIsPlaying(false);
        }
      }
    };

    attemptAutoplay();
  }, []);

  // Video control handlers
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
    setHasInteracted(true);
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
    setShowUnmutePrompt(false);
    setHasInteracted(true);
  }, []);

  const handleUnmuteClick = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    setIsMuted(false);
    setShowUnmutePrompt(false);
    setHasInteracted(true);

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    }
  }, []);

  // Sync state with video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => setIsMuted(video.muted);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("volumechange", handleVolumeChange);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("volumechange", handleVolumeChange);
    };
  }, []);

  // Handle scroll-based animations
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // scrolled = how many px the user has scrolled past the top of this container
    const scrolled = -rect.top;

    // Minimise the video once the user scrolls past 60 % of the first viewport
    const triggerPoint = windowHeight * 0.6;
    setIsVideoMinimized(scrolled > triggerPoint);

    // Slides begin after the full-screen video phase (one full viewport of scrolling)
    // Each slide occupies ~90 vh of scroll distance
    const slideScrollStart = windowHeight;
    const slideHeight = windowHeight * 0.9;
    const slideProgress = Math.max(0, scrolled - slideScrollStart);
    const slideIndex = Math.min(
      slides.length - 1,
      Math.floor(slideProgress / slideHeight)
    );
    setActiveSlide(slideIndex);
  }, [slides.length]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div ref={containerRef} className={styles.heroContainer}>
      {/* ── Video – single element that morphs to corner (desktop) or bottom bar (mobile) on scroll ── */}
      <div
        className={`${styles.videoWrapper} ${
          isVideoMinimized
            ? isMobile
              ? styles.minimizedBar
              : styles.minimized
            : ""
        }`}
      >
        <video
          ref={videoRef}
          className={styles.video}
          src={videoSrc}
          poster={videoPoster}
          loop
          playsInline
          preload="auto"
        />

        {/* Controls are safe inside because they scale with the video */}
        <div className={styles.videoControls}>
          <button
            className={styles.controlButton}
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </button>

          <button
            className={styles.controlButton}
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            )}
          </button>
        </div>

        {/* Play Overlay (shown only when autoplay fails entirely) */}
        {!isPlaying && !hasInteracted && (
          <button className={styles.playOverlay} onClick={togglePlay} aria-label="Play video">
            <div className={styles.playButton}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          </button>
        )}
      </div>

      {/*
        ── Overlay layer – OUTSIDE videoWrapper so it never gets clipped ──
        Sits fixed over the full screen while the video is in hero state,
        then fades out when the video minimises.
      */}
      <div className={`${styles.heroOverlay} ${isVideoMinimized ? styles.heroOverlayHidden : ""}`}>
        {/* Unmute prompt (centred on screen, not inside the shrinking video) */}
        {showUnmutePrompt && !hasInteracted && (
          <button className={styles.unmutePrompt} onClick={handleUnmuteClick} aria-label="Click to unmute video">
            <span className={styles.unmuteIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            </span>
            <span className={styles.unmuteText}>Click to unmute</span>
          </button>
        )}

        {/* Scroll-to-explore pinned to bottom of viewport */}
        <div className={styles.scrollIndicator}>
          <span className={styles.scrollText}>Scroll to explore</span>
          <div className={styles.scrollArrow}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Spacer – holds the scroll height for the full-screen video phase */}
      <div className={styles.videoSpacer} />

      {/* ── Presentation Slides ── */}
      <div className={styles.slidesContainer}>
        {slides.map((slide, index) => (
          <section
            key={slide.id}
            className={`${styles.slide} ${slide.isHero ? styles.heroSlide : ""} ${activeSlide >= index ? styles.active : ""}`}
          >
            {slide.isHero ? (
              /* ── Hero Slide Layout (two columns) ── */
              <div className={styles.heroSlideInner}>
                <div className={styles.heroSlideContent}>
                  {slide.subheadline && (
                    <p className={styles.heroSlideEyebrow}>{slide.subheadline}</p>
                  )}
                  <h2 className={styles.heroSlideHeadline}>
                    {renderHeroHeadline(slide.headline)}
                  </h2>
                  {slide.showCta && (
                    <div className={styles.slideCta}>
                      <Link href={ctaHref} className={styles.ctaButton}>
                        {ctaLabel}
                      </Link>
                    </div>
                  )}
                </div>

                <div className={styles.heroSlideVisual}>
                  <div className={styles.heroVisualFrame}>
                    <Image
                      src="/hero-section/landlord-hero-visual.svg"
                      alt="Illustration of a protected rental property with verified tenant checks"
                      width={720}
                      height={720}
                      className={styles.heroVisualImage}
                      priority={slide.isHero}
                    />
                    {heroVisualMessages.map((message, index) => (
                      <div
                        key={message.title}
                        className={`${styles.heroVisualNote} ${styles[message.className]}`}
                        style={{ animationDelay: `${0.28 + index * 0.18}s` }}
                      >
                        <span className={styles.heroVisualNoteIcon} aria-hidden="true">
                          <svg viewBox="0 0 20 20" fill="none">
                            <path
                              d="M5 10.5L8.3 13.8L15 7.2"
                              stroke="currentColor"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        <span className={styles.heroVisualNoteContent}>
                          <span className={styles.heroVisualNoteTitle}>{message.title}</span>
                          <span className={styles.heroVisualNoteDetail}>{message.detail}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* ── Regular Slide Layout ── */
              <div className={styles.slideContent}>
                <div className={styles.slideNumber}>
                  <span>0{index + 1}</span>
                </div>
                <h2 className={styles.slideHeadline}>{slide.headline}</h2>
                {slide.subheadline && (
                  <p className={styles.slideSubheadline}>{slide.subheadline}</p>
                )}
                {slide.showCta && (
                  <div className={styles.slideCta}>
                    <Link href={ctaHref} className={styles.ctaButton}>
                      {ctaLabel}
                    </Link>
                  </div>
                )}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
