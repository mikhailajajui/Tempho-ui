"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useScrollSnap } from "./ScrollSnapContainer";
import type { VideoSources } from "./types";

type VideoHeroSectionProps = {
  videoSrc: string | VideoSources;
  videoPoster?: string;
  /** Called when the video has enough data to play through */
  onVideoReady?: () => void;
};

export function VideoHeroSection({ videoSrc, videoPoster, onVideoReady }: VideoHeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { activeIndex, hasScrolled, scrollToSection } = useScrollSnap();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  const isMinimized = activeIndex > 0 || hasScrolled;
  const sources = typeof videoSrc === "string" ? { mp4: videoSrc } : videoSrc;

  // Auto-play video when component mounts
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const startVideo = async () => {
      try {
        video.muted = true;
        await video.play();
        setIsPlaying(true);
        setIsMuted(true);
      } catch {
        setIsPlaying(false);
      }
    };

    // Signal when video has loaded enough to play through
    const handleCanPlayThrough = () => onVideoReady?.();
    video.addEventListener("canplaythrough", handleCanPlayThrough, { once: true });
    // Also fire if video is already ready
    if (video.readyState >= 4) {
      onVideoReady?.();
    }

    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => startVideo(), { timeout: 2000 });
    } else {
      setTimeout(startVideo, 100);
    }

    return () => {
      video.removeEventListener("canplaythrough", handleCanPlayThrough);
    };
  }, [onVideoReady]);

  const togglePlay = () => {
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
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
    setHasInteracted(true);
  };

  const expandVideo = () => {
    scrollToSection(0);
  };

  return (
    <div
      className={clsx(
        "fixed z-50 overflow-hidden bg-[#0f172a]",
        "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
        isMinimized
          ? "bottom-0 left-0 right-0 h-[72px] w-full rounded-none border-t border-white/20 md:bottom-6 md:left-auto md:right-6 md:h-[203px] md:w-[360px] md:rounded-2xl md:border-[3px] md:border-white/95 md:border-t-white/95 max-[1100px]:md:h-[169px] max-[1100px]:md:w-[300px] cursor-pointer shadow-2xl"
          : "inset-0 pointer-events-none"
      )}
      onClick={isMinimized ? expandVideo : undefined}
      role={isMinimized ? "button" : undefined}
      aria-label={isMinimized ? "Expand video" : undefined}
    >
      <video
        ref={videoRef}
        className="h-full w-full object-contain md:object-cover"
        poster={videoPoster}
        loop
        playsInline
        muted
      >
        {sources.webm && <source src={sources.webm} type="video/webm" />}
        {sources.mp4 && <source src={sources.mp4} type="video/mp4" />}
      </video>

      {/* Controls */}
      <div
        className={clsx(
          "absolute z-[60] flex gap-2 pointer-events-auto transition-all duration-300",
          isMinimized ? "top-1/2 right-3 -translate-y-1/2 gap-1.5 md:top-auto md:bottom-2 md:right-2 md:translate-y-0" : "bottom-5 right-5"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={togglePlay}
          className={clsx(
            "flex items-center justify-center rounded-full bg-white/95 text-slate-900 shadow-lg",
            "transition-transform hover:scale-110",
            isMinimized ? "h-8 w-8" : "h-12 w-12"
          )}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg width={isMinimized ? "14" : "20"} height={isMinimized ? "14" : "20"} viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width={isMinimized ? "14" : "20"} height={isMinimized ? "14" : "20"} viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21" />
            </svg>
          )}
        </button>

        <button
          onClick={toggleMute}
          className={clsx(
            "flex items-center justify-center rounded-full bg-white/95 text-slate-900 shadow-lg",
            "transition-transform hover:scale-110",
            isMinimized ? "h-8 w-8" : "h-12 w-12"
          )}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <svg width={isMinimized ? "14" : "20"} height={isMinimized ? "14" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width={isMinimized ? "14" : "20"} height={isMinimized ? "14" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
        </button>
      </div>

      {/* Play overlay for initial state */}
      {!isPlaying && !hasInteracted && !isMinimized && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 z-[55] flex items-center justify-center bg-black/40 pointer-events-auto transition-colors hover:bg-black/50"
          aria-label="Play video"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#ffd55a] text-slate-900 shadow-xl transition-transform hover:scale-110">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21" />
            </svg>
          </span>
        </button>
      )}

      {/* Scroll indicator - only show when not minimized */}
      {!isMinimized && (
        <div
          className="absolute bottom-10 left-1/2 flex -translate-x-1/2 animate-bounce cursor-pointer flex-col items-center gap-2 text-white/80 pointer-events-auto"
          onClick={() => scrollToSection(1)}
        >
          <span className="text-sm font-medium uppercase tracking-widest">
            Scroll to explore
          </span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      )}
    </div>
  );
}
