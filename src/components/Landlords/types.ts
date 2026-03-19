import type { ReactNode } from "react";

export type TrustStat = {
  value: string;
  label: string;
};

export type PackageHero = {
  label: string;
  value: string;
  description: string;
};

export type PackageBenefit = {
  label: string;
  value?: string;
  description: string;
};

export type SupportCategory = {
  step?: string;
  icon?: "screening" | "legal" | "rent" | "management";
  title: string;
  description?: string;
  points: string[];
};

export type SupportProofStat = {
  value: string;
  label: string;
};

export type SupportProofQuote = {
  eyebrow: string;
  text: string;
  attribution: string;
};

export type SupportProof = {
  label: string;
  stats: SupportProofStat[];
  quote: SupportProofQuote;
};

export type WorkflowStep = {
  step: string;
  icon?: "listing" | "agreement" | "lease";
  title: string;
  description: string;
};

export type WorkflowBenefit = {
  title: string;
  description: string;
};

export type PresentationSlide = {
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
};

export type HeroVisualMessage = {
  title: string;
  detail: string;
  positionClassName: string;
};

export type VideoSources = {
  webm?: string;
  mp4: string;
};

export type LandlordPresentationProps = {
  ctaLabel?: string;
  ctaHref?: string;
  videoSrc?: string | VideoSources;
  videoPoster?: string;
  slides?: PresentationSlide[];
};

export type SlideComponentProps = {
  slide: PresentationSlide;
  index: number;
  isActive: boolean;
  ctaLabel: string;
  ctaHref: string;
};

export type HeadlineRenderer = (headline: string, isActive: boolean) => ReactNode;
