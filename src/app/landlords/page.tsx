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
            headline: "AI-Powered Tenant Matching",
            subheadline: "Our intelligent system finds tenants that match your property requirements perfectly.",
          },
          {
            id: "feature-2",
            headline: "Guaranteed Rent Protection",
            subheadline: "Never worry about missed payments. We ensure your rent arrives on time, every time.",
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
