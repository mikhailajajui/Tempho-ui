import type { HeroVisualMessage, PresentationSlide } from "./types";

export const heroVisualMessages: HeroVisualMessage[] = [
  {
    title: "Tenant profile verified",
    detail: "Identity and screening complete",
    positionClassName: "top-3 left-4 md:-left-6 md:top-8",
  },
  {
    title: "Rent protection active",
    detail: "Coverage confirmed for this listing",
    positionClassName: "right-2 top-1/4 md:-right-8",
  },
  {
    title: "Listing ready to publish",
    detail: "Photos, terms, and checks approved",
    positionClassName: "bottom-4 left-10 md:-bottom-3 md:left-16",
  },
] as const;

export const defaultSlides: PresentationSlide[] = [
  {
    id: "intro",
    headline: "List Your Property.\nFind Quality Tenants.",
    subheadline: "Guaranteed Rent Insurance",
    isHero: true,
    showCta: true,
    trustStats: [
      { value: "10,000+", label: "Landlords trust us" },
      { value: "95%", label: "Vacancy fill rate" },
      { value: "48h", label: "Average listing time" },
    ],
  },
  {
    id: "feature-1",
    variant: "package",
    eyebrow: "Why Tempho!",
    headline: "Pension Rent Guarantee",
    packageHero: {
      label: "Rent Guarantee",
      value: "$60,000",
      description: "Up to $5,000/month paid for 12 months.",
    },
    packageBenefits: [
      {
        label: "Damage claim",
        value: "$10,000",
        description: "Coverage support for qualifying damage-related claims.",
      },
      {
        label: "Legal support",
        value: "$1,500",
        description: "Practical help for eligible tenancy-related legal needs.",
      },
      {
        label: "Same-month settlement",
        description: "Fast payout support when an eligible rent issue arises.",
      },
    ],
  },
  {
    id: "feature-2",
    variant: "global",
    eyebrow: "Why Tempho!",
    headline: "Pensio Global",
    subheadline:
      "$1.5B+ in rent risk solutions delivered to landlords and other stakeholders.",
  },
  {
    id: "feature-3",
    variant: "support",
    eyebrow: "What Tempho does for you",
    headline: "What Tempho Handles for Landlords",
    subheadline:
      "Protection, leasing support, and day-to-day management tools that help you reduce risk, avoid delays, and place the right tenant faster.",
    supportLead: "From screening to rent protection",
    supportStages: [
      {
        step: "01",
        icon: "screening",
        title: "Screen applicants with confidence",
        description:
          "Verify the person behind the application before a lease is signed.",
        points: [
          "Government ID verification",
          "Income and banking verification",
          "Employment verification",
          "Previous landlord verification",
        ],
      },
      {
        step: "02",
        icon: "legal",
        title: "Reduce legal exposure",
        description:
          "Get structured support when tenancy disputes create risk or delay.",
        points: [
          "Support for Landlord and Tenant Board matters",
          "Up to $1,500 in legal expense coverage",
          "Guidance when disputes arise",
        ],
      },
      {
        step: "03",
        icon: "rent",
        title: "Protect rent flow",
        description:
          "Keep payments organized and reduce the friction around collection.",
        points: [
          "Automated rent collection",
          "Fewer missed or delayed payments",
          "Clear payment tracking for every lease",
        ],
      },
      {
        step: "04",
        icon: "management",
        title: "Fill and manage faster",
        description:
          "Move from vacancy to stable tenancy with less manual follow-up.",
        points: [
          "10-day placement pledge",
          "Centralized tenant communication",
          "Lease and document organization",
        ],
      },
    ],
    supportProof: {
      label: "Landlord relief",
      stats: [
        { value: "10-day", label: "placement pledge" },
        { value: "$1,500", label: "legal expense support" },
        { value: "4 checks", label: "tenant screening checks" },
      ],
      quote: {
        eyebrow: "Operational proof",
        text:
          "Tempho helps landlords move from screening to rent collection with fewer handoffs, fewer unknowns, and a clearer process for every tenancy.",
        attribution: "Built for independent landlords and growing portfolios",
      },
    },
  },
];
