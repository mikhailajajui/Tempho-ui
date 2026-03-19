"use client";

import clsx from "clsx";

import animations from "../animations.module.css";
import { renderSupportIcon } from "../icons";
import type { SlideComponentProps } from "../types";

export function SupportSlide({ slide, index, isActive }: SlideComponentProps) {
  if (!slide.supportStages || !slide.supportProof) {
    return null;
  }

  return (
    <div className="mx-auto grid w-full max-w-[1260px] gap-8">
      <div className="max-w-[46rem]">
        <div className="ll-slide-number mb-5 inline-flex text-xs tracking-[0.2em]">
          0{index + 1}
        </div>
        {slide.eyebrow ? (
          <p className="ll-eyebrow-bar mb-3">
            {slide.eyebrow}
          </p>
        ) : null}
        <h2 className="[font-family:var(--font-family-display)] text-[clamp(2.4rem,4.4vw,4.8rem)] leading-[1.03] text-slate-900">
          {slide.headline}
        </h2>
        {slide.subheadline ? (
          <p className="ll-intro mt-4 max-w-[58rem] text-lg leading-8">
            {slide.subheadline}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(14rem,0.86fr)_minmax(0,1.2fr)_minmax(15rem,0.8fr)]">
        <aside className="grid content-start gap-4">
          {slide.supportLead ? (
            <p className="ll-eyebrow text-[0.65rem] tracking-[0.28em] text-[#8b6d38]">
              {slide.supportLead}
            </p>
          ) : null}
          <article className="ll-card rounded-[1.8rem] border-[#ead7a9]/60 bg-[linear-gradient(180deg,rgba(255,252,245,0.98),rgba(251,243,228,0.88))] px-5 py-6">
            <p className="font-serif text-[1.5rem] font-bold leading-[1.2] tracking-[-0.02em] text-slate-900">
              Tempho supports the full leasing lifecycle with one calmer, more
              structured workflow.
            </p>
            <p className="ll-body mt-4 text-[0.96rem] leading-7">
              Each stage reduces a different kind of landlord friction, from who
              gets approved to how rent and communication stay on track.
            </p>
          </article>
        </aside>

        <div className="relative grid gap-4 pl-5 before:absolute before:bottom-4 before:left-2.5 before:top-4 before:w-px before:bg-gradient-to-b before:from-[#c9a04a] before:to-[#c9a04a]/10 before:content-['']">
          {slide.supportStages.map((stage, stageIndex) => (
            <article
              key={stage.title}
              className={clsx(
                "ll-card relative grid gap-4 rounded-[1.6rem] border-[#e4d1a2]/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(252,246,231,0.9))] px-5 py-5 md:grid-cols-[4.5rem_minmax(0,1fr)]",
                animations.cardReveal,
                isActive && animations.cardRevealVisible,
              )}
              style={{ animationDelay: `${0.12 + stageIndex * 0.08}s` }}
            >
              <span className="absolute -left-[1.18rem] top-8 h-3 w-3 rounded-full bg-[linear-gradient(135deg,#ffd55a_0%,#f4a300_100%)] shadow-[0_0_0_6px_rgba(255,213,90,0.16)]" />
              <div className="grid content-start gap-3">
                <span className="ll-pill min-h-7 border-[#c9a96e]/30 bg-[#fffcf5] px-3 text-[0.62rem] text-slate-500">
                  {stage.step}
                </span>
                <span className="ll-icon-wrap h-12 w-12 rounded-2xl bg-[linear-gradient(135deg,#fff3c3_0%,#ffd55a_100%)] text-slate-900 shadow-[0_12px_26px_rgba(255,213,90,0.28)]">
                  {renderSupportIcon(stage.icon)}
                </span>
              </div>
              <div>
                <h3 className="font-serif text-[1.45rem] font-bold leading-[1.15] tracking-[-0.02em] text-slate-900">
                  {stage.title}
                </h3>
                {stage.description ? (
                  <p className="ll-body mt-3 text-[0.95rem] leading-7">
                    {stage.description}
                  </p>
                ) : null}
                <ul className="mt-4 grid gap-3">
                  {stage.points.map((point) => (
                    <li
                      key={point}
                      className="grid grid-cols-[0.75rem_minmax(0,1fr)] gap-3 font-serif text-[0.95rem] leading-7 text-slate-700"
                    >
                      <span className="ll-bullet mt-[0.72rem]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <aside className="grid content-start gap-3">
          <p className="ll-eyebrow text-[0.65rem] tracking-[0.28em] text-slate-500">
            {slide.supportProof.label}
          </p>
          <div className="grid gap-3">
            {slide.supportProof.stats.map((stat, statIndex) => (
              <div
                key={stat.label}
                className={clsx(
                  "ll-card rounded-[1.1rem] border-[#d6bb81]/40 bg-[#fffbf2] px-4 py-4",
                  animations.cardReveal,
                  isActive && animations.cardRevealVisible,
                )}
                style={{ animationDelay: `${0.22 + statIndex * 0.06}s` }}
              >
                <div className="ll-stat-value text-[2rem]">
                  {stat.value}
                </div>
                <div className="ll-stat-label mt-2 text-[0.7rem] tracking-[0.12em]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          <article className="ll-card rounded-[1.7rem] border-[#ead7a9]/60 bg-[radial-gradient(circle_at_top_right,rgba(255,213,90,0.15),transparent_28%),linear-gradient(180deg,rgba(255,254,249,0.98),rgba(250,242,225,0.9))] px-5 py-6">
            <p className="ll-eyebrow text-[0.65rem] tracking-[0.2em] text-[#8b6d38]">
              {slide.supportProof.quote.eyebrow}
            </p>
            <p className="mt-4 font-serif text-[1.2rem] leading-8 text-slate-900">
              {slide.supportProof.quote.text}
            </p>
            <p className="mt-4 text-sm font-semibold tracking-[0.04em] text-slate-600">
              {slide.supportProof.quote.attribution}
            </p>
          </article>
        </aside>
      </div>
    </div>
  );
}
