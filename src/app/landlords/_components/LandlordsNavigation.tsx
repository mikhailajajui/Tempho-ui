import { NavSection } from "../../../components/NavSection";
import { landlordHeroContent, landlordNavLinks } from "../content";

export function LandlordsNavigation() {
  return (
    <NavSection
      links={[...landlordNavLinks]}
      ctaLabel={landlordHeroContent.ctaLabel}
      ctaHref={landlordHeroContent.ctaHref}
    />
  );
}
