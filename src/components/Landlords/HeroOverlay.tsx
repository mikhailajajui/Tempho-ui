"use client";

import clsx from "clsx";

import animations from "./animations.module.css";

type HeroOverlayProps = {
  isMinimized: boolean;
  showUnmutePrompt: boolean;
  hasInteracted: boolean;
  onUnmute: () => void;
};

export function HeroOverlay({
  isMinimized,
  showUnmutePrompt,
  hasInteracted,
  onUnmute,
}: HeroOverlayProps) {
  return (
    <div
      className={clsx(
        "pointer-events-none fixed inset-0 z-[55] bg-gradient-to-b from-black/15 via-transparent to-black/45 transition-opacity duration-400 ease-out",
        isMinimized && "pointer-events-none opacity-0",
      )}
    >
      {showUnmutePrompt && !hasInteracted ? (
        <button
          className="pointer-events-auto absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3 rounded-[16px] border-2 border-white/20 bg-black/85 px-8 py-6 text-white backdrop-blur-[8px] transition-[transform,background-color] duration-200 ease-out hover:-translate-x-1/2 hover:-translate-y-1/2 hover:scale-105 hover:bg-black/90 focus-visible:outline-3 focus-visible:outline-[#ffd55a] focus-visible:outline-offset-2"
          onClick={onUnmute}
          aria-label="Click to unmute video"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ffd55a] text-[#0f172a]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          </span>
          <span className="text-base font-medium tracking-[0.02em]">
            Click to unmute
          </span>
        </button>
      ) : null}

      <div
        className={clsx(
          "absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-[10px] text-white/85",
          animations.fadeInUpCenter,
        )}
      >
        <span className="text-[13px] font-medium uppercase tracking-[0.12em]">
          Scroll to explore
        </span>
        <span className={animations.bounceArrow}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </span>
      </div>
    </div>
  );
}
