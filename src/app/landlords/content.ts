import { defaultSlides } from "../../components/Landlords/constants";

export type LandlordFaqItem = {
  question: string;
  answer: string;
};

export const landlordNavLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Why Tempo", href: "#why-tempo" },
  { label: "Collaborators", href: "#collaborators" },
  { label: "Testimonials", href: "#testimonials" },
] as const;

export const landlordHeroContent = {
  ctaLabel: "List Property",
  ctaHref: "/forms",
  videoSrc: {
    webm: "/hero-section/hero-video-720p.webm",
    mp4: "/hero-section/hero-video-720p.mp4",
  },
  videoPoster: "/hero-section/hero-video-poster.jpg",
  belowFoldStart: 6,
  slides: defaultSlides,
} as const;

export const landlordClosingFaqs: readonly LandlordFaqItem[] = [
  {
    question: "How do I start listing my property with Tempho?",
    answer:
      "Use the listing form to share the property details, preferred move-in timing, and the basics tenants need to see. Once submitted, the Tempho team can guide the next steps from setup to promotion.",
  },
  {
    question: "How does the free photo offer work?",
    answer:
      "The free photo offer is reserved for the first 100 landlords who move forward through this campaign. Start by claiming the offer on WhatsApp, then Tempho confirms eligibility and coordinates the shoot timing.",
  },
  {
    question: "Should I book photos before or after I list?",
    answer:
      "You can start the listing immediately and claim the photo offer in parallel. That keeps the listing process moving while the photography slot is being confirmed.",
  },
  {
    question: "How quickly can my property go live?",
    answer:
      "That depends on how complete the listing details are and when photos are ready, but the goal of this flow is to reduce handoffs so landlords can move from setup to active marketing faster.",
  },
] as const;

export const landlordClosingContent = {
  faq: {
    eyebrow: "Operational FAQ",
    title: "Answers before you list.",
    intro:
      "Everything landlords usually ask at the bottom of the page, organized around timing, setup, and how the offer works.",
  },
  dualCta: {
    eyebrow: "Next step",
    title: "Book your photo now or start listing.",
    description:
      "Choose the fast path that matches where you are. Secure the visual asset first, or move straight into the listing workflow.",
    listingLabel: "Start listing",
    listingHref: "/forms",
    photoLabel: "Book your photo now",
    photoHref:
      "https://wa.me/10000000000?text=Hi%20Tempho%2C%20I%20want%20to%20book%20the%20free%20photo%20offer%20for%20my%20property.",
  },
  offer: {
    eyebrow: "Free photo offer",
    title: "Claim free photo now.",
    description:
      "Use WhatsApp to reserve the promo before your listing momentum goes cold. Tempho can confirm the offer and coordinate the next steps from there.",
    ctaLabel: "Claim free photo now",
    ctaHref:
      "https://wa.me/10000000000?text=Hi%20Tempho%2C%20I%20want%20to%20claim%20the%20free%20photo%20offer%20for%20my%20listing.",
    supportingPoints: [
      "Fast contact path",
      "Offer confirmation",
      "Photo scheduling next",
    ],
  },
  urgency: {
    eyebrow: "Launch offer",
    title: "List property now.",
    description:
      "This campaign is positioned as a first-wave landlord offer. If the property is ready, move now and secure your place while the incentive is still active.",
    badge: "Valid for first 100 landlords",
    ctaLabel: "List property now",
    ctaHref: "/forms",
  },
} as const;
