import { NavSection } from "../components/NavSection";
import { HeroSection } from "../components/HeroSection";
import { HowItWorksSection } from "../components/HowItWorksSection";
import { WhyTempoSection } from "../components/WhyTempoSection";
import { ReviewsSection } from "../components/ReviewsSection";
import { PartnersSection } from "../components/PartnersSection";
import { GetMatchedSection } from "../components/GetMatchedSection";
import { FooterImageSection } from "../components/FooterImageSection";

export default function HomePage() {
  return (
    <main>
      <NavSection />
      <HeroSection />
      <HowItWorksSection />
      <WhyTempoSection />
      <ReviewsSection />
      <PartnersSection />
      <GetMatchedSection />
      <FooterImageSection />
    </main>
  );
}
