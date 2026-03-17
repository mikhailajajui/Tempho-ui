import { NavSection } from "../../components/NavSection";
import { LandlordHeroSection } from "../../components/LandlordHeroSection";
import { HowItWorksSection } from "../../components/HowItWorksSection";
import { WhyTempoSection } from "../../components/WhyTempoSection";
import { ReviewsSection } from "../../components/ReviewsSection";
import { PartnersSection } from "../../components/PartnersSection";
import { GetMatchedSection } from "../../components/GetMatchedSection";
import { FooterImageSection } from "../../components/FooterImageSection";

export default function LandlordsPage() {
  return (
    <main>
      <NavSection
        links={[
          { label: "How It Works", href: "#how-it-works" },
          { label: "Why Tempo", href: "#why-tempo" },
          { label: "Collaborators", href: "#collaborators" },
          { label: "Testimonials", href: "#testimonials" },
        ]}
        ctaLabel="List Property"
        ctaHref="/forms"
      />
      <LandlordHeroSection
        ctaLabel="Sign up today!"
        ctaHref="/forms"
        videoSrc="/hero-section/hero-video.mp4"
        slides={[
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
            subheadline: "$1.5B+ in rent risk solutions delivered to landlords and other stakeholders.",
          },
          {
            id: "feature-3",
            headline: "Hassle-Free Management",
            subheadline: "From listings to lease signing, we handle everything so you can focus on what matters.",
          },
          {
            id: "cta",
            headline: "Ready to Get Started?",
            subheadline: "Join thousands of landlords who trust Tempho with their properties.",
            showCta: true,
          },
        ]}
      />
      <HowItWorksSection />
      <WhyTempoSection />
      <ReviewsSection />
      <PartnersSection />
      <GetMatchedSection />
      <FooterImageSection />
    </main>
  );
}
