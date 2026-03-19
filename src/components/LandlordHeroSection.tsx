"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./LandlordHeroSection.module.css";
import { PensioGlobalGlobe } from "./PensioGlobalGlobe";

type TrustStat = {
  value: string;
  label: string;
};

type PackageHero = {
  label: string;
  value: string;
  description: string;
};

type PackageBenefit = {
  label: string;
  value?: string;
  description: string;
};

type SupportCategory = {
  step?: string;
  icon?: "screening" | "legal" | "rent" | "management";
  title: string;
  description?: string;
  points: string[];
};

type SupportProofStat = {
  value: string;
  label: string;
};

type SupportProofQuote = {
  eyebrow: string;
  text: string;
  attribution: string;
};

type SupportProof = {
  label: string;
  stats: SupportProofStat[];
  quote: SupportProofQuote;
};

type WorkflowStep = {
  step: string;
  icon?: "listing" | "agreement" | "lease";
  title: string;
  description: string;
};

type WorkflowBenefit = {
  title: string;
  description: string;
};

type WorkflowTestimonial = {
  name: string;
  role: string;
  quote: string;
};

type PresentationSlide = {
  id: string;
  headline: string;
  subheadline?: string;
  variant?: "default" | "package" | "global" | "support" | "workflow";
  eyebrow?: string;
  isHero?: boolean;
  showCta?: boolean;
  trustStats?: TrustStat[];
  packageHero?: PackageHero;
  packageBenefits?: PackageBenefit[];
  supportLead?: string;
  supportStages?: SupportCategory[];
  supportProof?: SupportProof;
  workflowSteps?: WorkflowStep[];
  workflowBenefits?: WorkflowBenefit[];
  workflowTestimonials?: WorkflowTestimonial[];
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

function renderPackageHeadline(headline: string) {
  const match = headline.match(/^(.*?)(\s+Guarantee)(\s+Package)?$/);

  if (!match) {
    return headline;
  }

  const [, leadText, highlightedWord, trailingText = ""] = match;

  return (
    <>
      {leadText}
      <span className={styles.packageHeadlineAccent}>{highlightedWord}</span>
      {trailingText}
    </>
  );
}

function renderGlobalHeadline(headline: string) {
  const match = headline.match(/^(.*?)(\s+Global)$/);

  if (!match) {
    return headline;
  }

  const [, leadText, highlightedWord] = match;

  return (
    <>
      {leadText}
      <span className={styles.packageHeadlineAccent}>{highlightedWord}</span>
    </>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l7 3.2v5.4c0 4.4-2.6 8.4-7 10.4-4.4-2-7-6-7-10.4V6.2L12 3z" />
      <path d="M9 12.2l2 2 4-4.2" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13 2L5 14h5l-1 8 8-12h-5l1-8z" />
    </svg>
  );
}

function HomeShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 11.2L12 4l9 7.2" />
      <path d="M5.5 9.8V20h13V9.8" />
      <path d="M12 10.5l3 1.4v2.5c0 2.1-1.2 4-3 5-1.8-1-3-2.9-3-5v-2.5l3-1.4z" />
    </svg>
  );
}

function ScaleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 4v16" />
      <path d="M7 7h10" />
      <path d="M5 7l-2.5 4.5a2.7 2.7 0 0 0 5 0L5 7z" />
      <path d="M19 7l-2.5 4.5a2.7 2.7 0 0 0 5 0L19 7z" />
      <path d="M8 20h8" />
    </svg>
  );
}

function CheckBadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l7 4v5c0 4.5-2.8 8.5-7 10-4.2-1.5-7-5.5-7-10V7l7-4z" />
      <path d="M8.8 12.1l2.1 2.1 4.5-4.5" />
    </svg>
  );
}

function UserCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15.5 19.5a6.7 6.7 0 0 0-11 0" />
      <circle cx="10" cy="8" r="3.2" />
      <path d="M17 10.8l1.8 1.8 3.2-3.4" />
    </svg>
  );
}

function GavelIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.5 4.5l5 5" />
      <path d="M12 7l5 5" />
      <path d="M4.5 19.5l8-8" />
      <path d="M3 21h8" />
      <path d="M11 3l3 3-2.5 2.5-3-3z" />
      <path d="M16 8l3 3-2.5 2.5-3-3z" />
    </svg>
  );
}

function WalletFlowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v1.5" />
      <path d="M4 8.5h14a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 16.5z" />
      <path d="M15 13h5" />
      <path d="M7 12h3" />
      <path d="M8.5 10.5L7 12l1.5 1.5" />
    </svg>
  );
}

function ConversationShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 16.5A3.5 3.5 0 0 1 1.5 13V7A3.5 3.5 0 0 1 5 3.5h8A3.5 3.5 0 0 1 16.5 7v2.5" />
      <path d="M5 16.5V20l3.2-2.4" />
      <path d="M18 12l4 1.8v3c0 2.5-1.5 4.7-4 5.7-2.5-1-4-3.2-4-5.7v-3z" />
      <path d="M16.6 16.6l1 1 1.8-1.9" />
    </svg>
  );
}

function renderSupportIcon(icon?: SupportCategory["icon"]) {
  if (icon === "screening") return <UserCheckIcon />;
  if (icon === "legal") return <GavelIcon />;
  if (icon === "rent") return <WalletFlowIcon />;
  if (icon === "management") return <ConversationShieldIcon />;
  return <CheckBadgeIcon />;
}

function renderWorkflowIcon(icon?: WorkflowStep["icon"]) {
  if (icon === "listing") return <HomeShieldIcon />;
  if (icon === "agreement") return <ShieldIcon />;
  if (icon === "lease") return <CheckBadgeIcon />;
  return <BoltIcon />;
}

function renderPackageIcon(index: number) {
  if (index === 0) return <BoltIcon />;
  if (index === 1) return <HomeShieldIcon />;
  return <ScaleIcon />;
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
    variant: "package",
    eyebrow: "Protection package",
    headline: "Pension Rent Guarantee",
    packageHero: {
      label: "Rent Guarantee",
      value: "$60,000",
      description: "Up to $5,000/month paid for 12 months.",
    },
    packageBenefits: [
      {
        label: "Same-month settlement",
        description: "Fast payout support when an eligible rent issue arises.",
      },
      {
        label: "Damage claim",
        value: "$10,000",
        description: "Coverage support for qualifying damage-related claims.",
      },
      {
        label: "Legal support",
        value: "$1,500",
        description: "Practical help for eligible tenancy-related legal needs.",
      },
    ],
  },
  {
    id: "feature-2",
    variant: "global",
    eyebrow: "Why Tempho!",
    headline: "Pensio Global",
    subheadline: "$1.5+ Billion in Rent Risk solutions delivered to landlords, and other stakeholders.",
  },
  {
    id: "feature-3",
    variant: "support",
    eyebrow: "What Tempho does for you",
    headline: "What Tempho Handles for Landlords",
    subheadline:
      "Protection, leasing support, and day-to-day management tools that help you reduce risk, avoid delays, and place the right tenant faster.",
    supportLead: "From screening to rent protection",
    supportStages: [
      {
        step: "01",
        icon: "screening",
        title: "Screen applicants with confidence",
        description:
          "Verify the person behind the application before a lease is signed.",
        points: [
          "Government ID verification",
          "Income and banking verification",
          "Employment verification",
          "Previous landlord verification",
        ],
      },
      {
        step: "02",
        icon: "legal",
        title: "Reduce legal exposure",
        description:
          "Get structured support when tenancy disputes create risk or delay.",
        points: [
          "Support for Landlord and Tenant Board matters",
          "Up to $1,500 in legal expense coverage",
          "Guidance when disputes arise",
        ],
      },
      {
        step: "03",
        icon: "rent",
        title: "Protect rent flow",
        description:
          "Keep payments organized and reduce the friction around collection.",
        points: [
          "Automated rent collection",
          "Fewer missed or delayed payments",
          "Clear payment tracking for every lease",
        ],
      },
      {
        step: "04",
        icon: "management",
        title: "Fill and manage faster",
        description:
          "Move from vacancy to stable tenancy with less manual follow-up.",
        points: [
          "10-day placement pledge",
          "Centralized tenant communication",
          "Lease and document organization",
        ],
      },
    ],
    supportProof: {
      label: "Landlord relief",
      stats: [
        { value: "10-day", label: "placement pledge" },
        { value: "$1,500", label: "legal expense support" },
        { value: "4 checks", label: "tenant screening checks" },
      ],
      quote: {
        eyebrow: "Operational proof",
        text:
          "Tempho helps landlords move from screening to rent collection with fewer handoffs, fewer unknowns, and a clearer process for every tenancy.",
        attribution: "Built for independent landlords and growing portfolios",
      },
    },
  },
  {
    id: "cta",
    variant: "workflow",
    eyebrow: "How it works",
    headline: "From listing to lease, Tempho keeps the landlord process structured.",
    subheadline:
      "A simple workflow for getting your property live, protected, and ready for the right tenant.",
    showCta: true,
    workflowSteps: [
      {
        step: "01",
        icon: "listing",
        title: "Simply list your property on Tempho",
        description:
          "Create the listing with the property details, terms, and readiness information landlords need to present clearly.",
      },
      {
        step: "02",
        icon: "agreement",
        title: "Sign guarantee agreement with Pensio Global insurance",
        description:
          "Put the protection layer in place so the property moves forward with coverage and a clearer risk framework.",
      },
      {
        step: "03",
        icon: "lease",
        title: "Approve tenant and sign lease",
        description:
          "Review the verified applicant, confirm the fit, and move into lease signature with less manual back-and-forth.",
      },
    ],
    workflowBenefits: [
      {
        title: "Steady income",
        description:
          "Reduce rent disruption with a workflow built around screening, structure, and continuity.",
      },
      {
        title: "Peace of mind",
        description:
          "Move through the tenancy process with fewer unknowns and a more reliable operating rhythm.",
      },
      {
        title: "Expand portfolio",
        description:
          "Create a repeatable process that supports growth beyond a single property.",
      },
    ],
  },
];

export function LandlordHeroSection({
  ctaLabel = "List Property",
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
            ) : slide.variant === "package" &&
              slide.packageHero &&
              slide.packageBenefits ? (
              <div className={styles.packageSlideContent}>
                <div className={styles.packageHeader}>
                  <div className={styles.slideNumber}>
                    <span>0{index + 1}</span>
                  </div>
                  {slide.eyebrow && <p className={styles.packageEyebrow}>{slide.eyebrow}</p>}
                  <h2 className={styles.packageHeadline}>{renderPackageHeadline(slide.headline)}</h2>
                  <p className={styles.packageIntro}>
                    A coverage-first package designed to keep landlord income calm,
                    predictable, and protected.
                  </p>
                </div>

                <div className={styles.packageGrid}>
                  <article className={`${styles.packageCard} ${styles.packageHeroCard}`}>
                    <div className={styles.packageHeroWatermark} aria-hidden="true">
                      <ShieldIcon />
                    </div>
                    <div className={styles.packageHeroTop}>
                      <div className={styles.packageIconWrap}>
                        <ShieldIcon />
                      </div>
                      <span className={styles.packageHeroPill}>12 month protection</span>
                    </div>
                    <p className={styles.packageLabel}>{slide.packageHero.label}</p>
                    <p className={styles.packageHeroValue}>{slide.packageHero.value}</p>
                    <p className={styles.packageHeroDescription}>{slide.packageHero.description}</p>
                    <div className={styles.packageFormulaBlock}>
                      <span className={styles.packageFormulaLabel}>Coverage formula</span>
                      <span className={styles.packageFormulaValue}>Up to $5,000 x 12 months</span>
                    </div>
                  </article>

                  {slide.packageBenefits.map((benefit, benefitIndex) => (
                    <article key={benefit.label} className={`${styles.packageCard} ${styles.packageBenefitCard}`}>
                      <div className={styles.packageBenefitTop}>
                        <div className={styles.packageIconWrapSmall}>{renderPackageIcon(benefitIndex)}</div>
                      </div>
                      <p className={styles.packageLabel}>{benefit.label}</p>
                      {benefit.value && <p className={styles.packageBenefitValue}>{benefit.value}</p>}
                      <p className={styles.packageBenefitDescription}>{benefit.description}</p>
                    </article>
                  ))}
                </div>
              </div>
            ) : slide.variant === "global" ? (
              <div className={styles.globalSlideContent}>
                <div className={styles.globalTextColumn}>
                  <div className={styles.packageHeader}>
                    <div className={styles.slideNumber}>
                      <span>0{index + 1}</span>
                    </div>
                    {slide.eyebrow && <p className={styles.packageEyebrow}>{slide.eyebrow}</p>}
                    <h2 className={styles.packageHeadline}>{renderGlobalHeadline(slide.headline)}</h2>
                    <p className={styles.packageIntro}>
                      A worldwide rent-risk solution built to support landlords,
                      property groups, and stakeholders through one connected protection network.
                    </p>
                  </div>

                  <div className={styles.globalAudienceRow}>
                    <span className={styles.globalAudienceChip}>Landlords</span>
                    <span className={styles.globalAudienceChip}>Property groups</span>
                    <span className={styles.globalAudienceChip}>Stakeholders</span>
                  </div>
                </div>

                <div className={styles.globalVisualColumn}>
                  <div className={styles.globalGlobeStage}>
                    <div className={styles.globalStageHalo} aria-hidden="true" />
                    <div className={styles.globalStagePanel}>
                      <div className={styles.globalStageOrbit} aria-hidden="true" />

                      <div className={`${styles.globalMetricCard} ${styles.globalMetricCardFloating}`}>
                        <p className={styles.globalMetricLabel}>Global proof point</p>
                        <p className={styles.globalMetricValue}>$1.5B+</p>
                        <div className={styles.globalMetricDescriptionList}>
                          <p className={styles.globalMetricDescription}>Landlords</p>
                          <p className={styles.globalMetricDescription}>Portfolios</p>
                          <p className={styles.globalMetricDescription}>Property stakeholders</p>
                        </div>
                      </div>

                      <div className={styles.globalGlobeFrame}>
                        <PensioGlobalGlobe className={styles.globalGlobeCanvasShell} />
                      </div>
                    </div>

                    <div className={`${styles.globalGlobeHud} ${styles.globalGlobeHudFloating}`}>
                      <span className={styles.globalGlobeHudLabel}>Coverage reach</span>
                      <span className={styles.globalGlobeHudValue}>6 continents</span>
                    </div>
                  </div>

                </div>
              </div>
            ) : slide.variant === "support" && slide.supportStages && slide.supportProof ? (
              <div className={styles.supportSlideContent}>
                <div className={styles.supportMasthead}>
                  <div className={styles.supportHeader}>
                    <div className={styles.slideNumber}>
                      <span>0{index + 1}</span>
                    </div>
                    {slide.eyebrow && <p className={styles.packageEyebrow}>{slide.eyebrow}</p>}
                    <h2 className={styles.packageHeadline}>{slide.headline}</h2>
                    {slide.subheadline && (
                      <p className={styles.supportIntro}>{slide.subheadline}</p>
                    )}
                  </div>
                </div>

                <div className={styles.supportLayout}>
                  <div className={styles.supportNarrativeColumn}>
                    {slide.supportLead && (
                      <p className={styles.supportLeadLabel}>{slide.supportLead}</p>
                    )}
                    <div className={styles.supportNarrativeCard}>
                      <p className={styles.supportNarrativeTitle}>
                        Tempho supports the full leasing lifecycle with one calmer, more structured workflow.
                      </p>
                      <p className={styles.supportNarrativeBody}>
                        Each stage reduces a different kind of landlord friction, from who gets approved to how rent and communication stay on track.
                      </p>
                    </div>
                  </div>

                  <div className={styles.supportTimeline} aria-label="Leasing lifecycle support">
                    {slide.supportStages.map((stage) => (
                      <article key={stage.title} className={styles.supportStageCard}>
                        <div className={styles.supportStageTop}>
                          <span className={styles.supportStageStep}>{stage.step}</span>
                          <span className={styles.supportIconWrap}>
                            {renderSupportIcon(stage.icon)}
                          </span>
                        </div>
                        <div className={styles.supportStageBody}>
                          <h3 className={styles.supportCardTitle}>{stage.title}</h3>
                          {stage.description && (
                            <p className={styles.supportStageDescription}>{stage.description}</p>
                          )}
                          <ul className={styles.supportList}>
                            {stage.points.map((point) => (
                              <li key={point} className={styles.supportListItem}>
                                <span className={styles.supportListBullet} aria-hidden="true" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </article>
                    ))}
                  </div>

                  <aside className={styles.supportProofRail} aria-label="Slide highlights">
                    <p className={styles.supportRailLabel}>{slide.supportProof.label}</p>
                    <div className={styles.supportStatStack}>
                      {slide.supportProof.stats.map((stat) => (
                        <div key={stat.label} className={styles.supportStatCard}>
                          <span className={styles.supportStatValue}>{stat.value}</span>
                          <span className={styles.supportStatLabel}>{stat.label}</span>
                        </div>
                      ))}
                    </div>

                    <article className={styles.supportProofCard}>
                      <p className={styles.supportProofEyebrow}>
                        {slide.supportProof.quote.eyebrow}
                      </p>
                      <p className={styles.supportProofQuote}>
                        {slide.supportProof.quote.text}
                      </p>
                      <p className={styles.supportProofAttribution}>
                        {slide.supportProof.quote.attribution}
                      </p>
                    </article>
                  </aside>
                </div>
              </div>
            ) : slide.variant === "workflow" &&
              slide.workflowSteps &&
              slide.workflowBenefits ? (
              <div className={styles.workflowSlideContent}>
                <div className={styles.workflowHeader}>
                  <div className={styles.slideNumber}>
                    <span>0{index + 1}</span>
                  </div>
                  {slide.eyebrow && <p className={styles.packageEyebrow}>{slide.eyebrow}</p>}
                  <h2 className={styles.packageHeadline}>{slide.headline}</h2>
                  {slide.subheadline && (
                    <p className={styles.supportIntro}>{slide.subheadline}</p>
                  )}
                </div>

                <section className={styles.workflowZigzag} aria-label="How it works">
                  {slide.workflowSteps.map((item, stepIndex) => (
                    <div key={item.step}>
                      <article
                        className={`${styles.workflowZigzagRow} ${
                          stepIndex % 2 !== 0 ? styles.workflowZigzagRowReversed : ""
                        }`}
                        style={{ animationDelay: `${stepIndex * 0.18}s` }}
                      >
                        <div className={styles.workflowZigzagText}>
                          <span className={styles.workflowStepNumber}>{item.step}</span>
                          <h3 className={styles.workflowStepTitle}>{item.title}</h3>
                          <p className={styles.workflowStepDescription}>{item.description}</p>
                        </div>
                        <div className={styles.workflowZigzagIcon}>
                          <span className={styles.workflowZigzagIconInner}>
                            {renderWorkflowIcon(item.icon)}
                          </span>
                        </div>
                      </article>
                      {stepIndex < (slide.workflowSteps?.length ?? 0) - 1 && (
                        <div className={styles.workflowZigzagConnector} aria-hidden="true">
                          <svg
                            width="120"
                            height="56"
                            viewBox="0 0 120 56"
                            fill="none"
                            className={styles.workflowConnectorSvg}
                          >
                            <path
                              d="M60 0 C60 20, 60 36, 60 56"
                              stroke="url(#connectorGrad)"
                              strokeWidth="1.5"
                              strokeDasharray="5 7"
                              strokeLinecap="round"
                            />
                            <circle cx="60" cy="28" r="3" fill="rgba(214,187,129,0.5)" />
                            <defs>
                              <linearGradient id="connectorGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="rgba(214,187,129,0.6)" />
                                <stop offset="50%" stopColor="rgba(214,187,129,0.3)" />
                                <stop offset="100%" stopColor="rgba(214,187,129,0.6)" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </section>

                <div className={styles.workflowBenefitStrip}>
                  {slide.workflowBenefits.map((benefit, benefitIndex) => (
                    <article
                      key={benefit.title}
                      className={styles.workflowBenefitItem}
                      style={{ animationDelay: `${0.54 + benefitIndex * 0.12}s` }}
                    >
                      <span className={styles.workflowBenefitIndex}>
                        0{benefitIndex + 1}
                      </span>
                      <h3 className={styles.workflowBenefitTitle}>{benefit.title}</h3>
                      <p className={styles.workflowBenefitDescription}>
                        {benefit.description}
                      </p>
                    </article>
                  ))}
                </div>

                <section
                  className={styles.workflowProofCard}
                  aria-label="Workflow outcome"
                  style={{ animationDelay: "0.9s" }}
                >
                  <p className={styles.workflowSectionLabel}>End state</p>
                  <p className={styles.workflowProofTitle}>
                    Protected listing. Verified tenant. Cleaner handoff to lease.
                  </p>
                  <p className={styles.workflowProofBody}>
                    Every step is set up to reduce guesswork so landlords can move from
                    listing to approval with better visibility and fewer loose ends.
                  </p>
                </section>
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
