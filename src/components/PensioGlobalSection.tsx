"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { PensioGlobalGlobe } from "./PensioGlobalGlobe";
import styles from "./PensioGlobalSection.module.css";

const routeLabels = [
  "Sydney – Singapore",
  "Sydney – London",
  "Melbourne – Los Angeles",
] as const;

const audiences = ["Landlords", "Property groups", "Stakeholders"] as const;

function cx(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function PensioGlobalSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Intersection observer for scroll reveal
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Video thumbnail autoplay (muted)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.play().catch(() => {});
    setIsPlaying(true);
    setIsMuted(true);
  }, []);

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
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  const reveal = (base: string, delay?: string) =>
    cx(base, visible && styles.visible, delay);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.inner}>
        {/* ── Left: Text Column ── */}
        <div className={styles.textColumn}>
          <div className={reveal(styles.revealUp, styles.delay1)}>
            <span className={styles.sectionNumber}>03</span>
          </div>

          <h2 className={reveal(styles.revealSlideRight, styles.delay2) + " " + styles.headline}>
            Pensio Global
          </h2>

          <p className={reveal(styles.revealUp, styles.delay3) + " " + styles.subheadline}>
            $1.5B+ in rent risk solutions delivered to landlords and other
            stakeholders.
          </p>

          <div className={reveal(styles.revealUp, styles.delay4) + " " + styles.audienceRow}>
            {audiences.map((audience) => (
              <span key={audience} className={styles.audienceChip}>
                {audience}
              </span>
            ))}
          </div>
        </div>

        {/* ── Right: Visual Column ── */}
        <div className={styles.visualColumn}>
          <div className={reveal(styles.revealUp, styles.delay1) + " " + styles.metaRow}>
            <div className={styles.metaChips}>
              <span className={styles.networkBadge}>Pensio Network</span>
              <span className={styles.liveSignal}>
                <span className={styles.signalDot} aria-hidden="true" />
                Live routes
              </span>
            </div>
          </div>

          <div className={reveal(styles.revealScale, styles.delay2) + " " + styles.globeStage}>
            {/* $1.5B+ metric card */}
            <div className={styles.metricCard}>
              <p className={styles.metricLabel}>Global proof point</p>
              <p className={styles.metricValue}>
                $1.5B<span className={styles.metricValuePlus}>+</span>
              </p>
              <p className={styles.metricDescription}>
                Delivered across rent risk solutions supporting landlords,
                portfolios, and property stakeholders.
              </p>
            </div>

            {/* 3D Globe */}
            <div className={styles.globeFrame}>
              <PensioGlobalGlobe className={styles.globeCanvasShell} />
            </div>

            {/* Coverage HUD */}
            <div className={styles.coverageHud}>
              <span className={styles.coverageLabel}>Coverage reach</span>
              <span className={styles.coverageValue}>6 continents</span>
            </div>

            {/* Route legend chips */}
            <div className={styles.routeLegend}>
              {routeLabels.map((label) => (
                <span key={label} className={styles.routeChip}>
                  {label}
                </span>
              ))}
              <span className={cx(styles.routeChip, styles.routeChipMore)}>
                +3 more
              </span>
            </div>

            {/* Video thumbnail */}
            <div className={styles.videoThumb}>
              <div className={styles.videoThumbInner}>
                <video
                  ref={videoRef}
                  className={styles.videoThumbMedia}
                  src="/hero-section/hero-video.mp4"
                  loop
                  playsInline
                  preload="metadata"
                />
                <div className={styles.videoThumbOverlay}>
                  <button
                    className={styles.videoThumbControl}
                    onClick={togglePlay}
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                  >
                    {isPlaying ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16" rx="1" />
                        <rect x="14" y="4" width="4" height="16" rx="1" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    )}
                  </button>

                  <button
                    className={styles.videoThumbControl}
                    onClick={toggleMute}
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <line x1="23" y1="9" x2="17" y2="15" />
                        <line x1="17" y1="9" x2="23" y2="15" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <p className={reveal(styles.revealUp, styles.delay5) + " " + styles.caption}>
            A living network view inspired by GitHub-style globe motion,
            adapted to Tempho&apos;s warm protection palette.
          </p>
        </div>
      </div>
    </section>
  );
}
