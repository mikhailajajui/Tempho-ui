"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

import animations from "../animations.module.css";
import { heroVisualMessages } from "../constants";
import { renderHeroHeadline } from "../headline-renderers";
import type { SlideComponentProps } from "../types";

export function HeroSlide({
  slide,
  isActive,
  ctaHref,
  ctaLabel,
}: SlideComponentProps) {
  return (
    <div className="mx-auto grid w-full max-w-[1320px] gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
      <div className="max-w-[42rem]">
        {slide.subheadline ? (
          <p className="ll-eyebrow-bar mb-6">
            {slide.subheadline}
          </p>
        ) : null}
        <h2 className="[font-family:var(--font-family-display)] text-[clamp(3rem,6vw,6.4rem)] leading-[0.98] tracking-[0.01em] text-slate-900">
          {renderHeroHeadline(slide.headline, isActive)}
        </h2>
        <p className="ll-intro mt-8 max-w-[36rem] text-lg leading-8 sm:text-xl">
          A presentation-led landlord landing flow designed to move from protection
          to leasing confidence without visual clutter.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href={ctaHref}
            className="ll-cta min-h-14 items-center justify-center px-8 text-base font-semibold"
          >
            {ctaLabel}
          </Link>
        </div>

        {slide.trustStats?.length ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {slide.trustStats.map((stat, index) => (
              <div
                key={stat.label}
                className={clsx(
                  "ll-card rounded-[1.5rem] border-white/80 bg-white/80 px-5 py-4 backdrop-blur",
                  animations.cardReveal,
                  isActive && animations.cardRevealVisible,
                )}
                style={{ animationDelay: `${0.24 + index * 0.08}s` }}
              >
                <div className="[font-family:var(--font-family-display)] text-4xl leading-none text-slate-900">
                  {stat.value}
                </div>
                <div className="ll-stat-label mt-2 text-sm text-slate-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="relative mx-auto w-full max-w-[42rem] px-4 py-5 sm:px-6 md:px-8">
        <div className="relative isolate overflow-visible rounded-[2.25rem] border border-amber-100/70 bg-[radial-gradient(circle_at_top,#fff4ce_0%,#fffdf6_38%,#ffffff_100%)] p-6 shadow-[0_36px_90px_rgba(113,74,17,0.12)]">
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#f0d691] to-transparent" />
          <Image
            src="/hero-section/landlord-hero-visual.svg"
            alt="Illustration of a protected rental property with verified tenant checks"
            width={720}
            height={720}
            priority
            className={clsx("relative z-10 w-full", animations.heroFloat)}
          />

          {heroVisualMessages.map((message, index) => (
            <div
              key={message.title}
              className={clsx(
                "ll-card absolute z-20 max-w-[15rem] flex-row items-start gap-3 rounded-[1.25rem] border-white/90 bg-white/95 px-4 py-3 backdrop-blur",
                message.positionClassName,
                animations.heroNote,
                isActive && animations.heroNoteVisible,
              )}
              style={{ animationDelay: `${0.34 + index * 0.12}s` }}
            >
              <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff1b8] text-[#8d6500]">
                <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                  <path
                    d="M5 10.5L8.3 13.8L15 7.2"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>
                <span className="block text-sm font-semibold text-slate-900">
                  {message.title}
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  {message.detail}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
