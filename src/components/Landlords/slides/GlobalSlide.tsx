"use client";

import dynamic from "next/dynamic";
import clsx from "clsx";

import animations from "../animations.module.css";
import { renderGlobalHeadline } from "../headline-renderers";
import type { SlideComponentProps } from "../types";

type GlobeProps = { className?: string; eager?: boolean };

const PensioGlobalGlobe = dynamic<GlobeProps>(
  () => import("../../PensioGlobalGlobe").then((mod) => mod.PensioGlobalGlobe),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[22rem] w-full items-center justify-center rounded-[2rem] border border-amber-100 bg-[radial-gradient(circle_at_center,rgba(255,229,149,0.18),transparent_58%),linear-gradient(180deg,#fffdf7,#fff8ea)] text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        Loading globe
      </div>
    ),
  },
);

export function GlobalSlide({ slide, index, isActive, eagerGlobe }: SlideComponentProps & { eagerGlobe?: boolean }) {
  return (
    <div className="mx-auto grid w-full max-w-[1240px] gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
      <div className="max-w-[35rem]">
        <div className="ll-slide-number mb-5 inline-flex text-xs tracking-[0.2em]">
          0{index + 1}
        </div>
        {slide.eyebrow ? (
          <p className="ll-eyebrow-bar mb-3">
            {slide.eyebrow}
          </p>
        ) : null}
        <h2 className="[font-family:var(--font-family-display)] text-[clamp(2.7rem,4.8vw,5rem)] leading-[1.02] text-slate-900">
          {renderGlobalHeadline(slide.headline)}
        </h2>
        <p className="ll-intro mt-4 text-lg leading-8">
          A worldwide rent-risk solution built to support landlords, property
          groups, and stakeholders through one connected protection network.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {["Landlords", "Property groups", "Stakeholders"].map((item) => (
            <span
              key={item}
              className="ll-pill border-[#ecd7a3] bg-[#fff8e8] px-4 py-2 text-xs text-slate-700"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(circle_at_center,rgba(255,213,90,0.22),transparent_60%)] blur-2xl" />
        <div className="relative overflow-hidden rounded-[2.5rem] border border-[#ebd8ab]/60 bg-[linear-gradient(180deg,rgba(255,253,247,0.98),rgba(252,244,227,0.94))] px-4 py-5 shadow-[0_38px_85px_rgba(113,74,17,0.1)] md:px-6 md:py-6">
          <div
            className={clsx(
              "ll-card absolute left-5 top-5 z-10 rounded-[1.4rem] border-[#ead8a5] bg-white/90 px-4 py-3 backdrop-blur",
              animations.cardReveal,
              isActive && animations.cardRevealVisible,
            )}
          >
            <p className="ll-eyebrow text-[0.65rem] tracking-[0.2em] text-slate-500">
              Global proof point
            </p>
            <p className="[font-family:var(--font-family-display)] mt-2 text-5xl leading-none text-slate-900">
              $1.5B+
            </p>
            <div className="mt-3 space-y-1 text-sm font-medium text-slate-600">
              <p>Landlords</p>
              <p>Portfolios</p>
              <p>Property stakeholders</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-[radial-gradient(circle_at_center,rgba(255,239,196,0.55),transparent_68%),linear-gradient(180deg,#fffefb,#fdf7ea)] p-2 pt-20 md:p-5 md:pt-24">
            <PensioGlobalGlobe className="h-[22rem] w-full md:h-[30rem]" eager={eagerGlobe} />
          </div>

          <div
            className={clsx(
              "ll-card absolute bottom-6 right-5 z-10 rounded-[1.2rem] border-[#ead8a5] bg-white/92 px-4 py-3 text-right backdrop-blur",
              animations.cardReveal,
              isActive && animations.cardRevealVisible,
            )}
            style={{ animationDelay: "0.12s" }}
          >
            <p className="ll-eyebrow text-[0.65rem] tracking-[0.2em] text-slate-500">
              Coverage reach
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              6 continents
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
