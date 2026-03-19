"use client";

import clsx from "clsx";

import animations from "../animations.module.css";
import { renderPackageIcon, ShieldIcon } from "../icons";
import { renderPackageHeadline } from "../headline-renderers";
import type { SlideComponentProps } from "../types";

export function PackageSlide({ slide, index, isActive }: SlideComponentProps) {
  if (!slide.packageHero || !slide.packageBenefits) {
    return null;
  }

  return (
    <div className="mx-auto grid w-full max-w-[1180px] gap-8">
      <div className="max-w-[46rem]">
        <div className="ll-slide-number mb-5 inline-flex text-xs tracking-[0.2em]">
          0{index + 1}
        </div>
        {slide.eyebrow ? (
          <p className="ll-eyebrow-bar mb-3">
            {slide.eyebrow}
          </p>
        ) : null}
        <h2 className="[font-family:var(--font-family-display)] text-[clamp(2.6rem,4.7vw,4.8rem)] leading-[1.02] text-slate-900">
          {renderPackageHeadline(slide.headline)}
        </h2>
        <p className="ll-intro mt-4 max-w-[38rem] text-lg leading-8">
          A coverage-first package designed to keep landlord income calm,
          predictable, and protected.
        </p>
      </div>

      <div className="grid gap-4 rounded-[2rem] border border-[#e9d7ac] bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(251,245,229,0.96))] p-4 shadow-[0_32px_72px_rgba(113,74,17,0.08)] lg:grid-cols-[minmax(0,1.18fr)_minmax(18rem,0.82fr)]">
        <article
          className={clsx(
            "ll-card relative min-h-full justify-between overflow-hidden rounded-[1.65rem] border-[#e2c67e]/50 bg-[radial-gradient(circle_at_top_right,rgba(255,213,90,0.22),transparent_34%),linear-gradient(180deg,rgba(255,250,241,0.98),rgba(245,237,219,0.96))] px-6 py-6",
            animations.cardReveal,
            isActive && animations.cardRevealVisible,
          )}
        >
          <div className="absolute -right-4 -top-4 h-32 w-32 text-slate-800/5">
            <ShieldIcon />
          </div>
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="ll-icon-wrap h-11 w-11">
                <ShieldIcon />
              </span>
              <span className="ll-pill border-[#c59741]/30 bg-[#fffbf0] px-3 py-1 text-[0.65rem] text-[#86641e]">
                12 month protection
              </span>
            </div>
            <p className="ll-eyebrow text-xs tracking-[0.16em] text-slate-900">
              {slide.packageHero.label}
            </p>
            <p className="[font-family:var(--font-family-display)] mt-5 text-[clamp(3.2rem,5vw,5rem)] leading-none text-slate-900">
              {slide.packageHero.value}
            </p>
            <p className="ll-intro mt-4 max-w-[26rem] text-lg leading-7">
              {slide.packageHero.description}
            </p>
          </div>
          <div className="mt-8 border-t border-[#b68830]/20 pt-5">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[#8e6d28]">
              Coverage formula
            </p>
            <p className="mt-2 font-serif text-lg font-semibold text-slate-900">
              Up to $5,000 x 12 months
            </p>
          </div>
        </article>

        <div className="grid gap-4">
          {slide.packageBenefits.map((benefit, benefitIndex) => (
            <article
              key={benefit.label}
              className={clsx(
                "ll-card rounded-[1.5rem] border-[#e1cfa0]/50 bg-white/90 px-5 py-5",
                animations.cardReveal,
                isActive && animations.cardRevealVisible,
              )}
              style={{ animationDelay: `${0.14 + benefitIndex * 0.08}s` }}
            >
              <span className="ll-icon-wrap h-9 w-9">
                {renderPackageIcon(benefitIndex)}
              </span>
              <p className="ll-eyebrow mt-4 text-xs tracking-[0.16em] text-slate-900">
                {benefit.label}
              </p>
              {benefit.value ? (
                <p className="[font-family:var(--font-family-display)] mt-3 text-[clamp(2.1rem,3vw,3rem)] leading-none text-slate-900">
                  {benefit.value}
                </p>
              ) : null}
              <p className="ll-body mt-3 text-sm leading-6">
                {benefit.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
