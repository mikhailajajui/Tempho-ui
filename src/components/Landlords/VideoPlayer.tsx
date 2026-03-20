"use client";

import clsx from "clsx";
import type { RefObject } from "react";
import type { VideoSources } from "./types";

type VideoPlayerProps = {
  videoRef: RefObject<HTMLVideoElement | null>;
  videoSrc: string | VideoSources;
  videoPoster?: string;
  isMinimized: boolean;
  isMobile: boolean;
  isPlaying: boolean;
  isMuted: boolean;
  hasInteracted: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
};

export function VideoPlayer({
  videoRef,
  videoSrc,
  videoPoster,
  isMinimized,
  isMobile,
  isPlaying,
  isMuted,
  hasInteracted,
  onTogglePlay,
  onToggleMute,
}: VideoPlayerProps) {
  const sources = typeof videoSrc === "string"
    ? { mp4: videoSrc }
    : videoSrc;

  return (
    <div
      className={clsx(
        "fixed z-50 overflow-hidden bg-[#0f172a]",
        "transition-[top,left,width,height,border-radius,box-shadow,border] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
        isMinimized
          ? isMobile
            ? "top-[calc(100dvh-88px)] left-0 h-[88px] w-full rounded-none border-t-2 border-t-white/12 shadow-[0_-8px_32px_rgba(0,0,0,0.25)]"
            : "top-[calc(100dvh-203px-24px)] left-[calc(100vw-360px-24px)] h-[203px] w-[360px] rounded-[16px] border-[3px] border-white/95 shadow-[0_25px_60px_rgba(0,0,0,0.25),0_10px_20px_rgba(0,0,0,0.15)] max-[1100px]:top-[calc(100dvh-169px-24px)] max-[1100px]:left-[calc(100vw-300px-24px)] max-[1100px]:h-[169px] max-[1100px]:w-[300px]"
          : "left-0 top-0 h-dvh w-full",
      )}
    >
      <video
        ref={videoRef}
        className={clsx(
          "h-full w-full object-contain",
          isMinimized && isMobile && "object-[center_30%]",
        )}
        poster={videoPoster}
        loop
        playsInline
        preload="none"
      >
        {sources.webm && (
          <source src={sources.webm} type="video/webm" />
        )}
        <source src={sources.mp4} type="video/mp4" />
      </video>

      <div
        className={clsx(
          "absolute z-[60] flex transition-[bottom,right,left,gap,transform] duration-300 ease-out",
          isMinimized && !isMobile
            ? "bottom-3 right-3 gap-1.5"
            : isMinimized && isMobile
              ? "bottom-1/2 left-4 right-auto translate-y-1/2 gap-2"
              : "bottom-5 right-5 gap-2",
        )}
      >
        <button
          className={clsx(
            "flex items-center justify-center rounded-full border-none bg-white/95 text-[#0f172a] shadow-[0_4px_12px_rgba(0,0,0,0.15)]",
            "transition-[transform,background-color,box-shadow,width,height] duration-200 ease-out hover:scale-[1.08] hover:bg-white hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)]",
            "focus-visible:outline-3 focus-visible:outline-[#ffd55a] focus-visible:outline-offset-2",
            isMinimized ? "h-9 w-9" : "h-12 w-12",
            isMinimized && isMobile && "bg-white/90",
          )}
          onClick={onTogglePlay}
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
          className={clsx(
            "flex items-center justify-center rounded-full border-none bg-white/95 text-[#0f172a] shadow-[0_4px_12px_rgba(0,0,0,0.15)]",
            "transition-[transform,background-color,box-shadow,width,height] duration-200 ease-out hover:scale-[1.08] hover:bg-white hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)]",
            "focus-visible:outline-3 focus-visible:outline-[#ffd55a] focus-visible:outline-offset-2",
            isMinimized ? "h-9 w-9" : "h-12 w-12",
            isMinimized && isMobile && "bg-white/90",
          )}
          onClick={onToggleMute}
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

      {!isPlaying && !hasInteracted ? (
        <button
          className="group absolute inset-0 z-[55] flex items-center justify-center border-none bg-black/40 transition-colors duration-200 ease-out hover:bg-black/50 focus-visible:outline-3 focus-visible:outline-[#ffd55a] focus-visible:outline-offset-[-3px]"
          onClick={onTogglePlay}
          aria-label="Play video"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#ffd55a] text-[#0f172a] shadow-[0_10px_30px_rgba(255,213,90,0.4)] transition-[transform,box-shadow] duration-200 ease-out group-hover:scale-110 group-hover:shadow-[0_15px_40px_rgba(255,213,90,0.5)]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </span>
        </button>
      ) : null}
    </div>
  );
}
