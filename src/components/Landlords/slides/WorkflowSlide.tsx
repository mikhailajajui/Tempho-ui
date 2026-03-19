"use client";

import clsx from "clsx";
import Link from "next/link";

import animations from "../animations.module.css";
import { renderWorkflowIcon } from "../icons";
import type { SlideComponentProps } from "../types";

export function WorkflowSlide({
  slide,
  index,
  isActive,
  ctaHref,
  ctaLabel,
}: SlideComponentProps) {
  if (!slide.workflowSteps || !slide.workflowBenefits) {
    return null;
  }

  const workflowSteps = slide.workflowSteps;
  const workflowBenefits = slide.workflowBenefits;

  return (
    <div className="mx-auto grid w-full max-w-[1240px] gap-8">
      <div className="max-w-[46rem]">
        <div className="ll-slide-number mb-5 inline-flex text-xs tracking-[0.2em]">
          0{index + 1}
        </div>
        {slide.eyebrow ? (
          <p className="ll-eyebrow-bar mb-3">
            {slide.eyebrow}
          </p>
        ) : null}
        <h2 className="[font-family:var(--font-family-display)] text-[clamp(2.5rem,4.6vw,4.9rem)] leading-[1.03] text-slate-900">
          {slide.headline}
        </h2>
        {slide.subheadline ? (
          <p className="ll-intro mt-4 max-w-[40rem] text-lg leading-8">
            {slide.subheadline}
          </p>
        ) : null}
      </div>

      <div className="mx-auto grid w-full max-w-[980px] gap-2">
        {workflowSteps.map((item, stepIndex) => (
          <div key={item.step}>
            <article
              className={clsx(
                "grid gap-6 rounded-[1.8rem] px-5 py-6 transition-colors duration-300 hover:bg-[#fff8e6]/60 md:grid-cols-[minmax(0,1.2fr)_minmax(8rem,0.8fr)] md:items-center",
                stepIndex % 2 !== 0 && "md:[&>div:first-child]:order-2 md:[&>div:last-child]:order-1 md:[&>div:first-child]:text-right",
                animations.zigzagReveal,
                isActive && animations.zigzagRevealVisible,
              )}
              style={{ animationDelay: `${stepIndex * 0.14}s` }}
            >
              <div>
                <span className="ll-pill border-[#d7c091] bg-white/80 px-3 py-1 text-[0.68rem] text-slate-500">
                  {item.step}
                </span>
                <h3 className="mt-4 font-serif text-[1.9rem] font-bold leading-[1.12] tracking-[-0.02em] text-slate-900">
                  {item.title}
                </h3>
                <p className="ll-body mt-3 text-[1rem] leading-7">
                  {item.description}
                </p>
              </div>
              <div className="flex justify-center">
                <span className="ll-icon-wrap relative h-28 w-28 bg-[radial-gradient(circle_at_center,#fff7da_0%,#ffd55a_52%,#f3b83d_100%)] text-slate-900 shadow-[0_20px_42px_rgba(255,213,90,0.26)] before:absolute before:inset-3 before:rounded-full before:border before:border-white/40 before:content-['']">
                  <span className="h-10 w-10">{renderWorkflowIcon(item.icon)}</span>
                </span>
              </div>
            </article>
            {stepIndex < workflowSteps.length - 1 ? (
              <div className="flex justify-center py-1">
                <svg viewBox="0 0 120 56" fill="none" className="h-12 w-24 text-[#d6bb81]/70">
                  <path
                    d="M60 0 C60 20, 60 36, 60 56"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeDasharray="5 7"
                    strokeLinecap="round"
                  />
                  <circle cx="60" cy="28" r="3" fill="rgba(214,187,129,0.55)" />
                </svg>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
        {workflowBenefits.map((benefit, benefitIndex) => (
          <article
            key={benefit.title}
            className={clsx(
              "ll-card rounded-[1.45rem] border-[#ead7a9]/60 bg-white/90 px-5 py-5",
              animations.cardReveal,
              isActive && animations.cardRevealVisible,
            )}
            style={{ animationDelay: `${0.4 + benefitIndex * 0.08}s` }}
          >
            <div className="ll-eyebrow text-xs tracking-[0.18em] text-[#b88710]">
              0{benefitIndex + 1}
            </div>
            <h3 className="mt-4 font-serif text-[1.4rem] font-bold leading-[1.15] text-slate-900">
              {benefit.title}
            </h3>
            <p className="ll-body mt-3 text-[0.97rem] leading-7">
              {benefit.description}
            </p>
          </article>
        ))}
      </div>

      <div className="ll-card grid gap-5 rounded-[2rem] border-[#ead7a9]/60 bg-[radial-gradient(circle_at_top_right,rgba(255,213,90,0.15),transparent_28%),linear-gradient(180deg,rgba(255,254,249,0.98),rgba(250,242,225,0.88))] px-6 py-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <p className="ll-eyebrow text-[0.7rem] tracking-[0.2em] text-[#8b6d38]">
            End state
          </p>
          <p className="mt-3 font-serif text-[1.7rem] font-bold leading-[1.15] tracking-[-0.02em] text-slate-900">
            Protected listing. Verified tenant. Cleaner handoff to lease.
          </p>
          <p className="ll-body mt-3 max-w-[44rem] text-[1rem] leading-7">
            Every step is set up to reduce guesswork so landlords can move from
            listing to approval with better visibility and fewer loose ends.
          </p>
        </div>
        {slide.showCta ? (
          <Link
            href={ctaHref}
            className="ll-cta min-h-14 items-center justify-center px-8 text-base font-semibold"
          >
            {ctaLabel}
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
